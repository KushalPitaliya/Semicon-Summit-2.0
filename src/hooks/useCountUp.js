import { useState, useEffect, useRef } from 'react';

/**
 * Animated counter that counts up when the element scrolls into view.
 * @param {string} target - Target value string like "500+", "₹50K+", "15+"
 * @param {number} duration - Animation duration in ms
 */
const useCountUp = (target, duration = 2000) => {
    const [display, setDisplay] = useState('0');
    const ref = useRef(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;
                    animateValue();
                }
            },
            { threshold: 0.5 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [target]);

    const animateValue = () => {
        // Extract numeric part and suffix
        const match = target.match(/^([₹]?)(\d+)(.*)$/);
        if (!match) {
            setDisplay(target);
            return;
        }

        const prefix = match[1];
        const num = parseInt(match[2], 10);
        const suffix = match[3];
        const startTime = performance.now();

        const step = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * num);

            setDisplay(`${prefix}${current}${suffix}`);

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        };

        requestAnimationFrame(step);
    };

    return [ref, display];
};

export default useCountUp;
