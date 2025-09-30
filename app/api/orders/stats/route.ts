import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Order from "@/lib/models/order";
import { options } from "@/app/api/auth/[...nextauth]/option";
import { connectDB } from "@/lib/db/dbase";

await connectDB();

export async function GET() {
  const session = await getServerSession(options);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    // Statistiques des commandes par statut
    const statusStats = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$total" }
        }
      }
    ]);

    // Statistiques des commandes par mois (6 derniers mois)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 },
          totalAmount: { $sum: "$total" }
        }
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]);

    // Statistiques des commandes par zone de livraison
    const shippingZoneStats = await Order.aggregate([
      {
        $group: {
          _id: "$shippingInfo.delivery",
          count: { $sum: 1 },
          totalAmount: { $sum: "$total" }
        }
      }
    ]);

    // Normaliser les données pour le frontend
    const normalizedStatusStats = statusStats.reduce((acc, stat) => {
      acc[stat._id] = {
        count: stat.count,
        totalAmount: stat.totalAmount
      };
      return acc;
    }, {});

    const normalizedMonthlyStats = monthlyStats.map(stat => ({
      month: `${stat._id.year}-${String(stat._id.month).padStart(2, '0')}`,
      count: stat.count,
      totalAmount: stat.totalAmount
    }));

    const normalizedShippingZoneStats = shippingZoneStats.map(stat => ({
      zone: stat._id || 'Non spécifiée',
      count: stat.count,
      totalAmount: stat.totalAmount
    }));

    return NextResponse.json({
      statusStats: normalizedStatusStats,
      monthlyStats: normalizedMonthlyStats,
      shippingZoneStats: normalizedShippingZoneStats
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
} 