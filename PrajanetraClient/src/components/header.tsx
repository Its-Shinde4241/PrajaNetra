"use client";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { cn } from "@/lib/utils";
import { useScroll } from "motion/react";
import { Separator } from "@/components/ui/separator";
import { useLocation } from "react-router-dom"; // Import from react-router-dom
import webLogo from "@/assets/webLogo.png";
import { ThemeTogglerButton } from "./animate-ui/components/buttons/theme-toggler";
const menuItems = [
  { name: "Home", href: "/" },
  { name: "complaint", href: "/complaint" },
  { name: "track", href: "/track" },
  { name: "Reports Feed", href: "/reports-feed" },
  { name: "About", href: "#link" },
  { name: "Contact", href: "#link" },
];
import { NavUser } from "./nav-user";
export const Header = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const location = useLocation(); // Get current location

  const { scrollYProgress } = useScroll();

  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setScrolled(latest > 0.05);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  // Function to check if current path matches menu item
  const isCurrentPage = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <header>
      <nav
        data-state={menuState && "active"}
        className={cn(
          "fixed z-20 w-full h-14 border-b transition-colors duration-150",
          scrolled && "bg-background/50 backdrop-blur-xl"
        )}
      >
        <div className="px-3 h-full transition-all duration-300">
          <div className="relative flex h-full flex-wrap items-center justify-between gap-3 lg:gap-0">
            <div className="flex w-full h-full items-center justify-between gap-6 lg:w-auto">
              <a
                href="/"
                aria-label="home"
                className="flex gap-2 -mr-3 whitespace-nowrap items-center"
              >
                <img
                  src={webLogo}
                  alt="Prajanetra Logo"
                  height={50}
                  width={50}
                  className="h-10 z-10 w-full hidden dark:block object-contain"
                />
                <img
                  src={webLogo}
                  alt="Design Logo"
                  height={50}
                  width={50}
                  className="h-10 z-10 w-full dark:hidden block object-contain"
                />
              </a>

              <Separator className="hidden lg:block" orientation="vertical" />

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                className="relative z-20  -m-2.5 mr-2 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>

              <div className="hidden lg:block">
                <ul className="flex gap-10 text-sm">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <a
                        href={item.href}
                        className={cn(
                          "block duration-150",
                          isCurrentPage(item.href)
                            ? "text-accent-foreground"
                            : "text-muted-foreground hover:text-accent-foreground"
                        )}
                      >
                        <span>{item.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-background lg:h-14 in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-4 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <a
                        href={item.href}
                        className={cn(
                          "block duration-150",
                          isCurrentPage(item.href)
                            ? "text-accent-foreground"
                            : "text-muted-foreground hover:text-accent-foreground"
                        )}
                        onClick={() => setMenuState(false)} // Close mobile menu on click
                      >
                        <span>{item.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <Separator orientation="vertical" />
              {/* <Search /> */}
              <Separator orientation="vertical" />
              <ThemeTogglerButton direction="ttb" variant="ghost" className="cursor-pointer" />
              <Separator orientation="vertical" />
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <Button asChild variant="outline" size="sm">
                  <a href="#">
                    <span>Login</span>
                  </a>
                </Button>
                <Button asChild size="sm">
                  <a href="#">
                    <span>Sign Up</span>
                  </a>
                </Button>
                <NavUser user={{ name: "Shubham Shinde", email: "shinde@gmail.com", avatar: "" }} />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};