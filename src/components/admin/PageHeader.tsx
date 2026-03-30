import { PlusCircle } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  buttonText: string;
  onButtonClick?: () => void;
}

export function PageHeader({ title, subtitle, buttonText, onButtonClick }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl font-display font-black text-white tracking-wide uppercase mb-1">
          {title}
        </h1>
        <p className="text-gray-400 text-sm">
          {subtitle}
        </p>
      </div>
      <button 
        onClick={onButtonClick}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 font-medium transition-all shadow-lg shadow-blue-600/20"
      >
        <PlusCircle className="w-5 h-5" />
        {buttonText}
      </button>
    </div>
  );
}
