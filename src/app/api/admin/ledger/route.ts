/**
 * GET /api/admin/ledger
 *
 * Server-side route — calls the get_ledger_summary() Postgres RPC
 * using the service-role key so it can bypass RLS on platform_ledger.
 *
 * In production, add your own admin auth check here before returning data.
 */

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    // Use service-role key to bypass RLS on platform_ledger
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data, error } = await sb.rpc("get_ledger_summary");

    if (error) {
      console.error("[admin/ledger] RPC error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // data is JSON from the RPC
    const parsed = typeof data === "string" ? JSON.parse(data) : data;
    return NextResponse.json(parsed);

  } catch (err) {
    console.error("[admin/ledger] Unexpected:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
