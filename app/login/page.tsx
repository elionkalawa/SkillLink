import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <AuthForm type="login" />
      </div>
    </div>
  );
}
