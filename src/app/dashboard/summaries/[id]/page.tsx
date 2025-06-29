'use client'

import AudioPlayer from "@/components/AudioPlayer";
import axios from "axios";
import { useEffect, useState } from "react";
import { FileText, Download, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Define the document type
interface DocumentData {
    _id: string;
    filename: string;
    fileUrl: string;
    summary: string;
    uploadedAt: string;
    audioUrl?: string;
}

export default function SummaryPage(props: {
    params: Promise<{ id: string }>
}) {
    const [id, setId] = useState<string | null>(null);
    const [documentData, setDocumentData] = useState<DocumentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleAudioGenerated = async (audioUrl: string, documentId: string) => {
        try {
            await axios.put(`/api/documents/${documentId}/audio`, { audioUrl });

            // Update the document in the local state
            setDocumentData(prev => prev ? { ...prev, audioUrl } : null);

            toast.success('Audio saved successfully!');
        } catch (error) {
            console.error('Error saving audio URL:', error);
            toast.error('Failed to save audio');
        }
    };

    const handleDownload = async (fileUrl: string) => {
        try {
            if (!fileUrl) {
                toast.error('No file URL available');
                return;
            }

            const response = await axios.get(fileUrl, { responseType: 'blob' });
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a') as HTMLAnchorElement;
            a.href = url;
            a.download = fileUrl.split('/').pop() || 'download';
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file:', error);
            toast.error('Failed to download file');
        }
    }

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const params = await props.params;
                const documentId = params.id;
                setId(documentId);

                const response = await axios.get(`/api/documents/findById`, {
                    params: { id: documentId }
                });
                const data = response.data;
                setDocumentData(data);
            } catch (error) {
                console.error('Error fetching document:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDocument();
    }, [props.params]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const readingTime = () => {
        const words = documentData?.summary?.split(' ').length || 0;
        const minutes = Math.ceil(words / 200);
        return `${minutes} min read`;
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div>
                {documentData ? (
                    <div className="space-y-6">
                        {/* Document Info */}
                        <div className="rounded-lg p-6">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-2 space-x-2 mb-4">
                                <div className="flex items-center gap-5 space-x-2 mb-4">
                                    <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        {documentData.filename}
                                    </h1>
                                    <Badge className="text-xs md:text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 h-8 px-4 py-2 rounded-full mt-2">
                                        <Clock className="w-4 h-4" />
                                        {readingTime()}
                                    </Badge>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="hidden md:flex bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-4 py-2 rounded-full mt-2 cursor-pointer"
                                            onClick={() => handleDownload(documentData.fileUrl)}
                                        >
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div>
                                    {documentData.summary && (
                                        <AudioPlayer
                                            text={documentData.summary}
                                            documentId={documentData._id}
                                            existingAudioUrl={documentData.audioUrl}
                                            onAudioGenerated={(audioUrl) => handleAudioGenerated(audioUrl, documentData._id)}
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="text-sm text-gray-500 mb-4">
                                Uploaded {formatDate(documentData.uploadedAt)}
                            </div>

                            {/* Summary */}
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Summary</h3>
                                <div className="rounded-lg p-6 text-gray-700 leading-relaxed max-w-4xl mx-auto bg-white shadow-md">
                                    {documentData.summary ? (
                                        mounted ? (
                                            <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-h1:text-2xl prose-h1:font-bold prose-h1:mb-4 prose-h2:text-xl prose-h2:font-semibold prose-h2:mt-6 prose-h2:mb-3 prose-h3:text-lg prose-h3:font-medium prose-h3:mt-4 prose-h3:mb-2 prose-p:text-gray-700 prose-p:leading-relaxed prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6 prose-li:text-gray-700 prose-strong:text-gray-900 prose-strong:font-semibold prose-em:text-gray-600 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-hr:border-gray-300 prose-hr:my-6">
                                                <ReactMarkdown
                                                    remarkPlugins={[remarkGfm]}
                                                >
                                                    {documentData.summary}
                                                </ReactMarkdown>
                                            </div>
                                        ) : (
                                            <div className="prose prose-lg max-w-none">
                                                <pre className="whitespace-pre-wrap">{documentData.summary}</pre>
                                            </div>
                                        )
                                    ) : (
                                        <p className="text-gray-500 italic">No summary available.</p>
                                    )}
                                </div>
                            </div>


                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Select a Document
                        </h3>
                        <p className="text-gray-500">
                            Choose a document from the list to view its summary and generate audio.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}