import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { licenseKey } = await request.json();

    // Validate input
    if (!licenseKey || typeof licenseKey !== "string") {
      return NextResponse.json(
        { success: false, error: "License key is required" },
        { status: 400 }
      );
    }

    // Mock validation logic
    // TODO: Replace with actual API endpoint
    if (licenseKey.trim() === "MOCK_CODE") {
      return NextResponse.json({
        success: true,
        message: "License activated successfully",
        isPro: true,
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid license key" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("License activation error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
