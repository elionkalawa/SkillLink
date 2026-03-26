"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "./Input";
import { Button } from "./Button";
import { OAuthButton } from "./OAuthButton";

interface AuthFormProps {
  type: "login" | "register";
}

export const AuthForm = ({ type }: AuthFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (type === "register") {
        // Handle registration flow by hitting our custom API route first
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Registration failed");
        }
        
        // After successful registration, sign in
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) throw new Error("Could not log you in after registration");
        
        router.push("/dashboard");
      } else {
        // Login flow
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (result?.error) throw new Error("Invalid credentials");
        
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {type === "login" ? "Welcome back" : "Create an account"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {type === "login" ? "Enter your details to sign in to your account" : "Enter your details to get started with SkillLink"}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-800">
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === "register" && (
            <div className="space-y-4">
              <Input
                label="Full Name"
                type="text"
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="Username"
                type="text"
                placeholder="e.g. johndoe"
                value={formData.username || ""}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>
          )}
          
          <Input
            label="Email address"
            type="email"
            placeholder="e.g. m@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            minLength={8}
          />

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>
            </div>
          )}

          <Button type="submit" isLoading={isLoading} className="mt-2">
            {type === "login" ? "Sign In" : "Sign Up"}
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-center space-x-4">
          <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Or</p>
          <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
        </div>

        <div className="mt-6">
          <OAuthButton provider="google" />
        </div>
        
        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          {type === "login" ? "Don't have an account? " : "Already have an account? "}
          <Link
            href={type === "login" ? "/register" : "/login"}
            className="font-semibold text-blue-600 hover:text-blue-500 hover:underline dark:text-blue-400"
          >
            {type === "login" ? "Sign up" : "Sign in"}
          </Link>
        </p>
      </div>
    </div>
  );
};
