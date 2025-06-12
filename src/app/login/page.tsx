"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { School, LockKeyhole } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const router = useRouter();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include', // Important to include cookies
      });

      const data = await response.json();

      if (response.ok) {
        // Update auth context (which updates localStorage)
        login(data.token, data.user);

        toast({
          title: "Success",
          description: "Login successful! Redirecting to your dashboard...",
          variant: "default",
        });

        // Use router.replace instead of push for a cleaner navigation
        setTimeout(() => {
          switch (data.user.role) {
            case 'admin':
              router.replace('/admin');
              break;
            case 'teacher':
              router.replace('/teacher');
              break;
            case 'student':
              router.replace('/student');
              break;
            case 'parent':
              router.replace('/parent');
              break;
            default:
              router.replace('/dashboard');
          }
        }, 1000);
      } else {
        toast({
          title: "Login Failed",
          description: data.message || "Invalid username or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      {/* Container that's mobile-sized on small screens but adapts to larger screens */}
      <div className="w-full max-w-[375px] md:max-w-[450px] lg:max-w-[500px] xl:max-w-[550px] bg-white min-h-[calc(100vh-40px)] md:min-h-0 md:max-h-[800px] rounded-2xl shadow-lg overflow-hidden">
        {/* Status Bar - Only visible on small screens for mobile-like appearance */}
        <div className="status-bar flex justify-between items-center px-5 py-3 bg-white md:hidden">

        </div>

        {/* Header Section with Gradient Background */}
        <div className="header text-center py-10 px-5 pb-16 md:py-12 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white">
          <div className="logo flex items-center justify-center gap-3 mb-10">
            <div className="logo-icon w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <School className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div className="logo-text text-2xl md:text-3xl font-bold">Edu Portal</div>
          </div>
          <h1 className="welcome-title text-3xl md:text-4xl font-bold mb-3">Welcome Back</h1>
          <p className="welcome-subtitle text-base md:text-lg opacity-90 leading-relaxed max-w-md mx-auto">
            Sign in to continue your learning journey
          </p>
        </div>

        {/* Form Section */}
        <div className="form-section px-6 py-10 md:px-10 md:py-12">
          <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
            <div className="form-group mb-6">
              <Label htmlFor="username" className="form-label text-base font-semibold text-gray-700 mb-2 block">
                Username
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="form-input w-full py-4 px-4 border-2 border-gray-200 rounded-xl text-base bg-gray-50 focus:border-[#667eea] focus:bg-white focus:ring-[#667eea]/10 transition-all"
                required
              />
            </div>

            <div className="form-group mb-6">
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="password" className="form-label text-base font-semibold text-gray-700">
                  Password
                </Label>
                <Link href="/forgot-password" className="text-sm font-medium text-[#667eea] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="form-input w-full py-4 px-4 border-2 border-gray-200 rounded-xl text-base bg-gray-50 focus:border-[#667eea] focus:bg-white focus:ring-[#667eea]/10 transition-all"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="login-button w-full py-5 px-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white border-0 rounded-xl text-lg font-semibold cursor-pointer mt-8 transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="divider flex items-center my-8 text-gray-400 text-sm max-w-md mx-auto">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-4">or continue with</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <div className="social-login flex gap-3 mb-8 max-w-md mx-auto">
            <button
              className="social-button flex-1 py-3.5 px-4 border-2 border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-all flex items-center justify-center gap-2 font-medium"
              onClick={() => toast({ title: "Google login", description: "Google login functionality" })}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#EA4335" className="w-5 h-5">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span>Google</span>
            </button>
            <button
              className="social-button flex-1 py-3.5 px-4 border-2 border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-all flex items-center justify-center gap-2 font-medium"
              onClick={() => toast({ title: "Apple login", description: "Apple login functionality" })}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000" className="w-5 h-5">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              <span>Apple</span>
            </button>
          </div>

          <div className="terms text-center text-xs md:text-sm text-gray-500 leading-relaxed max-w-md mx-auto">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="text-[#667eea] hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-[#667eea] hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>

        {/* Bottom indicator - only shown on mobile */}
        <div className="bottom-indicator w-[134px] h-[5px] bg-black rounded-full mx-auto my-5 md:hidden"></div>
      </div>
    </div>
  );
}