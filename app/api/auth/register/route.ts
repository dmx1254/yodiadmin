import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/dbase";
import User from "@/lib/models/user";
// import VerificationModel from "@/lib/models/verification";
// import { SignupSuccessTemplate } from "@/components/signup-success-template";

// const resend = new Resend(process.env.RESEND_SERVICESMS_API_KEY);

connectDB();

export async function POST(req: Request) {
  const data = await req.json();
  const { phone, email } = data;
  const isUserAlreadyEmailExist = await User.findOne({
    email: email,
  });
  if (isUserAlreadyEmailExist) {
    return NextResponse.json(
      { error: "Cette adresse email est déjà utilisée" },
      { status: 400 }
    );
  }

  try {
    const isUserAlreadyPhoneExist = await User.findOne({
      phone: phone,
    });
    if (isUserAlreadyPhoneExist) {
      return NextResponse.json(
        { error: "Cette numéro de téléphone est déjà utilisée" },
        { status: 400 }
      );
    }


    const sendOtp = await fetch(`${process.env.AXIOMTEXT_API_URL}send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.AXIOMTEXT_API_KEY!}`,
      },
      body: JSON.stringify({ phone, signature: "yodi" }),
    });

    const sendOtpData = await sendOtp.json();

    if (sendOtpData.success) {
      return NextResponse.json({ message: "Code OTP envoyé" }, { status: 200 });
    }

    return NextResponse.json(
      { errorMessage: sendOtpData.error || "Code OTP invalide" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Erreur d'inscription:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'inscription" },
      { status: 500 }
    );
  }
}

// Route pour vérifier le code
// export async function PUT(req: Request) {
//   try {
//     const { email, code } = await req.json();

//     const verification = await VerificationModel.findOne({
//       email,
//       code,
//       expiresAt: { $gt: new Date() },
//     });

//     if (!verification) {
//       return NextResponse.json(
//         { error: "Code invalide ou expiré" },
//         { status: 400 }
//       );
//     }

//     // Créer l'utilisateur avec les données stockées
//     await User.create(verification.userData);

//     // Supprimer le code de vérification
//     await VerificationModel.deleteOne({ _id: verification._id });

//     // Envoyer l'email de succès à l'utilisateur
//     await resend.emails.send({
//       from: "yodi <noreply@axiomtext.com>",
//       to: email,
//       subject: "Inscription réussie - yodi",
//       react: SignupSuccessTemplate({
//         firstname: verification.userData.firstname,
//         lastname: verification.userData.lastname,
//       }) as React.ReactElement,
//     });

//     return NextResponse.json(
//       { message: "Inscription validée avec succès" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Erreur de vérification:", error);
//     return NextResponse.json(
//       { error: "Erreur lors de la vérification" },
//       { status: 500 }
//     );
//   }
// }
