import { AuthForm } from "@/components/forms/auth-form";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center">Register</h1>
        <AuthForm type="register" />
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-blue-500 hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
