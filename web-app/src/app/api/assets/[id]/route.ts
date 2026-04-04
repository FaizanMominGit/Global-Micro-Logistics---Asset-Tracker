import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const asset = await prisma.asset.findUnique({
      where: { id },
      include: {
        history: {
          orderBy: { timestamp: "desc" },
          take: 50,
        },
      },
    });

    if (!asset) {
      return NextResponse.json({ error: "Asset not found" }, { status: 404 });
    }

    return NextResponse.json(asset);
  } catch (error) {
    console.error("GET Asset History Error:", error);
    return NextResponse.json({ error: "Failed to fetch asset history" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { speed, status } = body;

    const updatedAsset = await prisma.asset.update({
      where: { id },
      data: {
        ...(speed !== undefined && { speed: parseFloat(speed) }),
        ...(status && { status }),
      },
    });

    return NextResponse.json(updatedAsset);
  } catch (error) {
    console.error("PATCH Asset Error:", error);
    return NextResponse.json({ error: "Failed to update asset" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // First delete all location history for this asset to maintain referential integrity
    await prisma.locationHistory.deleteMany({
      where: { assetId: id },
    });

    // Then delete the asset itself
    await prisma.asset.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Asset decommissioned successfully" });
  } catch (error) {
    console.error("DELETE Asset Error:", error);
    return NextResponse.json({ error: "Failed to decommission asset" }, { status: 500 });
  }
}

