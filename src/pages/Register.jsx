import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, CheckCircle, AlertCircle, ArrowLeft, QrCode, CreditCard, User, Mail, Phone, Building, Calendar } from 'lucide-react';
import api from '../services/api';
import './Register.css';

// Fixed registration fee for the summit
const REGISTRATION_FEE = 299;

// Events included in registration (no additional cost)
const EVENTS = [
    {
        id: 'vlsi',
        name: 'VLSI Design Workshop',
        description: 'Hands-on workshop on VLSI chip design fundamentals',
        date: 'March 15, 2024',
        time: '10:00 AM - 4:00 PM',
        venue: 'Electronics Lab, Block A'
    },
    {
        id: 'chip',
        name: 'Chip Architecture Talk',
        description: 'Industry expert talk on modern chip architectures and trends',
        date: 'March 16, 2024',
        time: '2:00 PM - 5:00 PM',
        venue: 'Main Auditorium'
    },
    {
        id: 'hackathon',
        name: 'Embedded Systems Hackathon',
        description: '24-hour hackathon building innovative embedded projects',
        date: 'March 17-18, 2024',
        time: '9:00 AM - 9:00 AM (Next Day)',
        venue: 'Innovation Center'
    },
    {
        id: 'panel',
        name: 'Industry Panel Discussion',
        description: 'Panel discussion with semiconductor industry leaders',
        date: 'March 19, 2024',
        time: '11:00 AM - 1:00 PM',
        venue: 'Conference Hall'
    }
];

const Register = () => {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [registeredUserId, setRegisteredUserId] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        college: '',
        department: '',
        selectedEvents: []
    });

    const [paymentData, setPaymentData] = useState({
        paymentId: '',
        pdfFile: null
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleEventToggle = (eventId) => {
        setFormData(prev => ({
            ...prev,
            selectedEvents: prev.selectedEvents.includes(eventId)
                ? prev.selectedEvents.filter(id => id !== eventId)
                : [...prev.selectedEvents, eventId]
        }));
    };

    const calculateTotal = () => {
        // Fixed registration fee - all events included
        return REGISTRATION_FEE;
    };

    const validateStep1 = () => {
        if (!formData.name || !formData.email || !formData.phone || !formData.college) {
            setError('Please fill in all required fields');
            return false;
        }
        if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }
        if (!/^\d{10}$/.test(formData.phone)) {
            setError('Please enter a valid 10-digit phone number');
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        if (formData.selectedEvents.length === 0) {
            setError('Please select at least one event');
            return false;
        }
        return true;
    };

    const nextStep = () => {
        if (step === 1 && validateStep1()) {
            setStep(2);
            setError('');
        } else if (step === 2 && validateStep2()) {
            // Show payment step
            setStep(3);
            setError('');
        }
    };

    const prevStep = () => {
        setStep(step - 1);
        setError('');
    };

    const handlePaymentRedirect = async () => {
        if (!validateStep2()) return;

        setLoading(true);
        setError('');

        try {
            // Save user data first
            const response = await api.post('/register', {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                college: formData.college,
                department: formData.department,
                selectedEvents: formData.selectedEvents.map(id =>
                    EVENTS.find(e => e.id === id)?.name
                ),
                paymentAmount: calculateTotal()
            });

            // Store user ID for later verification
            setRegisteredUserId(response.data.user.id);

            // Redirect to Razorpay
            window.location.href = response.data.paymentLink;

        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
            setLoading(false);
        }
    };

    const handlePdfUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            if (file.size > 5 * 1024 * 1024) {
                setError('PDF file size must be less than 5MB');
                return;
            }
            setPaymentData(prev => ({ ...prev, pdfFile: file }));
            setError('');
        } else {
            setError('Please upload a valid PDF file');
        }
    };

    const handleVerifyPayment = async (e) => {
        e.preventDefault();

        if (!paymentData.paymentId || !paymentData.pdfFile) {
            setError('Please provide both payment ID and PDF receipt');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('pdfReceipt', paymentData.pdfFile);
            formDataToSend.append('paymentId', paymentData.paymentId);
            formDataToSend.append('userId', registeredUserId);

            const response = await api.post('/verify-payment', formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setSuccess(true);
            setLoading(false);

        } catch (err) {
            setError(err.response?.data?.error || 'Payment verification failed. Please try again.');
            setLoading(false);
        }

    };

    // Handle form submission - prevent default since we use button clicks
    const handleSubmit = (e) => {
        e.preventDefault();
        // Form submission is handled by button clicks (nextStep, handlePaymentRedirect, handleVerifyPayment)
    };

    if (success) {
        return (
            <div className="register-page">
                <div className="register-container success-container">
                    <div className="success-icon">
                        <CheckCircle size={80} />
                    </div>
                    <h1>Registration Submitted!</h1>
                    <p className="success-message">
                        Your registration is pending verification. Once our team verifies your payment,
                        you'll receive an email with your login credentials.
                    </p>
                    <div className="success-info">
                        <div className="info-item">
                            <Mail size={20} />
                            <span>Check your email: <strong>{formData.email}</strong></span>
                        </div>
                        <div className="info-item">
                            <CreditCard size={20} />
                            <span>Transaction ID: <strong>{formData.transactionId}</strong></span>
                        </div>
                    </div>
                    <Link to="/" className="btn btn-primary">
                        <ArrowLeft size={20} />
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="register-page">
            <div className="register-container">
                <Link to="/" className="back-link">
                    <ArrowLeft size={20} />
                    Back to Home
                </Link>

                <div className="register-header">
                    <h1>Register for <span className="text-gradient">Semiconductor Summit 2.0</span></h1>
                    <p>Complete your registration in 3 simple steps</p>
                </div>

                {/* Progress Steps */}
                <div className="progress-steps">
                    <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
                        <div className="step-number">1</div>
                        <span>Personal Info</span>
                    </div>
                    <div className="step-line"></div>
                    <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
                        <div className="step-number">2</div>
                        <span>Select Events</span>
                    </div>
                    <div className="step-line"></div>
                    <div className={`step ${step >= 3 ? 'active' : ''}`}>
                        <div className="step-number">3</div>
                        <span>Verify Payment</span>
                    </div>
                </div>

                {error && (
                    <div className="error-message">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Step 1: Personal Info */}
                    {step === 1 && (
                        <div className="form-step">
                            <h2><User size={24} /> Personal Information</h2>

                            <div className="form-grid">
                                <div className="input-group">
                                    <label>Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        className="input"
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Email Address *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="your.email@example.com"
                                        className="input"
                                    />
                                </div>

                                <div className="input-group">
                                    <label>Phone Number *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="10-digit mobile number"
                                        className="input"
                                    />
                                </div>

                                <div className="input-group">
                                    <label>College/University *</label>
                                    <input
                                        type="text"
                                        name="college"
                                        value={formData.college}
                                        onChange={handleChange}
                                        placeholder="Your institution name"
                                        className="input"
                                    />
                                </div>

                                <div className="input-group full-width">
                                    <label>Department</label>
                                    <input
                                        type="text"
                                        name="department"
                                        value={formData.department}
                                        onChange={handleChange}
                                        placeholder="e.g., Electronics, Computer Science"
                                        className="input"
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn btn-primary" onClick={nextStep}>
                                    Continue to Events
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Select Events */}
                    {step === 2 && (
                        <div className="form-step">
                            <h2><Calendar size={24} /> Select Events</h2>
                            <p className="step-description">Choose the events you want to attend</p>

                            <div className="events-grid">
                                {EVENTS.map(event => (
                                    <div
                                        key={event.id}
                                        className={`event-card ${formData.selectedEvents.includes(event.id) ? 'selected' : ''}`}
                                        onClick={() => handleEventToggle(event.id)}
                                    >
                                        <div className="event-checkbox">
                                            {formData.selectedEvents.includes(event.id) && <CheckCircle size={20} />}
                                        </div>
                                        <div className="event-info">
                                            <h3>{event.name}</h3>
                                            <p className="event-description">{event.description}</p>
                                            <div className="event-meta">
                                                <small>{event.date}</small>
                                                <span className="event-tag">INCLUDED</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="total-section">
                                <div>
                                    <span>Registration Fee:</span>
                                    <span className="total-amount">₹{calculateTotal()}</span>
                                </div>
                                <small className="included-text">✓ All events included in registration</small>
                            </div>

                            {/* Payment Guidelines */}
                            <div className="payment-guidelines">
                                <h3>📋 Payment Instructions</h3>
                                <ol>
                                    <li>Click "Proceed to Payment" below</li>
                                    <li>You'll be redirected to our secure Razorpay payment gateway</li>
                                    <li>Complete payment and you'll receive a <strong>PDF receipt via email</strong></li>
                                    <li>Return to this page and upload the PDF receipt in Step 3</li>
                                </ol>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={prevStep}>
                                    Back
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={nextStep}
                                    disabled={loading}
                                >
                                    Proceed to Payment
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Upload Payment Receipt */}
                    {step === 3 && (
                        <div className="form-step">
                            <h2><CreditCard size={24} /> Verify Payment</h2>
                            <p className="step-description">Upload your Razorpay PDF receipt and enter the payment ID</p>

                            {!registeredUserId ? (
                                <div className="alert alert-info">
                                    <AlertCircle size={20} />
                                    <div>
                                        <strong>Complete Payment First</strong>
                                        <p>Please complete your payment on Razorpay before returning here to verify.</p>
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={handlePaymentRedirect}
                                            disabled={loading}
                                        >
                                            {loading ? 'Redirecting...' : 'Go to Payment'}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="pdf-upload-section">
                                    <div className="input-group">
                                        <label htmlFor="paymentId">
                                            Payment ID <span className="required">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="paymentId"
                                            placeholder="e.g., pay_xxxxxxxxxxxxx"
                                            value={paymentData.paymentId}
                                            onChange={(e) => setPaymentData(prev => ({ ...prev, paymentId: e.target.value }))}
                                        />
                                        <small>Find this ID in your Razorpay PDF receipt</small>
                                    </div>

                                    <div className="input-group">
                                        <label htmlFor="pdfReceipt">
                                            PDF Receipt <span className="required">*</span>
                                        </label>
                                        <input
                                            type="file"
                                            id="pdfReceipt"
                                            accept=".pdf"
                                            onChange={handlePdfUpload}
                                        />
                                        <small>Upload the PDF receipt you received from Razorpay (max 5MB)</small>
                                        {paymentData.pdfFile && (
                                            <div className="file-preview">
                                                ✓ {paymentData.pdfFile.name}
                                            </div>
                                        )}
                                    </div>

                                    <div className="form-actions">
                                        <button type="button" className="btn btn-secondary" onClick={prevStep}>
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={handleVerifyPayment}
                                            disabled={loading || !paymentData.paymentId || !paymentData.pdfFile}
                                        >
                                            {loading ? 'Verifying...' : 'Verify Payment & Complete Registration'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Register;
