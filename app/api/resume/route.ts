import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, orderBy } from "firebase/firestore";

const USER_ID = "demo-user-123"; // Temporary fixed user ID

export async function GET() {
  try {
    const resumesRef = collection(db, "users", USER_ID, "resumes");
    const q = query(resumesRef, orderBy("updatedAt", "desc"));
    const snapshot = await getDocs(q);

    const resumes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(resumes);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const resumesRef = collection(db, "users", USER_ID, "resumes");
    
    const docRef = await addDoc(resumesRef, {
      ...body,
      updatedAt: new Date(),
      createdAt: new Date(),
    });

    return NextResponse.json({ id: docRef.id }, { status: 201 });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}