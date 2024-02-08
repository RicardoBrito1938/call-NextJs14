import { getServerSession } from "next-auth/next";
import { GET, POST } from "../../auth/[...nextauth]/route";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, GET);

  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  return res.json({
    message: "Success",
  });
}
