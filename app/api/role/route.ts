// import User from "@/lib/models/user";
// import { connectDB } from "@/lib/db/dbase";
// import { NextResponse } from "next/server";

// connectDB();

// export async function POST(req: Request) {
//   const { email, role } = await req.json();

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }
//     await User.findByIdAndUpdate(
//       user._id,
//       { $set: { role } },
//       { new: true, runValidators: true }
//     );
//     return NextResponse.json(
//       { message: "Role updated successfully" },
//       { status: 200 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
