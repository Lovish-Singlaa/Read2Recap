'use client';

import { Upload, FileText, Volume2, Zap, Shield, Clock } from "lucide-react";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import HeroSection from "@/components/HeroSection";
import FeatureCard from "@/components/FeatureCard";

export default function Home() {
  const [dragActive, setDragActive] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  const features = [
    {
      icon: FileText,
      title: "Smart Summarization",
      description: "Advanced AI analyzes your documents and extracts key insights, saving you hours of reading time.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Volume2,
      title: "Text-to-Speech",
      description: "Convert any document to natural-sounding audio. Listen to your summaries on the go.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get comprehensive summaries in seconds, not minutes. Process multiple documents effortlessly.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Clock,
      title: "Save Time",
      description: "Transform hours of reading into minutes of listening. Perfect for busy professionals.",
      gradient: "from-indigo-500 to-purple-500"
    }
  ];

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Upload Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get Started in Seconds
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simply upload your document and let our AI do the heavy lifting
            </p>
          </div>
          
          {/* <FileUploadZone dragActive={dragActive} setDragActive={setDragActive} /> */}
        </div>
      </section>
  
      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to transform documents into actionable insights and audio content
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>
  
      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Transform Your Reading?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of professionals who save hours every week
            </p>
            <Link href='#'>
            <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105 shadow-lg cursor-pointer">
              Start Summarizing Now
            </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}