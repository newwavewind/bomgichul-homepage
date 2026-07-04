"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { USER_WRITABLE_CATEGORIES } from "@/lib/constants";
import { FeatureCard } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import { PrimaryButton } from "@/components/ui/Button";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import type { PostCategory } from "@/types/database";

export default function WritePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<PostCategory>("question");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      const { data, error: insertError } = await supabase
        .from("posts")
        .insert({
          author_id: user.id,
          title,
          content,
          category,
        })
        .select("id")
        .single();

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }

      router.push(`/community/${data.id}`);
    } catch {
      setError("Supabase 연결이 필요합니다. .env.local을 확인해주세요.");
      setLoading(false);
    }
  };

  const categoryOptions = USER_WRITABLE_CATEGORIES;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <Link
        href="/community"
        className="mb-8 inline-block font-display text-body-sm text-fog transition-colors hover:text-ink"
      >
        ← 목록으로
      </Link>

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
                    ${category === cat.value
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

          <Textarea
            id="content"
            label="내용"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={12}
            placeholder="내용을 입력하세요"
          />

          {error && (
            <p className="font-display text-body-sm text-coral">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Link
              href="/community"
              className="rounded-[var(--radius-buttons)] px-5 py-2.5 font-display text-body-sm font-medium text-fog transition-colors hover:text-ink"
            >
              취소
            </Link>
            <PrimaryButton type="submit" disabled={loading}>
              {loading ? "등록 중..." : "등록하기"}
            </PrimaryButton>
          </div>
        </form>
      </FeatureCard>
    </div>
  );
}
