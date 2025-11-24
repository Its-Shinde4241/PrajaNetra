import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Hook for smooth scroll to top on route change
export function useSmoothScrollOnRouteChange() {
    const location = useLocation();

    useEffect(() => {
        // Smooth scroll to top with a slight delay for animation
        const timer = setTimeout(() => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }, 150);

        return () => clearTimeout(timer);
    }, [location.pathname]);
}

// Hook for smooth intersection observer animations
export function useSmoothInView(threshold = 0.1) {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("animate-fade-in-up");
                    }
                });
            },
            { threshold, rootMargin: "50px" }
        );

        const elements = document.querySelectorAll("[data-animate-on-scroll]");
        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, [threshold]);
}

// Add these CSS classes to your global CSS for the animations
export const smoothAnimationClasses = `
  .animate-fade-in-up {
    animation: fadeInUp 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  /* Smooth transitions for all interactive elements */
  button, a, [role="button"] {
    transition: all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  button:hover, a:hover, [role="button"]:hover {
    transform: translateY(-1px);
  }

  button:active, a:active, [role="button"]:active {
    transform: translateY(0px) scale(0.98);
  }
`;