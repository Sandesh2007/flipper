import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "../../../public/logo.svg";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Youtube, TwitterIcon, Sparkles, Mail, Heart } from "lucide-react";
import { useAuth } from "../auth/auth-context";

const footerLinks = {
  product: [
    { name: "Features", href: "/" },
    { name: "Pricing", href: "/pricing" },
    { name: "Templates", href: "#templates" },
  ],
  resources: [
    { name: "Blog", href: "#blog" },
    { name: "Community", href: "/discover" },
  ],
  company: [
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" },
  ],
  legal: [
    { name: "Privacy", href: "#privacy" },
    { name: "Terms", href: "#terms" },
  ]
};

const socialLinks = [
  { icon: TwitterIcon, href: "#", label: "Twitter" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" }
];

export const Footer = () => {
  const { user } = useAuth()

  return (
    <footer className="bg-gradient-to-b from-background to-muted/20 border-t border-border/50">
      {/* Newsletter Section */}
      {!user && (
      <div className="border-b border-border/50">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-glass border border-primary/20 mb-6 animate-fade-in">
              <Mail className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Stay updated</span>
            </div>
            <h3 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-hero">
              Stay in the loop
            </h3>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Get the latest updates, tips, and resources delivered to your inbox. Join our community of creators.
            </p>
            <div className="flex gap-4 max-w-md mx-auto bg-gradient-card rounded-2xl p-2 shadow-soft">
              <Input
                placeholder="Enter your email" 
                className="flex-1 bg-transparent border-0 focus:ring-0 text-foreground placeholder:text-muted-foreground"
                type="email"
              />
              <Button className="bg-gradient-hero hover:shadow-glow text-white px-6">
                <Sparkles className="w-4 h-4 mr-2" />
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="relative">
                <div className="h-12 w-12 rounded-2xl flex items-center justify-center ">
                  <Image src={logo} alt="logo" className="w-8 h-8" />
                </div>
                <div className="absolute inset-0 rounded-2xl opacity-20 animate-pulse-slow"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gradient-hero">NekoPress</span>
                <span className="text-sm text-muted-foreground">Digital Publishing</span>
              </div>
            </div>
            <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
              Transform your static documents into engaging, interactive digital publications 
              that captivate your audience across all devices with stunning animations and modern design.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.href}
                  className="w-10 h-10 rounded-xl bg-gradient-card border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary  hover:scale-105 transition-all duration-300 group"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-bold text-lg mb-6 text-foreground">Product</h4>
            <ul className="space-y-4">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-muted-foreground hover:text-primary transition-all duration-300 text-sm hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-foreground">Resources</h4>
            <ul className="space-y-4">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-all duration-300 text-sm hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-foreground">Company</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-all duration-300 text-sm hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-foreground">Legal</h4>
            <ul className="space-y-4">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-all duration-300 text-sm hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              © 2024 NekoPress. Made with <Heart className="w-4 h-4 text-red-500" /> for creators worldwide.
            </p>
            <div className="flex items-center gap-6">
              <a href="#status" className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-y-[-1px]">
                Status
              </a>
              <a href="#sitemap" className="text-sm text-muted-foreground hover:text-primary transition-all duration-300 hover:translate-y-[-1px]">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};