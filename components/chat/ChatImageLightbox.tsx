"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, ZoomIn, Download } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface ChatImageLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  altText: string;
}

export function ChatImageLightbox({ isOpen, onClose, imageUrl, altText }: ChatImageLightboxProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* Provide an accessible Title for the Dialog */}
      <DialogTitle className="sr-only">View Image Fullscreen</DialogTitle>
      
      <DialogContent className="max-w-[100vw] max-h-[100vh] w-screen h-screen p-0 border-none bg-black/95 m-0 rounded-none flex items-center justify-center data-[state=open]:duration-300">
        
        {/* Top actions bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent z-50">
          <div className="text-white/80 text-sm font-medium truncate max-w-[70%]">
            {altText}
          </div>
          <div className="flex items-center gap-4">
            <a 
              href={imageUrl} 
              download 
              target="_blank" 
              rel="noreferrer"
              className="text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
              title="Download original"
            >
              <Download className="w-5 h-5" />
            </a>
            <button 
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
              title="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Image Container */}
        <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12" onClick={onClose}>
          <div 
            className="relative w-full h-full max-w-7xl mx-auto flex items-center justify-center cursor-default"
            onClick={(e) => e.stopPropagation()} // Prevent clicking image from closing
          >
            {/* We use standard img here for pure CSS scaling, or Next Image with unoptimized */}
            <Image
              src={imageUrl}
              alt={altText}
              fill
              className="object-contain"
              unoptimized
              sizes="100vw"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
