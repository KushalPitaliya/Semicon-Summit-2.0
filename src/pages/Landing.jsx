import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    Cpu, Calendar, MapPin, Users, Zap, Award,
    ArrowRight, Sparkles, CircuitBoard, ChevronRight,
    CheckCircle2, Target, Building2, GraduationCap, Globe,
    Linkedin
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ParticleField from '../components/ParticleField'
import StatCard from '../components/StatCard'
import useScrollReveal from '../hooks/useScrollReveal'
import './Landing.css'

// Event Date - March 17, 2026
const EVENT_DATE = new Date('2026-03-17T09:00:00')

const Landing = () => {
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

    // Scroll reveal animations
    useScrollReveal()

    // Countdown Timer Effect
    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date()
            const difference = EVENT_DATE - now

            if (difference > 0) {
                setCountdown({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                })
            }
        }

        calculateTimeLeft()
        const timer = setInterval(calculateTimeLeft, 1000)
        return () => clearInterval(timer)
    }, [])

    // ========================================
    // DATA DEFINITIONS
    // ========================================

    const stats = [
        { value: '500+', label: 'Expected Attendees' },
        { value: '5+', label: 'Industry Experts' },
        { value: '10', label: 'Technical Events' },
        { value: '3', label: 'Days of Learning' }
    ]

    const features = [
        { icon: Award, title: 'Expert Sessions', description: 'Learn from industry veterans and experts' },
        { icon: Sparkles, title: 'Hands-on Workshops', description: 'Practical experience with latest tools' },
        { icon: Users, title: 'Networking', description: 'Connect with peers and professionals' },
        { icon: Zap, title: 'Competitions', description: 'Showcase skills and win prizes' }
    ]

    const visionPoints = [
        { icon: Target, title: 'Bridge the Gap', description: 'Connect academic learning with real-world industry applications' },
        { icon: Globe, title: 'Global Perspective', description: 'Expose students to international semiconductor trends and innovations' },
        { icon: GraduationCap, title: 'Skill Development', description: 'Provide hands-on experience with industry-standard tools and technologies' },
        { icon: Building2, title: 'Industry Connect', description: 'Create networking opportunities with leading semiconductor companies' }
    ]

    // Speakers - Industry Experts
    const speakers = [
        { id: 1, name: 'Industry Expert 1', role: 'VLSI Expert', company: 'Semiconductor Industry', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop', linkedin: '#' },
        { id: 2, name: 'Industry Expert 2', role: 'Design Engineer', company: 'EDA Company', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop', linkedin: '#' },
        { id: 3, name: 'Industry Expert 3', role: 'Technical Lead', company: 'Chip Design Firm', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop', linkedin: '#' },
        { id: 4, name: 'Industry Expert 4', role: 'Research Faculty', company: 'CHARUSAT', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop', linkedin: '#' }
    ]



    // Organizers
    const organizers = {
        presentedBy: {
            name: 'CHARUSAT University',
            subtitle: 'Department of Electronics & Communication Engineering - CSPIT'
        },
        organizedBy: [
            { name: 'Student Technical Committee' },
            { name: 'IEEE Student Branch' },
            { name: 'IETE Student Forum' }
        ],
        sponsors: []
    }

    // Venue - CHARUSAT
    const venue = {
        name: 'CHARUSAT University, A6 Building',
        address: 'Department of EC Engineering - CSPIT, A6 Building, CHARUSAT, Changa, Gujarat - 388421',
        mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3682.8!2d72.8168!3d22.5988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e4e7439a2e021%3A0x9f4c4b1dfb8a586a!2sCHARUSAT!5e0!3m2!1sen!2sin!4v1700000000000'
    }

    // ========================================
    // RENDER
    // ========================================

    return (
        <div className="landing-page">
            <Navbar />

            {/* ====== HERO SECTION ====== */}
            <section id="home" className="hero-section">
                <div className="hero-bg">
                    <div className="hero-grid" />
                    <div className="hero-glow hero-glow-1" />
                    <div className="hero-glow hero-glow-2" />
                    <ParticleField count={50} />
                </div>

                <div className="container hero-content">
                    <div className="hero-badge hero-animate">
                        <Sparkles size={14} />
                        <span>The Premier Tech Event of 2026</span>
                    </div>

                    <h1 className="hero-title hero-animate hero-animate-delay-1">
                        <span className="text-gradient-vibrant">Semiconductor</span>
                        <br />
                        Summit 2.0
                    </h1>

                    <p className="hero-subtitle hero-animate hero-animate-delay-2">
                        Architecting the Future of Chips — 10 events across 3 days of workshops,
                        panel discussions, competitions, and industry interactions at CHARUSAT.
                    </p>

                    <div className="hero-info hero-animate hero-animate-delay-3">
                        <div className="hero-info-item">
                            <Calendar size={20} />
                            <span>March 17-19, 2026</span>
                        </div>
                        <div className="hero-info-divider" />
                        <div className="hero-info-item">
                            <MapPin size={20} />
                            <span>CHARUSAT, A6 Building</span>
                        </div>
                    </div>

                    <div className="hero-cta hero-animate hero-animate-delay-4">
                        <Link to="/register" className="btn btn-primary">
                            Register Now <ArrowRight size={18} />
                        </Link>
                        <Link to="/events" className="btn btn-secondary">
                            View Events
                        </Link>
                    </div>

                    <div className="hero-note">
                        <CheckCircle2 size={16} />
                        <span>Registration Fee: ₹299 • Limited Seats</span>
                    </div>
                </div>

                <div className="hero-floating">
                    <div className="floating-chip floating-chip-1"><Cpu size={32} /></div>
                    <div className="floating-chip floating-chip-2"><CircuitBoard size={28} /></div>
                </div>
            </section>

            {/* ====== COUNTDOWN SECTION ====== */}
            <section className="countdown-section reveal">
                <div className="container">
                    <div className="countdown-wrapper">
                        <h3 className="countdown-title">Event Starts In</h3>
                        <div className="countdown-grid">
                            <div className="countdown-item">
                                <span className="countdown-value text-gradient">{String(countdown.days).padStart(2, '0')}</span>
                                <span className="countdown-label">Days</span>
                            </div>
                            <div className="countdown-separator">:</div>
                            <div className="countdown-item">
                                <span className="countdown-value text-gradient">{String(countdown.hours).padStart(2, '0')}</span>
                                <span className="countdown-label">Hours</span>
                            </div>
                            <div className="countdown-separator">:</div>
                            <div className="countdown-item">
                                <span className="countdown-value text-gradient">{String(countdown.minutes).padStart(2, '0')}</span>
                                <span className="countdown-label">Minutes</span>
                            </div>
                            <div className="countdown-separator">:</div>
                            <div className="countdown-item">
                                <span className="countdown-value text-gradient">{String(countdown.seconds).padStart(2, '0')}</span>
                                <span className="countdown-label">Seconds</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ====== STATS SECTION ====== */}
            <section className="stats-section reveal">
                <div className="container">
                    <div className="stats-grid">
                        {stats.map((stat, i) => (
                            <StatCard key={i} value={stat.value} label={stat.label} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ====== VISION SECTION ====== */}
            <section id="vision" className="vision-section reveal">
                <div className="container">
                    <div className="section-header section-header-center">
                        <span className="section-tag">Our Vision</span>
                        <h2>Shaping the <span className="text-gradient">Future of Electronics</span></h2>
                        <p>Semiconductor Summit 2.0 aims to inspire the next generation of engineers and innovators.</p>
                    </div>

                    <div className="vision-grid">
                        {visionPoints.map((point, i) => (
                            <div key={i} className="vision-card">
                                <div className="vision-icon"><point.icon size={24} /></div>
                                <h4>{point.title}</h4>
                                <p>{point.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ====== ABOUT / FEATURES SECTION ====== */}
            <section id="about" className="about-section reveal">
                <div className="container">
                    <div className="section-header section-header-center">
                        <span className="section-tag">About The Summit</span>
                        <h2>Why Attend <span className="text-gradient">Semiconductor Summit 2.0?</span></h2>
                        <p>Join us for an immersive experience bridging academic knowledge and industry expertise.</p>
                    </div>

                    <div className="features-grid">
                        {features.map((f, i) => (
                            <div key={i} className="feature-card card">
                                <div className="feature-icon"><f.icon size={24} /></div>
                                <h4>{f.title}</h4>
                                <p>{f.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="section-cta" style={{ marginTop: '2rem' }}>
                        <Link to="/about" className="btn btn-secondary">
                            Learn More About Us <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ====== SPEAKERS SECTION ====== */}
            <section id="speakers" className="speakers-section reveal">
                <div className="container">
                    <div className="section-header section-header-center">
                        <span className="section-tag">Meet Our Experts</span>
                        <h2>Featured <span className="text-gradient">Speakers</span></h2>
                        <p>Learn from industry leaders and academic experts in semiconductor technology.</p>
                    </div>

                    <div className="speakers-grid">
                        {speakers.map((speaker) => (
                            <div key={speaker.id} className="speaker-card">
                                <div className="speaker-image">
                                    <img src={speaker.image} alt={speaker.name} loading="lazy" />
                                </div>
                                <div className="speaker-info">
                                    <h4>{speaker.name}</h4>
                                    <p className="speaker-role">{speaker.role}</p>
                                    <p className="speaker-company">{speaker.company}</p>
                                    <a href={speaker.linkedin} target="_blank" rel="noopener noreferrer" className="speaker-social">
                                        <Linkedin size={16} />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



            {/* ====== ORGANIZERS SECTION ====== */}
            <section id="organizers" className="organizers-section reveal">
                <div className="container">
                    <div className="section-header section-header-center">
                        <span className="section-tag">Organizing Team</span>
                        <h2>Presented & <span className="text-gradient">Organized By</span></h2>
                    </div>

                    <div className="organizers-content">
                        <div className="presented-by">
                            <span className="organizer-label">Presented By</span>
                            <div className="presented-card">
                                <div className="presented-info">
                                    <h4>{organizers.presentedBy.name}</h4>
                                    <p>{organizers.presentedBy.subtitle}</p>
                                </div>
                            </div>
                        </div>

                        <div className="organized-by">
                            <span className="organizer-label">Organized By</span>
                            <div className="organized-grid">
                                {organizers.organizedBy.map((org, i) => (
                                    <div key={i} className="organized-card">
                                        <span>{org.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ====== LOCATION MAP SECTION ====== */}
            <section id="location" className="location-section reveal">
                <div className="container">
                    <div className="section-header section-header-center">
                        <span className="section-tag">Event Venue</span>
                        <h2>Find Us <span className="text-gradient">Here</span></h2>
                        <p>Join us at our venue for an unforgettable experience.</p>
                    </div>

                    <div className="location-content">
                        <div className="location-info">
                            <div className="location-icon"><MapPin size={28} /></div>
                            <h3>{venue.name}</h3>
                            <p>{venue.address}</p>
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue.address)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-secondary"
                            >
                                Get Directions <ArrowRight size={16} />
                            </a>
                        </div>
                        <div className="location-map">
                            <iframe
                                src={venue.mapEmbedUrl}
                                width="100%"
                                height="350"
                                style={{ border: 0, borderRadius: '12px' }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Event Location"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ====== REGISTER CTA SECTION ====== */}
            <section id="register" className="register-section reveal">
                <div className="register-bg"><div className="register-glow" /></div>
                <div className="container">
                    <div className="register-content">
                        <h2>Ready to Join the <span className="text-gradient">Future of Tech?</span></h2>
                        <p>Secure your spot at Semiconductor Summit 2.0 for just ₹299.</p>

                        <div className="register-steps">
                            <div className="register-step"><div className="step-number">1</div><span>Pay ₹299</span></div>
                            <div className="register-step"><div className="step-number">2</div><span>Fill form & upload receipt</span></div>
                            <div className="register-step"><div className="step-number">3</div><span>Get verified</span></div>
                        </div>

                        <Link to="/register" className="btn btn-primary btn-lg">
                            Register Now — ₹299 <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}

export default Landing
