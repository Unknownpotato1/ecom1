import { redirect } from "next/navigation";

// Google-only sign-in — password reset doesn't apply. Redirect to /login.
export default function ForgotPasswordPage() {
  redirect("/login");
}
