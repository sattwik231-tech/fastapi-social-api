import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowBigUp,
  Calendar,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Share2,
  Trash2,
} from "lucide-react";
import type { Post } from "../../types/api";
interface PostCardProps {
  post: Post;
  votes: number;
  currentUserId: number;
  hasVoted?: boolean;
  onVote: (postId: number, dir: 0 | 1) => Promise<void>;
  onEdit: (post: Post) => void;
  onDelete: (postId: number) => Promise<void>;
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

function avatarLetter(email: string) {
  return email.charAt(0).toUpperCase();
}

export function PostCard({
  post,
  votes,
  currentUserId,
  hasVoted = false,
  onVote,
  onEdit,
  onDelete,
}: PostCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [voteCount, setVoteCount] = useState(votes);
  const [voted, setVoted] = useState(hasVoted);
  const [voting, setVoting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isOwner = post.owner_id === currentUserId;

  useEffect(() => {
    setVoteCount(votes);
  }, [votes]);

  const toggleVote = async () => {
    setVoting(true);
    try {
      const dir = voted ? 0 : 1;
      await onVote(post.id, dir);
      setVoted(!voted);
      setVoteCount((c) => (voted ? c - 1 : c + 1));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("aldready voted") || msg.includes("already voted")) {
        setVoted(true);
      }
    } finally {
      setVoting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this post permanently?")) return;
    setDeleting(true);
    try {
      await onDelete(post.id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <article className="rounded-lg border border-surface-200/80 bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-sm font-bold text-brand-700">
          {avatarLetter(post.owner.email)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-surface-900">
                {post.owner.email.split("@")[0]}
              </p>
              <p className="flex items-center gap-1 text-xs text-surface-500">
                <Calendar className="h-3 w-3" />
                {formatDate(post.created_at)}
              </p>
            </div>
            {isOwner ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((o) => !o)}
                  className="rounded-lg p-1.5 text-surface-500 hover:bg-surface-100"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>
                {menuOpen ? (
                  <>
                    <button
                      type="button"
                      className="fixed inset-0 z-10"
                      aria-label="Close menu"
                      onClick={() => setMenuOpen(false)}
                    />
                    <div className="absolute right-0 z-20 mt-1 w-36 rounded-lg border border-surface-200 bg-white py-1 shadow-lg">
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-surface-50"
                        onClick={() => {
                          setMenuOpen(false);
                          onEdit(post);
                        }}
                      >
                        <Pencil className="h-4 w-4" /> Edit
                      </button>
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        onClick={() => {
                          setMenuOpen(false);
                          void handleDelete();
                        }}
                        disabled={deleting}
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </button>
                    </div>
                  </>
                ) : null}
              </div>
            ) : null}
          </div>

          <Link to={`/posts/${post.id}`} className="mt-3 block group">
            <h3 className="text-lg font-semibold text-surface-900 group-hover:text-brand-600">
              {post.title}
            </h3>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-surface-700 line-clamp-4">
              {post.content}
            </p>
          </Link>

          {!post.published ? (
            <span className="mt-2 inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
              Draft
            </span>
          ) : null}

          <div className="mt-4 flex items-center gap-2 border-t border-surface-100 pt-4">
            <button
              type="button"
              onClick={() => void toggleVote()}
              disabled={voting}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                voted
                  ? "bg-brand-100 text-brand-700"
                  : "text-surface-600 hover:bg-surface-100"
              }`}
            >
              <ArrowBigUp
                className={`h-5 w-5 ${voted ? "fill-brand-600 text-brand-600" : ""}`}
              />
              {voteCount}
            </button>
            <Link
              to={`/posts/${post.id}`}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-surface-600 transition hover:bg-surface-100"
            >
              <MessageCircle className="h-4 w-4" />
              Open
            </Link>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-surface-600 transition hover:bg-surface-100"
              onClick={() => void navigator.clipboard?.writeText(`${window.location.origin}/posts/${post.id}`)}
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
