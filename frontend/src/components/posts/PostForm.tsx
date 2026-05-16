import { useState, type FormEvent } from "react";
import type { Post, PostCreate } from "../../types/api";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";

interface PostFormProps {
  initial?: Post;
  onSubmit: (data: PostCreate) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

export function PostForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel,
}: PostFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [published, setPublished] = useState(initial?.published ?? true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }
    setLoading(true);
    try {
      await onSubmit({ title: title.trim(), content: content.trim(), published });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
      {error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      ) : null}
      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What's on your mind?"
        maxLength={200}
      />
      <Textarea
        label="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your thoughts..."
      />
      <label className="flex cursor-pointer items-center gap-2 text-sm text-surface-700">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="h-4 w-4 rounded border-surface-300 text-brand-600 focus:ring-brand-500"
        />
        Publish immediately
      </label>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={loading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
