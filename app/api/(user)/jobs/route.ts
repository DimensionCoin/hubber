import { NextResponse } from "next/server";
import { createJob, updateJob, deleteJob } from "@/actions/job.actions";

/**
 * ✅ Create a new job (Requires authentication)
 */
export async function POST(req: Request) {
  try {
    const jobData = await req.json();

    if (!jobData.clientId) {
      return NextResponse.json(
        { success: false, error: "Client ID is required" },
        { status: 400 }
      );
    }

    if (!jobData.location) {
      return NextResponse.json(
        { success: false, error: "Location is required" },
        { status: 400 }
      );
    }

    const result = await createJob(jobData);
    return NextResponse.json(result);
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
}


/**
 * ✅ Update an existing job (Requires authentication)
 */
export async function PATCH(req: Request) {
  try {
    const { jobId, updatedData } = await req.json();

    if (updatedData.location) {
      if (
        !updatedData.location.street ||
        !updatedData.location.city ||
        !updatedData.location.stateOrProvince ||
        !updatedData.location.postalCodeOrZip ||
        !updatedData.location.country
      ) {
        return NextResponse.json(
          { success: false, error: "All location fields are required." },
          { status: 400 }
        );
      }
    }

    const result = await updateJob(jobId, updatedData);
    return NextResponse.json(result);
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
}

/**
 * ✅ Delete a job (Requires authentication)
 */
export async function DELETE(req: Request) {
  try {
    const { jobId } = await req.json();
    const result = await deleteJob(jobId);
    return NextResponse.json(result);
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
}
