"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import {
  Calendar,
  MapPin,
  Heart,
  Users,
  DollarSign,
  Search,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react";
import { authFetcher } from "@/lib/api";
import { Event } from "@/lib/types";
import { cn } from "@/lib/utils";

export function EventCard({ event }: { event: Event }) {
  return (
    <Link href={`/events/${event.id}`} className="group block">
      <article className="rounded-xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 h-full flex flex-col">
        {/* Image */}
        <div className="relative h-44 bg-muted overflow-hidden flex-shrink-0">
          {event.imageUrl ? (
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-secondary">
              <Calendar className="h-10 w-10 text-muted-foreground/40" />
            </div>
          )}
          {/* Price badge */}
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 text-xs font-mono font-bold bg-background/90 backdrop-blur-sm text-foreground px-2 py-1 rounded-md border border-border">
              {event.price === 0 ? "FREE" : `$${event.price}`}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col gap-2 flex-1">
          <h3 className="font-semibold text-foreground text-balance leading-snug group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          <div className="mt-auto pt-3 flex flex-col gap-1.5 border-t border-border">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 flex-shrink-0 text-primary/70" />
              <span>{event.date ? new Date(event.date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : "TBA"}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-primary/70" />
              <span className="truncate">{event.location || "Location TBD"}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Heart className="h-3.5 w-3.5 text-primary/70" />
                  {event.nblikes ?? 0}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3.5 w-3.5 text-primary/70" />
                  {event.nbplaces ?? 0} places
                </span>
              </div>
              <span className="text-primary text-xs flex items-center gap-0.5 font-medium group-hover:gap-1.5 transition-all">
                View <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function EventsGrid() {
  const { data: events, error, isLoading } = useSWR<Event[]>("/api/events", authFetcher);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const filtered = (events ?? []).filter((e) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q || e.title.toLowerCase().includes(q) || e.description?.toLowerCase().includes(q);
    const matchLocation =
      !locationFilter || e.location?.toLowerCase().includes(locationFilter.toLowerCase());
    return matchSearch && matchLocation;
  });

  const locations = [...new Set((events ?? []).map((e) => e.location).filter(Boolean))];

  return (
    <div className="flex flex-col gap-6">
      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-secondary pl-9 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="relative">
          <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full sm:w-48 rounded-lg border border-border bg-secondary pl-9 pr-8 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
          >
            <option value="">All locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc!}>{loc}</option>
            ))}
          </select>
        </div>
      </div>

      {/* States */}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border bg-card h-72 animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center text-destructive text-sm">
          Failed to load events. Make sure the backend is running at{" "}
          <span className="font-mono">localhost:8082</span>.
        </div>
      )}

      {!isLoading && !error && filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground text-sm">
          No events found.
        </div>
      )}

      {!isLoading && !error && filtered.length > 0 && (
        <>
          <p className="text-xs text-muted-foreground">
            Showing <span className="text-foreground font-medium">{filtered.length}</span> event{filtered.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
