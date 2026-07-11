"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { USER_WRITABLE_CATEGORIES } from "@/lib/constants";
import { FeatureCard } from "@/components/ui/Card";
import { Input, Textarea } from "@/components/ui/Input";
import { PrimaryButton } from "@/components/ui/Button";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import { BackLink } from "@/components/ui/BackLink";
import type { Post, PostCategory } from "@/types/database";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default function EditPage({ params }: EditPageProps) {
  const router = useRouter();
  const [postId, setPostId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<PostCategory>("question");
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

        supabase
          .from("posts")
          .select("*")
          .eq("id", id)
          .single()
          .then(({ data, error: fetchError }) => {
            if (fetchError || !data) {
              router.push("/community");
              return;
            }
            const post = data as Post;
            if (post.author_id !== user.id) {
              router.push(`/community/${id}`);
              return;
            }
            setTitle(post.title);
            setContent(post.content);
            setCategory(post.category);
            setLoading(false);
          });
      });
    });
  }, [params, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("posts")
        .update({ title, content, category })
        .eq("id", postId);

      if (updateError) {
        setError(updateError.message);
      } else {
        router.push(`/community/${postId}`);
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
      <BackLink href={`/community/${postId}`}>돌아가기</BackLink>

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

          <Textarea
            id="content"
            label="내용"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={12}
          />

          {error && <p className="font-display text-body-sm text-coral">{error}</p>}

          <div className="flex justify-end gap-3">
            <Link
              href={`/community/${postId}`}
              className="rounded-[var(--radius-buttons)] px-5 py-2.5 font-display text-body-sm text-fog"
            >
              취소
            </Link>
            <PrimaryButton type="submit" disabled={saving}>
              {saving ? "저장 중..." : "저장하기"}
            </PrimaryButton>
          </div>
        </form>
      </FeatureCard>
    </div>
  );
}
