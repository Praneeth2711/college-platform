import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const collegeId = parseInt(id);

    if (isNaN(collegeId)) {
      return Response.json({ error: "Invalid college ID" }, { status: 400 });
    }

    const college = await prisma.college.findUnique({
      where: { id: collegeId },
      include: { courses: true },
    });

    if (!college) {
      return Response.json({ error: "College not found" }, { status: 404 });
    }

    return Response.json(college);
  } catch (error) {
    console.error("Error fetching college:", error);
    return Response.json(
      { error: "Failed to fetch college" },
      { status: 500 }
    );
  }
}
