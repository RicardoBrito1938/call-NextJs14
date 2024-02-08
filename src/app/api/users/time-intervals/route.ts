import { getServerSession } from "next-auth/next";
import { config } from "../../auth/[...nextauth]/route";
import { NextApiRequest, NextApiResponse } from "next";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, config);

  console.log(res);

  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  return res.json({
    message: "Success",
  });
}
