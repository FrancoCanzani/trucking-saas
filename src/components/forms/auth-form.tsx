"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

type AuthFormProps = {
  type: "login" | "register";
};

export function AuthForm({ type }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"dispatcher" | "driver">("driver");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        data: type === "register" ? { name, role } : undefined,
      },
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Check your email for the magic link!");
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams:
          type === "register"
            ? {
                access_type: "offline",
                prompt: "consent",
              }
            : undefined,
      },
    });

    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {type === "register" && (
          <>
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                value={role}
                onChange={(e) =>
                  setRole(e.target.value as "dispatcher" | "driver")
                }
                className="w-full p-2 border rounded"
                required
              >
                <option value="driver">Driver</option>
                <option value="dispatcher">Dispatcher</option>
              </select>
            </div>
          </>
        )}
        <Button type="submit" className="w-full">
          {type === "login" ? "Send Magic Link" : "Register with Email"}
        </Button>
      </form>

      <div className="text-center">
        <span className="text-gray-500">or</span>
      </div>

      <Button onClick={handleGoogleSignIn} className="w-full" variant="outline">
        {type === "login" ? "Sign in" : "Register"} with Google
      </Button>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
