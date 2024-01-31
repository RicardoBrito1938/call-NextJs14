import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  return Response.json(request.body, {
    status: 200,
    headers: {
      "content-type": "application/json",
    },
  });
}

export async function POST(request: Request) {
  const requestBody = await request.json();
  const { name, username } = requestBody;

  const user = await prisma.user.create({
    data: {
      name,
      username,
    },
  });

  return Response.json(user, {
    status: 201,
  });
}
