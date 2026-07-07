export type PostCategory =
  | "question"
  | "resource"
  | "chat"
  | "info"
  | "bug"
  | "feedback"
  | "review";

export type ResourceType = "past_exam" | "note" | "summary" | "other";

export interface Profile {
  id: string;
  nickname: string;
  avatar_url: string | null;
  username_set: boolean;
  created_at: string;
}

export interface PostAttachment {
  id: string;
  post_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}

export interface Post {
  id: string;
  author_id: string;
  category: PostCategory;
  title: string;
  content: string;
  view_count: number;
  subject: string | null;
  resource_type: ResourceType | null;
  created_at: string;
  updated_at: string;
  profiles?: Pick<Profile, "nickname" | "avatar_url">;
  post_attachments?: PostAttachment[];
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  profiles?: Pick<Profile, "nickname" | "avatar_url">;
}

export interface QuestionBookmark {
  id: string;
  user_id: string;
  subject: string;
  year: number;
  question_no: number;
  created_at: string;
}

export type AttemptResult = "correct" | "wrong";

export interface QuestionAttempt {
  id: string;
  user_id: string;
  subject: string;
  year: number;
  question_no: number;
  result: AttemptResult;
  created_at: string;
  updated_at: string;
}

export interface QuestionNote {
  id: string;
  user_id: string;
  subject: string;
  year: number;
  question_no: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface DailyQuizResult {
  id: string;
  user_id: string;
  quiz_date: string;
  total: number;
  correct: number;
  created_at: string;
}

export interface Notification {
  id: string;
  recipient_id: string;
  actor_id: string;
  post_id: string;
  comment_id: string | null;
  type: "comment";
  read_at: string | null;
  created_at: string;
  actor?: Pick<Profile, "nickname" | "avatar_url">;
  post?: Pick<Post, "title">;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type DiaryMood = "great" | "good" | "okay" | "tired" | "hard";

export interface StudyDiary {
  id: string;
  author_id: string;
  diary_date: string;
  days_until_exam: number;
  content: string;
  mood: DiaryMood | null;
  study_minutes: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  profiles?: Pick<Profile, "nickname" | "avatar_url">;
}
