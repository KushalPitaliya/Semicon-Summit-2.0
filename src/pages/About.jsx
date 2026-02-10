import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Target, Lightbulb, Users, Trophy, ArrowRight, Image } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import ParticleField from '../components/ParticleField';
import './About.css';

const About = () => {
    const [galleryImages, setGalleryImages] = useState([]);
    const [galleryLoading, setGalleryLoading] = useState(true);

    // Fetch gallery images
    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const response = await api.get('/gallery/featured');
                setGalleryImages(response.data);
            } catch (error) {
                console.error('Error fetching gallery:', error);
            } finally {
                setGalleryLoading(false);
            }
        };
        fetchGallery();
    }, []);

    const previousEventImages = [
        { id: 1, title: 'VLSI Workshop 2024', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop', description: 'Participants learning chip design' },
        { id: 2, title: 'Hackathon Finals', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop', description: 'Teams presenting projects' },
        { id: 3, title: 'Expert Talk Session', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop', description: 'Industry expert sharing insights' },
        { id: 4, title: 'Networking Event', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop', description: 'Students connecting with professionals' },
        { id: 5, title: 'Award Ceremony', image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop', description: 'Winners receiving prizes' },
        { id: 6, title: 'Lab Session', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop', description: 'Hands-on learning experience' }
    ];

    return (
        <div className="about-page" style={{ position: 'relative', overflow: 'hidden' }}>
            <div className="hero-bg">
                <div className="hero-grid" />
                <div className="hero-glow hero-glow-1" />
                <div className="hero-glow hero-glow-2" />
                <ParticleField count={40} />
            </div>
            <Navbar />
            <div className="about-container" style={{ position: 'relative', zIndex: 1 }}>
                {/* Hero Section */}
                <div className="about-hero">
                    <h1>About <span className="text-gradient">Semiconductor Summit 2.0</span></h1>
                    <p className="hero-subtitle">Bridging Academia and Industry in Semiconductor Technology</p>
                </div>

                {/* Mission Section */}
                <section className="mission-section">
                    <div className="section-icon">
                        <Target size={40} />
                    </div>
                    <h2>Our Mission</h2>
                    <p>To provide students with comprehensive exposure to the semiconductor industry through hands-on workshops, expert talks, and industry interactions. SEMICONDUCTOR Summit 2.0 at CHARUSAT aims to bridge the gap between academia and industry innovation.</p>
                </section>

                {/* Why Attend Section */}
                <section className="why-attend-section">
                    <h2>Why Attend?</h2>
                    <div className="benefits-grid">
                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <Lightbulb size={32} />
                            </div>
                            <h3>Learn from Experts</h3>
                            <p>Industry professionals from leading semiconductor companies share their knowledge and experience</p>
                        </div>

                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <Users size={32} />
                            </div>
                            <h3>Network with Peers</h3>
                            <p>Connect with like-minded students and professionals passionate about semiconductor technology</p>
                        </div>

                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <Trophy size={32} />
                            </div>
                            <h3>Hands-on Experience</h3>
                            <p>Participate in workshops and hackathons to build practical skills in VLSI and embedded systems</p>
                        </div>

                        <div className="benefit-card">
                            <div className="benefit-icon">
                                <ArrowRight size={32} />
                            </div>
                            <h3>Career Opportunities</h3>
                            <p>Gain insights into career paths and connect with potential employers in the semiconductor industry</p>
                        </div>
                    </div>
                </section>

                {/* What We Offer */}
                <section className="offer-section">
                    <h2>What We Offer</h2>
                    <div className="offer-grid">
                        <div className="offer-item">
                            <h3>🎯 Expert-Led Workshops</h3>
                            <p>Hands-on training in VLSI design tools and methodologies used by industry leaders</p>
                        </div>
                        <div className="offer-item">
                            <h3>💡 Industry Insights</h3>
                            <p>Talks from chip architecture experts on latest trends and emerging technologies</p>
                        </div>
                        <div className="offer-item">
                            <h3>⚡ Competitions</h3>
                            <p>Pitch ideas in Silicon Shark Tank and showcase your skills in exciting challenges</p>
                        </div>
                        <div className="offer-item">
                            <h3>🤝 Panel Discussions</h3>
                            <p>Interactive sessions with industry leaders discussing career opportunities and challenges</p>
                        </div>
                        <div className="offer-item">
                            <h3>📜 Certificates</h3>
                            <p>Recognition for participation and achievement in workshops and competitions</p>
                        </div>
                        <div className="offer-item">
                            <h3>🌐 Networking</h3>
                            <p>Connect with peers, mentors, and potential employers in the semiconductor field</p>
                        </div>
                    </div>
                </section>

                {/* Who Should Attend */}
                <section className="audience-section">
                    <h2>Who Should Attend?</h2>
                    <div className="audience-grid">
                        <div className="audience-card">
                            <h3>Engineering Students</h3>
                            <p>Students from Electronics, Computer Science, and related fields interested in semiconductor technology</p>
                        </div>
                        <div className="audience-card">
                            <h3>Aspiring Engineers</h3>
                            <p>Those looking to build a career in VLSI design, chip architecture, or embedded systems</p>
                        </div>
                        <div className="audience-card">
                            <h3>Tech Enthusiasts</h3>
                            <p>Anyone passionate about learning cutting-edge semiconductor technologies and industry trends</p>
                        </div>
                    </div>
                </section>

                {/* ====== GLIMPSES SECTION ====== */}
                <section className="glimpse-section">
                    <h2>Glimpse of <span className="text-gradient">Summit 1.0</span></h2>
                    <p className="glimpse-subtitle">Relive the moments from our previous summit.</p>

                    <div className="glimpse-grid">
                        {galleryImages.length > 0 ? (
                            galleryImages.map((item) => (
                                <div key={item._id} className="about-glimpse-card">
                                    <div className="about-glimpse-image">
                                        <img src={item.thumbnailUrl || item.url} alt={item.title} loading="lazy" />
                                        <div className="about-glimpse-overlay"><Image size={24} /></div>
                                    </div>
                                    <div className="about-glimpse-content">
                                        <h4>{item.title}</h4>
                                        <p>{item.description || item.category}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            previousEventImages.map((item) => (
                                <div key={item.id} className="about-glimpse-card">
                                    <div className="about-glimpse-image">
                                        <img src={item.image} alt={item.title} loading="lazy" />
                                        <div className="about-glimpse-overlay"><Image size={24} /></div>
                                    </div>
                                    <div className="about-glimpse-content">
                                        <h4>{item.title}</h4>
                                        <p>{item.description}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Stats Section */}
                <section className="stats-section">
                    <div className="stat-item">
                        <h3>10</h3>
                        <p>Technical Events</p>
                    </div>
                    <div className="stat-item">
                        <h3>5+</h3>
                        <p>Industry Experts</p>
                    </div>
                    <div className="stat-item">
                        <h3>3</h3>
                        <p>Days of Learning</p>
                    </div>
                    <div className="stat-item">
                        <h3>₹299</h3>
                        <p>All-Inclusive Fee</p>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="about-cta">
                    <h2>Ready to Join the Summit?</h2>
                    <p>Register now and be part of this amazing learning experience</p>
                    <Link to="/register" className="btn btn-primary btn-large">
                        Register Now →
                    </Link>
                </section>
            </div>
            <Footer />
        </div>
    );
};

export default About;
