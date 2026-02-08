import { useEffect, useCallback } from 'react';

/**
 * Custom hook for semiconductor-themed click ripple effects
 * OPTIMIZED: Simple, performant click animation
 */
export const useCircuitRipple = () => {
    const createRipple = useCallback((e) => {
        // Don't create ripple on input fields
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }

        // Create simple ripple element
        const ripple = document.createElement('div');
        ripple.className = 'circuit-ripple-simple';
        ripple.style.cssText = `
            position: fixed;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            width: 20px;
            height: 20px;
            background: radial-gradient(circle, rgba(0, 255, 136, 0.6) 0%, transparent 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            pointer-events: none;
            z-index: 9999;
            animation: simpleRipple 0.4s ease-out forwards;
        `;

        document.body.appendChild(ripple);

        // Remove after animation
        setTimeout(() => ripple.remove(), 400);
    }, []);

    useEffect(() => {
        document.addEventListener('click', createRipple, { passive: true });
        return () => document.removeEventListener('click', createRipple);
    }, [createRipple]);
};

/**
 * Custom hook for simple hover glow effect
 */
export const useCircuitGlow = (ref) => {
    useEffect(() => {
        if (!ref.current) return;

        const element = ref.current;

        const handleMouseMove = (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            element.style.setProperty('--glow-x', `${x}px`);
            element.style.setProperty('--glow-y', `${y}px`);
        };

        element.addEventListener('mousemove', handleMouseMove, { passive: true });

        return () => {
            element.removeEventListener('mousemove', handleMouseMove);
        };
    }, [ref]);
};

// Simplified data flow - disabled by default as it can cause lag
export const useDataFlow = () => {
    // Disabled for performance
};

// Add simple keyframe animation
if (typeof document !== 'undefined') {
    const existingStyle = document.getElementById('semiconductor-effects-style');
    if (existingStyle) existingStyle.remove();

    const style = document.createElement('style');
    style.id = 'semiconductor-effects-style';
    style.textContent = `
        @keyframes simpleRipple {
            0% {
                transform: translate(-50%, -50%) scale(0);
                opacity: 1;
            }
            100% {
                transform: translate(-50%, -50%) scale(8);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

export default useCircuitRipple;
