import { fetchAllSubjects, fetchQuestions, saveScore, fetchLeaderboard, createSubject } from '../services/api';
import { subjects } from '../config/constants';

interface QuizState {
  playerName: string;
  selectedSubject: string;
  currentQuestion: number;
  questions: any[];
  answers: (number | null)[];
  quizStarted: boolean;
  quizCompleted: boolean;
  timeLeft: number;
  timer: NodeJS.Timeout | null;
  isLoading: boolean;
}

export class QuizStore {
  state: QuizState;
  private listeners: Set<() => void>;

  constructor() {
    this.state = {
      playerName: '',
      selectedSubject: '',
      currentQuestion: 0,
      questions: [],
      answers: [],
      quizStarted: false,
      quizCompleted: false,
      timeLeft: 0,
      timer: null,
      isLoading: false
    };
    this.listeners = new Set();
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }

  async loadSubjects() {
    try {
      const fetchedSubjects = await fetchAllSubjects();
      subjects.length = 0;
      subjects.push(...fetchedSubjects);
      this.notify();
    } catch (error) {
      console.error('Error loading subjects:', error);
    }
  }

  saveState(subjectId: string) {
    const stateToSave = {
      selectedSubject: this.state.selectedSubject,
      currentQuestion: this.state.currentQuestion,
      answers: this.state.answers,
      quizStarted: this.state.quizStarted,
      quizCompleted: this.state.quizCompleted,
      timeLeft: this.state.timeLeft,
      questions: this.state.questions,
    };
    localStorage.setItem(`quizAppState_${subjectId}`, JSON.stringify(stateToSave));
    this.notify();
  }

  loadState(subjectId: string) {
    const savedState = localStorage.getItem(`quizAppState_${subjectId}`);
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      this.state = { ...this.state, ...parsedState };
    } else {
      this.resetState(subjectId);
    }
    this.notify();
  }

  clearState(subjectId: string) {
    localStorage.removeItem(`quizAppState_${subjectId}`);
    this.notify();
  }

  savePlayerName() {
    localStorage.setItem('quizAppPlayerName', this.state.playerName);
    this.notify();
  }

  loadPlayerName() {
    const savedName = localStorage.getItem('quizAppPlayerName');
    if (savedName) {
      this.state.playerName = savedName;
      this.notify();
    }
  }

  resetState(subjectId: string) {
    this.state = {
      ...this.state,
      selectedSubject: subjectId,
      currentQuestion: 0,
      questions: [],
      answers: [],
      quizStarted: false,
      quizCompleted: false,
      timeLeft: 0,
      timer: null,
      isLoading: false
    };
    this.notify();
  }

  clearAllData() {
    // Clear all localStorage data
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('quizAppState_') || key === 'quizAppPlayerName') {
        localStorage.removeItem(key);
      }
    });

    // Reset state
    this.state = {
      playerName: '',
      selectedSubject: '',
      currentQuestion: 0,
      questions: [],
      answers: [],
      quizStarted: false,
      quizCompleted: false,
      timeLeft: 0,
      timer: null,
      isLoading: false
    };
    this.notify();
  }

  private showLoadingOverlay(message: string) {
    const overlay = document.createElement('div');
    overlay.id = 'quiz-loading-overlay';
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 50;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(to bottom right, rgba(49, 46, 129, 0.9), rgba(88, 28, 135, 0.9));
      backdrop-filter: blur(8px);
      opacity: 0;
      transition: opacity 0.3s ease-out;
    `;

    overlay.innerHTML = `
      <div style="text-align: center; transform: translateY(20px); transition: transform 0.3s ease-out;">
        <div style="position: relative; width: 12rem; height: 12rem; margin: 0 auto 2rem;">
          <div style="position: absolute; inset: 0; border-radius: 9999px; border: 4px solid rgba(99, 102, 241, 0.2); animation: spin 3s linear infinite;"></div>
          <div style="position: absolute; inset: 0; border-radius: 9999px; border: 4px solid transparent; border-top-color: rgb(168, 85, 247); animation: spin 2s linear infinite;"></div>
          <div style="position: absolute; inset: 2rem; border-radius: 9999px; background: linear-gradient(to bottom right, rgb(99, 102, 241), rgb(168, 85, 247)); animation: pulse 2s ease-in-out infinite; display: flex; align-items: center; justify-center;">
            <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;">
              <div style="font-size: 2.25rem; font-weight: 700; color: white; animation: iconSpin 8s linear infinite;">
                ⚡
              </div>
            </div>
          </div>
        </div>
        <div style="font-size: 1.5rem; font-weight: 700; background: linear-gradient(to right, rgb(129, 140, 248), rgb(167, 139, 250)); -webkit-background-clip: text; color: transparent;">
          ${message}
        </div>
        <div style="margin-top: 1rem; width: 16rem; height: 0.5rem; margin-left: auto; margin-right: auto; background: rgba(255, 255, 255, 0.1); border-radius: 9999px; overflow: hidden;">
          <div style="height: 100%; background: linear-gradient(to right, rgb(99, 102, 241), rgb(168, 85, 247)); border-radius: 9999px; width: 0%; animation: loading 2s ease-in-out infinite;"></div>
        </div>
      </div>

      <style>
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes iconSpin {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(90deg) scale(1.2); }
          50% { transform: rotate(180deg) scale(1); }
          75% { transform: rotate(270deg) scale(1.2); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(0.95); opacity: 0.8; }
        }
        @keyframes loading {
          0% { width: 0%; transform: translateX(-100%); }
          50% { width: 100%; transform: translateX(0); }
          100% { width: 0%; transform: translateX(100%); }
        }
      </style>
    `;

    document.body.appendChild(overlay);
    
    // Trigger animations
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      const content = overlay.querySelector('div');
      if (content) {
        content.style.transform = 'translateY(0)';
      }
    });

    return overlay;
  }

  private removeLoadingOverlay() {
    const overlay = document.getElementById('quiz-loading-overlay');
    if (overlay) {
      overlay.style.opacity = '0';
      overlay.querySelector('div')!.style.transform = 'translateY(20px)';
      setTimeout(() => overlay.remove(), 300);
    }
  }

  async startQuiz(subjectId: string) {
    try {
      this.state.selectedSubject = subjectId;
      this.state.isLoading = true;
      this.saveState(subjectId);

      const loadingOverlay = this.showLoadingOverlay('Loading Questions...');

      const questions = await fetchQuestions(subjectId);
      this.state.questions = questions;
      this.state.answers = new Array(questions.length).fill(null);
      this.state.timeLeft = questions.length * 60;
      this.state.isLoading = false;
      this.state.quizStarted = true;
      this.saveState(subjectId);
      this.notify();

      this.removeLoadingOverlay();
      return true;
    } catch (error) {
      this.state.isLoading = false;
      this.removeLoadingOverlay();
      this.notify();
      throw error;
    }
  }

  async completeQuiz() {
    try {
      const loadingOverlay = this.showLoadingOverlay('Submitting Results...');

      if (this.state.timer) {
        clearInterval(this.state.timer);
      }
      
      this.state.quizCompleted = true;
      this.notify();
      
      const score = this.calculateScore();

      // Start saving score and fetching leaderboard in parallel
      const [saveResult] = await Promise.all([
        saveScore(
          this.state.playerName,
          this.state.selectedSubject,
          score
        ),
        // Pre-fetch leaderboard for faster results display
        this.getLeaderboard()
      ]);

      this.clearState(this.state.selectedSubject);
      this.removeLoadingOverlay();

      return score;
    } catch (error) {
      this.removeLoadingOverlay();
      throw error;
    }
  }

  selectAnswer(index: number) {
    this.state.answers[this.state.currentQuestion] = index;
    this.saveState(this.state.selectedSubject);
    this.notify();
  }

  nextQuestion() {
    if (this.state.currentQuestion < this.state.questions.length - 1) {
      this.state.currentQuestion++;
      this.saveState(this.state.selectedSubject);
      this.notify();
      return true;
    }
    return false;
  }

  previousQuestion() {
    if (this.state.currentQuestion > 0) {
      this.state.currentQuestion--;
      this.saveState(this.state.selectedSubject);
      this.notify();
      return true;
    }
    return false;
  }

  calculateScore() {
    return this.state.answers.reduce((score, answer, index) => {
      return score + (answer === this.state.questions[index].answer ? 1 : 0);
    }, 0);
  }

  async getLeaderboard() {
    return await fetchLeaderboard(this.state.selectedSubject);
  }

  async createSubject(subjectData: any) {
    return await createSubject(subjectData);
  }
}