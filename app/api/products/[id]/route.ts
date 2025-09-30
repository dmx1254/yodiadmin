import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/dbase";
import Product from "@/lib/models/product";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/option";

connectDB();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const isAuthentication = await getServerSession(options);
    if (!isAuthentication) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json(
        { error: "Produit non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Erreur lors de la récupération du produit:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du produit" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const isAuthentication = await getServerSession(options);
    if (!isAuthentication) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const data = await req.json();
 

    const product = await Product.findByIdAndUpdate(
      id,
      {
        $set: data,
      },
      { new: true, runValidators: true }
    );

    if (!product) {
      return NextResponse.json(
        { error: "Produit non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Erreur lors de la modification du produit:", error);
    return NextResponse.json(
      { error: "Erreur lors de la modification du produit" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const isAuthentication = await getServerSession(options);
    if (!isAuthentication) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        { error: "Produit non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Produit supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du produit:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du produit" },
      { status: 500 }
    );
  }
}
