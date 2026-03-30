import { Hexagon } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-[#0A0E1A] items-center justify-center p-4">
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute top-0 inset-x-0 h-96 bg-blue-600/10 rounded-b-[100%] blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md z-10 flex flex-col items-center">
        {/* LOGO */}
        <div className="flex flex-col items-center gap-3 mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center glow-blue shadow-lg shadow-blue-600/30">
             <Hexagon className="w-10 h-10 text-white" />
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="font-display font-black text-2xl tracking-wide text-white">GOL MAIS BONITO</span>
            <span className="text-sm text-blue-400 font-medium tracking-widest uppercase mt-1">Painel Administrativo</span>
          </div>
        </div>

        {/* AUTH FORM CONTAINER */}
        <div className="w-full bg-[#111827]/80 backdrop-blur-xl border border-gray-800/80 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/50">
          {children}
        </div>
      </div>
    </div>
  );
}
