'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Users, FileText, Clock, TrendingUp } from 'lucide-react';
import { createClient } from '@/lib/database/supabase/client';
import Link from 'next/link';

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
  placeholder = "Search users, publications..."
}: SearchBoxProps) {
  const [search, setSearch] = useState('');
  const [userResults, setUserResults] = useState<SearchResult[]>([]);
  const [publicationResults, setPublicationResults] = useState<PublicationSearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async (value: string) => {
    setSearch(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (!value.trim()) {
      setUserResults([]);
      setPublicationResults([]);
      setShowDropdown(isFocused);
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
    setShowDropdown(isFocused);
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setIsFocused(true);
    setShowDropdown(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Delay hiding dropdown to allow clicks
    setTimeout(() => setShowDropdown(false), 150);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasResults = userResults.length > 0 || publicationResults.length > 0;
  const showEmptyState = !hasResults && !isLoading && search.trim();

  const handleRecentSearchClick = (term: string) => {
    setSearch(term);
    handleSearch(term);
  };

  return (
    <div className={`relative w-full max-w-2xl ${className}`} ref={searchRef}>
      {/* Search Input */}
      <div className={`relative group transition-all duration-200 ${isFocused ? 'transform scale-[1.02]' : ''
        }`}>
        <div className={`absolute inset-0 rounded-xl bg-blue-500/20 opacity-0 blur-xl transition-opacity duration-300 ${isFocused ? 'opacity-100' : ''
          }`}></div>

        <div className="relative glass rounded-xl border-2 border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-200 hover:shadow-xl">
          <Search className={`absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 transition-colors duration-200 ${isFocused ? 'text-blue-500' : 'text-gray-400'
            }`} />

          <input
            ref={inputRef}
            placeholder={placeholder}
            className="w-full h-14 pl-12 pr-12 text-base bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />

          {search && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full glass hover:bg-gray-200 dark:hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center group"
              onClick={clearSearch}
            >
              <X className="h-4 w-4 text-gray-400 hover:text-primary" />
            </button>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showDropdown && (
        <div className={`absolute top-full left-0 right-0 mt-3 bg-muted-40 border-gray-200 dark:border-neutral-700 rounded-2xl shadow-2xl max-h-[28rem] overflow-hidden z-50 animate-in fade-in-0 slide-in-from-top-2 duration-200 ${showDropdown ?? 'hidden'} `}>
          <div className="overflow-y-auto max-h-[28rem] glass scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">

            {/* Loading State */}
            {isLoading && (
              <div className="p-8 text-center glass">
                <div className="relative">
                  <div className="w-8 h-8 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-3"></div>
                  <div className="absolute inset-0 w-8 h-8 border-4 border-transparent border-t-neutral-50 rounded-full animate-spin mx-auto" style={{ animationDelay: '0.1s' }}></div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Searching the community...</p>
              </div>
            )}

            {/* User Results */}
            {userResults.length > 0 && (
              <div className="border-b border-gray-100 dark:border-neutral-800 bg-muted/40">
                <div className="px-5 py-3 flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 glass">
                  <Users className="w-4 h-4" />
                  People ({userResults.length})
                </div>
                {userResults.map((profile, index) => (
                  <Link
                    key={profile.username}
                    href={`/profile/${profile.username}`}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-muted transition-all duration-150 group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="relative ">
                      {profile.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt={profile.username.charAt(0)}
                          className={`w-10 h-10 rounded-full items-center flex justify-center object-cover border-2 
                            text-neutral-50 bg-neutral-700
                            border-gray-200 dark:border-gray-700 group-hover:border-blue-500 transition-colors overflow-hidden uppercase`}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-gray-200 dark:border-neutral-700 group-hover:border-blue-500 flex items-center justify-start transition-colors">
                          <span className="text-sm font-semibold text-white">
                            {profile.username.charAt(0).toUpperCase()}start
                          </span>
                        </div>
                      )}
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {profile.username}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Publication Results */}
            {publicationResults.length > 0 && (
              <div>
                <div className="px-5 py-3 flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-50">
                  <FileText className="w-4 h-4" />
                  Publications ({publicationResults.length})
                </div>
                {publicationResults.map((pub, index) => (
                  <a
                    key={pub.id}
                    href={`/profile/${pub.username}`}
                    className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-gray-50 transition-all duration-150 group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {pub.avatar_url ? (
                        <img
                          src={pub.avatar_url}
                          alt="publication avatar"
                          className="w-10 h-10 rounded-lg object-cover border border-gray-200 dark:border-gray-700 group-hover:border-blue-500 transition-colors"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-blue-500 border border-gray-200 dark:border-gray-700 group-hover:border-blue-500 flex items-center justify-center transition-colors">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                        {pub.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        by <span className="font-medium">@{pub.username}</span>
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span>• 5 min read</span>
                        <span>• Published 2 days ago</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}

            {/* Empty State */}
            {showEmptyState && (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">No results found</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  We couldn't find anything matching <strong>"{search}"</strong>
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  Try adjusting your search terms or browse popular content
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
