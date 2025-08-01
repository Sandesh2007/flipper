'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Users, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/database/supabase/client';
import Link from 'next/link';
import Image from 'next/image';

interface SearchResult {
  username: string;
  avatar_url: string | null;
}

interface PublicationSearchResult {
  id: string;
  title: string;
  user_id: string;
  username: string;
  avatar_url: string | null;
}

interface SearchBoxProps {
  className?: string;
  placeholder?: string;
}

export default function SearchBox({ 
  className = "", 
  placeholder = "Search for users and publications..." 
}: SearchBoxProps) {
  const [search, setSearch] = useState('');
  const [userResults, setUserResults] = useState<SearchResult[]>([]);
  const [publicationResults, setPublicationResults] = useState<PublicationSearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (value: string) => {
    setSearch(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    
    if (!value.trim()) {
      setUserResults([]);
      setPublicationResults([]);
      setShowDropdown(false);
      return;
    }

    setIsLoading(true);
    searchTimeout.current = setTimeout(async () => {
      try {
        const supabase = createClient();
        
        // Search for users
        const { data: userData } = await supabase
          .from('profiles')
          .select('username,avatar_url')
          .ilike('username', `%${value}%`)
          .limit(3);
        
        // Search for publications
        const { data: pubData } = await supabase
          .from('publications')
          .select(`
            id,
            title,
            user_id,
            profiles!publications_user_id_fkey(username, avatar_url)
          `)
          .or(`title.ilike.%${value}%,description.ilike.%${value}%`)
          .limit(5);
        
        setUserResults(userData || []);
        
        // Transform publication results
        const transformedPubResults = pubData?.map((pub: any) => ({
          id: pub.id,
          title: pub.title,
          user_id: pub.user_id,
          username: pub.profiles?.username || 'Unknown',
          avatar_url: pub.profiles?.avatar_url || null
        })) || [];
        
        setPublicationResults(transformedPubResults);
        setShowDropdown(true);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  const clearSearch = () => {
    setSearch('');
    setUserResults([]);
    setPublicationResults([]);
    setShowDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasResults = userResults.length > 0 || publicationResults.length > 0;

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          className="pl-12 pr-12 h-12 text-base bg-background border-2 border-border focus:border-primary transition-colors"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => hasResults && setShowDropdown(true)}
        />
        {search && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
            onClick={clearSearch}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showDropdown && (hasResults || isLoading) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
              Searching...
            </div>
          ) : (
            <>
              {userResults.length > 0 && (
                <div className="border-b border-border">
                  <div className="px-4 py-2 text-sm font-medium text-muted-foreground bg-muted/50">
                    <Users className="inline w-4 h-4 mr-2" />
                    Users
                  </div>
                  {userResults.map((profile) => (
                    <Link
                      key={profile.username}
                      href={`/profile/${profile.username}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      {profile.avatar_url ? (
                        <Image
                          src={profile.avatar_url}
                          alt="avatar"
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full object-cover border border-border"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center">
                          <span className="text-xs font-medium text-muted-foreground">
                            {profile.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="font-medium text-foreground">{profile.username}</span>
                    </Link>
                  ))}
                </div>
              )}

              {publicationResults.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-sm font-medium text-muted-foreground bg-muted/50">
                    <FileText className="inline w-4 h-4 mr-2" />
                    Publications
                  </div>
                  {publicationResults.map((pub) => (
                    <Link
                      key={pub.id}
                      href={`/profile/${pub.username}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      {pub.avatar_url ? (
                        <Image
                          src={pub.avatar_url}
                          alt="publication avatar"
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full object-cover border border-border"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center">
                          <span className="text-xs font-medium text-muted-foreground">
                            {pub.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground text-sm">{pub.title}</span>
                        <span className="text-xs text-muted-foreground">by {pub.username}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {!hasResults && !isLoading && search.trim() && (
                <div className="p-4 text-center text-muted-foreground">
                  No results found for "{search}"
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
