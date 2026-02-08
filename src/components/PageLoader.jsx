import React, { useEffect, useState } from 'react';
import './PageLoader.css';

const PageLoader = ({ onLoadComplete }) => {
    const [progress, setProgress] = useState(0);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Smooth progress animation
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return Math.min(prev + 5, 100);
            });
        }, 50);

        // Start exit animation
        const exitTimer = setTimeout(() => {
            setIsExiting(true);
        }, 1800);

        // Complete load
        const completeTimer = setTimeout(() => {
            if (onLoadComplete) onLoadComplete();
        }, 2200);

        return () => {
            clearInterval(interval);
            clearTimeout(exitTimer);
            clearTimeout(completeTimer);
        };
    }, [onLoadComplete]);

    return (
        <div className={`page-loader ${isExiting ? 'exiting' : ''}`}>
            {/* Simple grid background */}
            <div className="loader-grid" />

            {/* Main content */}
            <div className="loader-content">
                {/* Simple chip icon */}
                <div className="loader-chip">
                    <div className="chip-inner">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="4" y="4" width="16" height="16" rx="2" />
                            <rect x="9" y="9" width="6" height="6" />
                            <line x1="9" y1="1" x2="9" y2="4" />
                            <line x1="15" y1="1" x2="15" y2="4" />
                            <line x1="9" y1="20" x2="9" y2="23" />
                            <line x1="15" y1="20" x2="15" y2="23" />
                            <line x1="1" y1="9" x2="4" y2="9" />
                            <line x1="1" y1="15" x2="4" y2="15" />
                            <line x1="20" y1="9" x2="23" y2="9" />
                            <line x1="20" y1="15" x2="23" y2="15" />
                        </svg>
                    </div>
                    <div className="chip-ring" />
                    <div className="chip-ring chip-ring-2" />
                </div>

                {/* Text */}
                <div className="loader-text">
                    <span className="loader-title">SEMICONDUCTOR</span>
                    <span className="loader-subtitle">SUMMIT 2.0</span>
                </div>

                {/* Progress bar */}
                <div className="loader-progress">
                    <div
                        className="loader-progress-fill"
                        style={{ transform: `scaleX(${progress / 100})` }}
                    />
                </div>
                <span className="loader-percent">{Math.round(progress)}%</span>
            </div>
        </div>
    );
};

export default PageLoader;
