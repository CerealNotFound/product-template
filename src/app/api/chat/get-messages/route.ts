import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getCurrentUser } from "@/lib/auth-utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get("conversation_id");

    if (!conversationId) {
      return NextResponse.json(
        { error: "conversation_id is required" },
        { status: 400 }
      );
    }

    // Get current authenticated user
    const user = await getCurrentUser();
    const supabase = await createClient();

    // First verify the conversation belongs to the current user
    const { data: conversation, error: conversationError } = await supabase
      .from("conversations")
      .select("id")
      .eq("id", conversationId)
      .eq("user_id", user.id)
      .single();

    if (conversationError || !conversation) {
      return NextResponse.json(
        { error: "Conversation not found or access denied" },
        { status: 404 }
      );
    }

    // Get all prompts for the conversation
    const { data: prompts, error: promptsError } = await supabase
      .from("prompts")
      .select(
        `
        id,
        content,
        created_at,
        responses (
          id,
          content,
          created_at,
          models (
            id,
            name
          )
        )
      `
      )
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });

    if (promptsError) {
      console.error("Error fetching messages:", promptsError);
      return NextResponse.json(
        { error: "Failed to fetch messages" },
        { status: 500 }
      );
    }

    // Transform the data to match the expected response format
    const messages =
      prompts?.map((prompt) => ({
        prompt: prompt.content,
        created_at: prompt.created_at,
        responses:
          prompt.responses?.map((response: any) => ({
            model_id: response.models?.id,
            model_name: response.models?.name,
            content: response.content,
            created_at: response.created_at,
          })) || [],
      })) || [];

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error in get-messages:", error);
    if (error instanceof Error && error.message === "User not authenticated") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
