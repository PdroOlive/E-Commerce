import { Request, Response } from "express";
import { ProductTypes } from "../../types/types.js";
import { prisma } from "../../lib/prisma.js";

export const createProduct = async (req: Request, res: Response) => {
  const { name, price, image } = req.body as unknown as ProductTypes;

  if (!name || !price || !image) {
    return res.status(400).json({ message: "Missing required fields" });
  }


  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        price,
        image
      }
    });
    return res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error: Error | any) {
    return res.status(500).json({ message: "Error creating product", error: error.message });
  }
}