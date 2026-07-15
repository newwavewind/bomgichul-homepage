export type PostCategory =
  | "question"
  | "resource"
  | "chat"
  | "free"
  | "info"
  | "bug"
  | "feedback"
  | "review"
  | "law_update";

/** 커뮤니티 목록 필터 (베스트는 DB 카테고리가 아닌 가상 필터) */
export type CommunityListFilter = PostCategory | "all" | "best";

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

/** 커뮤니티 목록용 경량 타입 */
export interface PostListItem {
  id: string;
  author_id: string;
  category: PostCategory;
  title: string;
  view_count: number;
  created_at: string;
  profiles?: Pick<Profile, "nickname">;
}

/** 자료실 목록용 경량 타입 */
export interface ArchiveListItem {
  id: string;
  author_id: string;
  category: PostCategory;
  title: string;
  view_count: number;
  subject: string | null;
  resource_type: ResourceType | null;
  created_at: string;
  profiles?: Pick<Profile, "nickname">;
  post_attachments?: Pick<
    PostAttachment,
    "id" | "file_name" | "file_size" | "mime_type"
  >[];
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

export interface PublicQuestionMemo {
  id: string;
  user_id: string;
  subject: string;
  year: number;
  question_no: number;
  content: string;
  created_at: string;
  updated_at: string;
  author: Pick<Profile, "nickname" | "avatar_url">;
  like_count: number;
  liked_by_viewer: boolean;
  comments: PublicMemoComment[];
}

export interface PublicMemoComment {
  id: string;
  memo_id: string;
  user_id: string;
  content: string;
  created_at: string;
  author: Pick<Profile, "nickname" | "avatar_url">;
}

export interface ConceptCommunityComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  author: Pick<Profile, "nickname" | "avatar_url">;
}

export interface ConceptCommunityPost {
  id: string;
  user_id: string;
  subject: string;
  concept_slug: string;
  content: string;
  view_count: number;
  created_at: string;
  updated_at: string;
  author: Pick<Profile, "nickname" | "avatar_url">;
  like_count: number;
  liked_by_viewer: boolean;
  recommend_count: number;
  recommended_by_viewer: boolean;
  comments: ConceptCommunityComment[];
}

export interface DmMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  author: Pick<Profile, "nickname" | "avatar_url">;
}

export interface DmConversationPreview {
  id: string;
  otherUser: Pick<Profile, "id" | "nickname" | "avatar_url">;
  lastMessage: {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    created_at: string;
  } | null;
  unreadCount: number;
  updatedAt: string;
}

export interface OnlineUser {
  user_id: string;
  nickname: string;
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

export interface MockExamSession {
  id: string;
  user_id: string;
  subject: string;
  year: number;
  total: number;
  correct: number;
  elapsed_seconds: number;
  created_at: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source_name: string;
  source_url: string;
  published_at: string;
  created_at: string;
}
