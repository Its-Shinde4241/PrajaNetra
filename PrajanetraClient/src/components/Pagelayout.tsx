// components/PageLayout.tsx
import { type ReactNode } from "react";
import { motion } from "motion/react";
import { useLocation } from "react-router-dom";
import { useSmoothScrollOnRouteChange } from "../hooks/use-smooth-animations";

type PageLayoutProps = {
    children: ReactNode;
};

const getPageVariants = (pathname: string, shouldReduceMotion: boolean = false) => {
    if (shouldReduceMotion) {
        return {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
        };
    }

    // Different animations for different routes
    const routeSpecificVariants: Record<string, any> = {
        "/": {
            initial: {
                scale: 0.96,
                opacity: 0,
                y: 50,
                rotateX: 8,
            },
            animate: {
                scale: 1,
                opacity: 1,
                y: 0,
                rotateX: 0,
                transition: {
                    type: "spring",
                    stiffness: 250,
                    damping: 30,
                    mass: 0.9,
                    velocity: 2,
                },
            },
            exit: {
                scale: 0.96,
                opacity: 0,
                y: -30,
                rotateX: -4,
                transition: {
                    type: "spring",
                    stiffness: 350,
                    damping: 35,
                    mass: 0.7,
                },
            },
        },
        "/complaint": {
            initial: {
                x: "100%",
                opacity: 0,
                scale: 0.97,
                filter: "blur(2px)",
            },
            animate: {
                x: "0%",
                opacity: 1,
                scale: 1,
                filter: "blur(0px)",
                transition: {
                    type: "spring",
                    stiffness: 220,
                    damping: 28,
                    mass: 0.8,
                    velocity: 1.5,
                },
            },
            exit: {
                x: "-100%",
                opacity: 0,
                scale: 0.97,
                filter: "blur(1px)",
                transition: {
                    type: "spring",
                    stiffness: 280,
                    damping: 32,
                    mass: 0.7,
                },
            },
        },
        "/track": {
            initial: {
                x: "100%",
                opacity: 0,
                rotateY: 20,
                scale: 0.95,
            },
            animate: {
                x: "0%",
                opacity: 1,
                rotateY: 0,
                scale: 1,
                transition: {
                    type: "spring",
                    stiffness: 240,
                    damping: 26,
                    mass: 0.85,
                    velocity: 1.8,
                },
            },
            exit: {
                x: "-100%",
                opacity: 0,
                rotateY: -20,
                scale: 0.95,
                transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 35,
                    mass: 0.7,
                },
            },
        },
        "/reports-feed": {
            initial: {
                opacity: 0,
                rotateY: 120,
                scale: 0.85,
                z: -50,
            },
            animate: {
                opacity: 1,
                rotateY: 0,
                scale: 1,
                z: 0,
                transition: {
                    type: "spring",
                    stiffness: 200,
                    damping: 25,
                    mass: 0.9,
                    velocity: 1.2,
                },
            },
            exit: {
                opacity: 0,
                rotateY: -120,
                scale: 0.85,
                z: -50,
                transition: {
                    type: "spring",
                    stiffness: 250,
                    damping: 30,
                    mass: 0.8,
                },
            },
        },
    };

    return routeSpecificVariants[pathname] || routeSpecificVariants["/complaint"];
};

export function PageLayout({ children }: PageLayoutProps) {
    const location = useLocation();
    useSmoothScrollOnRouteChange(); // Smooth scroll to top on route change

    // Simple reduced motion check using CSS media query
    const shouldReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pageVariants = getPageVariants(location.pathname, shouldReduceMotion);

    return (
        <motion.main
            className="h-full w-full relative"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
                transformStyle: "preserve-3d",
                perspective: "1000px",
            }}
        >
            {/* Content blur effect for smoother transitions */}
            <motion.div
                initial={{
                    filter: "blur(3px)",
                    opacity: 0.8,
                    scale: 0.99
                }}
                animate={{
                    filter: "blur(0px)",
                    opacity: 1,
                    scale: 1,
                    transition: {
                        delay: 0.15,
                        duration: 0.4,
                        ease: [0.25, 0.46, 0.45, 0.94],
                        filter: {
                            duration: 0.3,
                            ease: [0.4, 0, 0.2, 1]
                        }
                    }
                }}
                className="w-full h-full"
            >
                {children}
            </motion.div>
        </motion.main>
    );
}
