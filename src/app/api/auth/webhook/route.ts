import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const formData = await request.formData();
  const email = String(formData.get("email"));
  const event = String(formData.get("event"));
  const supabase = createRouteHandlerClient({ cookies });

  if (event === "SIGNED_IN" || event === "USER_CREATED") {
    // Fetch the user's details
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Determine the role (you might want to adjust this logic based on your needs)
      const role = user.user_metadata.role || "driver"; // Default to 'driver' if not specified

      // Insert or update the user in your custom users table
      const { error } = await supabase.from("users").upsert(
        {
          id: user.id,
          email: user.email,
          role: role,
          created_at: user.created_at,
          last_sign_in_at: new Date().toISOString(),
        },
        {
          onConflict: "id",
          update: ["last_sign_in_at", "role"], // Update these fields if the user already exists
        }
      );

      if (error) {
        console.error("Error updating user:", error);
        return NextResponse.json(
          { error: "Failed to update user" },
          { status: 400 }
        );
      }
    }
  }

  return NextResponse.json({
    message: `Webhook received for event: ${event}`,
  });
}
