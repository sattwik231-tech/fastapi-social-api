import { useCallback, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  Flame,
  Search,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { PostCard } from "../components/posts/PostCard";
import { PostForm } from "../components/posts/PostForm";
import { Modal } from "../components/ui/Modal";
import { Button } from "../components/ui/Button";
import type { Post, PostCreate } from "../types/api";

const PAGE_SIZE = 10;

interface FeedPageProps {
  createOpen: boolean;
  onCreateOpenChange: (open: boolean) => void;
}

export function FeedPage({ createOpen, onCreateOpenChange }: FeedPageProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [skip, setSkip] = useState(0);
  const [editPost, setEditPost] = useState<Post | null>(null);

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["posts", search, skip],
    queryFn: () => api.getPosts({ limit: PAGE_SIZE, skip, search }),
  });

  const refresh = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: ["posts"] });
  }, [queryClient]);

  const handleVote = async (postId: number, dir: 0 | 1) => {
    await api.vote({ post_id: postId, dir });
    refresh();
  };

  const handleDelete = async (postId: number) => {
    await api.deletePost(postId);
    refresh();
  };

  const handleCreate = async (payload: PostCreate) => {
    await api.createPost(payload);
    onCreateOpenChange(false);
    setSkip(0);
    refresh();
  };

  const handleUpdate = async (payload: PostCreate) => {
    if (!editPost) return;
    await api.updatePost(editPost.id, payload);
    setEditPost(null);
    refresh();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setSkip(0);
  };

  if (!user) return null;

  const totalVotes = data?.reduce((sum, item) => sum + item.votes, 0) ?? 0;
  const visibleAuthors = new Set(data?.map((item) => item.Post.owner_id)).size;
  const topics = ["ideas", "launch", "learning", "community"];

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)_300px]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <section className="rounded-lg border border-surface-200 bg-white p-4 shadow-card">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 text-lg font-bold text-emerald-700">
                  {user.email.charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-surface-900">
                    {user.email.split("@")[0]}
                  </p>
                  <p className="truncate text-xs text-surface-500">{user.email}</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                <div className="rounded-lg bg-surface-50 p-3">
                  <p className="text-lg font-bold text-surface-900">{data?.length ?? 0}</p>
                  <p className="text-xs text-surface-500">Posts</p>
                </div>
                <div className="rounded-lg bg-surface-50 p-3">
                  <p className="text-lg font-bold text-surface-900">{totalVotes}</p>
                  <p className="text-xs text-surface-500">Votes</p>
                </div>
              </div>
            </section>

            <section className="rounded-lg border border-surface-200 bg-white p-4 shadow-card">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-surface-900">
                <Activity className="h-4 w-4 text-brand-600" />
                Feed Pulse
              </h2>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-surface-500">Active authors</span>
                  <span className="font-semibold text-surface-900">{visibleAuthors}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-surface-500">Page</span>
                  <span className="font-semibold text-surface-900">{skip / PAGE_SIZE + 1}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-surface-500">Status</span>
                  <span className="font-semibold text-emerald-700">Live</span>
                </div>
              </div>
            </section>
          </div>
        </aside>

        <section className="min-w-0">
          <div className="mb-5 overflow-hidden rounded-lg border border-surface-200 bg-white shadow-card">
            <div className="border-b border-surface-100 bg-surface-50 px-5 py-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-surface-900">Your feed</h1>
                  <p className="text-sm text-surface-600">Fresh posts from your community</p>
                </div>
                <Button onClick={() => onCreateOpenChange(true)} className="shrink-0">
                  New post
                </Button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onCreateOpenChange(true)}
              className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-surface-50"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-sm font-bold text-brand-700">
                {user.email.charAt(0).toUpperCase()}
              </span>
              <span className="flex-1 rounded-lg border border-surface-200 bg-surface-50 px-4 py-2.5 text-sm text-surface-500">
                Start a conversation
              </span>
            </button>
          </div>

          <form onSubmit={handleSearch} className="mb-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
              <input
                type="search"
                placeholder="Search posts by title..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full rounded-lg border border-surface-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </form>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-44 animate-pulse rounded-lg bg-surface-200/60" />
              ))}
            </div>
          ) : isError ? (
            <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
              {error instanceof Error ? error.message : "Failed to load posts"}
            </p>
          ) : data && data.length > 0 ? (
            <div className="space-y-4">
              {data.map((item) => (
                <PostCard
                  key={item.Post.id}
                  post={item.Post}
                  votes={item.votes}
                  currentUserId={user.id}
                  onVote={handleVote}
                  onEdit={setEditPost}
                  onDelete={handleDelete}
                />
              ))}
              <div className="flex justify-center gap-2 pt-4">
                <Button
                  variant="secondary"
                  disabled={skip === 0 || isFetching}
                  onClick={() => setSkip((s) => Math.max(0, s - PAGE_SIZE))}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  disabled={data.length < PAGE_SIZE || isFetching}
                  onClick={() => setSkip((s) => s + PAGE_SIZE)}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-surface-300 bg-white/80 p-12 text-center">
              <p className="text-surface-600">No posts yet. Be the first to share something.</p>
              <Button className="mt-4" onClick={() => onCreateOpenChange(true)}>
                Create a post
              </Button>
            </div>
          )}
        </section>

        <aside className="hidden xl:block">
          <div className="sticky top-24 space-y-4">
            <section className="rounded-lg border border-surface-200 bg-white p-4 shadow-card">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-surface-900">
                <TrendingUp className="h-4 w-4 text-amber-600" />
                Trending Topics
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => {
                      setSearchInput(topic);
                      setSearch(topic);
                      setSkip(0);
                    }}
                    className="rounded-lg border border-surface-200 px-3 py-1.5 text-sm font-medium text-surface-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
                  >
                    #{topic}
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-surface-200 bg-white p-4 shadow-card">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-surface-900">
                <Flame className="h-4 w-4 text-red-500" />
                Network
              </h2>
              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-3 rounded-lg bg-surface-50 p-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="text-sm font-semibold text-surface-900">Session</p>
                    <p className="text-xs text-surface-500">Active</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-surface-50 p-3">
                  <Users className="h-5 w-5 text-brand-600" />
                  <div>
                    <p className="text-sm font-semibold text-surface-900">Authors</p>
                    <p className="text-xs text-surface-500">{visibleAuthors} visible</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </aside>
      </div>

      <Modal title="Create post" isOpen={createOpen} onClose={() => onCreateOpenChange(false)}>
        <PostForm
          submitLabel="Publish"
          onCancel={() => onCreateOpenChange(false)}
          onSubmit={handleCreate}
        />
      </Modal>

      <Modal
        title="Edit post"
        isOpen={!!editPost}
        onClose={() => setEditPost(null)}
      >
        {editPost ? (
          <PostForm
            initial={editPost}
            submitLabel="Save changes"
            onCancel={() => setEditPost(null)}
            onSubmit={handleUpdate}
          />
        ) : null}
      </Modal>
    </>
  );
}
