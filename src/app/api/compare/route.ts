import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ids } = body as { ids: number[] };

    if (!ids || !Array.isArray(ids) || ids.length < 2 || ids.length > 3) {
      return Response.json(
        { error: "Please provide 2-3 college IDs to compare" },
        { status: 400 }
      );
    }

    const colleges = await prisma.college.findMany({
      where: { id: { in: ids } },
      include: { courses: true },
    });

    if (colleges.length < 2) {
      return Response.json(
        { error: "Could not find enough colleges to compare" },
        { status: 404 }
      );
    }

    // Determine best values for highlighting
    const bestValues = {
      lowestFees: Math.min(...colleges.map((c) => c.fees)),
      highestRating: Math.max(...colleges.map((c) => c.rating)),
      highestPlacement: Math.max(
        ...colleges.map((c) => c.placementPercentage)
      ),
      oldestEstablished: Math.min(
        ...colleges.map((c) => c.establishedYear)
      ),
    };

    return Response.json({ colleges, bestValues });
  } catch (error) {
    console.error("Error comparing colleges:", error);
    return Response.json(
      { error: "Failed to compare colleges" },
      { status: 500 }
    );
  }
}
