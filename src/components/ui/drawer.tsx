"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  side?: "left" | "right";
  className?: string;
}

export function Drawer({ isOpen, onClose, children, title, side = "right", className }: DrawerProps) {
  // Prevent body scroll when open
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

  const slideVariants = {
    hidden: { x: side === "right" ? "100%" : "-100%" },
    visible: { x: 0 },
    exit: { x: side === "right" ? "100%" : "-100%" }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-navy-950/40 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "fixed top-0 bottom-0 z-50 flex w-full max-w-md flex-col bg-white shadow-2xl",
              side === "right" ? "right-0" : "left-0",
              className
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              {title && <h2 className="font-heading text-xl font-semibold text-gray-900">{title}</h2>}
              <button
                onClick={onClose}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
