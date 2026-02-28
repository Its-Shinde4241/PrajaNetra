"use client";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { cn } from "@/lib/utils";
import { useScroll } from "motion/react";
import { Separator } from "@/components/ui/separator";
import { useLocation, Link } from "react-router-dom";
import favicon from "@/assets/favicon.svg";
import { ThemeTogglerButton } from "./animate-ui/components/buttons/theme-toggler";
import { NavUser } from "./nav-user";
import { useUserStore } from "@/store/userStore";

const menuItems = [
  { name: "Home", href: "/" },
  { name: "complaint", href: "/complaint" },
  { name: "track", href: "/track" },
  { name: "Reports Feed", href: "/reports-feed" },
  { name: "About", href: "#link" },
  { name: "Contact", href: "#link" },
];

const adminMenuItems = [
  { name: "Dashboard", href: "/admin/dashboard" },
  { name: "Complaints", href: "/admin/complaints" },
  { name: "Users", href: "/admin/users" },
];

export const Header = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useUserStore();

  // Check if user is admin or staff
  const isAdminOrStaff = user?.roles?.includes("ADMIN") || user?.roles?.includes("STAFF");

  // Combine menu items based on user role
  const displayMenuItems = isAdminOrStaff
    ? [...menuItems, ...adminMenuItems]
    : menuItems;

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

  // Helper to check if href is an internal route (not a hash link)
  const isInternalRoute = (href: string) => href.startsWith("/");

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
              <Link
                to="/"
                aria-label="home"
                className="flex gap-2 -mr-3 whitespace-nowrap items-center"
              >
                <img
                  src={favicon}
                  alt="Prajanetra Logo"
                  height={50}
                  width={50}
                  className="h-10 z-10 w-full hidden dark:block object-contain"
                />
                <img
                  src={favicon}
                  alt="Design Logo"
                  height={50}
                  width={50}
                  className="h-10 z-10 w-full dark:hidden block object-contain"
                />
              </Link>

              <Separator className="hidden lg:block" orientation="vertical" />

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState == true ? "Close Menu" : "Open Menu"}
                className="relative z-20  -m-2.5 mr-2 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>

              <div className="hidden lg:block h-full  items-center">
                <ul className="flex gap-10 text-sm h-full items-center">
                  {displayMenuItems.map((item, index) => (
                    <li key={index}>
                      {isInternalRoute(item.href) ? (
                        <Link
                          to={item.href}
                          className={cn(
                            "block duration-150 h-full",
                            isCurrentPage(item.href)
                              ? "text-accent-foreground"
                              : "text-muted-foreground hover:text-accent-foreground"
                          )}
                        >
                          <span>{item.name}</span>
                        </Link>
                      ) : (
                        <a
                          href={item.href}
                          className={cn(
                            "block duration-150",
                            "text-muted-foreground hover:text-accent-foreground"
                          )}
                        >
                          <span>{item.name}</span>
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-background lg:h-14 in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-4 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {displayMenuItems.map((item, index) => (
                    <li key={index}>
                      {isInternalRoute(item.href) ? (
                        <Link
                          to={item.href}
                          className={cn(
                            "block duration-150",
                            isCurrentPage(item.href)
                              ? "text-accent-foreground"
                              : "text-muted-foreground hover:text-accent-foreground"
                          )}
                          onClick={() => setMenuState(false)}
                        >
                          <span>{item.name}</span>
                        </Link>
                      ) : (
                        <a
                          href={item.href}
                          className={cn(
                            "block duration-150",
                            "text-muted-foreground hover:text-accent-foreground"
                          )}
                          onClick={() => setMenuState(false)}
                        >
                          <span>{item.name}</span>
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              <Separator orientation="vertical" />
              <ThemeTogglerButton direction="ttb" variant="ghost" className="cursor-pointer" />
              <Separator orientation="vertical" />
              {isAuthenticated && user ? (
                <NavUser
                  user={{
                    name: user.name,
                    email: user.email,
                    avatar: user.profileImageUrl || ""
                  }}
                />
              ) : (
                <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/login">
                      <span>Login</span>
                    </Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link to="/signup">
                      <span>Sign Up</span>
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};