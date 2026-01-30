// import { NextRequest, NextResponse } from "next/server";

// import mongoose from "mongoose";
// import { connectDB } from "@/lib/mongodb";
// import { Job } from "@/models/Job";
// import { verifyToken } from "@/lib/auth";

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();

//     const token = req.cookies.get("token")?.value;
//     if (!token) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const decoded: any = verifyToken(token);

//     // Recruiter-only
//     if (decoded.role !== "recruiter") {
//       return NextResponse.json(
//         { error: "Only recruiters can post jobs" },
//         { status: 403 }
//       );
//     }

//     const body = await req.json();
//     const { title, company, location, skills, type, salary, description } =
//       body;
//     console.log("Incoming job body:", body);

//     if (!title || !company || !location || !type || !description || !skills) {
//       return NextResponse.json(
//         { error: "All required fields must be filled" },
//         { status: 400 }
//       );
//     }

//     const job = await Job.create({
//       title,
//       company,
//       location,
//       skills,
//       type,
//       salary,
//       description,
//       recruiterId: new mongoose.Types.ObjectId(decoded.id),
//     });
//     console.log(job);

//     return NextResponse.json(job, { status: 201 });
//   } catch (error) {
//     console.error("Create job error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
