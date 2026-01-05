"use client";

import { useState } from "react";
import { signIn } from "next-auth/react"; // Helper for client-side login
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError("");

    try {
      // 1. Call NextAuth's signIn method
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false, // We handle redirection manually to avoid full page reloads
      });

      if (result?.error) {
        setError("Invalid credentials.");
        setIsPending(false);
      } else {
        // 2. Success! Redirect to dashboard
        router.refresh(); // Update the session in the client
        router.push("/");
      }
    } catch (err) {
      setError("Something went wrong.");
      setIsPending(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">HRMS Login</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 disabled:opacity-50 transition"
          >
            {isPending ? "Logging in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}