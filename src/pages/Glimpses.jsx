import { useState, useEffect } from 'react';
import { Calendar, Camera, ChevronDown, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageLoader from '../components/PageLoader';
import useScrollReveal from '../hooks/useScrollReveal';
import './Glimpses.css';

const Glimpses = () => {
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [activeDay, setActiveDay] = useState('all');
    const { reveal } = useScrollReveal();

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    // Day 1 images (0.jpeg - 9.jpeg)
    const day1Images = Array.from({ length: 10 }, (_, i) => ({
        id: `day1-${i}`,
        src: `/images/Glimps/${i}.jpeg`,
        alt: `Summit Day 1 - Photo ${i + 1}`,
        day: 1,
        caption: `Day 1 Moment ${i + 1}`
    }));

    // Day 2 images (summit day 2 _1.jpeg - summit day 2 _6.jpeg)
    const day2Images = [
        { id: 'day2-1', src: '/images/Glimps/summit day 2 _1.jpeg', alt: 'Summit Day 2 - Photo 1', day: 2, caption: 'Day 2 Moment 1' },
        { id: 'day2-2', src: '/images/Glimps/summit day 2 _2.jpg', alt: 'Summit Day 2 - Photo 2', day: 2, caption: 'Day 2 Moment 2' },
        { id: 'day2-3', src: '/images/Glimps/summit day 2 _3.jpg', alt: 'Summit Day 2 - Photo 3', day: 2, caption: 'Day 2 Moment 3' },
        { id: 'day2-4', src: '/images/Glimps/summit day 2 _4.jpg', alt: 'Summit Day 2 - Photo 4', day: 2, caption: 'Day 2 Moment 4' },
        { id: 'day2-5', src: '/images/Glimps/summit day 2 _5.jpg', alt: 'Summit Day 2 - Photo 5', day: 2, caption: 'Day 2 Moment 5' },
        { id: 'day2-6', src: '/images/Glimps/summit day 2 _6.jpeg', alt: 'Summit Day 2 - Photo 6', day: 2, caption: 'Day 2 Moment 6' }
    ];

    const allImages = [...day1Images, ...day2Images];

    // Filter images based on active day
    const filteredImages = activeDay === 'all'
        ? allImages
        : allImages.filter(img => img.day === parseInt(activeDay));

    const handleImageClick = (image) => {
        setSelectedImage(image);
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    };

    const closeModal = () => {
        setSelectedImage(null);
        document.body.style.overflow = 'auto'; // Restore scrolling
    };

    if (loading) return <PageLoader />;

    return (
        <div className="glimpses-page">
            <Navbar />

            {/* Hero Section */}
            <section className="glimpses-hero">
                <div className="hero-bg">
                    <div className="hero-grid" />
                    <div className="hero-glow hero-glow-1" />
                    <div className="hero-glow hero-glow-2" />
                </div>

                <div className="container hero-content">
                    <div className="section-tag" data-reveal="fade-up">
                        <Camera size={16} />
                        <span>Event Memories</span>
                    </div>
                    <h1 className="hero-title" data-reveal="fade-up" data-delay="100">
                        Summit <span className="text-gradient">Glimpses</span>
                    </h1>
                    <p className="hero-subtitle" data-reveal="fade-up" data-delay="200">
                        Relive the best moments from Semiconductor Summit 2.0
                    </p>

                    {/* Stats */}
                    <div className="glimpses-stats" data-reveal="fade-up" data-delay="300">
                        <div className="stat">
                            <div className="stat-value">{allImages.length}</div>
                            <div className="stat-label">Total Photos</div>
                        </div>
                        <div className="stat">
                            <div className="stat-value">2</div>
                            <div className="stat-label">Event Days</div>
                        </div>
                        <div className="stat">
                            <div className="stat-value">500+</div>
                            <div className="stat-label">Participants</div>
                        </div>
                    </div>
                </div>

                <div className="scroll-indicator">
                    <ChevronDown className="bounce" />
                </div>
            </section>

            {/* Filter Section */}
            <section className="filter-section">
                <div className="container">
                    <div className="filter-tabs" data-reveal="fade-up">
                        <button
                            className={`filter-tab ${activeDay === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveDay('all')}
                        >
                            <span>All Days</span>
                            <span className="count">{allImages.length}</span>
                        </button>
                        <button
                            className={`filter-tab ${activeDay === '1' ? 'active' : ''}`}
                            onClick={() => setActiveDay('1')}
                        >
                            <Calendar size={16} />
                            <span>Day 1</span>
                            <span className="count">{day1Images.length}</span>
                        </button>
                        <button
                            className={`filter-tab ${activeDay === '2' ? 'active' : ''}`}
                            onClick={() => setActiveDay('2')}
                        >
                            <Calendar size={16} />
                            <span>Day 2</span>
                            <span className="count">{day2Images.length}</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Gallery Grid */}
            <section className="gallery-section">
                <div className="container">
                    <div className="gallery-grid">
                        {filteredImages.map((image, index) => (
                            <div
                                key={image.id}
                                className="gallery-card"
                                data-reveal="scale-in"
                                data-delay={index * 50}
                                onClick={() => handleImageClick(image)}
                            >
                                <div className="gallery-card-inner">
                                    <div className="image-wrapper">
                                        <img
                                            src={image.src}
                                            alt={image.alt}
                                            loading="lazy"
                                        />
                                        <div className="image-overlay">
                                            <div className="overlay-content">
                                                <Camera size={24} />
                                                <p>{image.caption}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer">
                                        <span className="day-badge">Day {image.day}</span>
                                        <span className="photo-number">Photo {index + 1}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredImages.length === 0 && (
                        <div className="empty-state" data-reveal="fade-up">
                            <Camera size={48} />
                            <h3>No photos found</h3>
                            <p>Try selecting a different day</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div className="lightbox-modal" onClick={closeModal}>
                    <button className="close-btn" onClick={closeModal}>
                        <X size={24} />
                    </button>
                    <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={selectedImage.src}
                            alt={selectedImage.alt}
                        />
                        <div className="lightbox-info">
                            <h3>{selectedImage.caption}</h3>
                            <p>Day {selectedImage.day} • Semiconductor Summit 2.0</p>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Glimpses;
