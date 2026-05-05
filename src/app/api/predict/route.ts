import { prisma } from "@/lib/prisma";
import { findMatchingRule } from "@/lib/predictor";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { exam, rank } = body as { exam: string; rank: number };

    if (!exam || !rank || rank < 1) {
      return Response.json(
        { error: "Please provide a valid exam and rank" },
        { status: 400 }
      );
    }

    const rule = findMatchingRule(exam, rank);

    if (!rule) {
      return Response.json({
        colleges: [],
        message: "No colleges found for this exam and rank combination. Try a different rank range.",
        exam,
        rank,
      });
    }

    // Filter by acceptedExams (the critical fix) + rating threshold
    const colleges = await prisma.college.findMany({
      where: {
        acceptedExams: { hasSome: rule.acceptedExams },
        rating: { gte: rule.minRating },
        ...(rule.maxFees ? { fees: { lte: rule.maxFees } } : {}),
      },
      orderBy: [{ rating: "desc" }, { placementPercentage: "desc" }],
      include: { courses: true },
    });

    return Response.json({
      colleges,
      exam,
      rank,
      matchedRule: {
        rankRange: `${rule.minRank} - ${rule.maxRank}`,
        acceptedExams: rule.acceptedExams,
        minRating: rule.minRating,
      },
      message:
        colleges.length > 0
          ? `Based on your ${exam} rank ${rank}, ${colleges.length} colleges are strong matches considering placement performance and affordability.`
          : "No colleges match this criteria currently",
    });
  } catch (error) {
    console.error("Error predicting colleges:", error);
    return Response.json(
      { error: "Failed to predict colleges" },
      { status: 500 }
    );
  }
}
