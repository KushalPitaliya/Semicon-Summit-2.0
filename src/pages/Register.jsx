import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Upload, CheckCircle, AlertCircle, ArrowLeft, QrCode, CreditCard, User, Mail, Phone, Building, Calendar } from 'lucide-react';
import api from '../services/api';
import './Register.css';

const EVENTS = [
    { id: 'vlsi', name: 'VLSI Design Workshop', fee: 400 },
    { id: 'chip', name: 'Chip Architecture Talk', fee: 0 },
    { id: 'hackathon', name: 'Embedded Systems Hackathon', fee: 200 },
    { id: 'panel', name: 'Industry Panel Discussion', fee: 0 }
];

const Register = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        college: '',
        department: '',
        selectedEvents: [],
        transactionId: '',
        paymentScreenshot: null
    });

    const [previewUrl, setPreviewUrl] = useState('');

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
        return formData.selectedEvents.reduce((total, eventId) => {
            const event = EVENTS.find(e => e.id === eventId);
            return total + (event?.fee || 0);
        }, 0);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                return;
            }
            setFormData(prev => ({ ...prev, paymentScreenshot: file }));
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            if (file.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                return;
            }
            setFormData(prev => ({ ...prev, paymentScreenshot: file }));
            setPreviewUrl(URL.createObjectURL(file));
        }
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

    const validateStep3 = () => {
        if (!formData.transactionId) {
            setError('Please enter the transaction ID');
            return false;
        }
        if (!formData.paymentScreenshot) {
            setError('Please upload the payment screenshot');
            return false;
        }
        return true;
    };

    const nextStep = () => {
        if (step === 1 && validateStep1()) setStep(2);
        else if (step === 2 && validateStep2()) setStep(3);
    };

    const prevStep = () => {
        setStep(prev => Math.max(1, prev - 1));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateStep3()) return;

        setLoading(true);
        setError('');

        try {
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('email', formData.email);
            submitData.append('phone', formData.phone);
            submitData.append('college', formData.college);
            submitData.append('department', formData.department);
            submitData.append('selectedEvents', JSON.stringify(formData.selectedEvents.map(id =>
                EVENTS.find(e => e.id === id)?.name
            )));
            submitData.append('transactionId', formData.transactionId);
            submitData.append('paymentAmount', calculateTotal());
            submitData.append('paymentScreenshot', formData.paymentScreenshot);

            await api.post('/register', submitData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
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
                        <span>Payment</span>
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
                                            <span className={`event-fee ${event.fee === 0 ? 'free' : ''}`}>
                                                {event.fee === 0 ? 'FREE' : `₹${event.fee}`}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="total-section">
                                <span>Total Amount:</span>
                                <span className="total-amount">₹{calculateTotal()}</span>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={prevStep}>
                                    Back
                                </button>
                                <button type="button" className="btn btn-primary" onClick={nextStep}>
                                    Continue to Payment
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Payment */}
                    {step === 3 && (
                        <div className="form-step">
                            <h2><CreditCard size={24} /> Payment</h2>

                            <div className="payment-section">
                                <div className="qr-section">
                                    <h3>Scan QR to Pay</h3>
                                    <div className="qr-code-container">
                                        <QrCode size={200} className="qr-placeholder" />
                                        <p className="qr-note">
                                            <strong>Amount: ₹{calculateTotal()}</strong>
                                        </p>
                                        <p className="qr-instruction">
                                            Scan this QR code with any UPI app to make payment
                                        </p>
                                    </div>
                                </div>

                                <div className="upload-section">
                                    <div className="input-group">
                                        <label>Transaction ID / UTR Number *</label>
                                        <input
                                            type="text"
                                            name="transactionId"
                                            value={formData.transactionId}
                                            onChange={handleChange}
                                            placeholder="Enter 12-digit transaction ID"
                                            className="input"
                                        />
                                    </div>

                                    <div className="input-group">
                                        <label>Payment Screenshot *</label>
                                        <div
                                            className={`upload-zone ${previewUrl ? 'has-file' : ''}`}
                                            onClick={() => fileInputRef.current?.click()}
                                            onDrop={handleDrop}
                                            onDragOver={(e) => e.preventDefault()}
                                        >
                                            {previewUrl ? (
                                                <div className="preview-container">
                                                    <img src={previewUrl} alt="Payment screenshot" />
                                                    <p>Click to change</p>
                                                </div>
                                            ) : (
                                                <>
                                                    <Upload size={40} />
                                                    <p>Click or drag to upload screenshot</p>
                                                    <span>PNG, JPG up to 5MB</span>
                                                </>
                                            )}
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                style={{ display: 'none' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn btn-secondary" onClick={prevStep}>
                                    Back
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Submitting...' : 'Submit Registration'}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default Register;
