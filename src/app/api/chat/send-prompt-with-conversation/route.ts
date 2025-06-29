import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { generateResponsesFromModels } from "@/lib/chat-utils";

export async function POST(request: NextRequest) {
  try {
    const { content, model_ids, conversation_title, conversation_id } =
      await request.json();

    if (!content || !model_ids || !Array.isArray(model_ids)) {
      return NextResponse.json(
        { error: "content and model_ids array are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get current authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    let finalConversationId = conversation_id;

    // Step 1: Create a new conversation if none provided
    if (!finalConversationId) {
      const conversationTitle =
        conversation_title || `Chat - ${new Date().toLocaleString()}`;

      const { data: conversationData, error: conversationError } =
        await supabase
          .from("conversations")
          .insert({
            title: conversationTitle,
            user_id: user.id,
          })
          .select("id")
          .single();

      if (conversationError) {
        console.error("Error creating conversation:", conversationError);
        return NextResponse.json(
          { error: "Failed to create conversation" },
          { status: 500 }
        );
      }

      finalConversationId = conversationData.id;
    } else {
      // Verify the existing conversation belongs to the current user
      const { data: conversation, error: conversationError } = await supabase
        .from("conversations")
        .select("id")
        .eq("id", finalConversationId)
        .eq("user_id", user.id)
        .single();

      if (conversationError || !conversation) {
        return NextResponse.json(
          { error: "Conversation not found or access denied" },
          { status: 404 }
        );
      }
    }

    // Step 2: Store the prompt
    const { data: promptData, error: promptError } = await supabase
      .from("prompts")
      .insert({
        conversation_id: finalConversationId,
        content,
      })
      .select("id")
      .single();

    if (promptError) {
      console.error("Error storing prompt:", promptError);
      return NextResponse.json(
        { error: "Failed to store prompt" },
        { status: 500 }
      );
    }

    // Step 3: Get model details for the requested model_ids
    const { data: models, error: modelsError } = await supabase
      .from("models")
      .select("id, name")
      .in("id", model_ids);

    if (modelsError) {
      console.error("Error fetching models:", modelsError);
      return NextResponse.json(
        { error: "Failed to fetch models" },
        { status: 500 }
      );
    }

    // Step 4: Generate responses using the utility function with conversation history
    const generatedResponses = await generateResponsesFromModels(
      models,
      content,
      finalConversationId
    );

    // Step 5: Store all responses in the database
    const responsePromises = generatedResponses.map(async (response) => {
      const { error: responseError } = await supabase.from("responses").insert({
        prompt_id: promptData.id,
        model_id: response.model_id,
        content: response.content,
      });

      if (responseError) {
        console.error(
          `Error storing response for model ${response.model_id}:`,
          responseError
        );
        return null;
      }

      return response;
    });

    const storedResponses = await Promise.all(responsePromises);
    const validResponses = storedResponses.filter(
      (response) => response !== null
    );

    return NextResponse.json({
      conversation_id: finalConversationId,
      prompt_id: promptData.id,
      responses: validResponses,
    });
  } catch (error) {
    console.error("Error in send-prompt-with-conversation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
