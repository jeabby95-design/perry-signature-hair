import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { toast } from "sonner";
import { useAuth } from "../../firebase/auth-context";
import type { UserRole } from "../../types/domain";

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<UserRole>(
    (searchParams.get("role") as UserRole) || "client",
  );
  const [submitting, setSubmitting] = useState(false);

  const redirectPath = searchParams.get("redirect") || `/${role}`;

  const title = useMemo(
    () => (mode === "login" ? "Sign In" : "Create Account"),
    [mode],
  );

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);

    try {
      if (mode === "login") {
        await login(email, password);
        toast.success("Welcome back!");
      } else {
        if (!fullName.trim()) {
          throw new Error("Full name is required.");
        }
        await signup(fullName.trim(), email, password, role);
        toast.success("Account created successfully.");
      }

      navigate(redirectPath, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to continue.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-600 mt-1">
            Use your email/password to access your dashboard.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              minLength={6}
              required
            />
          </div>

          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="role">Account Role</Label>
              <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
            disabled={submitting}
          >
            {submitting ? "Please wait..." : title}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            className="text-sm text-amber-700 hover:text-amber-800"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
          >
            {mode === "login"
              ? "Need an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </Card>
    </div>
  );
}
