'use client';

import { MapPin, Pencil } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { CurrentUserAvatar } from "../features";
import { Button } from "./button";

interface ProfileHeaderProps {
  user: User | null;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center space-y-6 animate-fade-in">
      <div className="relative group">
        <CurrentUserAvatar className="h-32 w-32 rounded-full ring-4 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40" />
        <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button variant="ghost" size="icon" className="text-white hover:scale-110 transition-transform">
            <Pencil className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold animate-slide-in">
          {user?.user_metadata?.name || 'Anonymous User'}
        </h1>
        <p className="text-muted-foreground flex items-center gap-2 justify-center animate-slide-in opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
          <MapPin className="h-4 w-4" />
          {user?.user_metadata?.location || 'Location not set'}
        </p>
      </div>
    </div>
  );
}
