import { Request, Response } from "express"
import { prisma } from "../utils/prisma"

function getUserId(req: Request): string {
  const userId = req.headers["x-user-id"] as string;
  
  if (!userId) {
    throw new Error("Unauthorized");
  }
  
  return userId;
}

export const getProfileController = async (req: Request, res: Response) => {
  try {
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
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user)
  } catch (err: any) {
    res.status(401).json({ message: "Unauthorized" })
  }
}

export const updateProfileController = async (req: Request, res: Response) => {
  try {
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
  } catch (err: any) {
    res.status(401).json({ message: "Unauthorized" })
  }
}
