import { Request, Response } from "express"
import { prisma } from "../utils/prisma"
import { asyncHandler } from "../middleware/asyncHandler";
import { ApiError } from "../utils/ApiError";

function getUserId(req: Request): string {
  const userId = req.headers["x-user-id"] as string;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  return userId;
}

export const getProfileController = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserId(req)

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,

      phone: true,
      createdAt: true,
    },
  })

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.json(user)
});

export const updateProfileController = asyncHandler(async (req: Request, res: Response) => {
  const userId = getUserId(req) // userID

  const { name, phone } = req.body

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      phone,
    },
  })

  res.json({
    id: user.id,
    name: user.name,
    phone: user.phone,
  })
});

