import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowBigUp } from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { PostForm } from "../components/posts/PostForm";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";
import type { PostCreate } from "../types/api";

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const [voted, setVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(0);
  const [voting, setVoting] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => api.getPost(postId),
    enabled: Number.isFinite(postId),
  });

  useEffect(() => {
    if (data) setVoteCount(data.votes);
  }, [data]);

  const refresh = () => {
    void queryClient.invalidateQueries({ queryKey: ["post", postId] });
    void queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  const handleVote = async () => {
    if (!data) return;
    setVoting(true);
    try {
      const dir = voted ? 0 : 1;
      await api.vote({ post_id: data.Post.id, dir });
      setVoted(!voted);
      setVoteCount((c) => (voted ? c - 1 : c + 1));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("aldready voted")) setVoted(true);
    } finally {
      setVoting(false);
    }
  };

  const handleUpdate = async (payload: PostCreate) => {
    await api.updatePost(postId, payload);
    setEditOpen(false);
    refresh();
  };

  const handleDelete = async () => {
    if (!confirm("Delete this post?")) return;
    await api.deletePost(postId);
    window.location.href = "/";
  };

  if (!user) return null;

  if (isLoading) {
    return <div className="h-48 animate-pulse rounded-2xl bg-surface-200/60" />;
  }

  if (isError || !data) {
    return (
      <div className="rounded-xl bg-red-50 p-6 text-center">
        <p className="text-red-700">
          {error instanceof Error ? error.message : "Post not found"}
        </p>
        <Link to="/" className="mt-4 inline-block text-brand-600 hover:underline">
          Back to feed
        </Link>
      </div>
    );
  }

  const post = data.Post;
  const isOwner = post.owner_id === user.id;

  return (
    <>
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-surface-600 hover:text-brand-600"
      >
        <ArrowLeft className="h-4 w-4" /> Back to feed
      </Link>

      <article className="rounded-2xl border border-surface-200/80 bg-white p-8 shadow-card">
        <p className="text-sm text-surface-500">{post.owner.email}</p>
        <h1 className="mt-2 text-3xl font-bold text-surface-900">{post.title}</h1>
        <p className="mt-6 whitespace-pre-wrap text-base leading-relaxed text-surface-700">
          {post.content}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-surface-100 pt-6">
          <button
            type="button"
            onClick={() => void handleVote()}
            disabled={voting}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
              voted ? "bg-brand-100 text-brand-700" : "bg-surface-100 text-surface-700"
            }`}
          >
            <ArrowBigUp className={`h-5 w-5 ${voted ? "fill-brand-600" : ""}`} />
            {voteCount} upvotes
          </button>
          {isOwner ? (
            <>
              <Button variant="secondary" onClick={() => setEditOpen(true)}>
                Edit
              </Button>
              <Button variant="danger" onClick={() => void handleDelete()}>
                Delete
              </Button>
            </>
          ) : null}
        </div>
      </article>

      <Modal title="Edit post" isOpen={editOpen} onClose={() => setEditOpen(false)}>
        <PostForm
          initial={post}
          submitLabel="Save"
          onCancel={() => setEditOpen(false)}
          onSubmit={handleUpdate}
        />
      </Modal>
    </>
  );
}
