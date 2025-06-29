import Document from "@/models/Document";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }
  
  console.log(id);
  const document = await Document.findById(id);
  
  if (!document) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }
  
  return NextResponse.json(document);
}