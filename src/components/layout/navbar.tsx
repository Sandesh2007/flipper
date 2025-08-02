"use client";

import * as React from "react";
import logo from "../../../public/logo.svg";
import Image from "next/image";
import {
    Menu,
    X,
    Home,
    Library,
    FileText,
    Users,
    BarChart3,
    HelpCircle,
    Upload,
    ChevronDown,
    ChevronRight,
    ExternalLink,
    RefreshCw,
    Sparkles,
} from "lucide-react";
import { NavigationMenuLink } from "@radix-ui/react-navigation-menu";

import { Button } from "../ui/button";
import { ThemeToggle } from "../themeToggle";
import Link from "next/link";
import { useAuth } from "../auth/auth-context";
import { CurrentUserAvatar } from "../features/current-user-avatar";
import { useEffect, useState } from "react";

export function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const { user } = useAuth();
    const homePage = user ? "/home/publisher" : "/";

    // Close mobile menu when screen becomes large
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setMobileOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <nav className="bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-border/50 shadow-soft">
                {/* Desktop & Mobile Container */}
                <div className="flex justify-between items-center px-4 sm:px-6 py-4 max-w-screen-xl mx-auto w-full">
                    {/* Left Side: Logo */}
                    <div className="flex items-center gap-4">
                        <Link href={homePage} className="flex gap-3 items-center flex-shrink-0 group">
                            <div className="relative">
                                <Image src={logo} alt="logo" height={36} width={36} className="sm:h-12 sm:w-12 transition-transform duration-300 group-hover:scale-110" priority />
                                <div className="absolute inset-0 bg-gradient-hero rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-lg sm:text-xl text-gradient-hero">NekoPress</span>
                                <span className="text-xs text-muted-foreground hidden sm:block">Digital Publishing</span>
                            </div>
                        </Link>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 cursor-pointer hover:bg-accent transition-all duration-300 hover:scale-105 rounded-xl"
                            onClick={() => window.location.reload()}
                            aria-label="Refresh page"
                        >
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-6">
                        <div className="flex items-center gap-1">
                            <Link href="/discover" className="px-4 py-2 rounded-xl hover:bg-accent transition-all duration-300 text-sm font-medium hover:scale-105 group">
                                <span className="group-hover:text-primary transition-colors duration-300">Discover</span>
                            </Link>
                            <Link href="/pricing" className="px-4 py-2 rounded-xl hover:bg-accent transition-all duration-300 text-sm font-medium hover:scale-105 group">
                                <span className="group-hover:text-primary transition-colors duration-300">Pricing</span>
                            </Link>
                            {user ? (
                                <div className="flex items-center gap-3">
                                    <Link href="/profile" className="flex items-center gap-2 hover:scale-105 transition-all duration-300 rounded-xl p-2 hover:bg-accent">
                                        <CurrentUserAvatar />
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <Link href="/auth/register?mode=login" className="px-4 py-2 rounded-xl hover:bg-accent transition-all duration-300 text-sm font-medium hover:scale-105 group">
                                        <span className="group-hover:text-primary transition-colors duration-300">Login</span>
                                    </Link>
                                    <Button asChild className="bg-gradient-hero hover:shadow-glow text-white text-sm font-medium px-6 py-2 rounded-xl transition-all duration-300 hover:scale-105 group">
                                        <Link href="/auth/register?mode=signup">
                                            <Sparkles className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                                            Sign up
                                        </Link>
                                    </Button>
                                </>
                            )}
                            <ThemeToggle />
                        </div>
                    </div>

                    {/* Mobile Controls */}
                    <div className="flex items-center gap-3 lg:hidden">
                        <ThemeToggle />
                        {user && (
                            <Link href="/profile" className="flex items-center gap-2 p-2 rounded-xl hover:bg-accent transition-all duration-300" aria-label="Go to profile">
                                <CurrentUserAvatar />
                            </Link>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="lg:hidden hover:bg-accent transition-all duration-300 rounded-xl"
                            aria-label={mobileOpen ? "Close menu" : "Open menu"}
                            aria-expanded={mobileOpen}
                        >
                            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Slide-out Menu */}
                {mobileOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 bg-background/70 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
                            onClick={() => setMobileOpen(false)}
                        />

                        {/* Slide-out Panel */}
                        <div className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-gradient-card border-r border-border/50 z-50 lg:hidden transform transition-transform duration-300 ease-in-out overflow-y-auto shadow-soft animate-slide-in">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-border/50">
                                <Link href="/" className="flex gap-3 items-center" onClick={() => setMobileOpen(false)}>
                                    <Image src={logo} alt="logo" height={32} width={32} priority />
                                    <div className="flex flex-col">
                                        <span className="font-bold text-lg text-gradient-hero">NekoPress</span>
                                        <span className="text-xs text-muted-foreground">Digital Publishing</span>
                                    </div>
                                </Link>
                            </div>

                            {/* Upload Button */}
                            <div className="p-6 border-b border-border/50">
                                <Button variant="outline" className="w-full bg-gradient-hero hover:shadow-glow text-white border-primary/30 rounded-xl transition-all duration-300 hover:scale-105" onClick={() => setMobileOpen(false)}>
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload PDF
                                </Button>
                            </div>

                            {/* Navigation Menu */}
                            <div className="flex flex-col">
                                {/* Dashboard Navigation */}
                                {user && (
                                    <div className="px-6 py-4">
                                        <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Dashboard</h3>
                                        <div className="space-y-2">
                                            <MobileSidebarItem
                                                icon={<Home className="w-5 h-5" />}
                                                label="Home"
                                                href="/"
                                                onClick={() => setMobileOpen(false)}
                                            />

                                            <div>
                                                <div
                                                    className="flex items-center px-4 py-3 text-foreground hover:bg-accent rounded-xl cursor-pointer transition-all duration-300"
                                                    onClick={() => setIsLibraryOpen(!isLibraryOpen)}
                                                >
                                                    {isLibraryOpen ? <ChevronDown className="w-4 h-4 mr-3" /> : <ChevronRight className="w-4 h-4 mr-3" />}
                                                    <Library className="w-5 h-5 mr-3" />
                                                    My Library
                                                </div>
                                                {isLibraryOpen && (
                                                    <div className="ml-6 space-y-2 mt-2">
                                                        <MobileSidebarItem
                                                            icon={<FileText className="w-4 h-4" />}
                                                            label="Publications"
                                                            href="/home/publisher/publications"
                                                            onClick={() => setMobileOpen(false)}
                                                        />
                                                        <MobileSidebarItem
                                                            icon={<FileText className="w-4 h-4" />}
                                                            label="Articles"
                                                            href="/home/publisher/articles"
                                                            onClick={() => setMobileOpen(false)}
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <MobileSidebarItem
                                                icon={<Users className="w-5 h-5" />}
                                                label="Social Posts"
                                                href="/home/publisher/social"
                                                onClick={() => setMobileOpen(false)}
                                            />
                                            <MobileSidebarItem
                                                icon={<BarChart3 className="w-5 h-5" />}
                                                label="Statistics"
                                                href="/home/publisher/statistics"
                                                onClick={() => setMobileOpen(false)}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* User Section */}
                                <div className="px-6 py-6 border-t border-border/50 mt-auto">
                                    <Link href="/discover" className="block px-4 py-3 rounded-xl hover:bg-accent transition-all duration-300 text-sm mb-3" onClick={() => setMobileOpen(false)}>
                                        Discover
                                    </Link>
                                    <Link href="/pricing" className="block px-4 py-3 rounded-xl hover:bg-accent transition-all duration-300 text-sm mb-4" onClick={() => setMobileOpen(false)}>
                                        Pricing
                                    </Link>
                                    {user ? (
                                        <Link href="/profile" className="flex items-center gap-4 px-4 py-3 hover:bg-accent rounded-xl transition-all duration-300" onClick={() => setMobileOpen(false)}>
                                            <CurrentUserAvatar />
                                            <span className="font-medium text-sm truncate">{user.username || user.email}</span>
                                        </Link>
                                    ) : (
                                        <div className="space-y-3">
                                            <Link href="/auth/register?mode=login" className="block px-4 py-3 rounded-xl hover:bg-accent transition-all duration-300 text-sm" onClick={() => setMobileOpen(false)}>
                                                Login
                                            </Link>
                                            <Button asChild className="w-full bg-gradient-hero hover:shadow-glow text-white text-sm font-medium rounded-xl transition-all duration-300 hover:scale-105">
                                                <Link href="/auth/register?mode=signup" onClick={() => setMobileOpen(false)}>
                                                    <Sparkles className="w-4 h-4 mr-2" />
                                                    Sign up
                                                </Link>
                                            </Button>
                                        </div>
                                    )}

                                    {/* Plan Info */}
                                    {user && (
                                        <div className="mt-4 px-4 py-3 bg-gradient-card rounded-xl border border-border/50">
                                            <div className="text-xs text-muted-foreground">
                                                Current plan: <span className="text-foreground font-medium">Basic</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </nav>
        </>
    );
}

function MobileSidebarItem({
    icon,
    label,
    href,
    onClick
}: {
    icon: React.ReactNode;
    label: string;
    href: string;
    onClick: () => void;
}) {
    return (
        <Link
            href={href}
            className="flex items-center px-4 py-3 text-foreground hover:bg-accent rounded-xl cursor-pointer transition-all duration-300"
            onClick={onClick}
        >
            <span className="mr-3">{icon}</span>
            {label}
        </Link>
    );
}

function ListItem({
    title,
    children,
    href,
    ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
    return (
        <li {...props}>
            <NavigationMenuLink asChild>
                <Link
                    href={href}
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    );
}
