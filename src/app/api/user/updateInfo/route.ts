import { createClient } from "@/utils/supabase/server";

// Interface for user update details - can be extended in the future
interface UserUpdateDetails {
  name: string;
  // Add more fields here as needed in the future
  // email?: string;
  // avatar_url?: string;
  // phone?: string;
  // etc.
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const body: UserUpdateDetails = await request.json();

    // Validate that name is provided
    if (!body.name || typeof body.name !== "string") {
      return Response.json(
        { error: "Name is required and must be a string" },
        {
          status: 400,
        }
      );
    }

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return Response.json(
        { error: "User not authenticated" },
        {
          status: 401,
        }
      );
    }

    // Update user profile in the profiles table
    const { data, error } = await supabase
      .from("profiles")
      .update({
        name: body.name,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select();

    if (error) {
      console.error("Supabase update error:", error);
      return Response.json(
        { error: error.message },
        {
          status: 500,
        }
      );
    }

    return Response.json(
      {
        message: "User updated successfully",
        user: data[0],
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Update info error:", error);
    return Response.json(
      { error: "Internal server error" },
      {
        status: 500,
      }
    );
  }
}
