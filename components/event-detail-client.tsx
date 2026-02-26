"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useSWR, { mutate } from "swr";
import {
  Calendar,
  MapPin,
  Heart,
  Users,
  ArrowLeft,
  Star,
  Send,
  ThumbsUp,
  ThumbsDown,
  User,
  Trash2,
  Pencil,
} from "lucide-react";
import { authFetcher, api, getRole, getUserEmail } from "@/lib/api";
import { Event, FeedBack } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { TextArea } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function StarRating({
  value,
  onChange,
  readonly,
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center gap-1" aria-label={`Rating: ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={cn(
            "transition-colors",
            readonly ? "cursor-default" : "cursor-pointer hover:scale-110"
          )}
          aria-label={`${star} star`}
        >
          <Star
            className={cn(
              "h-5 w-5",
              (hovered || value) >= star
                ? "fill-primary text-primary"
                : "fill-transparent text-muted-foreground"
            )}
          />
        </button>
      ))}
    </div>
  );
}

function FeedbackCard({
  fb,
  onDelete,
  onEdit,
  canModify,
}: {
  fb: FeedBack;
  onDelete: (id: number) => void;
  onEdit: (fb: FeedBack) => void;
  canModify: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold uppercase flex-shrink-0">
            {fb.user?.firstName?.[0] ?? "?"}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {fb.user ? `${fb.user.firstName} ${fb.user.lastName}` : "Anonymous"}
            </p>
            <p className="text-xs text-muted-foreground">
              {fb.date ? new Date(fb.date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StarRating value={fb.rate} readonly />
          {canModify && (
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={() => onEdit(fb)}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
                aria-label="Edit feedback"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onDelete(fb.id)}
                className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded"
                aria-label="Delete feedback"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{fb.message}</p>
    </div>
  );
}

export function EventDetailClient({ eventId }: { eventId: number }) {
  const { data: event, mutate: mutateEvent } = useSWR<Event>(
    `/api/events/${eventId}`,
    authFetcher
  );
  const { data: feedbacks, mutate: mutateFeedbacks } = useSWR<FeedBack[]>(
    `/api/feedback/event/${eventId}`,
    authFetcher
  );

  const role = getRole();
  const userEmail = getUserEmail();

  // Feedback form state
  const [fbMessage, setFbMessage] = useState("");
  const [fbRate, setFbRate] = useState(5);
  const [fbLoading, setFbLoading] = useState(false);
  const [fbError, setFbError] = useState<string | null>(null);

  // Edit state
  const [editingFb, setEditingFb] = useState<FeedBack | null>(null);
  const [editMessage, setEditMessage] = useState("");
  const [editRate, setEditRate] = useState(5);
  const [editLoading, setEditLoading] = useState(false);

  const handleLike = async () => {
    try {
      const updated = await api.likeEvent(eventId);
      mutateEvent(updated, false);
    } catch {/* silently handle */}
  };

  const handleDislike = async () => {
    try {
      const updated = await api.dislikeEvent(eventId);
      mutateEvent(updated, false);
    } catch {/* silently handle */}
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbMessage.trim()) return;
    setFbLoading(true);
    setFbError(null);
    try {
      await api.addFeedback(eventId, { message: fbMessage, rate: fbRate });
      setFbMessage("");
      setFbRate(5);
      mutateFeedbacks();
    } catch (err: unknown) {
      setFbError(err instanceof Error ? err.message : "Failed to submit feedback");
    } finally {
      setFbLoading(false);
    }
  };

  const handleDeleteFeedback = async (id: number) => {
    try {
      await api.deleteFeedback(id);
      mutateFeedbacks();
    } catch {/* silently handle */}
  };

  const handleStartEdit = (fb: FeedBack) => {
    setEditingFb(fb);
    setEditMessage(fb.message);
    setEditRate(fb.rate);
  };

  const handleSaveEdit = async () => {
    if (!editingFb) return;
    setEditLoading(true);
    try {
      await api.updateFeedback(editingFb.id, { message: editMessage, rate: editRate });
      setEditingFb(null);
      mutateFeedbacks();
    } catch {/* silently handle */} finally {
      setEditLoading(false);
    }
  };

  const canModifyFeedback = (fb: FeedBack) => {
    if (role === "ADMIN") return true;
    return fb.user?.email === userEmail;
  };

  const avgRating =
    feedbacks && feedbacks.length > 0
      ? feedbacks.reduce((sum, f) => sum + f.rate, 0) / feedbacks.length
      : 0;

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="inline-block h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Back */}
      <Link
        href="/events"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to events
      </Link>

      {/* Hero image */}
      {event.imageUrl && (
        <div className="relative h-64 sm:h-80 rounded-xl overflow-hidden mb-8 border border-border">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Title + meta */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground text-balance">{event.title}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-3">
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 text-primary/80" />
              {event.date ? new Date(event.date).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "long", year: "numeric" }) : "TBA"}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary/80" />
              {event.location || "TBD"}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Users className="h-4 w-4 text-primary/80" />
              {event.nbplaces ?? 0} places
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-2xl font-bold font-mono text-foreground">
            {event.price === 0 ? "FREE" : `$${event.price}`}
          </span>
        </div>
      </div>

      {/* Description */}
      {event.description && (
        <p className="text-muted-foreground leading-relaxed mb-8 text-sm">{event.description}</p>
      )}

      {/* Like/Dislike (CLIENT only) */}
      {role === "CLIENT" && (
        <div className="flex items-center gap-3 mb-8 p-4 rounded-xl border border-border bg-card">
          <p className="text-sm text-muted-foreground mr-2">Rate this event:</p>
          <button
            onClick={handleLike}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/10"
          >
            <ThumbsUp className="h-4 w-4" />
            <span className="font-medium">{event.nblikes ?? 0}</span>
          </button>
          <button
            onClick={handleDislike}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors px-3 py-1.5 rounded-lg hover:bg-destructive/10"
          >
            <ThumbsDown className="h-4 w-4" />
            Dislike
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Feedback list */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Reviews
              {feedbacks && feedbacks.length > 0 && (
                <span className="ml-2 text-sm text-muted-foreground font-normal">
                  ({feedbacks.length})
                </span>
              )}
            </h2>
            {avgRating > 0 && (
              <div className="flex items-center gap-1.5">
                <StarRating value={Math.round(avgRating)} readonly />
                <span className="text-sm font-mono text-foreground">{avgRating.toFixed(1)}</span>
              </div>
            )}
          </div>

          {/* Edit dialog */}
          {editingFb && (
            <div className="rounded-xl border border-primary/30 bg-card p-4 flex flex-col gap-3">
              <p className="text-sm font-medium text-foreground">Edit your review</p>
              <StarRating value={editRate} onChange={setEditRate} />
              <TextArea
                value={editMessage}
                onChange={(e) => setEditMessage(e.target.value)}
                rows={3}
                placeholder="Update your review..."
              />
              <div className="flex gap-2">
                <Button size="sm" loading={editLoading} onClick={handleSaveEdit}>
                  Save
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditingFb(null)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {!feedbacks ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-xl border border-border bg-card h-24 animate-pulse" />
              ))}
            </div>
          ) : feedbacks.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No reviews yet. Be the first!
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {feedbacks.map((fb) => (
                <FeedbackCard
                  key={fb.id}
                  fb={fb}
                  onDelete={handleDeleteFeedback}
                  onEdit={handleStartEdit}
                  canModify={canModifyFeedback(fb)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Leave feedback form */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-5 sticky top-20">
            <h3 className="text-sm font-semibold text-foreground mb-4">Leave a review</h3>

            {role ? (
              <form onSubmit={handleSubmitFeedback} className="flex flex-col gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Rating</p>
                  <StarRating value={fbRate} onChange={setFbRate} />
                </div>
                <TextArea
                  label="Message"
                  placeholder="Share your thoughts about this event..."
                  rows={4}
                  value={fbMessage}
                  onChange={(e) => setFbMessage(e.target.value)}
                  required
                />
                {fbError && <p className="text-xs text-destructive">{fbError}</p>}
                <Button type="submit" loading={fbLoading} className="w-full gap-2">
                  <Send className="h-4 w-4" />
                  Submit review
                </Button>
              </form>
            ) : (
              <div className="text-center py-4">
                <User className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground mb-4">
                  You must be logged in to leave a review.
                </p>
                <Link href="/login">
                  <Button className="w-full">Sign in</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
