"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Campus = "masoro" | "gishushu" | "both";
export type Tier = "recorded" | "online" | "campus" | "custom";
export type Faculty =
  | "Software Engineering"
  | "Networking"
  | "Information Management"
  | "Business"
  | "Theology"
  | "Nursing"
  | "Education";

export interface AppLesson {
  id: string;
  courseCode: string;
  courseCodeColor: "primary" | "secondary";
  faculty: string;
  facultyKey: Faculty;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  thumbnailAlt: string;
  tutorId: string;
  basePrice: 1000;
  tiers: { recorded: 1000; online: 2000; campus: 3000; custom: 5000 };
  rating: number;
  reviewCount: number;
  campus: Campus;
  tags: string[];
  instructor: {
    initials: string;
    name: string;
    title: string;
    color?: "primary" | "secondary";
  };
  assets: Array<{
    icon: string;
    label: string;
    color?: "primary" | "secondary" | "tertiary";
  }>;
}

export interface User {
  id: string;
  name: string;
  initials: string;
  email: string;
  campus: Campus;
}

export interface Purchase {
  id: string;
  userId: string;
  lessonId: string;
  tier: Tier;
  pricePaid: number;
  purchasedAt: string;
  status: "active" | "completed";
}

export interface WalletTransaction {
  id: string;
  lessonId: string;
  tutorId: string;
  totalAmount: number;
  tutorCut: number;
  platformCut: number;
  createdAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  lessonId: string;
  tier: Tier;
  scheduledDate: string;
  scheduledTime: string;
  location: string;
  status: "upcoming" | "completed" | "cancelled";
}

export interface CreatorLesson {
  id: string;
  title: string;
  courseCode: string;
  faculty: string;
  campus: Campus;
  videoUrl: string;
  description: string;
  tiers: Tier[];
  uploadedAt: string;
  tutorId: string;
}

// ─── State shape ─────────────────────────────────────────────────────────────

interface AppState {
  lessons: AppLesson[];
  currentUser: User;
  purchases: Purchase[];
  walletTransactions: WalletTransaction[];
  bookings: Booking[];
  creatorLessons: CreatorLesson[];
}

// ─── Actions ──────────────────────────────────────────────────────────────────

type Action =
  | {
      type: "PURCHASE_LESSON";
      payload: {
        lessonId: string;
        tier: Tier;
        pricePaid: number;
        bookingDetails?: {
          scheduledDate: string;
          scheduledTime: string;
          location: string;
        };
      };
    }
  | { type: "MARK_BOOKING_COMPLETED"; payload: { bookingId: string } }
  | { type: "UPLOAD_LESSON"; payload: Omit<CreatorLesson, "id" | "uploadedAt"> }
  | { type: "HYDRATE"; payload: Partial<AppState> };

// ─── Seed data (imported lazily to avoid circular dependency) ─────────────────

import { appLessons } from "@/lib/data";

const SEED_USER: User = {
  id: "user-001",
  name: "Cedric Ishimwe",
  initials: "CI",
  email: "c.ishimwe@auca.ac.rw",
  campus: "masoro",
};

const SEED_PURCHASES: Purchase[] = [
  {
    id: "pur-001",
    userId: "user-001",
    lessonId: "comp201",
    tier: "recorded",
    pricePaid: 1000,
    purchasedAt: "2025-01-10T09:00:00Z",
    status: "active",
  },
  {
    id: "pur-002",
    userId: "user-001",
    lessonId: "se304",
    tier: "recorded",
    pricePaid: 1000,
    purchasedAt: "2025-01-12T14:00:00Z",
    status: "active",
  },
];

const SEED_TRANSACTIONS: WalletTransaction[] = [
  {
    id: "wt-001",
    lessonId: "comp201",
    tutorId: "tutor-001",
    totalAmount: 1000,
    tutorCut: 800,
    platformCut: 200,
    createdAt: "2025-01-10T09:00:00Z",
  },
  {
    id: "wt-002",
    lessonId: "comp201",
    tutorId: "tutor-001",
    totalAmount: 3000,
    tutorCut: 2400,
    platformCut: 600,
    createdAt: "2025-01-14T11:00:00Z",
  },
  {
    id: "wt-003",
    lessonId: "cs310",
    tutorId: "tutor-001",
    totalAmount: 2000,
    tutorCut: 1600,
    platformCut: 400,
    createdAt: "2025-01-16T15:30:00Z",
  },
];

const SEED_BOOKINGS: Booking[] = [
  {
    id: "book-001",
    userId: "user-001",
    lessonId: "se304",
    tier: "campus",
    scheduledDate: "Friday, Oct 25",
    scheduledTime: "02:00 PM – 02:45 PM",
    location: "Gishushu Study Hall",
    status: "upcoming",
  },
];

const INITIAL_STATE: AppState = {
  lessons: appLessons,
  currentUser: SEED_USER,
  purchases: SEED_PURCHASES,
  walletTransactions: SEED_TRANSACTIONS,
  bookings: SEED_BOOKINGS,
  creatorLessons: [],
};

// ─── Reducer ──────────────────────────────────────────────────────────────────

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "HYDRATE":
      return {
        ...state,
        ...action.payload,
        // Always keep latest lessons from code (future-proof for data upgrades)
        lessons: appLessons,
      };

    case "PURCHASE_LESSON": {
      const { lessonId, tier, pricePaid, bookingDetails } = action.payload;
      const lesson = state.lessons.find((l) => l.id === lessonId);
      const tutorId = lesson?.tutorId ?? "tutor-001";

      const purchase: Purchase = {
        id: `pur-${Date.now()}`,
        userId: state.currentUser.id,
        lessonId,
        tier,
        pricePaid,
        purchasedAt: new Date().toISOString(),
        status: "active",
      };

      const transaction: WalletTransaction = {
        id: `wt-${Date.now()}`,
        lessonId,
        tutorId,
        totalAmount: pricePaid,
        tutorCut: Math.round(pricePaid * 0.8),
        platformCut: Math.round(pricePaid * 0.2),
        createdAt: new Date().toISOString(),
      };

      const newBookings = [...state.bookings];
      if (tier !== "recorded" && bookingDetails) {
        const booking: Booking = {
          id: `book-${Date.now()}`,
          userId: state.currentUser.id,
          lessonId,
          tier,
          scheduledDate: bookingDetails.scheduledDate,
          scheduledTime: bookingDetails.scheduledTime,
          location: bookingDetails.location,
          status: "upcoming",
        };
        newBookings.push(booking);
      }

      return {
        ...state,
        purchases: [...state.purchases, purchase],
        walletTransactions: [...state.walletTransactions, transaction],
        bookings: newBookings,
      };
    }

    case "MARK_BOOKING_COMPLETED": {
      const { bookingId } = action.payload;
      return {
        ...state,
        bookings: state.bookings.map((b) =>
          b.id === bookingId ? { ...b, status: "completed" } : b
        ),
        purchases: state.purchases.map((p) =>
          p.lessonId ===
          state.bookings.find((b) => b.id === bookingId)?.lessonId
            ? { ...p, status: "completed" }
            : p
        ),
      };
    }

    case "UPLOAD_LESSON": {
      const lesson: CreatorLesson = {
        ...action.payload,
        id: `cl-${Date.now()}`,
        uploadedAt: new Date().toISOString(),
      };
      return {
        ...state,
        creatorLessons: [...state.creatorLessons, lesson],
      };
    }

    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AppContextValue extends AppState {
  purchaseLesson: (
    lessonId: string,
    tier: Tier,
    pricePaid: number,
    bookingDetails?: { scheduledDate: string; scheduledTime: string; location: string }
  ) => void;
  markBookingCompleted: (bookingId: string) => void;
  uploadLesson: (lesson: Omit<CreatorLesson, "id" | "uploadedAt">) => void;
  getTutorWalletBalance: (tutorId: string) => number;
  getPlatformRevenue: () => number;
}

const AppContext = createContext<AppContextValue | null>(null);

const LS_KEY = "amanota-state";

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<AppState>;
        dispatch({ type: "HYDRATE", payload: parsed });
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Persist on every state change
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch {
      // ignore storage errors
    }
  }, [state]);

  const purchaseLesson: AppContextValue["purchaseLesson"] = (
    lessonId,
    tier,
    pricePaid,
    bookingDetails
  ) => {
    dispatch({ type: "PURCHASE_LESSON", payload: { lessonId, tier, pricePaid, bookingDetails } });
  };

  const markBookingCompleted = (bookingId: string) => {
    dispatch({ type: "MARK_BOOKING_COMPLETED", payload: { bookingId } });
  };

  const uploadLesson = (lesson: Omit<CreatorLesson, "id" | "uploadedAt">) => {
    dispatch({ type: "UPLOAD_LESSON", payload: lesson });
  };

  const getTutorWalletBalance = (tutorId: string) =>
    state.walletTransactions
      .filter((t) => t.tutorId === tutorId)
      .reduce((sum, t) => sum + t.tutorCut, 0);

  const getPlatformRevenue = () =>
    state.walletTransactions.reduce((sum, t) => sum + t.platformCut, 0);

  return (
    <AppContext.Provider
      value={{
        ...state,
        purchaseLesson,
        markBookingCompleted,
        uploadLesson,
        getTutorWalletBalance,
        getPlatformRevenue,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppContextProvider");
  return ctx;
}
