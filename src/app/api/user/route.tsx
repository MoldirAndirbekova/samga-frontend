import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface UserPayload {
  id: number;
  full_name: string;
  email: string;
  children?: { id: number; full_name: string }[];
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  if (!process.env.SECRET_KEY) {
    console.error("SECRET_KEY is not defined in environment variables");
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY) as UserPayload;

    if (!decoded.id || !decoded.full_name || !decoded.email) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 403 });
    }

    return NextResponse.json({
      id: decoded.id,
      full_name: decoded.full_name,
      email: decoded.email,
      children: decoded.children || [{ id: decoded.id, full_name: decoded.full_name }],
    });
  } catch (error) {
    console.error("JWT verification error:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 403 });
  }
}
