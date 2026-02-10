import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import './Contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [formStatus, setFormStatus] = useState({ submitted: false, error: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setFormStatus({ submitted: false, error: '' });

        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            setFormStatus({ submitted: true, error: '' });
            setLoading(false);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 1500);
    };

    return (
        <div className="contact-page">
            <div className="contact-container">
                {/* Header */}
                <div className="contact-header">
                    <h1>Get in <span className="text-gradient">Touch</span></h1>
                    <p>Have questions? We'd love to hear from you</p>
                </div>

                <div className="contact-content">
                    {/* Contact Info */}
                    <div className="contact-info-section">
                        <h2>Contact Information</h2>
                        <p className="info-subtitle">Reach out to us through any of these channels</p>

                        <div className="contact-cards">
                            <div className="contact-card">
                                <div className="contact-icon">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h3>Email</h3>
                                    <a href="mailto:semisummit.ec@charusat.ac.in">semisummit.ec@charusat.ac.in</a>
                                </div>
                            </div>

                            <div className="contact-card">
                                <div className="contact-icon">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h3>Phone</h3>
                                    <a href="tel:+919876543210">+91 98765 43210</a>
                                </div>
                            </div>

                            <div className="contact-card">
                                <div className="contact-icon">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h3>Location</h3>
                                    <p>Department of Electronics and Communication Engineering - CSPIT<br />A6 Building, CHARUSAT<br />Changa, Gujarat - 388421</p>
                                </div>
                            </div>
                        </div>

                        <div className="office-hours">
                            <h3>Office Hours</h3>
                            <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
                            <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM</p>
                            <p><strong>Sunday:</strong> Closed</p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="contact-form-section">
                        <h2>Send Us a Message</h2>
                        <p className="form-subtitle">Fill out the form below and we'll get back to you within 24 hours</p>

                        {formStatus.submitted ? (
                            <div className="success-message">
                                <CheckCircle size={48} />
                                <h3>Message Sent Successfully!</h3>
                                <p>Thank you for reaching out. We'll get back to you soon.</p>
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setFormStatus({ submitted: false, error: '' })}
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="name">Name <span className="required">*</span></label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Your name"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email">Email <span className="required">*</span></label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="your.email@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="subject">Subject <span className="required">*</span></label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        placeholder="How can we help you?"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message">Message <span className="required">*</span></label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="6"
                                        placeholder="Tell us more about your inquiry..."
                                    ></textarea>
                                </div>

                                {formStatus.error && (
                                    <div className="error-message">
                                        {formStatus.error}
                                    </div>
                                )}

                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    <Send size={20} />
                                    {loading ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="faq-section">
                    <h2>Frequently Asked Questions</h2>
                    <div className="faq-grid">
                        <div className="faq-item">
                            <h3>What is the registration fee?</h3>
                            <p>The registration fee is ₹299, which includes access to all events during the summit.</p>
                        </div>
                        <div className="faq-item">
                            <h3>Can I get a refund?</h3>
                            <p>Refunds are available up to 7 days before the event starts. Contact us for more details.</p>
                        </div>
                        <div className="faq-item">
                            <h3>Are certificates provided?</h3>
                            <p>Yes, all participants will receive a certificate of participation after attending the summit.</p>
                        </div>
                        <div className="faq-item">
                            <h3>Is accommodation provided?</h3>
                            <p>Accommodation is not included, but we can help you find nearby hotels at discounted rates.</p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="contact-cta">
                    <h2>Ready to Register?</h2>
                    <p>Join us for an amazing learning experience</p>
                    <Link to="/register" className="btn btn-primary btn-large">
                        Register Now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Contact;
