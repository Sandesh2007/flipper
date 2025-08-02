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
    RefreshCw
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
            <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b">
                {/* Desktop & Mobile Container */}
                <div className="flex justify-between items-center px-3 sm:px-4 py-3 max-w-screen-xl mx-auto w-full">
                    {/* Left Side: Logo */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        <Link href={homePage} className="flex gap-2 items-center flex-shrink-0">
                            <Image src={logo} alt="logo" height={32} width={32} className="sm:h-10 sm:w-10" priority />
                            <span className="font-semibold text-base sm:text-lg">Neko Press</span>
                        </Link>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2 cursor-pointer hover:bg-accent transition-colors"
                            onClick={() => window.location.reload()}
                            aria-label="Refresh page"
                        >
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-4">
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
                                        <CurrentUserAvatar />
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
                        <ThemeToggle />
                        {user && (
                            <Link href="/profile" className="flex items-center gap-2 p-1 rounded-full hover:bg-accent transition-colors" aria-label="Go to profile">
                                <CurrentUserAvatar />
                            </Link>
                        )}
                        <ThemeToggle />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="lg:hidden hover:bg-accent transition-colors"
                            aria-label={mobileOpen ? "Close menu" : "Open menu"}
                            aria-expanded={mobileOpen}
                        >
                            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Search Bar removed */}
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
                                        <CurrentUserAvatar />
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
