import { createClient } from "@/utils/supabase/server";
import {
  ChatHistoryMessage,
  OpenRouterMessage,
  OpenRouterRequest,
  OpenRouterResponse,
} from "./types";

export interface ChatResponse {
  model_id: string;
  content: string;
}

export interface SendPromptResult {
  prompt_id: string;
  responses: ChatResponse[];
}

// Function to fetch chat history for a conversation
export async function fetchConversationHistory(
  conversationId: string
): Promise<ChatHistoryMessage[]> {
  const supabase = await createClient();

  // Get all prompts and responses for the conversation
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
    console.error("Error fetching conversation history:", promptsError);
    return [];
  }

  // Transform the data into the required format for OpenRouter
  const messages: ChatHistoryMessage[] = [];

  prompts?.forEach((prompt) => {
    // Add user message
    messages.push({
      role: "user",
      content: prompt.content,
      timestamp: prompt.created_at,
    });

    // Add assistant responses (we'll use the first response as the assistant's reply)
    // In a real implementation, you might want to handle multiple responses differently
    if (prompt.responses && prompt.responses.length > 0) {
      const firstResponse = prompt.responses[0];
      messages.push({
        role: "assistant",
        content: firstResponse.content,
        timestamp: firstResponse.created_at,
      });
    }
  });

  return messages;
}

// Actual OpenRouter integration function
export async function generateOpenRouterResponse(
  modelName: string,
  prompt: string,
  conversationId?: string
): Promise<string> {
  try {
    // Fetch conversation history if conversationId is provided
    let messages: ChatHistoryMessage[] = [];

    if (conversationId) {
      messages = await fetchConversationHistory(conversationId);
    }

    // Add the current prompt
    messages.push({
      role: "user",
      content: prompt,
      timestamp: new Date().toISOString(),
    });

    // Convert to OpenRouter format (without timestamp)
    const openRouterMessages: OpenRouterMessage[] = messages.map(
      ({ role, content }) => ({
        role,
        content,
      })
    );

    // Make the API call to OpenRouter
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer":
            process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
          "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || "Chat Playground",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: modelName,
          messages: openRouterMessages,
        } as OpenRouterRequest),
      }
    );

    if (!response.ok) {
      throw new Error(
        `OpenRouter API error: ${response.status} ${response.statusText}`
      );
    }

    const data: OpenRouterResponse = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Invalid response format from OpenRouter");
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error calling OpenRouter API:", error);

    // Fallback to dummy response if OpenRouter fails
    return generateDummyResponse(modelName, prompt);
  }
}

// Dummy function to simulate AI model responses (fallback)
export async function generateDummyResponse(
  modelName: string,
  prompt: string
): Promise<string> {
  // Simulate API delay
  await new Promise((resolve) =>
    setTimeout(resolve, Math.random() * 1000 + 500)
  );

  const responses = [
    `This is a simulated response from ${modelName}. I understand you asked: "${prompt}". Here's my perspective on this matter...`,
    `As ${modelName}, I would approach this question by considering multiple factors. Your prompt "${prompt}" raises interesting points that deserve careful analysis.`,
    `${modelName} here! Regarding "${prompt}", I believe this is a fascinating topic that requires nuanced understanding. Let me share my thoughts...`,
    `From ${modelName}'s perspective, "${prompt}" touches on important concepts. Here's what I think about this...`,
    `As an AI model called ${modelName}, I find your question "${prompt}" quite intriguing. Let me provide a thoughtful response...`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

// Core function for generating responses from multiple models
// This function now handles AI response generation with chat history
export async function generateResponsesFromModels(
  models: Array<{ id: string; name: string }>,
  prompt: string,
  conversationId?: string
): Promise<Array<{ model_id: string; content: string }>> {
  // Generate responses for each model in parallel
  const responsePromises = models.map(async (model) => {
    const responseContent = await generateOpenRouterResponse(
      model.name,
      prompt,
      conversationId
    );

    return {
      model_id: model.id,
      content: responseContent,
    };
  });

  const responses = await Promise.all(responsePromises);
  return responses;
}
