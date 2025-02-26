export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  coverUrl: string;
  description: string;
  driveLink?: string;
  fileType?: string;
  fileSize?: string;
}

export interface Category {
  name: string;
  color: string;
  ringColor: string;
}

export interface ApiResponse {
  success: boolean;
  data: Book[];
  error?: string;
}

export interface Theme {
  id: string;
  name: string;
  bgGradient: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  navBg: string;
  buttonBg: string;
}