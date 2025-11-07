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

export interface DeleteAccountResponse {
  id: number;
  username: string;
  role: string;
}

export interface UpdateUsernameRequest {
  username: string;
}

export interface UpdatePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface UserStatisticsResponse {
  data: {
    id: number;
    username: string;
    role: string;
    statistic: {
      rating: number;
      snippetsCount: number;
      commentsCount: number;
      likesCount: number;
      dislikesCount: number;
      questionsCount: number;
      correctAnswersCount: number;
      regularAnswersCount: number;
    };
  };
}
