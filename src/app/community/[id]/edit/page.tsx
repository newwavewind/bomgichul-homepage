"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { USER_WRITABLE_CATEGORIES } from "@/lib/constants";
import { FeatureCard } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PrimaryButton } from "@/components/ui/Button";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import { BackLink } from "@/components/ui/BackLink";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { sanitizeConceptCommunityHtml } from "@/lib/concept-community-html";
import { communityBaseHref, isValidCommunityScope } from "@/lib/exam-track/community";
import type { CommunityScope, Post, PostCategory } from "@/types/database";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

function scopeFromPost(scope: string | null | undefined): CommunityScope {
  return isValidCommunityScope(scope) ? scope : "real_estate";
}

export default function EditPage({ params }: EditPageProps) {
  const router = useRouter();
  const [postId, setPostId] = useState<string>("");
  const [postHref, setPostHref] = useState("/community");
  const [title, setTitle] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [contentPlain, setContentPlain] = useState("");
  const [initialHtml, setInitialHtml] = useState("");
  const [category, setCategory] = useState<PostCategory>("question");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    params.then(({ id }) => {
      setPostId(id);
      if (!isSupabaseConfigured()) {
        setLoading(false);
        return;
      }

      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (!user) {
          router.push("/login");
          return;
        }
        setUserId(user.id);

        supabase
          .from("posts")
          .select("*")
          .eq("id", id)
          .single()
          .then(({ data, error: fetchError }) => {
            if (fetchError || !data) {
              router.push("/");
              return;
            }
            const post = data as Post;
            const detail = `${communityBaseHref(scopeFromPost(post.community_scope))}/${id}`;
            setPostHref(detail);
            if (post.author_id !== user.id) {
              router.push(detail);
              return;
            }
            setTitle(post.title);
            setInitialHtml(post.content);
            setContentHtml(post.content);
            setCategory(post.category);
            setLoading(false);
          });
      });
    });
  }, [params, router]);

  const canSubmit =
    title.trim().length > 0 &&
    (contentPlain.trim().length > 0 || contentHtml.includes("<img"));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    setError(null);

    try {
      const supabase = createClient();
      const html = sanitizeConceptCommunityHtml(contentHtml).trim();
      const content = html || contentPlain.trim();
      const { error: updateError } = await supabase
        .from("posts")
        .update({ title: title.trim(), content, category })
        .eq("id", postId);

      if (updateError) {
        setError(updateError.message);
      } else {
        router.push(postHref);
        router.refresh();
      }
    } catch {
      setError("수정에 실패했습니다.");
    }

    setSaving(false);
  };

  const categoryOptions = USER_WRITABLE_CATEGORIES;

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="font-display text-body text-smoke">불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <BackLink href={postHref}>돌아가기</BackLink>

      <EyebrowLabel className="mb-2">게시글 수정</EyebrowLabel>
      <SectionHeading as="h1" className="mb-8 text-heading-sm">
        글 수정하기
      </SectionHeading>

      <FeatureCard>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-3 block font-display text-body-sm font-medium text-ink">
              카테고리
            </label>
            <div className="flex flex-wrap gap-2">
              {categoryOptions.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value as PostCategory)}
                  className={`rounded-[var(--radius-tags)] px-4 py-1.5 font-display text-body-sm font-medium ${
                    category === cat.value
                      ? "bg-midnight text-paper"
                      : "bg-paper text-ink hover:bg-surface"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <Input
            id="title"
            label="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div>
            <label className="mb-3 block font-display text-body-sm font-medium text-ink">
              내용
            </label>
            <RichTextEditor
              userId={userId}
              initialHtml={initialHtml}
              placeholder="내용을 입력하세요"
              onHtmlChange={(html, plain) => {
                setContentHtml(html);
                setContentPlain(plain);
              }}
            />
          </div>

          {error && <p className="font-display text-body-sm text-coral">{error}</p>}

          <div className="flex justify-end gap-3">
            <Link
              href={postHref}
              className="rounded-[var(--radius-buttons)] px-5 py-2.5 font-display text-body-sm text-fog"
            >
              취소
            </Link>
            <PrimaryButton type="submit" disabled={saving || !canSubmit}>
              {saving ? "저장 중..." : "저장하기"}
            </PrimaryButton>
          </div>
        </form>
      </FeatureCard>
    </div>
  );
}
