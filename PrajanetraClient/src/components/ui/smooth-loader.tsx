import { motion } from "motion/react";

interface SmoothLoaderProps {
    isVisible?: boolean;
}

export function SmoothLoader({ isVisible = true }: SmoothLoaderProps) {
    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50  backdrop-blur-sm flex items-center justify-center"
        >
            <motion.div className="flex items-center gap-3">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="w-6 h-6 border-3 border-primary border-t-transparent rounded-full"
                />
                <motion.span
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="text-sm font-medium text-muted-foreground"
                >
                    Loading...
                </motion.span>
            </motion.div>
        </motion.div>
    );
}

// Component for smooth page transitions with stagger effects
interface StaggerContainerProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export function StaggerContainer({ children, className = "", delay = 0.1 }: StaggerContainerProps) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: delay,
                        delayChildren: 0.2,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

interface StaggerItemProps {
    children: React.ReactNode;
    className?: string;
    index?: number;
}

export function StaggerItem({ children, className = "", index = 0 }: StaggerItemProps) {
    return (
        <motion.div
            variants={{
                hidden: {
                    opacity: 0,
                    y: 30,
                    scale: 0.95,
                },
                visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                        mass: 0.8,
                        delay: index * 0.05,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}