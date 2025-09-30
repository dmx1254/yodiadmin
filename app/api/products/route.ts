import { NextResponse } from "next/server";
import Product from "@/lib/models/product";
import { connectDB } from "@/lib/db/dbase";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]/option";

connectDB();

export async function GET(req: Request) {
  try {
    const isAuthentication = await getServerSession(options);
    if (!isAuthentication) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    const skip = (page - 1) * limit;

    // Construire le filtre
    const filter: any = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { sku: { $regex: search, $options: "i" } },
      ];
    }
    if (category && category !== "all") {
      filter.category = category;
    }

    // Récupérer le nombre total de produits
    const total = await Product.countDocuments(filter);

    // Récupérer les produits avec pagination
    const products = await Product.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ updatedAt: -1 });

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    console.error("Erreur lors de la récupération des produits:", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des produits" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const isAuthentication = await getServerSession(options);
    if (!isAuthentication) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error: unknown) {
    console.error("Erreur lors de la création du produit:", error);
    return NextResponse.json(
      { message: "Erreur lors de la création du produit" },
      { status: 500 }
    );
  }
} 