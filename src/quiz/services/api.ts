import { API_URL } from '../config/constants';
import { subjects } from '../config/constants';

const cache = {
  questions: new Map<string, any[]>(),
  leaderboard: new Map<string, any[]>(),
  subjects: null as any[] | null,
  timestamp: new Map<string, number>(),
  CACHE_DURATION: 5 * 60 * 1000
};

async function preloadQuestions(subject: string) {
  try {
    // Skip if questions are already cached and valid
    const timestamp = cache.timestamp.get(`questions_${subject}`);
    if (timestamp && Date.now() - timestamp < cache.CACHE_DURATION) {
      return;
    }

    // Skip if already being preloaded
    if (cache.timestamp.get(`preloading_${subject}`)) {
      return;
    }

    cache.timestamp.set(`preloading_${subject}`, Date.now());

    const questions = await fetchQuestionsFromAPI(subject);
    
    // Only cache if we got valid questions
    if (questions && Array.isArray(questions) && questions.length > 0) {
      cache.questions.set(subject, questions);
      cache.timestamp.set(`questions_${subject}`, Date.now());
    }

    cache.timestamp.delete(`preloading_${subject}`);
  } catch (error) {
    cache.timestamp.delete(`preloading_${subject}`);
    // Silently handle preloading errors since this is background loading
    console.debug('Preloading questions failed:', error);
  }
}

function letterToIndex(letter: string | null): number | null {
  if (!letter) return null;
  const normalized = letter.trim().toUpperCase();
  const mapping: { [key: string]: number } = { 'A': 0, 'B': 1, 'C': 2, 'D': 3 };
  return mapping[normalized];
}

async function fetchQuestionsFromAPI(subject: string) {
  try {
    const response = await fetch(`${API_URL}?action=getQuestions&subject=${encodeURIComponent(subject)}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch questions (Status: ${response.status})`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || "Failed to fetch questions");
    }
    
    if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
      throw new Error("No questions available for this subject");
    }
    
    return data.questions.map((row: any[]) => {
      if (!Array.isArray(row) || row.length < 7) {
        throw new Error("Invalid question format received from server");
      }
      
      const answerIndex = letterToIndex(row[5]);
      if (answerIndex === null) {
        throw new Error("Invalid answer format received from server. Expected A, B, C, or D");
      }
      
      return {
        question: row[0] || "Question not available",
        options: [
          row[1] || "Option not available",
          row[2] || "Option not available",
          row[3] || "Option not available",
          row[4] || "Option not available"
        ],
        answer: answerIndex,
        explanation: row[6] || 'No explanation available'
      };
    });
  } catch (error) {
    throw new Error(`Failed to fetch questions: ${(error as Error).message}`);
  }
}

export async function fetchQuestions(subject: string) {
  try {
    // Check cache first
    const cachedQuestions = cache.questions.get(subject);
    const timestamp = cache.timestamp.get(`questions_${subject}`);
    
    if (cachedQuestions && timestamp && (Date.now() - timestamp < cache.CACHE_DURATION)) {
      return cachedQuestions;
    }

    const questions = await fetchQuestionsFromAPI(subject);
    
    if (questions && Array.isArray(questions) && questions.length > 0) {
      cache.questions.set(subject, questions);
      cache.timestamp.set(`questions_${subject}`, Date.now());
      
      // Preload other subjects in background
      Promise.all(
        subjects
          .filter(s => s.id !== subject)
          .map(s => preloadQuestions(s.id))
      ).catch(() => {
        // Silently handle background preloading errors
      });
    }

    return questions;
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
}

export async function fetchAllSubjects() {
  try {
    // Check cache first
    if (cache.subjects && cache.timestamp.get('subjects') && 
        (Date.now() - cache.timestamp.get('subjects')! < cache.CACHE_DURATION)) {
      return cache.subjects;
    }

    const response = await fetch(`${API_URL}?action=getAllSubjects`);
    if (!response.ok) {
      throw new Error(`Failed to fetch subjects (Status: ${response.status})`);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || "Failed to fetch subjects");
    }

    if (data.subjects && Array.isArray(data.subjects)) {
      cache.subjects = data.subjects;
      cache.timestamp.set('subjects', Date.now());
      
      // Preload first subject's questions if available
      if (data.subjects.length > 0) {
        preloadQuestions(data.subjects[0].id).catch(() => {
          // Silently handle background preloading errors
        });
      }
    }

    return data.subjects || [];
  } catch (error) {
    console.error('Error fetching subjects:', error);
    throw error;
  }
}

export async function saveScore(playerName: string, subject: string, score: number) {
  try {
    if (!playerName || !subject || score === undefined) {
      throw new Error("Missing required parameters for saving score");
    }

    const formData = new URLSearchParams();
    formData.append('action', 'saveScore');
    formData.append('name', playerName.trim());
    formData.append('score', score.toString());
    formData.append('subject', subject);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    const responseText = await response.text();
    if (responseText.includes('success')) {
      // Invalidate leaderboard cache for this subject
      cache.leaderboard.delete(subject);
      return { success: true };
    }

    throw new Error('Failed to save score: ' + responseText);
  } catch (error) {
    console.error('Error saving score:', error);
    throw error;
  }
}

export async function fetchLeaderboard(subject: string) {
  try {
    if (!subject) {
      throw new Error("Subject is required for fetching leaderboard");
    }

    // Check cache first
    const cachedLeaderboard = cache.leaderboard.get(subject);
    const timestamp = cache.timestamp.get(`leaderboard_${subject}`);
    
    if (cachedLeaderboard && timestamp && (Date.now() - timestamp < cache.CACHE_DURATION)) {
      return cachedLeaderboard;
    }

    const params = new URLSearchParams({
      action: 'getLeaderboard',
      subject: subject
    });

    const response = await fetch(`${API_URL}?${params}`);
    const data = await response.json();
    
    if (!data.success) {
      console.warn('Leaderboard fetch failed:', data.error);
      return [];
    }

    const leaderboard = data.entries
      ?.filter((entry: any) => entry && entry.name && entry.score !== undefined)
      .map((entry: any) => ({
        name: entry.name,
        score: typeof entry.score === 'string' ? parseInt(entry.score, 10) : entry.score
      }))
      .sort((a: any, b: any) => b.score - a.score) || [];

    cache.leaderboard.set(subject, leaderboard);
    cache.timestamp.set(`leaderboard_${subject}`, Date.now());

    return leaderboard;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}

export async function createSubject(subjectData: any) {
  try {
    const formData = new URLSearchParams();
    formData.append('action', 'createSubject');
    formData.append('subject', subjectData.name);
    formData.append('questions', JSON.stringify(subjectData.questions || []));

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    const data = await response.json();
    if (data.success) {
      // Invalidate subjects cache
      cache.subjects = null;
      cache.timestamp.delete('subjects');
      return { success: true };
    }

    throw new Error(data.error || "Failed to create subject");
  } catch (error) {
    console.error('Error creating subject:', error);
    throw error;
  }
}