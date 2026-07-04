import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { getPosts } from "@/lib/posts";
import { PostCard } from "@/components/board/PostCard";
import { UsernameForm } from "@/components/profile/UsernameForm";
import { PrimaryButton } from "@/components/ui/Button";
import { EyebrowLabel, SectionHeading } from "@/components/ui/Typography";
import { ElevatedCard, FeatureCard } from "@/components/ui/Card";

export default async function ProfilePage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  if (!user.usernameSet) {
    redirect("/onboarding");
  }

  const { data: myPosts } = await getPosts({ authorId: user.id, page: 1 });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <EyebrowLabel className="mb-2">내 계정</EyebrowLabel>
      <SectionHeading as="h1" className="mb-8 text-heading-sm">
        프로필
      </SectionHeading>

      <FeatureCard className="mb-8 border-[1.5px] border-carbon">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-icons)] border-[1.5px] border-carbon bg-snow font-display text-heading-sm font-semibold text-ink">
            {user.nickname.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-display text-[12px] text-fog">아이디</p>
            <p className="font-display text-subheading font-semibold text-ink">
              {user.nickname}
            </p>
            <p className="mt-1 font-display text-[12px] text-fog">
              로그인용 이메일은 본인만 볼 수 있으며 공개되지 않습니다.
            </p>
          </div>
        </div>
        <UsernameForm currentUsername={user.nickname} />
      </FeatureCard>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-display text-subheading font-semibold text-ink">
          내가 쓴 글 ({myPosts.length})
        </h2>
        <PrimaryButton href="/community/write" size="sm">
          새 글쓰기
        </PrimaryButton>
      </div>

      <ElevatedCard className="overflow-hidden">
        {myPosts.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="mb-2 font-display text-body text-smoke">
              아직 작성한 글이 없어요
            </p>
            <PrimaryButton href="/community/write">첫 글 작성하기</PrimaryButton>
          </div>
        ) : (
          myPosts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              category={post.category}
              authorName={user.nickname}
              viewCount={post.view_count}
              createdAt={post.created_at}
            />
          ))
        )}
      </ElevatedCard>

      <div className="mt-6 text-center">
        <Link
          href="/community"
          className="font-display text-body-sm text-fog hover:text-ink"
        >
          커뮤니티로 돌아가기 →
        </Link>
      </div>
    </div>
  );
}
