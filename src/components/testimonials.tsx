import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Marketing Director",
    company: "TechCorp",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=100&h=100&fit=crop&crop=face",
    content: "This platform transformed how we share our quarterly reports. The flipbook format is so much more engaging than static PDFs.",
    rating: 5,
    verified: true
  },
  {
    name: "Michael Rodriguez",
    role: "Creative Director",
    company: "Design Studio",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    content: "The conversion quality is incredible. Our design portfolios look exactly as intended, and the analytics help us understand our audience.",
    rating: 5,
    verified: true
  },
  {
    name: "Emily Johnson",
    role: "Content Manager",
    company: "Publishing Co",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    content: "We've increased our content engagement by 300% since switching to interactive flipbooks. The social sharing features are fantastic.",
    rating: 5,
    verified: false
  },
  {
    name: "David Park",
    role: "Sales Manager",
    company: "Real Estate Firm",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    content: "Property brochures have never looked better. Clients love the interactive experience, and it's helped us close more deals.",
    rating: 4,
    verified: true
  }
];

export const Testimonials = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Loved by creators worldwide
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of professionals who trust our platform to bring their content to life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-neutral-200 dark:bg-neutral-900 border-0 hover:shadow-soft transition-all duration-300 relative"
            >
              <CardContent className="p-8">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>

                <blockquote className="text-foreground mb-6 leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </blockquote>

                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      {testimonial.verified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};