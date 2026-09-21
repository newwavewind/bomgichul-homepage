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
export type CommunityScope =
  | "real_estate"
  | "public_service"
  | "police"
  | "housing"
  | "social_worker"
  | "history"
  | "english";

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
  community_scope: CommunityScope;
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
  community_scope: CommunityScope;
  title: string;
  view_count: number;
  comment_count: number;
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

export type DmMessageKind =
  | "text"
  | "exam_card"
  | "wrong_share"
  | "timer"
  | "poll"
  | "voice"
  | "system"
  | "mock_invite"
  | "checkin"
  | "schedule_share"
  | "reminder"
  | "mock_result";

export interface DmMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  author: Pick<Profile, "nickname" | "avatar_url">;
  attachments: DmAttachment[];
  reply_to_id: string | null;
  edited_at: string | null;
  deleted_at: string | null;
  reply_to?: Pick<DmMessage, "id" | "content" | "sender_id"> | null;
  reactions: DmReaction[];
  views?: DmMessageView[];
  message_kind?: DmMessageKind;
  payload?: Record<string, unknown>;
  scheduled_for?: string | null;
  published_at?: string | null;
  mention_user_ids?: string[];
  bookmarked?: boolean;
  thread_root_id?: string | null;
}

export interface DmReaction {
  message_id: string;
  user_id: string;
  emoji: string;
}

export interface DmMessageView {
  message_id: string;
  user_id: string;
  created_at?: string;
}

export interface DmAttachment {
  id: string;
  message_id: string;
  conversation_id: string;
  uploader_id: string;
  kind: "image" | "video" | "file" | "audio";
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  width: number | null;
  height: number | null;
  duration_seconds: number | null;
  signed_url?: string;
}

export interface ChatMember extends Pick<
  Profile,
  "id" | "nickname" | "avatar_url"
> {
  role: "owner" | "admin" | "member";
  last_read_at?: string;
}

export interface DmConversationPreview {
  id: string;
  title: string;
  isGroup: boolean;
  avatar_url: string | null;
  members: ChatMember[];
  otherUser: Pick<Profile, "id" | "nickname" | "avatar_url"> | null;
  isSelf?: boolean;
  pinnedAt?: string | null;
  archivedAt?: string | null;
  mutedUntil?: string | null;
  kind?: "dm" | "group" | "self" | "topic";
  topicKey?: string | null;
  topicLabel?: string | null;
  inviteCode?: string | null;
  lastMessage: {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    created_at: string;
    mention_user_ids?: string[];
  } | null;
  unreadCount: number;
  mentionUnread?: boolean;
  updatedAt: string;
  pinned_message_id?: string | null;
  slow_mode_seconds?: number;
  study_dday?: string | null;
  study_goal?: string | null;
  posting_mode?: "open" | "admin_only" | null;
}

export interface UserChatPrefs {
  user_id: string;
  keyword_alerts: string[];
  daily_goal_count: number;
  daily_done_count: number;
  daily_done_on: string | null;
}

export interface TopicRoomRow {
  id: string;
  title: string;
  topic_key: string;
  topic_label: string;
  gate_subject: string | null;
  invite_code: string | null;
  member_count: number;
  joined: boolean;
  posting_mode?: string | null;
}

export interface Friendship {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: "pending" | "accepted";
  created_at: string;
  accepted_at: string | null;
  requester?: Pick<Profile, "id" | "nickname" | "avatar_url">;
  addressee?: Pick<Profile, "id" | "nickname" | "avatar_url">;
}

export interface OnlineUser {
  user_id: string;
  nickname: string;
  avatar_url?: string | null;
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
  post_id: string | null;
  comment_id: string | null;
  memo_id: string | null;
  memo_comment_id: string | null;
  conversation_id?: string | null;
  dm_message_id?: string | null;
  type:
    | "comment"
    | "memo_comment"
    | "dm_mention"
    | "dm_message"
    | "friend"
    | "chat_system";
  read_at: string | null;
  created_at: string;
  actor?: Pick<Profile, "nickname" | "avatar_url">;
  post?: Pick<Post, "title" | "community_scope">;
  memo?: {
    subject: string;
    year: number;
    question_no: number;
  };
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
  community_scope: CommunityScope;
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
