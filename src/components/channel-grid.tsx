"use client";

import { useState, useEffect } from "react";
import { Channel } from "@/types/channel";
import { ChannelCard, ChannelCardSkeleton } from "@/components/ui/channel-card";
import { Button } from "@/components/ui/button";

interface ChannelGridProps {
  initialChannels?: Channel[];
}

export function ChannelGrid({ initialChannels }: ChannelGridProps) {
  const [channels, setChannels] = useState<Channel[]>(initialChannels || []);
  const [isLoading, setIsLoading] = useState(!initialChannels);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  useEffect(() => {
    if (!initialChannels) {
      fetchChannels();
    }
  }, [initialChannels, page]);

  async function fetchChannels() {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/channels?page=${page}`);
      const data = await response.json();
      setChannels(data.channels);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching channels:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function handlePrevPage() {
    if (pagination.hasPrevPage) {
      setPage(page - 1);
    }
  }

  function handleNextPage() {
    if (pagination.hasNextPage) {
      setPage(page + 1);
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, index) => (
          <ChannelCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (channels.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold">No channels found</h3>
        <p className="text-gray-500 mt-2">Try adjusting your filters or check back later</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {channels.map((channel, index) => (
          <ChannelCard key={channel.id} channel={channel} index={index} />
        ))}
      </div>
      
      {(pagination.hasPrevPage || pagination.hasNextPage) && (
        <div className="flex justify-center gap-4 mt-8">
          <Button 
            variant="outline" 
            onClick={handlePrevPage}
            disabled={!pagination.hasPrevPage}
          >
            Previous
          </Button>
          <span className="flex items-center">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <Button 
            variant="outline" 
            onClick={handleNextPage}
            disabled={!pagination.hasNextPage}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
} 