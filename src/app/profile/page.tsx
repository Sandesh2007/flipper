'use client'
import EditProfile from "@/components/edit-profile";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MapPin, 
  Heart,
  MessageCircle,
  Share,
} from "lucide-react";
import { useAuth } from "@/components/auth-context";
import { CurrentUserAvatar } from "@/components/current-user-avatar";

export default function UserProfile() {
  const { user } = useAuth();
  const posts = [
    {
      id: 1,
      content: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugit minus doloribus sint commodi, facere, vitae quibusdam iure.",
      timestamp: "2 hours ago",
      likes: 24,
      comments: 8
    },
    {
      id: 2,
      content: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugit minus doloribus sint commodi, facere, vitae quibusdam iure distinctio inventore nemo itaque praesentium architecto veniam.",
      timestamp: "1 day ago",
      likes: 42,
      comments: 12
    },
  ];

  return (
    <>
    {user && (
    <div className="min-h-screen bg-background">
      {/* Minimal Header */}
      <div className="border-b border-border/50">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <CurrentUserAvatar/>
              <div>
                <h1 className="text-2xl font-bold text-foreground">{user.username}</h1>
                <p className="text-muted-foreground">{user.bio}</p>
                <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                  {user.location && (
                    <>
                      <MapPin className="h-3 w-3" />
                      {user.location}
                    </>
                  )}
                </div>
              </div>
            </div>
            <EditProfile />
          </div>
          
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt facere id quod cumque laborum vel.
          </p>
          
          <div className="flex gap-6 text-sm">
            <span><strong className="text-foreground">2.4K</strong> <span className="text-muted-foreground">followers</span></span>
            <span><strong className="text-foreground">421</strong> <span className="text-muted-foreground">following</span></span>
            <span><strong className="text-foreground">89</strong> <span className="text-muted-foreground">posts</span></span>
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id} className="shadow-soft hover:shadow-medium transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <CurrentUserAvatar/>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-medium text-foreground">{user.username}</span>
                      <span className="text-sm text-muted-foreground">{post.timestamp}</span>
                    </div>
                    <p className="text-foreground leading-relaxed mb-4">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <button className="flex items-center gap-2 hover:text-foreground transition-colors">
                        <Heart className="h-4 w-4" />
                        {post.likes}
                      </button>
                      <button className="flex items-center gap-2 hover:text-foreground transition-colors">
                        <MessageCircle className="h-4 w-4" />
                        {post.comments}
                      </button>
                      <button className="flex items-center gap-2 hover:text-foreground transition-colors">
                        <Share className="h-4 w-4" />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
    )}
    </>
  )
}
