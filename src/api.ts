import axios from 'axios';
import { ApiResponse } from './types';

// Replace this URL with your deployed Google Apps Script web app URL
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzSpyFRo8N2dCJ3gGbJttnOhu8hjltqAyXm3MlmDIxBVzSjY42yX-PKYeFa3dGVDxMV/exec';

export async function fetchBooks() {
  try {
    const response = await axios.get<ApiResponse>(APPS_SCRIPT_URL);
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.error || 'Failed to fetch books');
    }
  } catch (error) {
    console.error('Error fetching books:', error);
    throw error;
  }
}