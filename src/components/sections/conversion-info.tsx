import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Share2, FileText, Image } from "lucide-react";

const conTypes = [
  {
    title: "Flipbook",
    description: "Interactive page-turning experience",
    icon: BookOpen,
    color: "bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-200",
    badge: "Most Popular"
  },
  {
    title: "Social Post", 
    description: "Optimized for social media sharing",
    icon: Share2,
    color: "bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-200"
  },
  {
    title: "Article",
    description: "Clean, readable web article format", 
    icon: FileText,
    color: "bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-200"
  },
  {
    title: "GIF",
    description: "Animated preview for engagement",
    icon: Image, 
    color: "bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-200"
  }
];

export const ConversionInfo = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Turn your files into a...
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose from multiple output formats to suit your content strategy and audience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {conTypes.map((type, index) => (
            <Card 
              key={index} 
              className={`${type.color} hover:shadow-upload transition-all duration-300 hover:scale-105 cursor-pointer group relative overflow-hidden`}
            >
              {type.badge && (
                <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                  {type.badge}
                </Badge>
              )}
              <CardContent className="p-8 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <type.icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{type.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {type.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};