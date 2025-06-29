import { createClient } from "@/utils/supabase/server";

const sampleModels = [
  {
    name: "GPT-4",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1200px-ChatGPT_logo.svg.png",
  },
  {
    name: "Claude-3-Opus",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Anthropic_logo.svg/1200px-Anthropic_logo.svg.png",
  },
  {
    name: "Claude-3-Sonnet",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Anthropic_logo.svg/1200px-Anthropic_logo.svg.png",
  },
  {
    name: "Gemini-Pro",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png",
  },
  {
    name: "Llama-3-70B",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Meta_logo.svg/1200px-Meta_logo.svg.png",
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
