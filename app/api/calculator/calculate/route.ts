import { NextResponse } from "next/server";
import { calculateProjectEstimate } from "@/lib/calculator/pricing-engine";
import { getCalculatorConfig } from "@/lib/calculator/storage";
import type { CalculationInput } from "@/lib/calculator/types";

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as CalculationInput;

    if (!input || !input.serviceId) {
      return NextResponse.json(
        { error: "Invalid calculation input" },
        { status: 400 }
      );
    }

    const { services, features, settings } = await getCalculatorConfig();
    const result = calculateProjectEstimate(
      input,
      services,
      features,
      settings
    );

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Calculation API error:", error);
    return NextResponse.json(
      { error: "Failed to calculate estimate" },
      { status: 500 }
    );
  }
}

