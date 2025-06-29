import { ArrowRight, FileText, Volume2, Zap, Shield } from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-20 pb-32 px-4">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
      <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-indigo-200/20 to-pink-200/20 rounded-full blur-3xl" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-8 animate-fade-in">
            <Zap className="w-4 h-4 mr-2" />
            AI-Powered Document Processing
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight animate-fade-in">
            Transform Documents into
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              Audio & Insights
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in">
            Upload any document and get instant AI-powered summaries plus natural text-to-speech conversion. 
            Save hours of reading time.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in">
          <Link
              href="/auth/signup"
              // className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
            <button className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center cursor-pointer">
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            </Link> 
            <Link
              href="/auth/signin"
              // className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold border border-indigo-600 hover:bg-indigo-50 transition-colors"
            >
            <button className="bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-200 border border-gray-200 hover:border-gray-300 cursor-pointer">
              Login
            </button>
            </Link>
          </div>
          
          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center bg-white/70 px-4 py-2 rounded-full backdrop-blur-sm">
              <FileText className="w-4 h-4 mr-2 text-blue-500" />
              Smart Summarization
            </div>
            <div className="flex items-center bg-white/70 px-4 py-2 rounded-full backdrop-blur-sm">
              <Volume2 className="w-4 h-4 mr-2 text-purple-500" />
              Text-to-Speech
            </div>
            <div className="flex items-center bg-white/70 px-4 py-2 rounded-full backdrop-blur-sm">
              <Shield className="w-4 h-4 mr-2 text-green-500" />
              100% Secure
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;