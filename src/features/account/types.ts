export interface UserStats {
  rating: number;
  snippets: number;
  comments: number;
  likes: number;
  dislikes: number;
  questions: number;
  correctAnswers: number;
  regularAnswers: number;
}

export interface ChangeUsernameFormData {
  newUsername: string;
}

export interface ChangePasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
