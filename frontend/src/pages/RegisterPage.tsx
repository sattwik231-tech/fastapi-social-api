import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await register(email, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-surface-50 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-lg border border-surface-200/80 bg-white p-8 shadow-card">
          <Link to="/register" className="mb-8 flex items-center gap-2 font-bold text-surface-900">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="text-xl">Connect</span>
          </Link>
        <h1 className="text-2xl font-bold text-surface-900">Join Connect</h1>
        <p className="mt-1 text-sm text-surface-600">Create your account to start posting</p>

        <form onSubmit={(e) => void handleSubmit(e)} className="mt-8 space-y-4">
          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Input
            label="Confirm password"
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" isLoading={loading}>
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-surface-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Sign in
          </Link>
        </p>
      </div>
      </section>

      <section className="hidden gradient-mesh px-12 py-10 lg:flex lg:flex-col lg:justify-center">
        <div className="max-w-xl">
          <p className="mb-4 inline-flex rounded-lg bg-white px-3 py-1 text-sm font-semibold text-emerald-700 shadow-sm">
            Build your social space
          </p>
          <h2 className="text-5xl font-bold leading-tight tracking-tight text-surface-950">
            A clean community experience for posts, reactions, and momentum.
          </h2>
          <div className="mt-8 space-y-3">
            {["Private account", "Personal feed", "Original posts", "Community votes"].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-lg bg-white/80 p-4 shadow-card">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-semibold text-surface-800">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
