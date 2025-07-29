"use client";

import * as React from "react";
import logo from "../../public/logo.svg";
import Image from "next/image";
import {
    Search,
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
    ExternalLink
} from "lucide-react";
import { Input } from "./ui/input";
import { NavigationMenuLink } from "@radix-ui/react-navigation-menu";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { Button } from "./ui/button";
import { ThemeToggle } from "./themeToggle";
import Link from "next/link";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useAuth } from "./auth-context";
import { CurrentUserAvatar } from "./current-user-avatar";
import { useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';

const features = [
    { title: "Content Creation", href: "/features/creation", description: "Powerful tools to create and publish your content." },
    { title: "Analytics Dashboard", href: "/features/analytics", description: "Track your content performance and audience engagement." },
    { title: "Community Features", href: "/features/community", description: "Connect with other creators and build your audience." },
];

const useCases = [
    { title: "Bloggers", href: "/use-cases/bloggers", description: "Perfect for personal and professional blogging." },
    { title: "Businesses", href: "/use-cases/business", description: "Scale your content marketing and brand presence." },
    { title: "Educators", href: "/use-cases/education", description: "Share knowledge and create educational content." },
];

const learnItems = [
    { title: "Getting Started", href: "/learn/getting-started", description: "Learn the basics of using our platform effectively." },
    { title: "Best Practices", href: "/learn/best-practices", description: "Tips and strategies from successful creators." },
    { title: "Video Tutorials", href: "/learn/tutorials", description: "Step-by-step video guides for all features." },
];

export function Navbar() {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isLibraryOpen, setIsLibraryOpen] = React.useState(false);
    const { user } = useAuth();
    const [search, setSearch] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleSearch = async (value: string) => {
        setSearch(value);
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        if (!value) {
            setResults([]);
            setShowDropdown(false);
            return;
        }
        searchTimeout.current = setTimeout(async () => {
            const supabase = createClient();
            const { data } = await supabase.from('profiles').select('username,avatar_url').ilike('username', `%${value}%`).limit(5);
            setResults(data || []);
            setShowDropdown(true);
        }, 200);
    };

    // Close mobile menu when screen becomes large
    React.useEffect(() => {
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
            <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b">
                {/* Desktop & Mobile Container */}
                <div className="flex justify-between items-center px-3 sm:px-4 py-3 max-w-screen-xl mx-auto w-full">
                    {/* Left Side: Logo & Search */}
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 lg:flex-initial">
                        <Link href="/" className="flex gap-2 items-center flex-shrink-0">
                            <Image src={logo} alt="logo" height={32} width={32} className="sm:h-10 sm:w-10" priority />
                            <span className="font-semibold text-base sm:text-lg">Neko Press</span>
                        </Link>

                        {/* Search (hidden on small mobile, shown on tablet+) */}
                        <div className="hidden sm:flex lg:flex flex-1 max-w-xs lg:max-w-sm mx-2 lg:mx-4 bg-neutral-100 dark:bg-neutral-800 p-2 rounded-md relative">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Find creators and content"
                                    className="pl-10 bg-transparent border-none focus:outline-none w-full text-sm"
                                    value={search}
                                    onChange={e => handleSearch(e.target.value)}
                                    onFocus={() => search && setShowDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                                />
                                {showDropdown && results.length > 0 && (
                                    <div className="absolute left-0 right-0 top-10 z-50 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                                        {results.map((profile) => (
                                            <Link
                                                key={profile.username}
                                                href={`/profile/${profile.username}`}
                                                className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition"
                                                onClick={() => setShowDropdown(false)}
                                            >
                                                {profile.avatar_url ? (
                                                    <img src={profile.avatar_url} alt="avatar" className="w-7 h-7 rounded-full object-cover border border-border" />
                                                ) : (
                                                    <div className="w-7 h-7 rounded-full bg-muted border border-border" />
                                                )}
                                                <span className="font-medium text-foreground">{profile.username}</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-4">
                        <NavigationLinks />
                        <div className="flex items-center gap-2">
                            <Link href="/discover" className="px-3 py-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 transition text-sm">
                                Discover
                            </Link>
                            <Link href="/pricing" className="px-3 py-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 transition text-sm">
                                Pricing
                            </Link>
                            {user ? (
                                <div className="flex items-center gap-2">
                                    <Link href="/profile" className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <CurrentUserAvatar />
                                            <AvatarFallback className="text-xs">
                                                {user.username?.[0] || user.email[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <Link href="/auth/register?mode=login" className="px-3 py-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 transition text-sm">
                                        Login
                                    </Link>
                                    <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white text-sm">
                                        <Link href="/auth/register?mode=signup">Sign up</Link>
                                    </Button>
                                </>
                            )}
                            <ThemeToggle />
                        </div>
                    </div>

                    {/* Mobile Controls */}
                    <div className="flex items-center gap-2 lg:hidden">
                        {user && (
                            <Link href="/profile" className="flex items-center gap-2">
                                <Avatar className="h-8 w-8">
                                    <CurrentUserAvatar />
                                    <AvatarFallback className="text-xs">
                                        {user.username?.[0] || user.email[0]}
                                    </AvatarFallback>
                                </Avatar>
                            </Link>
                        )}
                        <ThemeToggle />
                        <Button
                            variant="ghost"
                            className="p-2 rounded-md"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            aria-label={mobileOpen ? "Close menu" : "Open menu"}
                        >
                            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Search Bar (visible on small screens) */}
                <div className="block sm:hidden px-3 pb-3">
                    <div className="relative bg-neutral-100 dark:bg-neutral-800 p-2 rounded-md">
                        <Search className="absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Find creators and content"
                            className="pl-10 bg-transparent border-none focus:outline-none w-full text-sm"
                            value={search}
                            onChange={e => handleSearch(e.target.value)}
                            onFocus={() => search && setShowDropdown(true)}
                            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                        />
                        {showDropdown && results.length > 0 && (
                            <div className="absolute left-0 right-0 top-10 z-50 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                                {results.map((profile) => (
                                    <Link
                                        key={profile.username}
                                        href={`/profile/${profile.username}`}
                                        className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        {profile.avatar_url ? (
                                            <img src={profile.avatar_url} alt="avatar" className="w-7 h-7 rounded-full object-cover border border-border" />
                                        ) : (
                                            <div className="w-7 h-7 rounded-full bg-muted border border-border" />
                                        )}
                                        <span className="font-medium text-foreground">{profile.username}</span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Mobile Slide-out Menu */}
            {mobileOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-background/70 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setMobileOpen(false)}
                    />

                    {/* Slide-out Panel */}
                    <div className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-background border-r z-50 lg:hidden transform transition-transform duration-300 ease-in-out overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b">
                            <Link href="/" className="flex gap-2 items-center" onClick={() => setMobileOpen(false)}>
                                <Image src={logo} alt="logo" height={32} width={32} priority />
                                <span className="font-semibold text-lg">Neko Press</span>
                            </Link>
                            {/* <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setMobileOpen(false)}
                                className="p-2"
                            >
                                <X size={20} />
                            </Button> */}
                        </div>

                        {/* Upload Button */}
                        <div className="p-4 border-b">
                            <Button variant="outline" className="w-full" onClick={() => setMobileOpen(false)}>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload
                            </Button>
                        </div>

                        {/* Navigation Menu */}
                        <div className="flex flex-col">
                            {/* Dashboard Navigation */}
                            {user && (
                                <div className="px-4 py-2">
                                    <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">Dashboard</h3>
                                    <div className="space-y-1">
                                        <MobileSidebarItem
                                            icon={<Home className="w-5 h-5" />}
                                            label="Home"
                                            href="/"
                                            onClick={() => setMobileOpen(false)}
                                        />

                                        <div>
                                            <div
                                                className="flex items-center px-3 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md cursor-pointer"
                                                onClick={() => setIsLibraryOpen(!isLibraryOpen)}
                                            >
                                                {isLibraryOpen ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
                                                <Library className="w-5 h-5 mr-3" />
                                                My Library
                                            </div>
                                            {isLibraryOpen && (
                                                <div className="ml-6 space-y-1">
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

                                        <div className="flex items-center px-3 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md cursor-pointer">
                                            <HelpCircle className="w-5 h-5 mr-3" />
                                            <span>Help Center</span>
                                            <ExternalLink className="w-4 h-4 ml-auto" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* User Section */}
                            <div className="px-4 py-4 border-t mt-auto">
                                <Link href="/discover" className="block px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition text-sm mb-2" onClick={() => setMobileOpen(false)}>
                                    Discover
                                </Link>
                                <Link href="/pricing" className="block px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition text-sm mb-2" onClick={() => setMobileOpen(false)}>
                                    Pricing
                                </Link>
                                {user ? (
                                    <Link href="/profile" className="flex items-center gap-3 px-3 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition">
                                        <Avatar className="h-8 w-8">
                                            <CurrentUserAvatar />
                                            <AvatarFallback className="text-xs">
                                                {user.username?.[0] || user.email[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium text-sm truncate">{user.username || user.email}</span>
                                    </Link>
                                ) : (
                                    <div className="space-y-2">
                                        <Link href="/auth/register?mode=login" className="block px-3 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition text-sm" onClick={() => setMobileOpen(false)}>
                                            Login
                                        </Link>
                                        <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm">
                                            <Link href="/auth/register?mode=signup" onClick={() => setMobileOpen(false)}>Sign up</Link>
                                        </Button>
                                    </div>
                                )}

                                {/* Plan Info */}
                                {user && (
                                    <div className="mt-4 px-3 py-2 bg-neutral-100 dark:bg-neutral-800 rounded-md">
                                        <div className="text-xs text-neutral-600 dark:text-neutral-400">
                                            Current plan: <span className="text-neutral-800 dark:text-neutral-100 font-medium">Basic</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

function NavigationLinks() {
    return (
        <NavigationMenu>
            <NavigationMenuList className="flex items-center gap-2">
                <Dropdown title="Features" items={features} />
                <Dropdown title="Use Cases" items={useCases} />
                <Dropdown title="Learn" items={learnItems} />
            </NavigationMenuList>
        </NavigationMenu>
    );
}

function MobileNavigationLinks({ onClose }: { onClose: () => void }) {
    return (
        <div className="space-y-1">
            <MobileDropdown title="Features" items={features} onClose={onClose} />
            <MobileDropdown title="Use Cases" items={useCases} onClose={onClose} />
            <MobileDropdown title="Learn" items={learnItems} onClose={onClose} />
        </div>
    );
}

function Dropdown({ title, items }: { title: string; items: typeof features | typeof useCases | typeof learnItems }) {
    return (
        <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent text-sm">
                {title}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
                <ul className="grid w-[300px] gap-3 p-4 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {items.map((item) => (
                        <ListItem key={item.title} title={item.title} href={item.href}>
                            {item.description}
                        </ListItem>
                    ))}
                </ul>
            </NavigationMenuContent>
        </NavigationMenuItem>
    );
}

function MobileDropdown({ title, items, onClose }: { title: string; items: typeof features | typeof useCases | typeof learnItems; onClose: () => void }) {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div>
            <div
                className="flex items-center justify-between px-3 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-sm font-medium">{title}</span>
                {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </div>
            {isOpen && (
                <div className="ml-4 mt-1 space-y-1">
                    {items.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className="block px-3 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
                            onClick={onClose}
                        >
                            {item.title}
                        </Link>
                    ))}
                </div>
            )}
        </div>
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
            className="flex items-center px-3 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md cursor-pointer"
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
