// Domain Types
export interface Snippet {
  id: number;
  title: string;
  content: string;
  language?: string;
  createdAt: string;
  username?: string;
  likes?: number;
  dislikes?: number;
  comments?: number;
  currentUserMark?: 'like' | 'dislike' | null;
}

export interface PaginationMeta {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
}

export interface SnippetsResponse {
  snippets: Snippet[];
  meta: PaginationMeta;
}

export interface PostSnippetRequest {
  code: string;
  language: string;
}

export interface PostSnippetFormData {
  language: string;
  code: string;
}

export interface UpdateSnippetRequest {
  code: string;
  language: string;
}

export interface CreateCommentRequest {
  content: string;
  snippetId: number;
}

export interface CreateCommentResponse {
  id: number;
  content: string;
  user: {
    id: number;
    username: string;
    role: string;
  };
}

export interface UpdateCommentRequest {
  content: string;
}

export interface UpdateCommentResponse {
  updatedCount: number;
}

// API Types
export interface ApiUser {
  id: string;
  username: string;
  role: string;
}

export interface ApiMark {
  id: string;
  type: 'like' | 'dislike';
  user: ApiUser;
}

export interface ApiComment {
  id: string;
  content: string;
  user: ApiUser;
}

export interface ApiSnippet {
  id: string;
  code: string;
  language: string;
  marks: ApiMark[];
  user: ApiUser;
  comments: ApiComment[];
}

export interface ApiPaginationMeta {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
}

export interface ApiPaginationLinks {
  current: string;
  next?: string;
  last: string;
}

export interface ApiResponseData {
  data: ApiSnippet[];
  meta: ApiPaginationMeta;
  links: ApiPaginationLinks;
}

export interface ApiResponse {
  data: ApiResponseData;
}
