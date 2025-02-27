"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-200 ${
      isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
    }`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          Channels Frame
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-gray-900">
            About
          </Link>
          <Link href="/docs" className="text-gray-600 hover:text-gray-900">
            Docs
          </Link>
        </nav>
        
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="https://warpcast.com" target="_blank" rel="noopener noreferrer">
              Open Warpcast
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="https://github.com/yourusername/channels-frame" target="_blank" rel="noopener noreferrer">
              GitHub
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
} 