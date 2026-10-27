'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { SITE_URL } from '@/lib/constants';
import { lectureBoardImage, LECTURE_SHARE_DESCRIPTION } from '@/lib/lecture-share';
import { KakaoShareButton } from '@/components/daily/KakaoShareButton';
import { LectureViewCount } from '@/components/lectures/LectureViewCount';

type Comment = { id: string; user_id: string; parent_id: string | null; content: string; created_at: string; profiles: {nickname: string} | {nickname: string}[] | null };
const nickname = (comment: Comment) => (Array.isArray(comment.profiles) ? comment.profiles[0] : comment.profiles)?.nickname || '수강생';
const PAGE_SIZE = 100;

export default function LectureSocial({lectureId, subject, title}: {lectureId: string; subject: string; title: string}) {
  const client = useMemo(() => createClient(), []);
  const [userId, setUserId] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentCount, setCommentCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [reply, setReply] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const commentsRef = useRef<HTMLElement>(null);
  const path = `/real-estate/lectures/${subject}?lecture=${encodeURIComponent(lectureId)}`;
  const loginHref = `/login?next=${encodeURIComponent(path)}`;

  const load = useCallback(async (viewer: string | null) => {
    const [rows, likes, mine] = await Promise.all([
      client.from('lecture_comments').select('id,user_id,parent_id,content,created_at,profiles:user_id(nickname)',{count:'exact'}).eq('lecture_id',lectureId).order('created_at').order('id').range(0,PAGE_SIZE-1),
      client.from('lecture_likes').select('lecture_id',{count:'exact',head:true}).eq('lecture_id',lectureId),
      viewer ? client.from('lecture_likes').select('lecture_id').eq('lecture_id',lectureId).eq('user_id',viewer).maybeSingle() : Promise.resolve({data:null,error:null}),
    ]);
    if (rows.error || likes.error || mine.error) throw new Error('load');
    const fetched = (rows.data || []) as unknown as Comment[];
    setComments(fetched); setCommentCount(rows.count || 0); setHasMore((rows.count || 0) > fetched.length);
    setLikeCount(likes.count || 0); setLiked(Boolean(mine.data));
  }, [client,lectureId]);

  useEffect(() => {
    let active = true;
    const refresh = async (viewer: string | null) => {
      if (!active) return;
      setUserId(viewer);
      try { await load(viewer); } catch { if(active) setError('댓글과 좋아요를 불러오지 못했어요. 다시 시도해 주세요.'); }
      finally { if(active) setLoading(false); }
    };
    void client.auth.getUser().then(({data}) => refresh(data.user?.id || null)).catch(() => refresh(null));
    const {data: listener}=client.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') void refresh(session?.user?.id || null);
    });
    return () => { active=false; listener.subscription.unsubscribe(); };
  },[client,load]);

  async function toggleLike() {
    if (!userId) { setMessage('로그인하면 좋아요와 댓글을 남길 수 있어요.'); return; }
    if (pending || loading) return;
    setPending(true); setError('');
    try {
      const result=liked ? await client.from('lecture_likes').delete().eq('lecture_id',lectureId).eq('user_id',userId)
        : await client.from('lecture_likes').insert({lecture_id:lectureId,user_id:userId});
      if(result.error && result.error.code !== '23505') throw result.error;
      await load(userId);
    } catch { setError('좋아요를 저장하지 못했어요. 다시 시도해 주세요.'); }
    finally { setPending(false); }
  }

  async function submit(event: React.FormEvent, parentId: string | null) {
    event.preventDefault();
    if (!userId) { setMessage('로그인하면 댓글을 남길 수 있어요.'); return; }
    const text=(parentId ? reply : content).trim();
    if(!text || text.length > 2000 || pending) return;
    setPending(true); setError('');
    try {
      const result=await client.from('lecture_comments').insert({lecture_id:lectureId,user_id:userId,parent_id:parentId,content:text});
      if(result.error) throw result.error;
      if(parentId) { setReply(''); setReplyTo(null); } else setContent('');
      setMessage(parentId ? '답글을 등록했어요.' : '댓글을 등록했어요.');
      await load(userId);
    } catch { setError('댓글을 등록하지 못했어요. 내용을 남겨 두었으니 다시 시도해 주세요.'); }
    finally { setPending(false); }
  }

  async function loadMore() {
    setLoadingMore(true); setError('');
    try {
      const result=await client.from('lecture_comments').select('id,user_id,parent_id,content,created_at,profiles:user_id(nickname)',{count:'exact'}).eq('lecture_id',lectureId).order('created_at').order('id').range(comments.length,comments.length+PAGE_SIZE-1);
      if(result.error) throw result.error;
      const more=(result.data || []) as unknown as Comment[];
      setComments(previous=>[...previous,...more]);setCommentCount(result.count || 0);setHasMore(comments.length+more.length < (result.count || 0));
    } catch { setError('댓글을 더 불러오지 못했어요. 다시 시도해 주세요.'); }
    finally { setLoadingMore(false); }
  }

  async function copyLink() {
    try { await navigator.clipboard.writeText(`${SITE_URL}${path}`);setMessage('이 강의의 링크를 복사했어요.'); }
    catch { setError('링크를 복사하지 못했어요. 아래 주소를 복사해 주세요.');setMessage(`${SITE_URL}${path}`); }
  }
  function commentBody(comment: Comment) {
    return <><div className="lecture-comment-author"><strong>{nickname(comment)}</strong><time dateTime={comment.created_at}>{new Date(comment.created_at).toLocaleDateString('ko-KR',{timeZone:'Asia/Seoul'})}</time></div><p className="lecture-comment-content">{comment.content}</p></>;
  }

  return <section className="lecture-social" aria-label="강의 댓글과 공유">
    <div className="lecture-social-actions">
      <LectureViewCount lectureId={lectureId} className="lecture-view-count" />
      <button type="button" className={liked ? 'is-liked' : ''} aria-pressed={liked} onClick={toggleLike} disabled={pending || loading}><span aria-hidden="true">{liked?'♥':'♡'}</span> 좋아요 {loading ? '…' : likeCount}</button>
      <button type="button" aria-expanded={showComments} onClick={()=>{setShowComments(!showComments);if(!showComments) requestAnimationFrame(()=>commentsRef.current?.scrollIntoView({behavior:'smooth',block:'nearest'}));}}>댓글 {loading ? '…' : commentCount}</button>
      <button type="button" onClick={copyLink}>링크 공유</button>
      <KakaoShareButton title={`${title} | 봄기출 칠판 강의`} description={LECTURE_SHARE_DESCRIPTION} imagePath={lectureBoardImage(lectureId)} path={path}>카카오톡 공유</KakaoShareButton>
    </div>
    {message && <p className="lecture-social-message" role="status">{message}</p>}
    {error && <p className="lecture-social-error" role="alert">{error} <button type="button" onClick={()=>{setError('');void load(userId).catch(()=>setError('잠시 후 다시 시도해 주세요.'));}}>다시 불러오기</button></p>}
    {!userId && <p className="lecture-social-login">좋아요와 댓글은 <Link href={loginHref}>로그인 후</Link> 남길 수 있어요.</p>}
    {showComments && <section ref={commentsRef} className="lecture-comments" aria-label="강의 댓글">
      <h3>댓글 {commentCount}</h3>
      <form onSubmit={event=>submit(event,null)}>
        <label htmlFor={`comment-${lectureId}`}>댓글 작성</label>
        <textarea id={`comment-${lectureId}`} value={content} onChange={event=>setContent(event.target.value)} maxLength={2000} rows={3} placeholder="강의에서 배운 점이나 궁금한 점을 남겨 주세요." required/>
        <div className="lecture-comment-submit"><span>{content.length}/2,000</span><button disabled={pending || !content.trim()} type="submit">{pending ? '등록 중…' : '댓글 등록'}</button></div>
      </form>
      {!loading && !commentCount && <p className="lecture-comment-empty">첫 댓글을 남겨 보세요.</p>}
      <ol>{comments.filter(comment=>!comment.parent_id).map(comment=><li key={comment.id} className="lecture-comment">
        {commentBody(comment)}
        <button className="lecture-reply-button" type="button" onClick={()=>{setReplyTo(replyTo?.id === comment.id ? null : comment);setReply('');}}>답글</button>
        <ol className="lecture-replies">{comments.filter(child=>child.parent_id === comment.id).map(child=><li key={child.id}>{commentBody(child)}</li>)}</ol>
        {replyTo?.id === comment.id && <form className="lecture-reply-form" onSubmit={event=>submit(event,comment.id)}>
          <label htmlFor={`reply-${comment.id}`}>{nickname(comment)}님에게 답글</label>
          <textarea id={`reply-${comment.id}`} value={reply} onChange={event=>setReply(event.target.value)} maxLength={2000} rows={2} required/>
          <div className="lecture-comment-submit"><button type="button" onClick={()=>setReplyTo(null)}>취소</button><button type="submit" disabled={pending || !reply.trim()}>답글 등록</button></div>
        </form>}
      </li>)}</ol>
      {hasMore && <button className="lecture-reply-button" disabled={loadingMore} onClick={loadMore}>{loadingMore ? '불러오는 중…' : '댓글 더 보기'}</button>}
    </section>}
  </section>;
}
