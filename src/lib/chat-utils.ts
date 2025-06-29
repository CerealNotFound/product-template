import { createClient } from "@/utils/supabase/server";

export interface ChatResponse {
  model_id: string;
  content: string;
}

export interface SendPromptResult {
  prompt_id: string;
  responses: ChatResponse[];
}

// Dummy function to simulate AI model responses
// This will be replaced with actual OpenRouter integration later
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

// Future OpenRouter integration function (placeholder)
export async function generateOpenRouterResponse(
  modelName: string,
  prompt: string
): Promise<string> {
  // TODO: Implement actual OpenRouter API call
  // const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     model: modelName,
  //     messages: [{ role: 'user', content: prompt }],
  //   }),
  // })
  // const data = await response.json()
  // return data.choices[0].message.content

  // For now, use dummy response
  return generateDummyResponse(modelName, prompt);
}

// Core function for generating responses from multiple models
// This function only handles AI response generation, not database operations
export async function generateResponsesFromModels(
  models: Array<{ id: string; name: string }>,
  prompt: string
): Promise<Array<{ model_id: string; content: string }>> {
  // Generate responses for each model in parallel
  const responsePromises = models.map(async (model) => {
    const responseContent = await generateOpenRouterResponse(
      model.name,
      prompt
    );

    return {
      model_id: model.id,
      content: responseContent,
    };
  });

  const responses = await Promise.all(responsePromises);
  return responses;
}
