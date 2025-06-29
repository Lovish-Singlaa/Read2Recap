import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Document from '@/models/Document';
// import { summarizeDocument } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // const formData = await request.formData();
    // const file = formData.get('file') as File;
    // const content = formData.get('content') as string;
    const {file, data} = await request.json();

    if (!file || !data) {
      return NextResponse.json(
        { error: 'File and summary are required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Create document record
    const document = await Document.create({
      userId: session.user.id,
      filename: file.name,
      fileUrl: file.url,
      summary: data,
      status: 'completed',
    });

    return NextResponse.json(
      { message: 'Document saved successfully', success: true, documentId: document._id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 