'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/database/supabase/client';
import { useAuth } from '@/components/auth/auth-context';

interface LikeButtonProps {
  publicationId: string;
  showText?: boolean;
  disabled?: boolean;
  uploaderId?: string;
  variant?: 'icon' | 'button';
}

export default function LikeButton({
  publicationId,
  showText = true,
  disabled = false,
  uploaderId,
  variant = 'icon',
}: LikeButtonProps) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const isUploader = user?.id === uploaderId;
  const isDisabled = disabled || !user || isUploader;

  useEffect(() => {
    const fetchLikes = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('publication_likes')
        .select('user_id, publication_id')
        .eq('publication_id', publicationId);

      if (data) {
        setLikesCount(data.length);
        if (user) {
          setLiked(data.some((row) => row.user_id === user.id));
        }
      }
    };
    fetchLikes();
  }, [publicationId, user]);

  const handleToggle = async () => {
    if (!user || isUploader) return;
    const supabase = createClient();

    if (liked) {
      setLiked(false);
      setLikesCount((prev) => Math.max(prev - 1, 0));
      await supabase
        .from('publication_likes')
        .delete()
        .eq('publication_id', publicationId)
        .eq('user_id', user.id);
    } else {
      setLiked(true);
      setLikesCount((prev) => prev + 1);
      await supabase
        .from('publication_likes')
        .insert({ publication_id: publicationId, user_id: user.id });
    }
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <Button
        variant="default"
        size={variant === 'icon' ? 'icon' : 'sm'}
        onClick={handleToggle}
        disabled={isDisabled}
        aria-label={liked ? 'Unlike' : 'Like'}
        className={`cursor-pointer rounded-full transition-colors ${liked ? "bg-red-300 hover:bg-red-200" :"bg-neutral-100 dark:bg-neutral-900 hover:bg-red-300" }`}
      >
        <Heart 
        size='lg'
        className={`${liked ? 'text-red-500 fill-red-500' : 'text-red-500'}`} />
        {variant === 'button' && <span className="ml-1">{likesCount}</span>}
      </Button>
      {showText && (
        <span className="text-xs text-muted-foreground">
          {likesCount} {likesCount === 1 ? 'Like' : 'Likes'}
        </span>
      )}
    </div>
  );
}
