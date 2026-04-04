import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {
    const assets = await prisma.asset.findMany();
    
      // Simulate real-time GPS progression with realistic speed-based increments
      const updates = assets.map(asset => {
        if (asset.status === "offline") return Promise.resolve();

        // Calculate a realistic delta based on speed (mph) / 3600 (s) * 2.5 (s)
        // 1 degree approx 69 miles. So (speed * 2.5 / 3600) / 69 degrees.
        const distancePerUpdate = (asset.speed * 2.5) / 3600;
        const degreeDelta = distancePerUpdate / 69;

        const latJitter = (Math.random() - 0.5) * degreeDelta * 2;
        const lngJitter = (Math.random() - 0.5) * degreeDelta * 2;
        const newLat = asset.lat + latJitter;
        const newLng = asset.lng + lngJitter;

      return prisma.asset.update({
        where: { id: asset.id },
        data: {
          lat: newLat,
          lng: newLng,
          history: {
            create: {
              lat: newLat,
              lng: newLng,
            }
          }
        }
      });
    });

    await Promise.all(updates);

    return NextResponse.json({ message: "Assets successfully synchronized" });
  } catch (error) {
    console.error("Sync Error:", error);
    return NextResponse.json({ error: "Failed to synchronize asset locations" }, { status: 500 });
  }
}
