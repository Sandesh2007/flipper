"use client";

import * as React from "react";
import logo from "../../public/logo.svg";
import Image from "next/image";
import { Search, Menu, X } from "lucide-react";
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

const readItems = [
    { title: "Latest Articles", href: "/articles", description: "Read the most recent articles and insights from our community." },
    { title: "Trending Topics", href: "/trending", description: "Discover what's popular and trending in your areas of interest." },
    { title: "Featured Stories", href: "/featured", description: "Handpicked stories and content from top creators." },
];

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

    return (
        <nav className="w-screen bg-neutral-50 text-neutral-950 dark:bg-neutral-900 dark:text-neutral-50 shadow-sm">
            {/* Desktop & Mobile Container */}
            <div className="flex justify-between items-center p-2 w-screen">
                {/* Left Side: Logo & Search */}
                <div className="flex items-center gap-4">
                    <Link href="/" className="flex gap-2 items-center">
                        <Image src={logo} alt="logo" height={40} priority />
                        <span className="font-semibold text-lg">Neko Press</span>
                    </Link>
                    {/* Search (hidden on mobile) */}
                    <div className="hidden lg:flex ml-6 items-center bg-neutral-100 dark:bg-neutral-800 p-2 rounded-md gap-2">
                        <Search size={20} />
                        <Input
                            type="text"
                            placeholder="Search"
                            className="bg-transparent placeholder:text-neutral-500 focus:ring-0 dark:placeholder:text-neutral-400"
                        />
                    </div>
                </div>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-4">
                    <NavigationLinks />
                    <div className="flex items-center gap-2">
                        <Link href="/pricing" className="px-3 py-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 transition">
                            Pricing
                        </Link>
                        <Link href="/login" className="px-3 py-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 transition">
                            Login
                        </Link>
                        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Link href="/signup">Sign up</Link>
                        </Button>
                        <ThemeToggle />
                    </div>
                </div>

                {/* Mobile Hamburger */}
                <Button
                variant={"ghost"}
                    className="lg:hidden p-2 rounded-md"
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </Button>
            </div>

            {/* Mobile Dropdown */}
            {mobileOpen && (
                <div className="lg:hidden flex flex-col gap-2 px-4 pb-4">
                    <div className="flex flex-col gap-2">
                        <NavigationLinks />
                        <Link href="/pricing" className="block px-3 py-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 transition">
                            Pricing
                        </Link>
                        <Link href="/login" className="block px-3 py-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-800 transition">
                            Login
                        </Link>
                        <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                            <Link href="/signup">Sign up</Link>
                        </Button>
                        <ThemeToggle />
                        {/* Search Bar */}
                        <div className="flex mt-2 items-center bg-neutral-100 dark:bg-neutral-800 p-2 rounded-md gap-2">
                            <Search size={20} />
                            <Input
                                type="text"
                                placeholder="Search"
                                className="bg-transparent placeholder:text-neutral-500 focus:ring-0 focus:outline-0 w-full dark:placeholder:text-neutral-400"
                            />
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}

function NavigationLinks() {
    return (
        <NavigationMenu>
            <NavigationMenuList className="flex flex-col lg:flex-row lg:items-center lg:gap-2">
                <Dropdown title="Read" items={readItems} />
                <Dropdown title="Features" items={features} />
                <Dropdown title="Use Cases" items={useCases} />
                <Dropdown title="Learn" items={learnItems} />
            </NavigationMenuList>
        </NavigationMenu>
    );
}

function Dropdown({ title, items }: { title: string; items: typeof readItems }) {
    return (
        <NavigationMenuItem>
            <NavigationMenuTrigger className="bg-transparent">
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
