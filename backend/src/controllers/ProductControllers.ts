import { Request, Response } from "express";
import { ProductTypes } from "../../types/types.js";
import { prisma } from "../../lib/prisma.js";
import { JwtPayload } from "jsonwebtoken";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany();
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error fetching products", error: (error as Error).message });
  }
}

export const createProduct = async (req: Request, res: Response) => {
  const user = req.user as JwtPayload;

  const { name, price, image } = req.body as unknown as ProductTypes;
  if (!name || !price || !image) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }


  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        price,
        image,
        userId: user.id as number
      }
    });
    return res.status(201).json({ success: true, message: "Product created successfully", data: newProduct });
  } catch (error: Error | any) {
    return res.status(500).json({ success: false, message: "Error creating product", error: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const dataBody = req.body as unknown as ProductTypes;
  
  if (!id) return res.status(400).json({ success: false, message: "Product ID is required" });

  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: dataBody.name,
        price: dataBody.price,
        image: dataBody.image
      }
    });
    return res.status(200).json({ success: true, message: "Product updated successfully", data: updatedProduct });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Error updating product", error: (error as Error).message });
  }
};


export const deleteProduct = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!id) return res.status(400).json({ success: false, message: "Product ID is required" });

  try {
    await prisma.product.delete({
      where: { id }
    });
    return res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error deleting product", error: (error as Error).message });
  }
};


