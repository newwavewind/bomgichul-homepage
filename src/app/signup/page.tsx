import type { Metadata } from "next";
import { GoogleAuthCard } from "@/components/auth/GoogleAuthCard";
import { SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "회원가입",
  description: `${SITE_NAME}에 Google 계정으로 무료 회원가입하세요.`,
};

export default function SignupPage() {
  return <GoogleAuthCard mode="signup" />;
}
