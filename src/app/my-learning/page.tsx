"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useApp } from "@/context/AppContext";
import { getSupabaseClient } from "@/lib/supabase";
import { getBookingsByStudent } from "@/lib/db";
import type { BookingStatus, TierType } from "@/lib/database.types";
import { ShieldCheck, GraduationCap, CheckCircle2, Compass, PlusCircle, Monitor, Users, Wallet, History, Loader2, BookOpen, CalendarDays, Unlock, Clock, PlayCircle, Scale, MapPin, ArrowRight } from "lucide-react";

type Tab = "lessons" | "upcoming" | "past";

// Shape returned by getBookingsByStudent (joined with lessons)
interface SbBooking {
  id: string;
  lesson_id: string;
  tier_type: TierType;
  price_rwf: number;
  status: BookingStatus;
  scheduled_at: string | null;
  scheduled_time: string | null;
  location: string | null;
  created_at: string;
  lessons: { title: string; course_code: string; faculty: string } | null;
}

function formatDate(iso: string) {
  if (!iso || iso === "TBD") return iso;
  try { return new Date(iso).toLocaleDateString("en-RW", { weekday: "short", day: "2-digit", month: "short", year: "numeric" }); }
  catch { return iso; }
}

export default function MyLearningPage() {
  const { lessons, purchases, bookings, currentUser, markBookingCompleted, supabaseUserId } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>("lessons");

  // Supabase-backed bookings
  const [sbBookings, setSbBookings] = useState<SbBooking[] | null>(null);
  const [sbLoading, setSbLoading]   = useState(false);

  useEffect(() => {
    if (!supabaseUserId) return;
    setSbLoading(true);
    const sb = getSupabaseClient();
    getBookingsByStudent(sb, supabaseUserId)
      .then((data) => setSbBookings(data as SbBooking[]))
      .catch((err) => console.error("Supabase bookings fetch:", err))
      .finally(() => setSbLoading(false));
  }, [supabaseUserId]);

  const handleMarkCompleted = async (bookingId: string) => {
    // Update Supabase
    if (supabaseUserId) {
      try {
        const sb = getSupabaseClient();
        const { updateBookingStatus } = await import("@/lib/db");
        await updateBookingStatus(sb, bookingId, "completed");
        setSbBookings((prev) => prev ? prev.map((b) => b.id === bookingId ? { ...b, status: "completed" as BookingStatus } : b) : prev);
      } catch (err) { console.error("Supabase updateBookingStatus:", err); }
    }
    // Always update local context
    markBookingCompleted(bookingId);
  };

  // Derive display data — prefer Supabase, fall back to context
  const unlockedLessons = purchases
    .filter((p) => p.tier === "recorded" && p.userId === currentUser.id)
    .map((p) => ({ purchase: p, lesson: lessons.find((l) => l.id === p.lessonId) }))
    .filter((x) => x.lesson !== undefined);

  const upcomingBookings = sbBookings
    ? sbBookings.filter((b) => b.status === "upcoming")
    : bookings.filter((b) => b.userId === currentUser.id && b.status === "upcoming");

  const pastBookings = sbBookings
    ? sbBookings.filter((b) => b.status === "completed")
    : bookings.filter((b) => b.userId === currentUser.id && b.status === "completed");

  const totalSpent = purchases.filter((p) => p.userId === currentUser.id).reduce((s, p) => s + p.pricePaid, 0);

  const tabs: { id: Tab; label: string; iconNode: React.ReactNode; count: number }[] = [
    { id: "lessons",  label: "Unlocked Lessons",         iconNode: <BookOpen size={20} />,    count: unlockedLessons.length },
    { id: "upcoming", label: "Upcoming Sessions",         iconNode: <CalendarDays size={20} />, count: upcomingBookings.length },
    { id: "past",     label: "Past Sessions",             iconNode: <History size={20} />,      count: pastBookings.length },
  ];

  return (
    <>
      <Header />
      <main style={{ width: "100%", paddingTop: "5rem", minHeight: "100vh", backgroundColor: "var(--color-surface)" }}>

        {/* ── Hero band ─────────────────────────────────────────────────── */}
        <div style={{ background: "linear-gradient(to bottom, rgba(222,232,255,0.4), var(--color-surface) 60%)" }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem 2rem 1.5rem" }}>

            {/* Student identity */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ position: "relative" }}>
                  <div style={{ width: "4rem", height: "4rem", borderRadius: "1rem", backgroundColor: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-on-primary)", fontFamily: "var(--font-headline)", fontSize: "1.25rem", fontWeight: 700, boxShadow: "0 4px 12px rgba(53,37,205,0.2)" }}>
                    {currentUser.initials}
                  </div>
                  <div style={{ position: "absolute", bottom: "-0.25rem", right: "-0.25rem", width: "1.25rem", height: "1.25rem", borderRadius: "9999px", backgroundColor: "var(--color-secondary)", border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CheckCircle2 size={10} color="var(--color-on-secondary)" />
                  </div>
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                    <h1 style={{ fontFamily: "var(--font-headline)", fontSize: "clamp(1.25rem, 3vw, 1.75rem)", fontWeight: 600, color: "var(--color-on-surface)", margin: 0, letterSpacing: "-0.01em" }}>{currentUser.name}</h1>
                    <span style={{ padding: "0.125rem 0.625rem", borderRadius: "9999px", backgroundColor: "var(--color-primary-fixed)", color: "var(--color-on-primary-fixed-variant)", fontFamily: "var(--font-label)", fontSize: "0.6875rem", fontWeight: 700 }}>AUCA Active Learner</span>
                    <span style={{ padding: "0.125rem 0.625rem", borderRadius: "9999px", backgroundColor: "var(--color-secondary-container)", color: "var(--color-on-secondary-container)", fontFamily: "var(--font-label)", fontSize: "0.6875rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <ShieldCheck size={11} />
                      AUCA Escrow Protected
                    </span>
                  </div>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-on-surface-variant)", margin: "0.25rem 0 0", display: "flex", alignItems: "center", gap: "0.375rem" }}>
                    <GraduationCap size={18} color="var(--color-outline)" />
                    AUCA • {currentUser.campus === "masoro" ? "Masoro Campus" : "Gishushu Campus"}
                    <span style={{ color: "var(--color-outline)" }}>•</span>
                    <span style={{ color: "var(--color-primary)", fontFamily: "var(--font-label)", fontSize: "0.75rem", fontWeight: 600 }}>{currentUser.email}</span>
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", borderRadius: "0.5rem", backgroundColor: "var(--color-surface-container-lowest)", color: "var(--color-on-surface)", fontFamily: "var(--font-label)", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
                  <Compass size={19} color="var(--color-primary)" />
                  Explore More
                </Link>
                <Link href="/lesson/comp201" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", borderRadius: "0.5rem", backgroundColor: "var(--color-primary)", color: "var(--color-on-primary)", fontFamily: "var(--font-label)", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none", boxShadow: "0 2px 8px rgba(53,37,205,0.25)" }}>
                  <PlusCircle size={19} />
                  Book New Tutor
                </Link>
              </div>
            </div>

            {/* Metrics bento */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
              {[
                { label: "Unlocked Lessons", value: `${unlockedLessons.length}`, sub: "Lifetime access", iconNode: <Monitor size={24} color="var(--color-primary)" />, iconBg: "var(--color-primary-fixed)" },
                { label: "Upcoming Sessions", value: `${upcomingBookings.length}`, sub: "Escrow protected", iconNode: <Users size={24} color="var(--color-secondary)" />, iconBg: "var(--color-secondary-container)" },
                { label: "Total Spent", value: `${totalSpent.toLocaleString()} RWF`, sub: "Escrow vault", iconNode: <Wallet size={24} color="var(--color-primary)" />, iconBg: "var(--color-primary-fixed)" },
                { label: "Past Sessions", value: `${pastBookings.length}`, sub: "Completed", iconNode: <History size={24} color="var(--color-primary)" />, iconBg: "var(--color-surface-container-highest)" },
              ].map((m) => (
                <div key={m.label} style={{ backgroundColor: "var(--color-surface-container-lowest)", padding: "1rem", borderRadius: "1rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ fontFamily: "var(--font-label)", fontSize: "0.65rem", fontWeight: 700, color: "var(--color-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 0.25rem" }}>{m.label}</p>
                    <p style={{ fontFamily: "var(--font-headline)", fontSize: "1.375rem", fontWeight: 700, color: "var(--color-on-surface)", margin: "0 0 0.25rem" }}>{m.value}</p>
                    <p style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--color-on-surface-variant)", margin: 0 }}>{m.sub}</p>
                  </div>
                  <div style={{ width: "2.75rem", height: "2.75rem", borderRadius: "0.75rem", backgroundColor: m.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {m.iconNode}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs ──────────────────────────────────────────────────────── */}
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 2rem 4rem" }}>

          {/* Loading indicator when fetching from Supabase */}
          {sbLoading && (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--color-on-surface-variant)", fontFamily: "var(--font-body)", fontSize: "0.875rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
              <Loader2 size={20} />
              Loading your sessions from Supabase…
            </div>
          )}

          {/* Tab bar */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", backgroundColor: "var(--color-surface-container-lowest)", padding: "0.5rem", borderRadius: "1rem", boxShadow: "0 1px 4px rgba(0,0,0,0.04)", marginBottom: "1.75rem", overflowX: "auto" }}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.25rem", borderRadius: "0.75rem", border: "none", cursor: "pointer", backgroundColor: isActive ? "var(--color-primary)" : "transparent", color: isActive ? "var(--color-on-primary)" : "var(--color-on-surface-variant)", fontFamily: "var(--font-label)", fontSize: "0.875rem", fontWeight: 600, whiteSpace: "nowrap", transition: "all 0.15s" }}
                  onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--color-surface-container)"; }}
                  onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
                >
                  {tab.iconNode}
                  {tab.label}
                  <span style={{ padding: "0.125rem 0.5rem", borderRadius: "9999px", backgroundColor: isActive ? "rgba(255,255,255,0.25)" : "var(--color-surface-container)", color: isActive ? "white" : "var(--color-on-surface-variant)", fontSize: "0.75rem", fontWeight: 700 }}>{tab.count}</span>
                </button>
              );
            })}
          </div>

          {/* ── TAB: Unlocked Lessons ──────────────────────────────────── */}
          {activeTab === "lessons" && (
            <>
              {unlockedLessons.length === 0 ? (
                <EmptyState icon={<PlayCircle size={48} color="var(--color-outline)" />} title="No lessons yet" sub="Browse the explore feed and unlock your first 1,000 RWF micro-lesson." cta="Explore Lessons →" href="/" />
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
                  {unlockedLessons.map(({ purchase, lesson }) => (
                    <div key={purchase.id} style={{ backgroundColor: "var(--color-surface-container-lowest)", borderRadius: "1rem", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                      {/* Thumbnail */}
                      <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", backgroundColor: "var(--color-surface-container-highest)", overflow: "hidden" }}>
                        {lesson!.thumbnail && lesson!.thumbnail !== "/placeholder.svg" ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={lesson!.thumbnail} alt={lesson!.thumbnailAlt} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <PlayCircle size={48} color="var(--color-outline)" />
                          </div>
                        )}
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(17,28,45,0.7) 0%, transparent 50%)" }} />
                        <div style={{ position: "absolute", top: "0.75rem", left: "0.75rem" }}>
                          <span style={{ padding: "0.25rem 0.625rem", borderRadius: "0.375rem", backgroundColor: "var(--color-primary)", color: "var(--color-on-primary)", fontFamily: "var(--font-label)", fontSize: "0.6875rem", fontWeight: 700 }}>{lesson!.courseCode}</span>
                        </div>
                        <div style={{ position: "absolute", top: "0.75rem", right: "0.75rem" }}>
                          <span style={{ padding: "0.25rem 0.625rem", borderRadius: "0.375rem", backgroundColor: "var(--color-secondary)", color: "var(--color-on-secondary)", fontFamily: "var(--font-label)", fontSize: "0.6875rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                            <Unlock size={11} />
                            Unlocked
                          </span>
                        </div>
                        <div style={{ position: "absolute", bottom: "0.75rem", right: "0.75rem", padding: "0.125rem 0.5rem", borderRadius: "0.375rem", backgroundColor: "rgba(17,28,45,0.8)", color: "white", fontFamily: "var(--font-label)", fontSize: "0.6875rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                          <Clock size={11} />
                          {lesson!.duration}
                        </div>
                      </div>
                      {/* Full-width secondary progress strip */}
                      <div style={{ width: "100%", height: "0.25rem", backgroundColor: "var(--color-secondary)" }} />
                      {/* Body */}
                      <div style={{ padding: "1rem" }}>
                        <p style={{ fontFamily: "var(--font-label)", fontSize: "0.6875rem", fontWeight: 600, color: "var(--color-secondary)", margin: "0 0 0.25rem" }}>{lesson!.faculty}</p>
                        <h3 className="line-clamp-2" style={{ fontFamily: "var(--font-headline)", fontSize: "1rem", fontWeight: 600, color: "var(--color-on-surface)", margin: "0 0 0.75rem", lineHeight: 1.35 }}>{lesson!.title}</h3>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", backgroundColor: "var(--color-surface-container-low)", padding: "0.5rem", borderRadius: "0.75rem", marginBottom: "0.75rem" }}>
                          <div style={{ width: "1.75rem", height: "1.75rem", borderRadius: "9999px", backgroundColor: "var(--color-primary-fixed)", color: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-label)", fontSize: "0.65rem", fontWeight: 700, flexShrink: 0 }}>{lesson!.instructor.initials}</div>
                          <div>
                            <p style={{ fontFamily: "var(--font-label)", fontSize: "0.75rem", fontWeight: 600, color: "var(--color-on-surface)", margin: 0 }}>{lesson!.instructor.name}</p>
                            <p style={{ fontFamily: "var(--font-label)", fontSize: "0.65rem", color: "var(--color-on-surface-variant)", margin: 0 }}>{lesson!.instructor.title}</p>
                          </div>
                        </div>
                        <Link href={`/lesson/${lesson!.id}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem", padding: "0.5rem", borderRadius: "0.75rem", backgroundColor: "var(--color-primary)", color: "var(--color-on-primary)", fontFamily: "var(--font-label)", fontSize: "0.875rem", fontWeight: 600, textDecoration: "none" }}>
                          <PlayCircle size={18} />
                          Watch Lesson
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── TAB: Upcoming Sessions ─────────────────────────────────── */}
          {activeTab === "upcoming" && (
            <>
              {/* Escrow banner */}
              <div style={{ background: "linear-gradient(to right, rgba(0,108,73,0.08), rgba(108,248,187,0.15), var(--color-surface-container-high))", padding: "1rem", borderRadius: "1rem", display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.75rem", backgroundColor: "var(--color-secondary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Scale size={22} color="var(--color-on-secondary)" />
                </div>
                <div>
                  <h4 style={{ fontFamily: "var(--font-headline)", fontSize: "1rem", fontWeight: 700, color: "var(--color-on-surface)", margin: "0 0 0.25rem" }}>AMANOTA Student Escrow Vault</h4>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-on-surface-variant)", margin: 0 }}>
                    Your funds are secured. Click <strong style={{ color: "var(--color-on-surface)" }}>"Mark Session Completed"</strong> after your session to release 80% to your tutor&apos;s MTN MoMo or Airtel Money account.
                  </p>
                </div>
              </div>

              {upcomingBookings.length === 0 ? (
                <EmptyState icon={<CalendarDays size={48} color="var(--color-outline)" />} title="No upcoming sessions" sub="Book a live or in-person tutoring session from any lesson page." cta="Explore Lessons →" href="/" />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {upcomingBookings.map((booking) => {
                    // Handle both Supabase booking (SbBooking) and context booking
                    const isSb = "lesson_id" in booking;
                    const lessonId = isSb ? (booking as SbBooking).lesson_id : (booking as typeof bookings[0]).lessonId;
                    const lesson = lessons.find((l) => l.id === lessonId);
                    const lessonTitle = isSb
                      ? ((booking as SbBooking).lessons?.title ?? lessonId)
                      : lesson?.title ?? lessonId;
                    const courseCode = isSb
                      ? ((booking as SbBooking).lessons?.course_code ?? "")
                      : lesson?.courseCode ?? "";
                    const scheduledDate = isSb
                      ? formatDate((booking as SbBooking).scheduled_at ?? "TBD")
                      : (booking as typeof bookings[0]).scheduledDate;
                    const scheduledTime = isSb
                      ? ((booking as SbBooking).scheduled_time ?? "")
                      : (booking as typeof bookings[0]).scheduledTime;
                    const location = isSb
                      ? ((booking as SbBooking).location ?? "")
                      : (booking as typeof bookings[0]).location;
                    const tierLabel = isSb
                      ? (booking as SbBooking).tier_type.replace("_", " ")
                      : (booking as typeof bookings[0]).tier;
                    return (
                      <div key={booking.id} style={{ backgroundColor: "var(--color-surface-container-lowest)", borderRadius: "1rem", padding: "1.25rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "0.375rem", backgroundColor: "var(--color-primary)" }} />
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginBottom: "0.5rem" }}>
                              <span style={{ padding: "0.125rem 0.625rem", borderRadius: "9999px", backgroundColor: "var(--color-primary-fixed)", color: "var(--color-primary)", fontFamily: "var(--font-label)", fontSize: "0.7rem", fontWeight: 700 }}>{courseCode}</span>
                              <span style={{ padding: "0.125rem 0.625rem", borderRadius: "9999px", backgroundColor: "var(--color-surface-container)", color: "var(--color-on-surface-variant)", fontFamily: "var(--font-label)", fontSize: "0.7rem", textTransform: "capitalize" }}>{tierLabel}</span>
                            </div>
                            <h3 style={{ fontFamily: "var(--font-headline)", fontSize: "1rem", fontWeight: 700, color: "var(--color-on-surface)", margin: "0 0 0.75rem" }}>{lessonTitle}</h3>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                                <Clock size={18} color="var(--color-primary)" style={{ marginTop: "0.125rem" }} />
                                <div>
                                  <p style={{ fontFamily: "var(--font-label)", fontSize: "0.65rem", fontWeight: 700, color: "var(--color-on-surface-variant)", textTransform: "uppercase", margin: "0 0 0.125rem" }}>Date &amp; Time</p>
                                  <p style={{ fontFamily: "var(--font-label)", fontSize: "0.875rem", fontWeight: 700, color: "var(--color-on-surface)", margin: "0 0 0.125rem" }}>{scheduledDate}</p>
                                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--color-on-surface-variant)", margin: 0 }}>{scheduledTime}</p>
                                </div>
                              </div>
                              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                                <MapPin size={18} color="var(--color-secondary)" style={{ marginTop: "0.125rem" }} />
                                <div>
                                  <p style={{ fontFamily: "var(--font-label)", fontSize: "0.65rem", fontWeight: 700, color: "var(--color-on-surface-variant)", textTransform: "uppercase", margin: "0 0 0.125rem" }}>Location</p>
                                  <p style={{ fontFamily: "var(--font-label)", fontSize: "0.875rem", fontWeight: 700, color: "var(--color-on-surface)", margin: 0 }}>{location}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleMarkCompleted(booking.id)}
                            style={{ display: "flex", alignItems: "center", gap: "0.375rem", padding: "0.625rem 1.25rem", borderRadius: "0.75rem", border: "none", cursor: "pointer", backgroundColor: "var(--color-secondary)", color: "var(--color-on-secondary)", fontFamily: "var(--font-label)", fontSize: "0.875rem", fontWeight: 700, boxShadow: "0 1px 4px rgba(0,0,0,0.12)", transition: "background 0.15s", alignSelf: "flex-end", whiteSpace: "nowrap" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--color-on-secondary-container)"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--color-secondary)"; }}
                          >
                            <CheckCircle2 size={18} />
                            Mark Session Completed
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* ── TAB: Past Sessions ─────────────────────────────────────── */}
          {activeTab === "past" && (
            <>
              {pastBookings.length === 0 ? (
                <EmptyState icon={<History size={48} color="var(--color-outline)" />} title="No past sessions yet" sub="Completed sessions will appear here after you mark them done." cta="See upcoming sessions" href="#" onClick={() => setActiveTab("upcoming")} />
              ) : (
                <div style={{ backgroundColor: "var(--color-surface-container-lowest)", borderRadius: "1rem", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-body)", fontSize: "0.875rem" }}>
                    <thead>
                      <tr style={{ backgroundColor: "var(--color-surface-container-low)", borderBottom: "2px solid var(--color-outline-variant)" }}>
                        {["Date", "Lesson", "Mode", "Location", "Status"].map((h) => (
                          <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontFamily: "var(--font-label)", fontSize: "0.7rem", fontWeight: 700, color: "var(--color-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pastBookings.map((b) => {
                      const isSb = "lesson_id" in b;
                      const lessonId = isSb ? (b as SbBooking).lesson_id : (b as typeof bookings[0]).lessonId;
                      const lesson = lessons.find((l) => l.id === lessonId);
                      const title = isSb ? ((b as SbBooking).lessons?.title ?? lessonId) : (lesson?.title ?? lessonId);
                      const date  = isSb ? formatDate((b as SbBooking).scheduled_at ?? "") : (b as typeof bookings[0]).scheduledDate;
                      const loc   = isSb ? ((b as SbBooking).location ?? "—") : (b as typeof bookings[0]).location;
                      const tier  = isSb ? (b as SbBooking).tier_type : (b as typeof bookings[0]).tier;
                        return (
                          <tr key={b.id} style={{ borderBottom: "1px solid var(--color-outline-variant)" }}>
                            <td style={{ padding: "0.75rem 1rem", color: "var(--color-on-surface-variant)" }}>{date}</td>
                            <td style={{ padding: "0.75rem 1rem" }}><span className="line-clamp-1" style={{ display: "block", maxWidth: "16rem", fontWeight: 500, color: "var(--color-on-surface)" }}>{title}</span></td>
                            <td style={{ padding: "0.75rem 1rem", textTransform: "capitalize", color: "var(--color-on-surface-variant)" }}>{String(tier).replace("_", " ")}</td>
                            <td style={{ padding: "0.75rem 1rem", color: "var(--color-on-surface-variant)" }}>{loc}</td>
                            <td style={{ padding: "0.75rem 1rem" }}>
                              <span style={{ padding: "0.25rem 0.625rem", borderRadius: "9999px", backgroundColor: "var(--color-secondary-container)", color: "var(--color-on-secondary-container)", fontFamily: "var(--font-label)", fontSize: "0.7rem", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                                <CheckCircle2 size={12} />
                                Completed
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

// ── Empty state helper ────────────────────────────────────────────────────────

function EmptyState({ icon, title, sub, cta, href, onClick }: {
  icon: React.ReactNode; title: string; sub: string; cta: string; href: string; onClick?: () => void;
}) {
  return (
    <div style={{ textAlign: "center", padding: "5rem 2rem", backgroundColor: "var(--color-surface-container-lowest)", borderRadius: "1rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
      <div style={{ display: "block", marginBottom: "1rem" }}>{icon}</div>
      <h3 style={{ fontFamily: "var(--font-headline)", fontSize: "1.25rem", fontWeight: 600, color: "var(--color-on-surface)", margin: "0 0 0.5rem" }}>{title}</h3>
      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--color-on-surface-variant)", maxWidth: "24rem", margin: "0 auto 1.5rem" }}>{sub}</p>
      <Link href={href} onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", padding: "0.625rem 1.5rem", borderRadius: "0.75rem", backgroundColor: "var(--color-primary)", color: "var(--color-on-primary)", fontFamily: "var(--font-label)", fontWeight: 600, textDecoration: "none" }}>
        {cta}
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
