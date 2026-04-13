import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { redis } from "@/lib/redis";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const cachedAssets = await redis.get("assets:all");
    if (cachedAssets) {
      return NextResponse.json(JSON.parse(cachedAssets));
    }

    const assets = await prisma.asset.findMany();
    
    // Cache for 5 seconds as fallback, though it's manually invalidated on sync
    await redis.set("assets:all", JSON.stringify(assets), "EX", 5);
    
    return NextResponse.json(assets);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Failed to fetch assets from database" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, type } = await req.json();
    
    // Generate random starting position for new assets within global tracking bounds
    const lat = Number((Math.random() * 120 - 60).toFixed(6));
    const lng = Number((Math.random() * 240 - 120).toFixed(6));

    const asset = await prisma.asset.create({
      data: {
        name,
        type,
        lat,
        lng,
        status: "active",
        speed: 0,
      },
    });

    await redis.del("assets:all");

    return NextResponse.json(asset);
  } catch (error) {
    console.error("Provisioning Error:", error);
    return NextResponse.json({ error: "Failed to provision new asset" }, { status: 500 });
  }
}

