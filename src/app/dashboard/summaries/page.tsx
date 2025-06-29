'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FileText, ArrowLeft, Volume2, Trash } from 'lucide-react';
import Link from 'next/link';
import AudioPlayer from '@/components/AudioPlayer';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Document {
  _id: string;
  filename: string;
  fileUrl: string;
  summary: string;
  audioUrl?: string;
  uploadedAt: string;
  processedAt?: string;
}

export default function Summaries() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchDocuments();
    }
  }, [status, router]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents');
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (e: React.MouseEvent, documentId: string) => {
    e.stopPropagation(); // Prevent card click event
    
    if (!confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      return;
    }

    setDeleting(documentId);
    
    try {
      const response = await axios.delete(`/api/documents/${documentId}`);
      
      if (response.data.success) {
        toast.success('Document deleted successfully');
        // Remove the document from the local state
        setDocuments(prev => prev.filter(doc => doc._id !== documentId));
      } else {
        toast.error('Failed to delete document');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const stripMarkdown = (text: string) => {
    // Remove markdown headers, bold, italic, links, and other formatting
    return text
      .replace(/^#+\s+/gm, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
      .replace(/`([^`]+)`/g, '$1') // Remove inline code
      .replace(/^\s*[-*+]\s+/gm, '') // Remove list markers
      .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered list markers
      .replace(/\n+/g, ' ') // Replace multiple newlines with single space
      .trim();
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <FileText className="w-6 h-6 text-blue-600" />
          <div className="text-xl">No documents found. Go back to dashboard and upload a document.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <div className="flex items-center space-x-2">
              <FileText className="w-6 h-6 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Your Summaries</h1>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Document List */}
          <div className="lg:col-span-1">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Documents ({documents.length})
                </h2>
              </div>
              
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4'>
                {documents.map((doc) => (
                  <Card key={doc._id} className='hover:shadow-lg hover:cursor-pointer transition-all duration-300' onClick={() => router.push(`/dashboard/summaries/${doc._id}`)}>
                    <CardHeader>
                      <CardTitle>
                        <div className='flex items-center space-x-2'>
                          <FileText className='w-5 h-5 text-blue-400 flex-shrink-0 ' />
                          <p className='text-sm font-medium text-gray-900 truncate'>{doc.filename.slice(0, 20)}{doc.filename.length > 20 ? '...' : ''}</p>
                          {doc.audioUrl && (
                            <Volume2 className='w-4 h-4 text-green-500 flex-shrink-0' />
                          )}
                        </div>
                      </CardTitle>
                      <CardDescription>{formatDate(doc.uploadedAt)}</CardDescription>
                      {/* Delete Document */}
                      <CardAction>
                        <button
                          onClick={(e) => handleDeleteDocument(e, doc._id)}
                          disabled={deleting === doc._id}
                          className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete document"
                        >
                          {deleting === doc._id ? (
                            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash className='w-4 h-4' />
                          )}
                        </button>
                      </CardAction> 
                    </CardHeader>
                    <CardContent className='text-sm '>
                      <p>{mounted ? stripMarkdown(doc.summary).slice(0, 100) + '...' : doc.summary.slice(0, 100) + '...'}</p>
                    </CardContent>
                    <CardFooter>
                      <p className='text-sm font-semibold text-green-700 bg-green-200 rounded-full px-2 py-1'>Completed</p>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>

          {/* Document Details and Audio Player */}
          
        </div>
      </div>
    </div>
  );
}

