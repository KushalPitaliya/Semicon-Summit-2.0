import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    Cpu, Calendar, MapPin, Users, Zap, Award,
    ArrowRight, Sparkles, CircuitBoard, ChevronRight,
    Clock, CheckCircle2, X, Image, Target, Building2, GraduationCap, Globe,
    Mail, Phone, ChevronDown, Linkedin, Twitter, MessageCircle
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import api from '../services/api'
import './Landing.css'

// Event Date - UPDATE THIS WITH ACTUAL DATE
const EVENT_DATE = new Date('2026-03-15T09:00:00')

const Landing = () => {
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [openFaq, setOpenFaq] = useState(null)
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
    const [galleryImages, setGalleryImages] = useState([])
    const [galleryLoading, setGalleryLoading] = useState(true)

    // Fetch gallery images
    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const response = await api.get('/gallery/featured')
                setGalleryImages(response.data)
            } catch (error) {
                console.error('Error fetching gallery:', error)
            } finally {
                setGalleryLoading(false)
            }
        }
        fetchGallery()
    }, [])

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

    const events = [
        {
            id: 1,
            title: 'VLSI Design Workshop',
            description: 'Hands-on workshop covering advanced VLSI design techniques and tools.',
            fullDescription: 'This comprehensive workshop will cover VLSI design fundamentals, including RTL design, synthesis, place and route, and verification.',
            icon: CircuitBoard,
            duration: '4 hours',
            type: 'Workshop',
            highlights: ['RTL Design', 'Synthesis', 'Place & Route', 'Verification']
        },
        {
            id: 2,
            title: 'Chip Architecture Talk',
            description: 'Expert session on modern chip architecture and AI accelerators.',
            fullDescription: 'Industry experts will discuss the latest trends in chip architecture, covering multi-core processors and AI/ML accelerators.',
            icon: Cpu,
            duration: '2 hours',
            type: 'Talk',
            highlights: ['Multi-core Design', 'AI Accelerators', 'Memory Systems', 'Power Optimization']
        },
        {
            id: 3,
            title: 'Embedded Systems Hackathon',
            description: 'Build innovative embedded solutions in this 24-hour challenge.',
            fullDescription: 'Put your skills to the test in this 24-hour hackathon! Teams will design and implement embedded solutions with prizes worth ₹30,000+!',
            icon: Zap,
            duration: '24 hours',
            type: 'Hackathon',
            highlights: ['Team Competition', 'Dev Kits Provided', '₹30K+ Prizes', 'Mentorship']
        },
        {
            id: 4,
            title: 'Industry Panel Discussion',
            description: 'Leaders from top semiconductor companies discuss the future.',
            fullDescription: 'Hear from executives at leading semiconductor companies about industry trends and career opportunities.',
            icon: Users,
            duration: '1.5 hours',
            type: 'Panel',
            highlights: ['Industry Leaders', 'Career Insights', 'Q&A Session', 'Networking']
        }
    ]

    const stats = [
        { value: '500+', label: 'Expected Attendees' },
        { value: '15+', label: 'Expert Speakers' },
        { value: '8+', label: 'Technical Events' },
        { value: '₹50K+', label: 'Prize Pool' }
    ]

    const features = [
        { icon: Award, title: 'Expert Sessions', description: 'Learn from industry veterans and experts' },
        { icon: Sparkles, title: 'Hands-on Workshops', description: 'Practical experience with latest tools' },
        { icon: Users, title: 'Networking', description: 'Connect with peers and professionals' },
        { icon: Zap, title: 'Competitions', description: 'Showcase skills and win prizes' }
    ]

    const previousEventImages = [
        { id: 1, title: 'VLSI Workshop 2024', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop', description: 'Participants learning chip design' },
        { id: 2, title: 'Hackathon Finals', image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=300&fit=crop', description: 'Teams presenting projects' },
        { id: 3, title: 'Expert Talk Session', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop', description: 'Industry expert sharing insights' },
        { id: 4, title: 'Networking Event', image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop', description: 'Students connecting with professionals' },
        { id: 5, title: 'Award Ceremony', image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop', description: 'Winners receiving prizes' },
        { id: 6, title: 'Lab Session', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop', description: 'Hands-on learning experience' }
    ]

    const visionPoints = [
        { icon: Target, title: 'Bridge the Gap', description: 'Connect academic learning with real-world industry applications' },
        { icon: Globe, title: 'Global Perspective', description: 'Expose students to international semiconductor trends and innovations' },
        { icon: GraduationCap, title: 'Skill Development', description: 'Provide hands-on experience with industry-standard tools and technologies' },
        { icon: Building2, title: 'Industry Connect', description: 'Create networking opportunities with leading semiconductor companies' }
    ]

    // Speakers - UPDATE WITH ACTUAL DATA
    const speakers = [
        { id: 1, name: 'Dr. Rajesh Kumar', role: 'VLSI Expert', company: 'Intel India', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop', linkedin: '#' },
        { id: 2, name: 'Priya Sharma', role: 'Senior Engineer', company: 'Qualcomm', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop', linkedin: '#' },
        { id: 3, name: 'Amit Patel', role: 'Design Lead', company: 'NVIDIA', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop', linkedin: '#' },
        { id: 4, name: 'Dr. Sneha Iyer', role: 'Research Head', company: 'IIT Bombay', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop', linkedin: '#' }
    ]

    // Schedule - UPDATE WITH ACTUAL DATA
    const schedule = [
        {
            day: 'Day 1',
            date: 'March 15, 2026',
            events: [
                { time: '09:00 AM', title: 'Registration & Welcome', type: 'General' },
                { time: '10:00 AM', title: 'Inauguration Ceremony', type: 'Ceremony' },
                { time: '11:00 AM', title: 'VLSI Design Workshop - Part 1', type: 'Workshop' },
                { time: '02:00 PM', title: 'Chip Architecture Talk', type: 'Talk' },
                { time: '04:00 PM', title: 'Embedded Hackathon Kickoff', type: 'Hackathon' }
            ]
        },
        {
            day: 'Day 2',
            date: 'March 16, 2026',
            events: [
                { time: '09:00 AM', title: 'VLSI Design Workshop - Part 2', type: 'Workshop' },
                { time: '11:00 AM', title: 'Industry Panel Discussion', type: 'Panel' },
                { time: '02:00 PM', title: 'Hackathon Final Submissions', type: 'Hackathon' },
                { time: '04:00 PM', title: 'Project Presentations', type: 'Competition' },
                { time: '06:00 PM', title: 'Awards & Closing Ceremony', type: 'Ceremony' }
            ]
        }
    ]

    // FAQs
    const faqs = [
        { question: 'What is the registration fee?', answer: 'The registration fee is ₹400 per participant, which includes access to all events, workshops, hackathons, lunch, refreshments, and certificate of participation.' },
        { question: 'Who can participate?', answer: 'Students from any engineering discipline, particularly those interested in Electronics, VLSI, Embedded Systems, and Semiconductor Technology can participate.' },
        { question: 'Do I need prior experience?', answer: 'Basic knowledge of electronics is helpful but not mandatory. Our workshops are designed to accommodate beginners as well as advanced learners.' },
        { question: 'What should I bring to the event?', answer: 'Bring your college ID, laptop (if you have one), and enthusiasm to learn! All other materials will be provided.' },
        { question: 'Will I get a certificate?', answer: 'Yes! All participants will receive a certificate of participation. Winners of competitions will receive additional achievement certificates.' },
        { question: 'Is there a team size limit for hackathon?', answer: 'Teams can have 2-4 members. Individual participation is also allowed.' }
    ]

    // Organizers - UPDATE WITH ACTUAL DATA
    const organizers = {
        presentedBy: {
            name: 'Your College Name',
            logo: 'https://via.placeholder.com/120x60?text=College+Logo',
            subtitle: 'Department of Electronics & Communication'
        },
        organizedBy: [
            { name: 'Student Technical Committee', logo: 'https://via.placeholder.com/80x80?text=STC' },
            { name: 'IEEE Student Branch', logo: 'https://via.placeholder.com/80x80?text=IEEE' },
            { name: 'IETE Student Forum', logo: 'https://via.placeholder.com/80x80?text=IETE' }
        ],
        sponsors: [
            { name: 'Sponsor 1', logo: 'https://via.placeholder.com/100x50?text=Sponsor+1' },
            { name: 'Sponsor 2', logo: 'https://via.placeholder.com/100x50?text=Sponsor+2' },
            { name: 'Sponsor 3', logo: 'https://via.placeholder.com/100x50?text=Sponsor+3' }
        ]
    }

    // Venue - UPDATE WITH ACTUAL VENUE
    const venue = {
        name: 'Your College Auditorium',
        address: 'College Name, City, State - PIN',
        mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.5!2d72.5!3d23.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDAwJzAwLjAiTiA3MsKwMzAnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890'
    }

    // Contact - UPDATE WITH ACTUAL CONTACT
    const contacts = [
        { name: 'Coordinator Name 1', role: 'Event Coordinator', phone: '+91 98765 43210', email: 'coordinator1@college.edu' },
        { name: 'Coordinator Name 2', role: 'Technical Head', phone: '+91 98765 43211', email: 'coordinator2@college.edu' }
    ]

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
                </div>

                <div className="container hero-content">
                    <div className="hero-badge">
                        <Sparkles size={14} />
                        <span>The Premier Tech Event of 2026</span>
                    </div>

                    <h1 className="hero-title">
                        <span className="text-gradient">Semiconductor</span>
                        <br />
                        Summit 2.0
                    </h1>

                    <p className="hero-subtitle">
                        Explore the cutting-edge world of semiconductor technology through
                        workshops, hackathons, expert talks, and networking opportunities.
                    </p>

                    <div className="hero-info">
                        <div className="hero-info-item">
                            <Calendar size={20} />
                            <span>March 15-16, 2026</span>
                        </div>
                        <div className="hero-info-divider" />
                        <div className="hero-info-item">
                            <MapPin size={20} />
                            <span>{venue.name}</span>
                        </div>
                    </div>

                    <div className="hero-cta">
                        <Link to="/register" className="btn btn-primary">
                            Register Now <ArrowRight size={18} />
                        </Link>
                        <a href="#events" className="btn btn-secondary">
                            View Events
                        </a>
                    </div>

                    <div className="hero-note">
                        <CheckCircle2 size={16} />
                        <span>Registration Fee: ₹400 • Limited Seats</span>
                    </div>
                </div>

                <div className="hero-floating">
                    <div className="floating-chip floating-chip-1"><Cpu size={32} /></div>
                    <div className="floating-chip floating-chip-2"><CircuitBoard size={28} /></div>
                </div>
            </section>

            {/* ====== COUNTDOWN SECTION ====== */}
            <section className="countdown-section">
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
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        {stats.map((stat, i) => (
                            <div key={i} className="stat-card">
                                <span className="stat-value text-gradient">{stat.value}</span>
                                <span className="stat-label">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ====== VISION SECTION ====== */}
            <section id="vision" className="vision-section">
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
            <section id="about" className="about-section">
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
                </div>
            </section>

            {/* ====== SPEAKERS SECTION ====== */}
            <section id="speakers" className="speakers-section">
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

            {/* ====== SCHEDULE SECTION ====== */}
            <section id="schedule" className="schedule-section">
                <div className="container">
                    <div className="section-header section-header-center">
                        <span className="section-tag">Event Timeline</span>
                        <h2>Event <span className="text-gradient">Schedule</span></h2>
                        <p>Plan your experience with our comprehensive two-day agenda.</p>
                    </div>

                    <div className="schedule-tabs">
                        {schedule.map((day, dayIndex) => (
                            <div key={dayIndex} className="schedule-day">
                                <div className="schedule-day-header">
                                    <h3>{day.day}</h3>
                                    <span>{day.date}</span>
                                </div>
                                <div className="schedule-events">
                                    {day.events.map((event, eventIndex) => (
                                        <div key={eventIndex} className="schedule-event">
                                            <div className="schedule-time">{event.time}</div>
                                            <div className="schedule-content">
                                                <h4>{event.title}</h4>
                                                <span className="schedule-type">{event.type}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ====== EVENTS SECTION ====== */}
            <section id="events" className="events-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-tag">Featured Events</span>
                        <h2>Explore Our <span className="text-gradient">Event Lineup</span></h2>
                        <p>From hands-on workshops to intense hackathons, there's something for everyone.</p>
                    </div>

                    <div className="events-grid">
                        {events.map((event) => (
                            <div key={event.id} className="event-card card" onClick={() => setSelectedEvent(event)}>
                                <div className="event-header">
                                    <div className="event-icon"><event.icon size={28} /></div>
                                    <span className="badge">{event.type}</span>
                                </div>
                                <h3>{event.title}</h3>
                                <p>{event.description}</p>
                                <div className="event-footer">
                                    <div className="event-duration">
                                        <Clock size={16} />
                                        <span>{event.duration}</span>
                                    </div>
                                    <ChevronRight size={20} className="event-arrow" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="section-cta">
                        <Link to="/register" className="btn btn-primary">
                            Register for All Events <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ====== GLIMPSE/GALLERY SECTION ====== */}
            <section id="glimpse" className="glimpse-section">
                <div className="container">
                    <div className="section-header section-header-center">
                        <span className="section-tag">Previous Events</span>
                        <h2>Glimpse of <span className="text-gradient">Summit 1.0</span></h2>
                        <p>Relive the moments from our previous summit.</p>
                    </div>

                    <div className="glimpse-grid">
                        {/* Show gallery images from database if they exist */}
                        {galleryImages.length > 0 ? (
                            galleryImages.map((item) => (
                                <div key={item._id} className="glimpse-card">
                                    <div className="glimpse-image">
                                        <img src={item.thumbnailUrl || item.url} alt={item.title} loading="lazy" />
                                        <div className="glimpse-overlay"><Image size={24} /></div>
                                    </div>
                                    <div className="glimpse-content">
                                        <h4>{item.title}</h4>
                                        <p>{item.description || item.category}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            /* Fallback to static images */
                            previousEventImages.map((item) => (
                                <div key={item.id} className="glimpse-card">
                                    <div className="glimpse-image">
                                        <img src={item.image} alt={item.title} loading="lazy" />
                                        <div className="glimpse-overlay"><Image size={24} /></div>
                                    </div>
                                    <div className="glimpse-content">
                                        <h4>{item.title}</h4>
                                        <p>{item.description}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* ====== FAQ SECTION ====== */}
            <section id="faq" className="faq-section">
                <div className="container">
                    <div className="section-header section-header-center">
                        <span className="section-tag">Got Questions?</span>
                        <h2>Frequently Asked <span className="text-gradient">Questions</span></h2>
                        <p>Find answers to common queries about the event.</p>
                    </div>

                    <div className="faq-list">
                        {faqs.map((faq, index) => (
                            <div key={index} className={`faq-item ${openFaq === index ? 'open' : ''}`}>
                                <button className="faq-question" onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                                    <span>{faq.question}</span>
                                    <ChevronDown size={20} className="faq-icon" />
                                </button>
                                <div className="faq-answer">
                                    <p>{faq.answer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ====== ORGANIZERS SECTION ====== */}
            <section id="organizers" className="organizers-section">
                <div className="container">
                    <div className="section-header section-header-center">
                        <span className="section-tag">Organizing Team</span>
                        <h2>Presented & <span className="text-gradient">Organized By</span></h2>
                    </div>

                    <div className="organizers-content">
                        <div className="presented-by">
                            <span className="organizer-label">Presented By</span>
                            <div className="presented-card">
                                <img src={organizers.presentedBy.logo} alt={organizers.presentedBy.name} />
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
                                        <img src={org.logo} alt={org.name} />
                                        <span>{org.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="sponsors">
                            <span className="organizer-label">Our Sponsors</span>
                            <div className="sponsors-grid">
                                {organizers.sponsors.map((sponsor, i) => (
                                    <div key={i} className="sponsor-card">
                                        <img src={sponsor.logo} alt={sponsor.name} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ====== LOCATION MAP SECTION ====== */}
            <section id="location" className="location-section">
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

            {/* ====== CONTACT SECTION ====== */}
            <section id="contact" className="contact-section">
                <div className="container">
                    <div className="section-header section-header-center">
                        <span className="section-tag">Get In Touch</span>
                        <h2>Contact <span className="text-gradient">Us</span></h2>
                        <p>Have questions? Reach out to our coordinators.</p>
                    </div>

                    <div className="contact-grid">
                        {contacts.map((contact, index) => (
                            <div key={index} className="contact-card">
                                <h4>{contact.name}</h4>
                                <p className="contact-role">{contact.role}</p>
                                <div className="contact-details">
                                    <a href={`tel:${contact.phone}`} className="contact-item">
                                        <Phone size={16} />
                                        <span>{contact.phone}</span>
                                    </a>
                                    <a href={`mailto:${contact.email}`} className="contact-item">
                                        <Mail size={16} />
                                        <span>{contact.email}</span>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ====== REGISTER CTA SECTION ====== */}
            <section id="register" className="register-section">
                <div className="register-bg"><div className="register-glow" /></div>
                <div className="container">
                    <div className="register-content">
                        <h2>Ready to Join the <span className="text-gradient">Future of Tech?</span></h2>
                        <p>Secure your spot at Semiconductor Summit 2.0 for just ₹400.</p>

                        <div className="register-steps">
                            <div className="register-step"><div className="step-number">1</div><span>Fill form</span></div>
                            <div className="register-step"><div className="step-number">2</div><span>Pay ₹400</span></div>
                            <div className="register-step"><div className="step-number">3</div><span>Upload proof</span></div>
                            <div className="register-step"><div className="step-number">4</div><span>Get login</span></div>
                        </div>

                        <Link to="/register" className="btn btn-primary btn-lg">
                            Register Now — ₹400 <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ====== EVENT MODAL ====== */}
            {selectedEvent && (
                <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedEvent(null)}><X size={24} /></button>

                        <div className="modal-header">
                            <div className="modal-icon"><selectedEvent.icon size={32} /></div>
                            <span className="badge">{selectedEvent.type}</span>
                        </div>

                        <h2>{selectedEvent.title}</h2>

                        <div className="modal-duration">
                            <Clock size={18} />
                            <span>Duration: {selectedEvent.duration}</span>
                        </div>

                        <p className="modal-description">{selectedEvent.fullDescription}</p>

                        <div className="modal-highlights">
                            <h4>What You'll Learn:</h4>
                            <ul>
                                {selectedEvent.highlights.map((h, i) => (
                                    <li key={i}><CheckCircle2 size={16} /><span>{h}</span></li>
                                ))}
                            </ul>
                        </div>

                        <Link to="/register" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                            Register for this Event <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    )
}

export default Landing
