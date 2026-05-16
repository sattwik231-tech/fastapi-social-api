import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MessageSquareText, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-surface-50 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="hidden gradient-mesh px-12 py-10 lg:flex lg:flex-col lg:justify-between">
        <Link to="/login" className="flex items-center gap-2 font-bold text-surface-900">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="text-xl">Connect</span>
        </Link>

        <div className="max-w-xl">
          <p className="mb-4 inline-flex rounded-lg bg-white px-3 py-1 text-sm font-semibold text-emerald-700 shadow-sm">
            Social workspace
          </p>
          <h1 className="text-5xl font-bold leading-tight tracking-tight text-surface-950">
            Share thoughts, discover posts, and keep the conversation moving.
          </h1>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { icon: MessageSquareText, label: "Create" },
              { icon: TrendingUp, label: "Vote" },
              { icon: ShieldCheck, label: "Protected" },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-white/70 bg-white/80 p-4 shadow-card">
                <item.icon className="h-5 w-5 text-brand-600" />
                <p className="mt-3 text-sm font-semibold text-surface-900">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-surface-500">A focused place for ideas, updates, and community momentum.</p>
      </section>

      <section className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-lg border border-surface-200/80 bg-white p-8 shadow-card">
          <div className="mb-8 lg:hidden">
            <Link to="/login" className="flex items-center gap-2 font-bold text-surface-900">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600 text-white">
                <Sparkles className="h-5 w-5" />
              </span>
              <span className="text-xl">Connect</span>
            </Link>
          </div>
        <h1 className="text-2xl font-bold text-surface-900">Welcome back</h1>
        <p className="mt-1 text-sm text-surface-600">Sign in to see your feed</p>

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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" isLoading={loading}>
            Sign in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-surface-600">
          New here?{" "}
          <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
            Create an account
          </Link>
        </p>
      </div>
      </section>
    </div>
  );
}
