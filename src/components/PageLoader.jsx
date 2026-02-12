import { useEffect, useState, useRef } from 'react';
import './PageLoader.css';

const FABRICATION_STEPS = [
    "Design & Simulation",
    "Wafer Production",
    "Photolithography",
    "Etching & Deposition",
    "Ion Implantation",
    "Assembly & Packaging",
    "Final Testing",
];

// Generate stable random values once
const ELECTRON_LINES = Array.from({ length: 20 }, (_, i) => ({
    width: `${30 + (i * 17) % 50}%`,
    top: `${(i * 5.3) % 100}%`,
    duration: `${2 + (i * 0.7) % 3}s`,
    delay: `${(i * 0.4) % 3}s`,
}));

const PageLoader = ({ onLoadComplete }) => {
    const [progress, setProgress] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
    const [isExiting, setIsExiting] = useState(false);
    const onCompleteRef = useRef(onLoadComplete);

    useEffect(() => {
        onCompleteRef.current = onLoadComplete;
    }, [onLoadComplete]);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return Math.min(prev + 2, 100);
            });
        }, 30);

        return () => clearInterval(interval);
    }, []);

    // Update step based on progress
    useEffect(() => {
        const stepIndex = Math.min(
            Math.floor((progress / 100) * FABRICATION_STEPS.length),
            FABRICATION_STEPS.length - 1
        );
        setCurrentStep(stepIndex);
    }, [progress]);

    // Trigger exit and completion
    useEffect(() => {
        if (progress >= 100) {
            const exitTimer = setTimeout(() => setIsExiting(true), 400);
            const completeTimer = setTimeout(() => {
                if (onCompleteRef.current) onCompleteRef.current();
            }, 1200);
            return () => {
                clearTimeout(exitTimer);
                clearTimeout(completeTimer);
            };
        }
    }, [progress]);

    return (
        <div className={`page-loader ${isExiting ? 'exiting' : ''}`}>
            {/* Grid background */}
            <div className="loader-grid" />

            {/* Electron flow lines */}
            <div className="electron-flow">
                {ELECTRON_LINES.map((line, i) => (
                    <div
                        key={i}
                        className="electron-line"
                        style={{
                            width: line.width,
                            top: line.top,
                            animationDuration: line.duration,
                            animationDelay: line.delay,
                        }}
                    />
                ))}
            </div>

            {/* Brand badge - appears at 20% */}
            <div className={`loader-brand ${progress >= 20 ? 'visible' : ''}`}>
                <div className="brand-text">
                    SEMICONDUCTOR
                    <br />
                    <span className="brand-highlight">SUMMIT 2.0</span>
                </div>
            </div>

            {/* Event badge - appears at 50% */}
            <div className={`loader-event-badge ${progress >= 50 ? 'visible' : ''}`}>
                <div className="event-date">17–19</div>
                <div className="event-month">March 2026</div>
                <div className="event-divider" />
                <div className="event-venue">
                    Dept. of Electronics & Communication
                    <br />
                    Engineering – CSPIT, CHARUSAT
                </div>
            </div>

            {/* Main content */}
            <div className="loader-content">
                {/* Chip with pins */}
                <div className="loader-chip">
                    {/* Top pins */}
                    <div className="chip-pins-row top">
                        {[0, 1, 2, 3].map(i => <div key={i} className="chip-pin" style={{ animationDelay: `${i * 0.1}s` }} />)}
                    </div>
                    {/* Bottom pins */}
                    <div className="chip-pins-row bottom">
                        {[0, 1, 2, 3].map(i => <div key={i} className="chip-pin" style={{ animationDelay: `${i * 0.1 + 0.4}s` }} />)}
                    </div>
                    {/* Left pins */}
                    <div className="chip-pins-col left">
                        {[0, 1, 2].map(i => <div key={i} className="chip-pin" style={{ animationDelay: `${i * 0.15}s` }} />)}
                    </div>
                    {/* Right pins */}
                    <div className="chip-pins-col right">
                        {[0, 1, 2].map(i => <div key={i} className="chip-pin" style={{ animationDelay: `${i * 0.15 + 0.3}s` }} />)}
                    </div>

                    {/* Chip body */}
                    <div className="loader-chip-inner">
                        <span className="chip-progress">{progress}%</span>
                    </div>
                    <div className="chip-ring" />
                    <div className="chip-ring chip-ring-2" />
                </div>

                {/* Boot step text */}
                <div className="loader-boot-text" key={currentStep}>
                    {FABRICATION_STEPS[currentStep]}
                </div>

                {/* Progress bar */}
                <div className="loader-progress">
                    <div
                        className="loader-progress-fill"
                        style={{ transform: `scaleX(${progress / 100})` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default PageLoader;
