"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export function Sheet({ isOpen, onClose, title, description, children }: SheetProps) {
  // Lock scroll when open
  React.useEffect(() => {
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
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose}
      />
      
      {/* Content */}
      <div className={cn(
        "relative w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl h-full flex flex-col transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            {title && <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>}
            {description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>}
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
