import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await auth();

  // Validate authorization
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized access to Danger Zone API." }, { status: 403 });
  }

  try {
    // Purge operating intelligence
    await prisma.asset.deleteMany();
    // (LocationHistory is cascaded automatically)

    // Reseed original coordinates
    const assets = [
      { id: "SH-102", name: "Ever Given II", type: "ship", lat: 25.2048, lng: 55.2708, status: "active", speed: 22 },
      { id: "TR-505", name: "Euro Hauler", type: "truck", lat: 48.8566, lng: 2.3522, status: "active", speed: 65 },
      { id: "PL-707", name: "Global Air Freight", type: "plane", lat: 40.7128, lng: -74.0060, status: "active", speed: 450 },
      { id: "SH-404", name: "Pacific Carrier", type: "ship", lat: 35.6762, lng: 139.6503, status: "delayed", speed: 12 },
      { id: "TR-808", name: "Desert Runner", type: "truck", lat: -33.8688, lng: 151.2093, status: "active", speed: 70 },
      { id: "TR-909", name: "Nordic Hauler", type: "truck", lat: 59.3293, lng: 18.0686, status: "offline", speed: 0 },
    ];

    for (const asset of assets) {
      await prisma.asset.create({
        data: asset
      });
    }

    return NextResponse.json({ success: true, message: "Factory Data Reset Complete!" });
  } catch (error) {
    console.error("Factory Reset Error:", error);
    return NextResponse.json({ error: "Failed to reset telemetry arrays." }, { status: 500 });
  }
}
