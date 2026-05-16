export interface User {
  id: number;
  email: string;
  created_at: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  published: boolean;
  created_at: string;
  owner_id: number;
  owner: User;
}

/** Backend returns nested key "Post" (capital P) */
export interface PostOut {
  Post: Post;
  votes: number;
}

export interface PostCreate {
  title: string;
  content: string;
  published?: boolean;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface VotePayload {
  post_id: number;
  dir: 0 | 1;
}

export interface ApiError {
  detail: string | { msg: string; type: string }[];
}

export interface JwtPayload {
  user_id: number;
  exp: number;
}
