/**
 * POST /api/purchase
 *
 * Server-side API route that:
 * 1. Validates the authenticated Supabase session
 * 2. Calls the process_purchase RPC (which atomically inserts the booking
 *    and fires the handle_booking_commission trigger)
 * 3. The trigger auto-executes the 80/20 split, writes wallet_transaction,
 *    credits the tutor wallet, debits the student wallet, and logs to
 *    platform_ledger — all inside one DB transaction
 *
 * Request body:
 *   { lesson_id, tier_type, price_rwf, scheduled_at?, scheduled_time?,
 *     location?, payment_method?, phone_number? }
 *
 * Response:
 *   { booking_id, tutor_cut, platform_cut, status: 'ok' } | { error }
 */

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// ── Tier price map (server-side validation) ───────────────────────────────────
const TIER_PRICES: Record<string, number> = {
  recorded:        1000,
  online:          2000,
  campus:          3000,
  custom_location: 5000,
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      lesson_id:       string;
      tier_type:       string;
      price_rwf:       number;
      scheduled_at?:   string;
      scheduled_time?: string;
      location?:       string;
      payment_method?: string;
      phone_number?:   string;
    };

    // ── Validate required fields ──────────────────────────────────────────
    if (!body.lesson_id)  return NextResponse.json({ error: "lesson_id is required" },  { status: 400 });
    if (!body.tier_type)  return NextResponse.json({ error: "tier_type is required" },  { status: 400 });

    const expectedPrice = TIER_PRICES[body.tier_type];
    if (!expectedPrice) {
      return NextResponse.json({ error: `Unknown tier_type: ${body.tier_type}` }, { status: 400 });
    }
    if (body.price_rwf !== expectedPrice) {
      return NextResponse.json(
        { error: `Price mismatch: expected ${expectedPrice} RWF for ${body.tier_type}` },
        { status: 400 }
      );
    }

    // ── Build server-side Supabase client (reads session cookie) ──────────
    const cookieStore = await cookies();
    const sb = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          setAll: () => {},
        },
      }
    );

    // ── Verify authenticated session ──────────────────────────────────────
    const { data: { user }, error: authError } = await sb.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // ── Fetch the lesson to get the tutor (creator_id) ────────────────────
    const { data: lesson, error: lessonError } = await sb
      .from("lessons")
      .select("id, creator_id, title, course_code, faculty")
      .eq("id", body.lesson_id)
      .single();

    if (lessonError || !lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // ── Call process_purchase RPC (atomic booking + 80/20 trigger) ────────
    const { data: result, error: rpcError } = await sb.rpc("process_purchase", {
      p_lesson_id:      body.lesson_id,
      p_student_id:     user.id,
      p_tutor_id:       lesson.creator_id ?? user.id,
      p_tier_type:      body.tier_type,
      p_price_rwf:      body.price_rwf,
      p_scheduled_at:   body.scheduled_at   ?? null,
      p_scheduled_time: body.scheduled_time ?? null,
      p_location:       body.location       ?? null,
      p_payment_method: body.payment_method ?? null,
      p_phone_number:   body.phone_number   ?? null,
    });

    if (rpcError) {
      console.error("[purchase] RPC error:", rpcError);
      return NextResponse.json({ error: rpcError.message }, { status: 500 });
    }

    // ── result is the JSON from process_purchase ──────────────────────────
    const parsed = typeof result === "string" ? JSON.parse(result) : result;

    if (parsed?.status === "error") {
      return NextResponse.json({ error: parsed.message }, { status: 500 });
    }

    return NextResponse.json({
      ...parsed,
      lesson_title:  lesson.title,
      course_code:   lesson.course_code,
      faculty:       lesson.faculty,
    });

  } catch (err) {
    console.error("[purchase] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
