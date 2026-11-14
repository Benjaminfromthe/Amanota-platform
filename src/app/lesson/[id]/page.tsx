"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useApp } from "@/context/AppContext";
import type { Tier } from "@/context/AppContext";

// ─── Tier config ──────────────────────────────────────────────────────────────

const TIER_CONFIG: {
  id: Tier;
  label: string;
  price: number;
  tagline: string;
  icon: string;
}[] = [
  { id: "recorded", label: "Recorded Video Lesson", price: 1000, tagline: "Instant lifetime access — watch anytime", icon: "smart_display" },
  { id: "online",   label: "Online Live 1-on-1",    price: 2000, tagline: "Live screen-share session with your tutor", icon: "videocam" },
  { id: "campus",   label: "In-Person at AUCA Campus", price: 3000, tagline: "Meet your tutor on campus", icon: "domain" },
  { id: "custom",   label: "In-Person — Custom Location (Kigali)", price: 5000, tagline: "Any spot in Kigali you choose", icon: "location_on" },
];

const CAMPUS_LOCATIONS = [
  "Masoro Library Study Room",
  "Gishushu Study Hall",
  "Computer Lab B",
  "Campus Cafeteria",
];

const TIME_SLOTS = ["Morning (08:00–10:00)", "Afternoon (13:00–15:00)", "Evening (17:00–19:00)"];

// ─── Syllabus generator ───────────────────────────────────────────────────────

function buildSyllabus(title: string): string[] {
  return [
    `Introduction & overview of ${title}`,
    "Core concepts and theoretical foundations",
    "Practical exercises with worked examples",
    "Common exam patterns and problem-solving strategies",
    "AUCA past-paper review and Q&A",
  ];
}

// ─── Payment modal ─────────────────────────────────────────────────────────────

interface PaymentModalProps {
  lessonTitle: string;
  tierLabel: string;
  price: number;
  onConfirm: (phone: string, method: string) => void;
  onClose: () => void;
}

function PaymentModal({ lessonTitle, tierLabel, price, onConfirm, onClose }: PaymentModalProps) {
  const [method, setMethod] = useState<"mtn" | "airtel">("mtn");
  const [phone, setPhone] = useState("0788 000 000");
  const [success, setSuccess] = useState(false);

  const handleConfirm = () => {
    onConfirm(phone, method);
    setSuccess(true);
  };

  useEffect(() => {
    if (success) {
      const t = setTimeout(onClose, 3500);
      return () => clearTimeout(t);
    }
  }, [success, onClose]);

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 200, backgroundColor: "rgba(15,23,42,0.6)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ backgroundColor: "var(--color-surface-container-lowest)", borderRadius: "1.5rem", padding: "2rem", width: "100%", maxWidth: "26rem", boxShadow: "0 25px 50px -12px rgba(30,41,59,0.3)" }}>
        {success ? (
          /* ── Success state ── */
          <div style={{ textAlign: "center", padding: "1rem 0" }}>
            <div style={{ width: "4rem", height: "4rem", borderRadius: "9999px", backgroundColor: "var(--color-secondary-container)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "2.25rem", color: "var(--color-secondary)", fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <h3 style={{ fontFamily: "var(--font-headline)", fontSize: "1.375rem", fontWeight: 700, color: "var(--color-on-surface)", margin: "0 0 0.5rem" }}>Payment Successful! 🎉</h3>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--color-on-surface-variant)", margin: "0 0 1.5rem" }}>
              Your booking is confirmed and secured in the AMANOTA Escrow Vault.
            </p>
            <Link href="/my-learning" style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", padding: "0.625rem 1.5rem", borderRadius: "0.75rem", backgroundColor: "var(--color-primary)", color: "var(--color-on-primary)", fontFamily: "var(--font-label)", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none" }}>
              Go to My Learning
              <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>arrow_forward</span>
            </Link>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
              <div>
                <h3 style={{ fontFamily: "var(--font-headline)", fontSize: "1.25rem", fontWeight: 700, color: "var(--color-on-surface)", margin: "0 0 0.25rem" }}>Complete Payment</h3>
                <p style={{ fontFamily: "var(--font-label)", fontSize: "0.75rem", color: "var(--color-on-surface-variant)", margin: 0, display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: "0.875rem", color: "var(--color-secondary)" }}>shield</span>
                  AUCA Escrow Protected
                </p>
              </div>
              <button onClick={onClose} style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--color-on-surface-variant)", display: "flex", alignItems: "center" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "1.5rem" }}>close</span>
              </button>
            </div>

            {/* Summary */}
            <div style={{ backgroundColor: "var(--color-surface-container-low)", borderRadius: "0.75rem", padding: "0.875rem 1rem", marginBottom: "1.25rem" }}>
              <p className="line-clamp-1" style={{ fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 600, color: "var(--color-on-surface)", margin: "0 0 0.25rem" }}>{lessonTitle}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--color-on-surface-variant)" }}>{tierLabel}</span>
                <span style={{ fontFamily: "var(--font-headline)", fontSize: "1.1rem", fontWeight: 700, color: "var(--color-primary)" }}>{price.toLocaleString()} RWF</span>
              </div>
            </div>

            {/* Payment method */}
            <p style={{ fontFamily: "var(--font-label)", fontSize: "0.75rem", fontWeight: 700, color: "var(--color-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 0.625rem" }}>Payment Method</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.625rem", marginBottom: "1.25rem" }}>
              {/* MTN */}
              <button
                onClick={() => setMethod("mtn")}
                style={{ padding: "0.75rem", borderRadius: "0.75rem", border: `2px solid ${method === "mtn" ? "#FFCC00" : "var(--color-outline-variant)"}`, backgroundColor: method === "mtn" ? "#FFFDE7" : "transparent", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.375rem", transition: "all 0.15s" }}
              >
                <span style={{ fontSize: "1.5rem" }}>📱</span>
                <span style={{ fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 700, color: "#B8860B" }}>MTN MoMo</span>
              </button>
              {/* Airtel */}
              <button
                onClick={() => setMethod("airtel")}
                style={{ padding: "0.75rem", borderRadius: "0.75rem", border: `2px solid ${method === "airtel" ? "#E53935" : "var(--color-outline-variant)"}`, backgroundColor: method === "airtel" ? "#FFF3F3" : "transparent", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.375rem", transition: "all 0.15s" }}
              >
                <span style={{ fontSize: "1.5rem" }}>💳</span>
                <span style={{ fontFamily: "var(--font-label)", fontSize: "0.8rem", fontWeight: 700, color: "#E53935" }}>Airtel Money</span>
              </button>
            </div>

            {/* Phone */}
            <label style={{ display: "block", marginBottom: "1rem" }}>
              <p style={{ fontFamily: "var(--font-label)", fontSize: "0.75rem", fontWeight: 700, color: "var(--color-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 0.375rem" }}>Mobile Number</p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 0.875rem", borderRadius: "0.625rem", border: "1.5px solid var(--color-outline-variant)", backgroundColor: "var(--color-surface-container-lowest)", transition: "border-color 0.15s" }}>
                <span className="material-symbols-outlined" style={{ fontSize: "1.1rem", color: "var(--color-outline)" }}>phone</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--color-on-surface)" }}
                />
              </div>
            </label>

            {/* Escrow note */}
            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--color-on-surface-variant)", backgroundColor: "rgba(108,248,187,0.12)", borderRadius: "0.5rem", padding: "0.625rem 0.75rem", marginBottom: "1.25rem", display: "flex", alignItems: "flex-start", gap: "0.375rem" }}>
              <span className="material-symbols-outlined" style={{ fontSize: "1rem", color: "var(--color-secondary)", flexShrink: 0 }}>lock</span>
              Your funds are held in the <strong style={{ color: "var(--color-on-surface)" }}>AMANOTA Escrow Vault</strong> and released to the tutor only after session completion.
            </p>

            {/* Confirm */}
            <button
              onClick={handleConfirm}
              style={{ width: "100%", padding: "0.875rem", borderRadius: "0.75rem", border: "none", cursor: "pointer", backgroundColor: "var(--color-primary)", color: "var(--color-on-primary)", fontFamily: "var(--font-label)", fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", transition: "background 0.15s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--color-on-primary-fixed-variant)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--color-primary)"; }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: "1.25rem" }}>lock</span>
              Confirm Payment — {price.toLocaleString()} RWF
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const { lessons, purchases, purchaseLesson } = useApp();

  const lessonId = typeof params.id === "string" ? params.id : params.id?.[0] ?? "";
  const lesson = lessons.find((l) => l.id === lessonId);

  const [activeTab, setActiveTab] = useState<"about" | "syllabus">("about");
  const [selectedTier, setSelectedTier] = useState<Tier>("recorded");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [campusLocation, setCampusLocation] = useState(CAMPUS_LOCATIONS[0]);
  const [customAddress, setCustomAddress] = useState("");
  const [showModal, setShowModal] = useState(false);

  const alreadyPurchased = purchases.some(
    (p) => p.lessonId === lessonId && p.tier === selectedTier
  );

  const tierConfig = TIER_CONFIG.find((t) => t.id === selectedTier)!;

  const handleConfirmPayment = (_phone: string, _method: string) => {
    const bookingDetails =
      selectedTier !== "recorded"
        ? {
            scheduledDate: date || "TBD",
            scheduledTime: timeSlot,
            location:
              selectedTier === "campus"
                ? campusLocation
                : selectedTier === "online"
                ? "Online — meet.amanota.rw"
                : customAddress || "Custom Kigali location",
          }
        : undefined;
    purchaseLesson(lessonId, selectedTier, tierConfig.price, bookingDetails);
  };

  if (!lesson) {
    return (
      <>
        <Header />
        <main style={{ paddingTop: "5rem", minHeight: "100vh", backgroundColor: "var(--color-surface)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <span className="material-symbols-outlined" style={{ fontSize: "3rem", color: "var(--color-outline)", display: "block", marginBottom: "1rem" }}>search_off</span>
            <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.5rem", color: "var(--color-on-surface)", marginBottom: "0.75rem" }}>Lesson not found</h2>
            <Link href="/" style={{ color: "var(--color-primary)", fontFamily: "var(--font-label)", fontWeight: 600 }}>← Back to Explore</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const syllabus = buildSyllabus(lesson.title);
  const stars = "★".repeat(Math.floor(lesson.rating));

  return (
    <>
      <Header />
      <main style={{ width: "100%", paddingTop: "5rem", minHeight: "100vh", backgroundColor: "var(--color-surface)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2rem" }}>

          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem", fontFamily: "var(--font-label)", fontSize: "0.8rem", color: "var(--color-on-surface-variant)" }}>
            <Link href="/" style={{ color: "var(--color-primary)", textDecoration: "none", fontWeight: 600 }}>Explore</Link>
            <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>chevron_right</span>
            <span>{lesson.faculty}</span>
            <span className="material-symbols-outlined" style={{ fontSize: "1rem" }}>chevron_right</span>
            <span style={{ color: "var(--color-on-surface)", fontWeight: 600 }} className="line-clamp-1">{lesson.title}</span>
          </div>

          {/* Two-column layout */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "2rem", alignItems: "start" }}>

            {/* ── LEFT: Video + details ───────────────────────────────────── */}
            <div>
              {/* Video player placeholder */}
              <div style={{ width: "100%", aspectRatio: "16/9", borderRadius: "1rem", backgroundColor: "var(--color-inverse-surface)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", marginBottom: "1.5rem", boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}>
                {lesson.thumbnail && lesson.thumbnail !== "/placeholder.svg" && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={lesson.thumbnail} alt={lesson.thumbnailAlt} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.35 }} />
                )}
                <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                  <button style={{ width: "5rem", height: "5rem", borderRadius: "9999px", backgroundColor: "rgba(79,70,229,0.92)", border: "3px solid rgba(255,255,255,0.3)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", backdropFilter: "blur(8px)" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "2.5rem", color: "white", fontVariationSettings: "'FILL' 1", paddingLeft: "0.25rem" }}>play_arrow</span>
                  </button>
                  <span style={{ fontFamily: "var(--font-label)", fontSize: "0.8rem", color: "rgba(255,255,255,0.7)", backgroundColor: "rgba(0,0,0,0.4)", padding: "0.375rem 0.875rem", borderRadius: "9999px", backdropFilter: "blur(8px)" }}>
                    {lesson.duration} · {lesson.courseCode}
                  </span>
                </div>
              </div>

              {/* Title + badges */}
              <div style={{ marginBottom: "1.25rem" }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <span style={{ padding: "0.25rem 0.75rem", borderRadius: "9999px", backgroundColor: lesson.courseCodeColor === "secondary" ? "var(--color-secondary)" : "var(--color-primary)", color: lesson.courseCodeColor === "secondary" ? "var(--color-on-secondary)" : "var(--color-on-primary)", fontFamily: "var(--font-label)", fontSize: "0.75rem", fontWeight: 700 }}>{lesson.courseCode}</span>
                  <span style={{ padding: "0.25rem 0.75rem", borderRadius: "9999px", backgroundColor: "var(--color-primary-fixed)", color: "var(--color-primary)", fontFamily: "var(--font-label)", fontSize: "0.75rem", fontWeight: 700 }}>{lesson.faculty.split("•")[0].trim()}</span>
                  <span style={{ padding: "0.25rem 0.75rem", borderRadius: "9999px", backgroundColor: "var(--color-surface-container)", color: "var(--color-on-surface-variant)", fontFamily: "var(--font-label)", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "0.9rem" }}>domain</span>
                    {lesson.campus === "both" ? "Masoro & Gishushu" : lesson.campus === "masoro" ? "Masoro Campus" : "Gishushu Campus"}
                  </span>
                </div>
                <h1 style={{ fontFamily: "var(--font-headline)", fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)", fontWeight: 700, color: "var(--color-on-surface)", lineHeight: 1.25, margin: "0 0 0.75rem" }}>{lesson.title}</h1>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontFamily: "var(--font-label)", fontSize: "0.8rem" }}>
                    <span style={{ color: "#B8860B", letterSpacing: "-0.05em" }}>{stars}</span>
                    <strong style={{ color: "var(--color-on-surface)" }}>{lesson.rating.toFixed(1)}</strong>
                    <span style={{ color: "var(--color-on-surface-variant)" }}>({lesson.reviewCount} reviews)</span>
                  </span>
                </div>
              </div>

              {/* Instructor card */}
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", backgroundColor: "var(--color-surface-container-lowest)", padding: "1rem", borderRadius: "1rem", marginBottom: "1.5rem", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <div style={{ width: "3.5rem", height: "3.5rem", borderRadius: "9999px", backgroundColor: lesson.instructor.color === "secondary" ? "var(--color-secondary-container)" : "var(--color-primary-fixed)", color: lesson.instructor.color === "secondary" ? "var(--color-on-secondary-container)" : "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-headline)", fontSize: "1rem", fontWeight: 700, flexShrink: 0 }}>
                  {lesson.instructor.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "var(--font-label)", fontSize: "1rem", fontWeight: 700, color: "var(--color-on-surface)", margin: "0 0 0.125rem" }}>{lesson.instructor.name}</p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-on-surface-variant)", margin: 0 }}>{lesson.instructor.title}</p>
                </div>
                <span style={{ padding: "0.25rem 0.75rem", borderRadius: "9999px", backgroundColor: "var(--color-primary-fixed)", color: "var(--color-primary)", fontFamily: "var(--font-label)", fontSize: "0.7rem", fontWeight: 700 }}>AUCA Verified</span>
              </div>

              {/* Tabs */}
              <div style={{ backgroundColor: "var(--color-surface-container-lowest)", borderRadius: "1rem", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", borderBottom: "1px solid var(--color-outline-variant)" }}>
                  {(["about", "syllabus"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{ flex: 1, padding: "0.875rem", border: "none", cursor: "pointer", backgroundColor: "transparent", fontFamily: "var(--font-label)", fontSize: "0.9rem", fontWeight: 600, color: activeTab === tab ? "var(--color-primary)" : "var(--color-on-surface-variant)", borderBottom: activeTab === tab ? "2px solid var(--color-primary)" : "2px solid transparent", transition: "all 0.15s" }}
                    >
                      {tab === "about" ? "About" : "Syllabus"}
                    </button>
                  ))}
                </div>
                <div style={{ padding: "1.25rem" }}>
                  {activeTab === "about" ? (
                    <>
                      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "var(--color-on-surface-variant)", lineHeight: 1.7, margin: "0 0 1rem" }}>{lesson.description}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                        {lesson.tags.map((tag) => (
                          <span key={tag} style={{ padding: "0.25rem 0.625rem", borderRadius: "9999px", backgroundColor: "var(--color-surface-container)", color: "var(--color-on-surface-variant)", fontFamily: "var(--font-label)", fontSize: "0.75rem", fontWeight: 600 }}>{tag}</span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <ol style={{ padding: "0 0 0 1.25rem", margin: 0 }}>
                      {syllabus.map((item, i) => (
                        <li key={i} style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "var(--color-on-surface-variant)", lineHeight: 1.7, marginBottom: "0.5rem" }}>
                          <span style={{ color: "var(--color-on-surface)", fontWeight: 500 }}>{item}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </div>
            </div>

            {/* ── RIGHT: Booking panel ────────────────────────────────────── */}
            <div style={{ position: "sticky", top: "6rem" }}>
              <div style={{ backgroundColor: "var(--color-surface-container-lowest)", borderRadius: "1rem", overflow: "hidden", boxShadow: "0 4px 24px rgba(30,41,59,0.1)" }}>
                <div style={{ padding: "1.25rem 1.25rem 0" }}>
                  <h2 style={{ fontFamily: "var(--font-headline)", fontSize: "1.1rem", fontWeight: 700, color: "var(--color-on-surface)", margin: "0 0 1rem" }}>Choose Your Learning Mode</h2>

                  {/* Tier cards */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
                    {TIER_CONFIG.map((t) => {
                      const active = selectedTier === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => setSelectedTier(t.id)}
                          style={{ display: "flex", alignItems: "flex-start", gap: "0.875rem", padding: "0.875rem", borderRadius: "0.75rem", border: `2px solid ${active ? "var(--color-primary)" : "var(--color-outline-variant)"}`, backgroundColor: active ? "rgba(226,223,255,0.25)" : "transparent", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}
                        >
                          <div style={{ width: "2.5rem", height: "2.5rem", borderRadius: "0.625rem", backgroundColor: active ? "var(--color-primary)" : "var(--color-surface-container)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "1.375rem", color: active ? "var(--color-on-primary)" : "var(--color-on-surface-variant)" }}>{t.icon}</span>
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                              <p style={{ fontFamily: "var(--font-label)", fontSize: "0.875rem", fontWeight: 700, color: active ? "var(--color-primary)" : "var(--color-on-surface)", margin: 0, lineHeight: 1.3 }}>{t.label}</p>
                              <span style={{ fontFamily: "var(--font-headline)", fontSize: "0.9rem", fontWeight: 700, color: active ? "var(--color-primary)" : "var(--color-on-surface)", flexShrink: 0 }}>{t.price.toLocaleString()} RWF</span>
                            </div>
                            <p style={{ fontFamily: "var(--font-body)", fontSize: "0.775rem", color: "var(--color-on-surface-variant)", margin: "0.25rem 0 0" }}>{t.tagline}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Conditional extras */}
                  {selectedTier !== "recorded" && (
                    <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                      {/* Date */}
                      <label style={{ display: "block" }}>
                        <p style={{ fontFamily: "var(--font-label)", fontSize: "0.7rem", fontWeight: 700, color: "var(--color-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 0.375rem" }}>Preferred Date</p>
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "0.5rem", border: "1.5px solid var(--color-outline-variant)", backgroundColor: "var(--color-surface-container-lowest)", fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-on-surface)", outline: "none", boxSizing: "border-box" }}
                        />
                      </label>

                      {/* Time slot */}
                      <label style={{ display: "block" }}>
                        <p style={{ fontFamily: "var(--font-label)", fontSize: "0.7rem", fontWeight: 700, color: "var(--color-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 0.375rem" }}>Time Slot</p>
                        <select
                          value={timeSlot}
                          onChange={(e) => setTimeSlot(e.target.value)}
                          style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "0.5rem", border: "1.5px solid var(--color-outline-variant)", backgroundColor: "var(--color-surface-container-lowest)", fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-on-surface)", outline: "none" }}
                        >
                          {TIME_SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </label>

                      {/* Campus location dropdown */}
                      {selectedTier === "campus" && (
                        <label style={{ display: "block" }}>
                          <p style={{ fontFamily: "var(--font-label)", fontSize: "0.7rem", fontWeight: 700, color: "var(--color-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 0.375rem" }}>Campus Location</p>
                          <select
                            value={campusLocation}
                            onChange={(e) => setCampusLocation(e.target.value)}
                            style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "0.5rem", border: "1.5px solid var(--color-outline-variant)", backgroundColor: "var(--color-surface-container-lowest)", fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-on-surface)", outline: "none" }}
                          >
                            {CAMPUS_LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                          </select>
                        </label>
                      )}

                      {/* Custom address input */}
                      {selectedTier === "custom" && (
                        <label style={{ display: "block" }}>
                          <p style={{ fontFamily: "var(--font-label)", fontSize: "0.7rem", fontWeight: 700, color: "var(--color-on-surface-variant)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 0.375rem" }}>Custom Address (Kigali)</p>
                          <input
                            type="text"
                            placeholder="e.g. KG 11 Ave, Kigali City Center"
                            value={customAddress}
                            onChange={(e) => setCustomAddress(e.target.value)}
                            style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "0.5rem", border: "1.5px solid var(--color-outline-variant)", backgroundColor: "var(--color-surface-container-lowest)", fontFamily: "var(--font-body)", fontSize: "0.875rem", color: "var(--color-on-surface)", outline: "none", boxSizing: "border-box" }}
                          />
                        </label>
                      )}
                    </div>
                  )}
                </div>

                {/* Escrow note + CTA */}
                <div style={{ padding: "1rem 1.25rem 1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.625rem 0.75rem", borderRadius: "0.625rem", backgroundColor: "rgba(108,248,187,0.1)", marginBottom: "0.875rem" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "1rem", color: "var(--color-secondary)" }}>shield</span>
                    <span style={{ fontFamily: "var(--font-body)", fontSize: "0.775rem", color: "var(--color-on-surface-variant)" }}>
                      Payment held in <strong style={{ color: "var(--color-on-surface)" }}>AMANOTA Escrow</strong> — released after session completion.
                    </span>
                  </div>

                  {alreadyPurchased ? (
                    <div style={{ textAlign: "center", padding: "0.75rem", borderRadius: "0.75rem", backgroundColor: "var(--color-secondary-container)", color: "var(--color-on-secondary-container)", fontFamily: "var(--font-label)", fontSize: "0.9rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                      <span className="material-symbols-outlined" style={{ fontSize: "1.25rem" }}>check_circle</span>
                      Already purchased — <Link href="/my-learning" style={{ color: "var(--color-secondary)", textDecoration: "underline" }}>Go to My Learning</Link>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowModal(true)}
                      style={{ width: "100%", padding: "0.875rem", borderRadius: "0.75rem", border: "none", cursor: "pointer", backgroundColor: "var(--color-primary)", color: "var(--color-on-primary)", fontFamily: "var(--font-label)", fontSize: "1rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", boxShadow: "0 4px 16px rgba(53,37,205,0.3)", transition: "background 0.15s" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--color-on-primary-fixed-variant)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--color-primary)"; }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "1.25rem" }}>lock</span>
                      Book &amp; Pay — {tierConfig.price.toLocaleString()} RWF
                    </button>
                  )}

                  <p style={{ fontFamily: "var(--font-label)", fontSize: "0.7rem", color: "var(--color-on-surface-variant)", textAlign: "center", margin: "0.625rem 0 0", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.25rem" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: "0.875rem" }}>payments</span>
                    MTN MoMo &amp; Airtel Money accepted
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {showModal && (
        <PaymentModal
          lessonTitle={lesson.title}
          tierLabel={tierConfig.label}
          price={tierConfig.price}
          onConfirm={handleConfirmPayment}
          onClose={() => setShowModal(false)}
        />
      )}

      <Footer />
    </>
  );
}
