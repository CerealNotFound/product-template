import { createClient } from "@/utils/supabase/server";

const sampleModels = [
  {
    name: "DeepSeek Chat v3",
    symbol: "deepseek/deepseek-chat-v3-0324:free",
  },
  {
    name: "Gemini 2.0 Flash",
    symbol: "google/gemini-2.0-flash-exp:free",
  },
  {
    name: "Qwen 3 32B",
    symbol: "qwen/qwen3-32b:free",
  },
  {
    name: "Mistral Nemo",
    symbol: "mistralai/mistral-nemo:free",
  },
  {
    name: "Llama 4 Maverick",
    symbol: "meta-llama/llama-4-maverick:free",
  },
  {
    name: "Kimi Dev 72B",
    symbol: "moonshotai/kimi-dev-72b:free",
  },
];

export async function seedModels() {
  const supabase = await createClient();

  // Check if models already exist
  const { data: existingModels } = await supabase.from("models").select("name");

  if (existingModels && existingModels.length > 0) {
    console.log("Models already seeded, skipping...");
    return;
  }

  // Insert sample models
  const { data, error } = await supabase
    .from("models")
    .insert(sampleModels)
    .select();

  if (error) {
    console.error("Error seeding models:", error);
    throw error;
  }

  console.log("Successfully seeded models:", data);
  return data;
}
