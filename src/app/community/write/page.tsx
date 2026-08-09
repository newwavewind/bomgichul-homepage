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
import type { CommunityScope, PostCategory } from "@/types/database";
import { communityBaseHref } from "@/lib/exam-track/community";

export function CommunityWritePage({ scope = "real_estate" }: { scope?: CommunityScope }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [contentHtml, setContentHtml] = useState("");
  const [contentPlain, setContentPlain] = useState("");
  const [category, setCategory] = useState<PostCategory>("free");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const baseHref = communityBaseHref(scope);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();
    void supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id ?? null);
    });
  }, []);

  const canSubmit =
    title.trim().length > 0 &&
    (contentPlain.trim().length > 0 || contentHtml.includes("<img"));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      const html = sanitizeConceptCommunityHtml(contentHtml).trim();
      const content = html || contentPlain.trim();

      const { data, error: insertError } = await supabase
        .from("posts")
        .insert({
          author_id: user.id,
          title: title.trim(),
          content,
          category,
          community_scope: scope,
        })
        .select("id")
        .single();

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }

      router.push(`${baseHref}/${data.id}`);
    } catch {
      setError("Supabase 연결이 필요합니다. .env.local을 확인해주세요.");
      setLoading(false);
    }
  };

  const categoryOptions = USER_WRITABLE_CATEGORIES;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <BackLink href={baseHref}>목록으로</BackLink>

      <EyebrowLabel className="mb-2">새 글 작성</EyebrowLabel>
      <SectionHeading as="h1" className="mb-8">
        글쓰기
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
                  className={`
                    rounded-[var(--radius-tags)] px-4 py-1.5
                    font-display text-body-sm font-medium transition-colors
                    ${
                      category === cat.value
                        ? "bg-midnight text-paper"
                        : "bg-paper text-ink hover:bg-snow"
                    }
                  `}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <Input
            id="title"
            label="제목"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="제목을 입력하세요"
          />

          <div>
            <label className="mb-3 block font-display text-body-sm font-medium text-ink">
              내용
            </label>
            <RichTextEditor
              userId={userId}
              placeholder="내용을 입력하세요. 굵게·크기·글꼴·색·사진으로 정리할 수 있어요."
              onRequireLogin={() => router.push(`/login?next=${baseHref}/write`)}
              onHtmlChange={(html, plain) => {
                setContentHtml(html);
                setContentPlain(plain);
              }}
            />
          </div>

          {error && (
            <p className="font-display text-body-sm text-coral">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Link
              href={baseHref}
              className="rounded-[var(--radius-buttons)] px-5 py-2.5 font-display text-body-sm font-medium text-fog transition-colors hover:text-ink"
            >
              취소
            </Link>
            <PrimaryButton type="submit" disabled={loading || !canSubmit}>
              {loading ? "등록 중..." : "등록하기"}
            </PrimaryButton>
          </div>
        </form>
      </FeatureCard>
    </div>
  );
}

export default function WritePage() {
  return <CommunityWritePage />;
}
