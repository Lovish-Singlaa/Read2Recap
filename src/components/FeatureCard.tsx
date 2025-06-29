import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}

const FeatureCard = ({ icon: Icon, title, description, gradient }: FeatureCardProps) => {
  return (
    <div className="group bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
      {/* Icon with Gradient Background */}
      <div className={`w-14 h-14 mb-6 rounded-xl bg-gradient-to-r ${gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      
      {/* Title */}
      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
      
      {/* Description */}
      <p className="text-gray-600 leading-relaxed">
        {description}
      </p>
      
      {/* Hover Effect Border */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};

export default FeatureCard;