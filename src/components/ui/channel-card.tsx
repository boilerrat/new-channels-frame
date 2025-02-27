"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Channel } from "@/types/channel";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

interface ChannelCardProps {
  channel: Channel;
  index: number;
}

export function ChannelCard({ channel, index }: ChannelCardProps) {
  const { name = "", description = "", imageUrl = "", host = { fid: 0, username: "", displayName: "", pfpUrl: "" }, memberCount = 0, warpcastUrl = "" } = channel || {};
  
  // Animation variants for staggered animation
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3,
        delay: index * 0.05 // Stagger based on index
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      className="h-full"
    >
      <a 
        href={warpcastUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block h-full transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 rounded-lg"
      >
        <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow group">
          <CardHeader className="p-0">
            <div className="relative w-full h-32">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">{name && name.length > 0 ? name.charAt(0) : "?"}</span>
                </div>
              )}
              <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink className="h-4 w-4 text-gray-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-grow p-4">
            <div className="flex items-center gap-2 mb-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={host.pfpUrl} alt={host.displayName} />
                <AvatarFallback>{host.displayName && host.displayName.length > 0 ? host.displayName.charAt(0) : "?"}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{host.displayName || "Unknown"}</span>
            </div>
            <h3 className="font-bold text-lg mb-1 group-hover:text-purple-600 transition-colors">{name || "Unnamed Channel"}</h3>
            <p className="text-sm text-gray-500 line-clamp-2">{description || "No description available"}</p>
          </CardContent>
          <CardFooter className="p-4 pt-0 text-sm text-gray-500">
            {(memberCount || 0).toLocaleString()} members
          </CardFooter>
        </Card>
      </a>
    </motion.div>
  );
}

export function ChannelCardSkeleton() {
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className="p-0">
        <Skeleton className="w-full h-32" />
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-4 w-20" />
      </CardFooter>
    </Card>
  );
} 