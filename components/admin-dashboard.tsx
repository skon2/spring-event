"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Image as ImageIcon,
  BarChart3,
  Heart,
  MessageSquare,
} from "lucide-react";
import { authFetcher, api } from "@/lib/api";
import { Event, FeedBack } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input, TextArea } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const EMPTY_EVENT: Partial<Event> = {
  title: "",
  description: "",
  date: "",
  location: "",
  price: 0,
  nbplaces: 0,
  nblikes: 0,
  imageUrl: "",
};

function EventFormModal({
  initial,
  onClose,
  onSave,
}: {
  initial?: Partial<Event>;
  onClose: () => void;
  onSave: (data: Partial<Event>) => Promise<void>;
}) {
  const [form, setForm] = useState<Partial<Event>>(initial ?? EMPTY_EVENT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (key: keyof Event, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await onSave(form);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">
            {initial?.id ? "Edit Event" : "Create Event"}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <Input
            label="Title"
            placeholder="Event title"
            value={form.title ?? ""}
            onChange={(e) => set("title", e.target.value)}
            required
          />
          <TextArea
            label="Description"
            placeholder="Describe the event..."
            rows={3}
            value={form.description ?? ""}
            onChange={(e) => set("description", e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date"
              type="date"
              value={form.date ?? ""}
              onChange={(e) => set("date", e.target.value)}
            />
            <Input
              label="Location"
              placeholder="City or venue"
              value={form.location ?? ""}
              onChange={(e) => set("location", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price ($)"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={form.price ?? ""}
              onChange={(e) => set("price", parseFloat(e.target.value))}
            />
            <Input
              label="Nb Places"
              type="number"
              min="0"
              placeholder="100"
              value={form.nbplaces ?? ""}
              onChange={(e) => set("nbplaces", parseInt(e.target.value))}
            />
          </div>
          <Input
            label="Image URL"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={form.imageUrl ?? ""}
            onChange={(e) => set("imageUrl", e.target.value)}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {initial?.id ? "Save changes" : "Create event"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EventRow({
  event,
  feedbackCount,
  onEdit,
  onDelete,
}: {
  event: Event;
  feedbackCount: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <tr className="border-b border-border hover:bg-secondary/30 transition-colors group">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
            {event.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={event.imageUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <ImageIcon className="h-4 w-4 text-muted-foreground/40" />
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{event.title}</p>
            <p className="text-xs text-muted-foreground truncate max-w-[180px]">{event.description}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground whitespace-nowrap">
        {event.date ? new Date(event.date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : "—"}
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{event.location || "—"}</td>
      <td className="px-4 py-3 text-sm font-mono text-foreground">
        {event.price === 0 ? "FREE" : `$${event.price}`}
      </td>
      <td className="px-4 py-3 text-sm text-muted-foreground">{event.nbplaces ?? 0}</td>
      <td className="px-4 py-3">
        <span className="flex items-center gap-1 text-sm text-primary">
          <Heart className="h-3.5 w-3.5" />
          {event.nblikes ?? 0}
        </span>
      </td>
      <td className="px-4 py-3">
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <MessageSquare className="h-3.5 w-3.5" />
          {feedbackCount}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            aria-label="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            aria-label="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export function AdminDashboard() {
  const { data: events, mutate } = useSWR<Event[]>("/api/events", authFetcher);
  const { data: feedbacks } = useSWR<FeedBack[]>("/api/feedback", authFetcher);

  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const feedbackCountByEvent = (eventId: number) =>
    (feedbacks ?? []).filter((f) => f.event?.id === eventId || (f as FeedBack & { event: { id: number } }).event?.id === eventId).length;

  const totalLikes = (events ?? []).reduce((s, e) => s + (e.nblikes ?? 0), 0);
  const totalPlaces = (events ?? []).reduce((s, e) => s + (e.nbplaces ?? 0), 0);

  const handleCreate = async (data: Partial<Event>) => {
    const created = await api.createEvent(data);
    mutate([...(events ?? []), created]);
  };

  const handleUpdate = async (data: Partial<Event>) => {
    if (!editingEvent) return;
    const updated = await api.updateEvent(editingEvent.id, data);
    mutate((events ?? []).map((e) => (e.id === updated.id ? updated : e)));
  };

  const handleDelete = async (id: number) => {
    await api.deleteEvent(id);
    mutate((events ?? []).filter((e) => e.id !== id));
    setDeleteConfirm(null);
  };

  const stats = [
    { label: "Total Events", value: events?.length ?? 0, icon: Calendar, color: "text-primary" },
    { label: "Total Likes", value: totalLikes, icon: Heart, color: "text-rose-400" },
    { label: "Total Places", value: totalPlaces, icon: Users, color: "text-sky-400" },
    { label: "Total Reviews", value: feedbacks?.length ?? 0, icon: MessageSquare, color: "text-amber-400" },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                  <p className="text-3xl font-bold font-mono text-foreground mt-1">{stat.value}</p>
                </div>
                <stat.icon className={cn("h-5 w-5 mt-1", stat.color)} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Events table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Events</h2>
          <Button
            onClick={() => { setEditingEvent(null); setModalMode("create"); }}
            size="sm"
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" />
            New event
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  {["Event", "Date", "Location", "Price", "Places", "Likes", "Reviews", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {!events
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i} className="border-b border-border">
                        <td colSpan={8} className="px-4 py-3">
                          <div className="h-8 rounded bg-secondary animate-pulse" />
                        </td>
                      </tr>
                    ))
                  : events.length === 0
                  ? (
                    <tr>
                      <td colSpan={8} className="text-center py-16 text-muted-foreground text-sm">
                        No events yet. Create your first event!
                      </td>
                    </tr>
                  )
                  : events.map((event) => (
                    <EventRow
                      key={event.id}
                      event={event}
                      feedbackCount={feedbackCountByEvent(event.id)}
                      onEdit={() => { setEditingEvent(event); setModalMode("edit"); }}
                      onDelete={() => setDeleteConfirm(event.id)}
                    />
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      {(modalMode === "create" || modalMode === "edit") && (
        <EventFormModal
          initial={modalMode === "edit" ? (editingEvent ?? undefined) : undefined}
          onClose={() => setModalMode(null)}
          onSave={modalMode === "edit" ? handleUpdate : handleCreate}
        />
      )}

      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-2xl">
            <h3 className="text-base font-semibold text-foreground mb-2">Delete event?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              This will permanently delete the event and all its associated feedback. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => handleDelete(deleteConfirm)}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
