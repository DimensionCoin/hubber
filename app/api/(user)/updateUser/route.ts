import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/db";
import User from "@/modals/user.modal";

export async function POST(req: NextRequest) {
  try {
    await connect();
    const {
      clerkId,
      firstName,
      lastName,
      email,
      subscriptionTier,
      newPassword,
    } = await req.json();

    if (!clerkId) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    console.log(`Updating user with Clerk ID: ${clerkId}`);

    // ✅ Update MongoDB User
    const updateFields: Record<string, any> = {};
    if (firstName) updateFields.firstName = firstName;
    if (lastName) updateFields.lastName = lastName;
    if (email) updateFields.email = email;
    if (subscriptionTier) updateFields.subscriptionTier = subscriptionTier;

    const updatedUser = await User.findOneAndUpdate({ clerkId }, updateFields, {
      new: true,
    });

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Update Password in Clerk if Provided
    if (newPassword) {
      console.log(`Attempting to update password for user: ${clerkId}`);

      const passwordResponse = await fetch(
        `https://api.clerk.dev/v1/users/${clerkId}`,
        {
          method: "PATCH", // ✅ PATCH instead of PUT
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          },
          body: JSON.stringify({ password: newPassword }),
        }
      );

      if (!passwordResponse.ok) {
        let errorData = null;

        // ✅ Safely attempt to parse JSON response
        try {
          errorData = await passwordResponse.json();
        } catch (err) {
          console.error("Clerk password update failed: Empty response");
        }

        console.error(
          "Clerk password update failed:",
          errorData || passwordResponse.statusText
        );

        return NextResponse.json(
          {
            error:
              errorData?.errors?.[0]?.long_message ||
              "Failed to update password",
          },
          { status: passwordResponse.status }
        );
      }

      console.log(`Password updated successfully for user: ${clerkId}`);
    }

    return NextResponse.json(
      { message: "User updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
