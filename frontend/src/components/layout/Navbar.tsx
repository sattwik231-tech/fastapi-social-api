import { Link, useNavigate } from "react-router-dom";
import { Bell, Home, LogOut, PenSquare, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";

interface NavbarProps {
  onCreatePost?: () => void;
}

export function Navbar({ onCreatePost }: NavbarProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-surface-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex min-w-fit items-center gap-2 font-bold text-surface-900">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white shadow-sm">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="text-lg tracking-tight">Connect</span>
        </Link>

        {isAuthenticated && user ? (
          <>
            <nav className="hidden flex-1 items-center justify-center md:flex">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-lg bg-surface-100 px-4 py-2 text-sm font-semibold text-surface-900"
              >
                <Home className="h-4 w-4" />
                Feed
              </Link>
            </nav>
            <div className="flex items-center gap-2 sm:gap-3">
              {onCreatePost ? (
                <Button variant="primary" onClick={onCreatePost} className="!rounded-lg !py-2">
                  <PenSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">New post</span>
                </Button>
              ) : null}
              <button
                type="button"
                className="hidden h-10 w-10 items-center justify-center rounded-lg text-surface-600 hover:bg-surface-100 sm:inline-flex"
                title="Notifications"
              >
                <Bell className="h-4 w-4" />
              </button>
              <div className="hidden items-center gap-2 border-l border-surface-200 pl-3 lg:flex">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100 text-sm font-bold text-emerald-700">
                  {user.email.charAt(0).toUpperCase()}
                </span>
                <span className="max-w-[160px] truncate text-sm font-medium text-surface-700">
                  {user.email}
                </span>
              </div>
              <Button variant="ghost" onClick={handleLogout} title="Log out" className="!rounded-lg">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : null}
      </div>
    </header>
  );
}
