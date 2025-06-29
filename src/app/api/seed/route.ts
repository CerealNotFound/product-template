import { NextResponse } from "next/server";
import { seedModels } from "@/lib/seed-models";

export async function POST() {
  try {
    const models = await seedModels();

    return NextResponse.json({
      message: "Database seeded successfully",
      models,
    });
  } catch (error) {
    console.error("Error seeding database:", error);
    return NextResponse.json(
      { error: "Failed to seed database" },
      { status: 500 }
    );
  }
}
