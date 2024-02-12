"use server";

import { prisma } from "@/lib/prisma";

export interface IUser {
  name: string;
  bio: string | null;
  avatarUrl: string | null;
}

export const getUser = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) return null;

  const userFormatted: IUser = {
    name: user.name,
    bio: user.bio,
    avatarUrl: user.avatar_url,
  };

  return userFormatted;
};
