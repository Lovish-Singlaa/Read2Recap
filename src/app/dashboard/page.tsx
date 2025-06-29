'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, Clock, CheckCircle, XCircle, LogOut, User, LucideZap, Loader2 } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { useUploadThing } from '@/utils/uploadthing';
import { toast } from 'sonner';
import { generateSummary } from '@/components/upload-actions';
import axios from 'axios';

interface Document {
  _id: string;
  filename: string;
  fileUrl: string;
  summary: string;
  uploadedAt: string;
  processedAt?: string;
}

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);

  const { startUpload, routeConfig } = useUploadThing(
    "pdfUploader",
    {
      onClientUploadComplete: (res) => {
        console.log("Files: ", res);
        console.log("Upload Completed");
        toast.success("Upload Completed", {
          description: "Your file has been uploaded successfully",
        });
      },
      onUploadError: (error: Error) => {
        console.log("Error: ", error);
        toast.error("Error occured while uploading!", {
          description: error.message,
        });
      },
      onUploadBegin: () => {
        console.log("Uploading...");
        toast.info("Uploading...", {
          description: "Your file is being uploaded...",
        });
      }
    }
  )

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
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const file = formData.get('file') as File;
    e.preventDefault();
    setUploading(true);

    try {
      const response = await startUpload([file]);
      if(!response){
        return;
      }

      console.log("response: ", response);

      const summary = await generateSummary(response[0]);

      const { data=null, message=null } = summary || {};
      if(data){
        //store the summary in the database
        const resp = await axios.post('/api/documents/upload', {file: response[0].serverData.file, data: data});

        if(resp.data.success){
          toast.success(resp.data.message);
        }else{
          toast.error(resp.data.message);
        }
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
      // e.currentTarget.reset();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-6xl mx-auto">
      

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center">
        {/* <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Document
              </label>
              <input
                type="file"
                accept=".txt,.doc,.docx,.pdf"
                onChange={handleFileSelect}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
            {selectedFile && (
              <div className="text-sm text-gray-600">
                Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
              </div>
            )}
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>{uploading ? 'Uploading...' : 'Upload & Summarize'}</span>
            </button>
          </div>
        </div> */}

        <div className='flex items-center space-x-2 justify-center py-4 text-lg'>
          <Badge variant="outline" className='p-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0'>
            <LucideZap className="w-4 h-4 mr-2" />
            <span>AI Based Summarizer & Voice Reader</span>
          </Badge>
        </div>
        <div className='text-center text-2xl font-bold'>
          Start Uploading Your Documents
        </div>
        <div className='text-center text-gray-500 py-4 text-sm'>Upload your Document and let our AI do the magic!</div>
        <div>
          <label className="py-4 block text-sm font-medium text-gray-700 mb-2 text-center">
            Select Document (Currently only supports PDF files)
          </label>
          <form onSubmit={(e)=>handleUpload(e)}>
            <div className='flex items-center space-x-2'>
              <Input
                type="file"
                accept=".txt,.doc,.docx,.pdf"
                required
                name='file'
                id='file'
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              />

              <button
                type='submit'
                className={`flex items-center cursor-pointer space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={uploading}
              >
                
                <span className='text-sm'>{uploading ? (<div className='flex items-center space-x-2'><Loader2 className='mr-2 w-4 h-4 animate-spin'/>Uploading...</div>) : (<div className='flex items-center space-x-2'><Upload className="w-4 h-4 mr-2" />Upload</div>)}</span>
              </button>
            </div>
          </form>
        </div>
          
        {/* Recent Documents
        {documents.length > 0 && (
          <div className="w-full max-w-4xl mt-12">
            <div className="bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Recent Documents</h2>
                <Link
                  href="/dashboard/summaries"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All →
                </Link>
              </div>
              <div className="divide-y divide-gray-200">
                {documents.slice(0, 3).map((doc) => (
                  <div key={doc._id} className="px-6 py-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <h3 className="text-lg font-medium text-gray-900">
                            {doc.filename}
                          </h3>
                        </div>
                        <div className="text-sm text-gray-500 mb-2">
                          Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                        </div>
                        {doc.summary && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Summary:</h4>
                            <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-700 line-clamp-3">
                              {doc.summary}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
} 