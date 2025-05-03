import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import router from "next/router";
import React from "react";
import { toast } from "sonner";

export default function VerifyEmailPage({
  params,
}: {
  params: Promise<{ email: string }>;
}) {
  const unwrapped = React.use(params);
  const { email } = unwrapped;
  const [code, setCode] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const response = await fetch("/api/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });
    if (response.ok) {
      toast.success("Email verified successfully!");
      router.push("/login");
    } else {
      const error = await response.json();
      toast.error(error.error || "Email verification failed");
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8 rounded-lg border">
        <h1 className="text-2xl font-bold text-center">Email Verification</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Verify Email"}
          </Button>
        </form>
      </div>
    </div>
  );
}
