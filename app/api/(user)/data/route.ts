import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId) {
    return NextResponse.json({ message: "Not Authenticated" }, { status: 401 });
  }

  // Find the primary verified email, ensuring `verification` is not null
  const primaryEmail = user?.emailAddresses?.find(
    (email) => email.verification?.status === "verified" // Safe check with optional chaining
  )?.emailAddress;

  return NextResponse.json(
    {
      message: "Authenticated",
      data: {
        userId: userId,
        firstname: user?.firstName,
        lastname: user?.lastName,
        primaryEmail: primaryEmail || null, // Ensures primary email is a valid email or null
        linkedEmails:
          user?.emailAddresses?.map((email) => email.emailAddress) || [], // All linked emails
      },
    },
    { status: 200 }
  );
}
