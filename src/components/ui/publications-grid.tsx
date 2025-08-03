'use client';

import { Heart, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Card } from "./card";
import { Button } from "./button";

interface Publication {
  id: string;
  title: string;
  description: string;
  thumb_url?: string;
}

interface PublicationsGridProps {
  publications: Publication[];
  viewMode: 'grid' | 'list';
  likes: Record<string, number>;
  onEdit: (pub: Publication) => void;
  onDelete: (id: string) => void;
}

export function PublicationsGrid({ 
  publications, 
  viewMode, 
  likes, 
  onEdit, 
  onDelete 
}: PublicationsGridProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className={`grid gap-6 ${
      viewMode === 'grid' 
        ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
        : 'grid-cols-1'
    }`}>
      {publications.map((pub, index) => (
        <Card 
          key={pub.id}
          className="overflow-hidden animate-scale-in bg-gradient-card border border-border/30 hover:border-border/50 transition-all duration-300 hover:scale-102 shadow-soft hover:shadow-glow"
          style={{ 
            animationDelay: `${index * 100}ms`,
            animationFillMode: 'backwards'
          }}
          onMouseEnter={() => setHoveredId(pub.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <div className="relative aspect-video">
            {pub.thumb_url ? (
              <Image
                src={pub.thumb_url}
                alt={pub.title}
                fill
                className="object-cover transition-transform duration-300"
                style={{
                  transform: hoveredId === pub.id ? 'scale(1.05)' : 'scale(1)'
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center backdrop-blur-sm">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-muted-foreground/10 flex items-center justify-center">
                    <span className="text-muted-foreground text-lg">📄</span>
                  </div>
                  <span className="text-muted-foreground text-sm">No thumbnail</span>
                </div>
              </div>
            )}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-center justify-center gap-3 transition-all duration-300 ${
              hoveredId === pub.id ? 'opacity-100' : 'opacity-0'
            }`}>
              <Button
                variant="secondary"
                size="icon"
                className="hover:scale-110 transition-transform bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-background/90"
                onClick={() => onEdit(pub)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                className="hover:scale-110 transition-transform bg-background/80 backdrop-blur-sm border border-border/50 hover:bg-destructive/90"
                onClick={() => onDelete(pub.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="p-6">
            <h3 className="font-semibold mb-3 line-clamp-1 text-foreground">{pub.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
              {pub.description}
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4 text-primary/70" />
                <span className="font-medium">{likes[pub.id] || 0} likes</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
