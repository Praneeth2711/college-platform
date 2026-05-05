import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const location = searchParams.get("location") || "";
    const minFees = parseInt(searchParams.get("minFees") || "0");
    const maxFees = parseInt(searchParams.get("maxFees") || "10000000");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const conditions: any[] = [];

    if (search) {
      conditions.push({
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { city: { contains: search, mode: "insensitive" } },
          { state: { contains: search, mode: "insensitive" } },
        ],
      });
    }

    if (location) {
      conditions.push({
        OR: [
          { city: { contains: location, mode: "insensitive" } },
          { state: { contains: location, mode: "insensitive" } },
          { location: { contains: location, mode: "insensitive" } },
        ],
      });
    }

    if (conditions.length > 0) {
      where.AND = conditions;
    }

    if (minFees > 0 || maxFees < 10000000) {
      where.fees = {
        gte: minFees,
        lte: maxFees,
      };
    }

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({
        where,
        skip,
        take: limit,
        orderBy: { rating: "desc" },
      }),
      prisma.college.count({ where }),
    ]);

    return Response.json({
      colleges,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching colleges:", error);
    return Response.json(
      { error: "Failed to fetch colleges" },
      { status: 500 }
    );
  }
}
