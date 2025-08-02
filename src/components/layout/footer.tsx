import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "../../../public/logo.svg";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Youtube, TwitterIcon } from "lucide-react";
import { useAuth } from "../auth/auth-context";

const footerLinks = {
  product: [
    { name: "Features", href: "/" },
    { name: "Pricing", href: "/pricing" },
  ],
  resources: [
    { name: "Blog", href: "#blog" },
    { name: "Community", href: "/discover" },
  ],
  company: [
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" }
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
    <footer className="bg-secondary/50 border-t border-border">
      {/* Newsletter Section */}
      {!user && (
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Stay in the loop</h3>
            <p className="text-muted-foreground mb-8">
              Get the latest updates, tips, and resources delivered to your inbox.
            </p>
            <div className="flex gap-4 max-w-md mx-auto bg-neutral-200 dark:bg-neutral-800 rounded-lg p-2">
              <Input
                placeholder="Enter your email" 
                className="flex-1 bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 !outline-none !border-none focus:outline-none focus:border-none focus:ring-0"
                type="email"
              />
              <Button className="bg-blue-700 text-neutral-100 hover:bg-blue-600 ">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="h-8 w-8 rounded-lg bg-gradient-hero flex items-center justify-center">
                <Image
                  src={logo} alt={"logo"}                />
              </div>
              <span className="text-neutral-900 dark:text-neutral-100 font-bold text-xl bg-gradient-hero bg-clip-text">
                Neko Press
              </span>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Transform your static documents into engaging, interactive digital publications 
              that captivate your audience across all devices.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
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
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 Neko Press. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#status" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Status
              </a>
              <a href="#sitemap" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};