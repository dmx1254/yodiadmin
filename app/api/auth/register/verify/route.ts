import User from "@/lib/models/user";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/dbase";

import bcrypt from "bcrypt";

await connectDB();

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const {
      data: { password, code, ...rest },
    } = data;

    // console.log(password);
    // console.log(code);
    // console.log(rest);

    const verifyOtp = await fetch(`${process.env.AXIOMTEXT_API_URL}verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.AXIOMTEXT_API_KEY!}`,
      },
      body: JSON.stringify({ phone: rest.phone, code }),
    });

    const verifyOtpData = await verifyOtp.json();

    if (!verifyOtpData.success) {
      return NextResponse.json(
        { errorMessage: verifyOtpData.error || "Code OTP invalide" },
        { status: 500 }
      );
    }

    // console.log("verifyOtpData", verifyOtpData);

    const newUser = {
      ...rest,
    };

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
      ...newUser,
      password: hashedPassword,
    };

    await User.create(userData);

    // console.log("verifyOtpData", verifyOtpData);

    return NextResponse.json(
      { message: "Inscription réussie" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { errorMessage: "Erreur lors de l'inscription" },
      { status: 500 }
    );
  }
}
