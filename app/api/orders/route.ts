import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Order from "@/lib/models/order";
import { options } from "@/app/api/auth/[...nextauth]/option";
import { connectDB } from "@/lib/db/dbase";

await connectDB();

export async function GET(req: Request) {
  const session = await getServerSession(options);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    const skip = (page - 1) * limit;

    // Construire le filtre
    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { "userId.firstname": { $regex: search, $options: "i" } },
        { "userId.lastname": { $regex: search, $options: "i" } },
        { "userId.email": { $regex: search, $options: "i" } },
      ];
    }
    if (status && status !== "all") {
      filter.status = status;
    }

    // Récupérer le nombre total de commandes
    const total = await Order.countDocuments(filter);

    // Récupérer les commandes avec pagination
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'firstname lastname email')
      .lean();

    // Ensure all orders have a status field
    const normalizedOrders = orders.map(order => ({
      ...order,
      status: order.status || "pending"
    }));

    return NextResponse.json({
      orders: normalizedOrders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
} 