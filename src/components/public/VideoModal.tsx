"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

interface VideoModalProps {
  videoUrl: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export function VideoModal({ videoUrl, isOpen, onClose, title }: VideoModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(21,101,255,0.3)] border border-white/10 animate-in fade-in zoom-in duration-300">
        {/* Header (Optional) */}
        <div className="absolute top-0 inset-x-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/80 to-transparent">
          <h3 className="text-white font-bold truncate pr-10">{title}</h3>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110 active:scale-95"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Video Player */}
        <video
          src={videoUrl}
          className="w-full h-full"
          controls
          autoPlay
          playsInline
        />
      </div>
    </div>
  );
}
