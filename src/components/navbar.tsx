"use client"

import * as React from "react"
import logo from "../../public/logo.svg";
import Image from "next/image";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { NavigationMenuLink } from "@radix-ui/react-navigation-menu";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "./ui/navigation-menu";
import { Button } from "./ui/button";
import { ThemeToggle } from "./themeToggle";
import Link from "next/link";

const readItems = [
    {
        title: "Latest Articles",
        href: "/articles",
        description: "Read the most recent articles and insights from our community.",
    },
    {
        title: "Trending Topics",
        href: "/trending",
        description: "Discover what's popular and trending in your areas of interest.",
    },
    {
        title: "Featured Stories",
        href: "/featured",
        description: "Handpicked stories and content from top creators.",
    },
]

const features = [
    {
        title: "Content Creation",
        href: "/features/creation",
        description: "Powerful tools to create and publish your content.",
    },
    {
        title: "Analytics Dashboard",
        href: "/features/analytics",
        description: "Track your content performance and audience engagement.",
    },
    {
        title: "Community Features",
        href: "/features/community",
        description: "Connect with other creators and build your audience.",
    },
]

const useCases = [
    {
        title: "Bloggers",
        href: "/use-cases/bloggers",
        description: "Perfect for personal and professional blogging.",
    },
    {
        title: "Businesses",
        href: "/use-cases/business",
        description: "Scale your content marketing and brand presence.",
    },
    {
        title: "Educators",
        href: "/use-cases/education",
        description: "Share knowledge and create educational content.",
    },
]

const learnItems = [
    {
        title: "Getting Started",
        href: "/learn/getting-started",
        description: "Learn the basics of using our platform effectively.",
    },
    {
        title: "Best Practices",
        href: "/learn/best-practices",
        description: "Tips and strategies from successful creators.",
    },
    {
        title: "Video Tutorials",
        href: "/learn/tutorials",
        description: "Step-by-step video guides for all features.",
    },
]


export function Navbar() {
    return (
        // Navbar
        <nav className="w-screen h-16 flex justify-between items-center p-4 bg-neutral-50 text-neutral-950 dark:bg-neutral-900 dark:text-neutral-50" >
            {/* Left side */}
            <div className="flex" >
                <Link
                    href={"/"}
                    className="flex gap-2 cursor-pointer items-center "
                >
                    {/* logo */}
                    <Image
                        src={logo}
                        alt="logo"
                        height={40}
                    />
                    <span>Neko Press</span>
                </Link>
                <div
                    className="flex ml-6 items-center bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-50 p-2 rounded-md gap-2 cursor-text"
                >
                    <Search size={22} />
                    <Input type="text" placeholder="Search" className="bg-transparent placeholder:text-neutral-950 focus:ring-0 dark:placeholder:text-neutral-50" />
                </div>
            </div>

            {/* Right side */}
            <NavigationMenu>
                <NavigationMenuList className="flex items-center space-x-2">
                    {/* Read */}
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="bg-transparent">
                            Read
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid gap-3 p-4 md:w-[500px] lg:w-[600px] grid-cols-3">
                                <li className="row-span-3">
                                    <NavigationMenuLink asChild>
                                        <Link
                                            className="flex h-full w-full flex-col select-none justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                            href="/read"
                                        >
                                            <div className="mb-2 mt-4 text-lg font-medium">
                                                Explore Content
                                            </div>
                                            <p className="text-sm leading-tight text-muted-foreground">
                                                Discover amazing content from creators around the world.
                                            </p>
                                        </Link>
                                    </NavigationMenuLink>
                                </li>
                                {readItems.map((item) => (
                                    <ListItem key={item.title} title={item.title} href={item.href}>
                                        {item.description}
                                    </ListItem>
                                ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* Features */}
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="bg-transparent">
                            Features
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                {features.map((feature) => (
                                    <ListItem key={feature.title} title={feature.title} href={feature.href}>
                                        {feature.description}
                                    </ListItem>
                                ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* Use Cases Dropdown */}
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="bg-transparent">
                            Use Cases
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                {useCases.map((useCase) => (
                                    <ListItem key={useCase.title} title={useCase.title} href={useCase.href}>
                                        {useCase.description}
                                    </ListItem>
                                ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* Learn */}
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="bg-transparent">
                            Learn
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                {learnItems.map((item) => (
                                    <ListItem key={item.title} title={item.title} href={item.href}>
                                        {item.description}
                                    </ListItem>
                                ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* Price */}
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Link href="/pricing" className="">
                                Pricing
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    {/* Login */}
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Link href="/login" className="px-3 py-2 rounded-md transition-colors">
                                <span>Login</span>
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    {/* Sign up Button */}
                    <NavigationMenuItem>
                        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
                            <Link href="/signup">Sign up</Link>
                        </Button>
                    </NavigationMenuItem>

                    {/* Theme Toggle */}
                    <NavigationMenuItem>
                        <ThemeToggle />
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </nav>
    )
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
    )
}