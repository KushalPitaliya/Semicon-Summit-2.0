import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Cpu, CircuitBoard, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ParticleField from '../components/ParticleField';
import './NotFound.css';

const NotFound = () => {
    return (
        <div className="not-found-page">
            <Navbar />

            <section className="not-found-hero">
                <div className="hero-bg">
                    <div className="hero-grid" />
                    <ParticleField count={50} />
                </div>

                <div className="not-found-content">
                    <div className="error-code-wrapper">
                        <div className="error-digit">4</div>
                        <div className="error-chip">
                            <Cpu size={64} />
                            <div className="chip-pulse" />
                        </div>
                        <div className="error-digit">4</div>
                    </div>

                    <h1 className="not-found-title">Signal Not Found</h1>
                    <p className="not-found-desc">
                        The circuit path you're looking for doesn't exist or has been rerouted.
                        Looks like this silicon trace leads nowhere.
                    </p>

                    <div className="not-found-details">
                        <div className="detail-item">
                            <CircuitBoard size={18} />
                            <span>Invalid route detected</span>
                        </div>
                        <div className="detail-item">
                            <Zap size={18} />
                            <span>No signal on this path</span>
                        </div>
                    </div>

                    <div className="not-found-actions">
                        <Link to="/" className="nf-btn nf-btn-primary">
                            <Home size={20} />
                            Return Home
                        </Link>
                        <button onClick={() => window.history.back()} className="nf-btn nf-btn-outline">
                            <ArrowLeft size={20} />
                            Go Back
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default NotFound;
