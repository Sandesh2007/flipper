"use client"
import { OtherUsersPublications, SearchBox } from '@/components';

export default function PublicLandingPage() {
  return (
    <div className="min-h-screen bg-background py-10 px-2">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 text-foreground">Discover Publications</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore amazing publications from our community. Find creators and content that inspire you.
          </p>
          
          {/* Search Box */}
          <div className="max-w-2xl mx-auto mb-12">
            <SearchBox 
              placeholder="Search for users and publications..."
              className="w-full"
            />
          </div>
        </div>
        
        <OtherUsersPublications
          maxPublicationsPerUser={4}
          showUserInfo={true}
        />
      </div>
    </div>
  );
}
