import { NextResponse } from "next/server";
import Job from "@/modals/job.model";
import Client from "@/modals/client.model"; // Import the Client model
import { connect } from "@/db";

/**
 * ✅ Public API: Get all jobs for a company (No authentication required)
 */
export async function GET(req: Request) {
  try {
    await connect();

    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get("companyId");

    if (!companyId) {
      return NextResponse.json(
        { success: false, error: "Company ID is required" },
        { status: 400 }
      );
    }

    console.log("🚀 Fetching jobs for companyId:", companyId);

    // ✅ Populate client details correctly
    const jobs = await Job.find({ companyId })
      .populate({
        path: "clientId",
        model: Client, // Explicitly specify the Client model
        select: "firstName lastName company",
      })
      .lean();

    console.log("✅ Jobs found:", jobs.length);

    return NextResponse.json({ success: true, jobs }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching jobs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
