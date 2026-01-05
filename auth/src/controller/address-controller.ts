import { Request, Response } from "express"

import { prisma } from "../utils/prisma"

function getUserId(req: Request): string {
  const userId = req.headers["x-user-id"] as string

  if (!userId) {
    throw new Error("Unauthorized")
  }

  return userId
}

export const getAddress = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })

    res.json(addresses)
  } catch (err: any) {
    res.status(401).json({ message: "Unauthorized" })
  }
}

export const postAddress = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)
    const { label, name, phone, addressLine, city, pinCode } = req.body

    if (!addressLine || !city || !pinCode) {
      return res.status(400).json({ message: "Address incomplete" })
    }

    if (phone && phone.length < 10) {
      return res.status(400).json({ message: "Invalid phone number" })
    }

    if (String(pinCode).length !== 6) {
      return res.status(400).json({ message: "Invalid pincode" })
    }

    const count = await prisma.address.count({ where: { userId } })
    if (count >= 5) {
      return res.status(400).json({ message: "Maximum 5 addresses allowed" })
    }

    const address = await prisma.address.create({
      data: {
        userId,
        label,
        name,
        phone,
        addressLine,
        city,
        pinCode,
      },
    })

    res.json(address)
  } catch (err: any) {
    res.status(401).json({ message: "Unauthorized" })
  }
}

export const deleteAddress = async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req)
    const { id } = req.params

    const deleted = await prisma.address.deleteMany({
      where: { id, userId },
    })

    if (deleted.count === 0) {
      return res.status(404).json({ message: "Address not found" })
    }

    res.json({ message: "Address deleted" })
  } catch (err: any) {
    res.status(401).json({ message: "Unauthorized" })
  }
}
