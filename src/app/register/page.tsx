import { redirect } from "next/navigation";

// Google-only sign-in — registration happens automatically when a user
// signs in with Google for the first time. Redirect to /login.
export default function RegisterPage() {
  redirect("/login");
}
