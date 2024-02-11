import { z } from "zod";
import { auth } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

const updateProfileBodySchema = z.object({
  bio: z.string(),
});

export async function PUT(request: Request) {
  const session = await auth();
  const requestBody = await request.json();

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { bio } = updateProfileBodySchema.parse(requestBody);

  await prisma.user.update({
    where: {
      id: session.user?.id,
    },
    data: {
      bio,
    },
  });

  //CQRS = Command Query Responsibility Segregation
  return new Response(null, { status: 204 });
}
