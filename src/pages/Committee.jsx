import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, User, GraduationCap, ArrowLeft, Star, Monitor, Share2, Palette, ClipboardList, Truck, IdCard, Video, MessageSquare, DollarSign, Award, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ParticleField from '../components/ParticleField';
import './Committee.css';

// --- DATA ---
const PLACEHOLDER_IMG = "https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=";

const CONVENERS = [
    {
        name: "Dr. Trushit Upadhyaya",
        role: "Principal, CSPIT",
        designation: "Principal",
        image: PLACEHOLDER_IMG + "Trushit+Upadhyaya",
        icon: <Star size={16} />
    },
    {
        name: "Dr. Upesh Patel",
        role: "HOD, EC Dept",
        designation: "Head of EC Dept",
        image: PLACEHOLDER_IMG + "Upesh+Patel",
        icon: <Award size={16} />
    }
];

const FACULTY_COORDINATORS = [
    { name: 'Dr. Sagar Patel', role: 'Faculty Coordinator', designation: 'Publicity & Food', icon: <Share2 size={16} /> },
    { name: 'Dr. Dharmendra Chauhan', role: 'Faculty Coordinator', designation: 'Publicity, Food & Media', icon: <Share2 size={16} /> },
    { name: 'Prof. Vishal Shah', role: 'Faculty Coordinator', designation: 'Publicity & Budget', icon: <DollarSign size={16} /> },
    { name: 'Dr. Tigmanshu Patel', role: 'Faculty Coordinator', designation: 'Publicity, Stationery & Media', icon: <Share2 size={16} /> },
    { name: 'Prof. Akshay Patel', role: 'Faculty Coordinator', designation: 'Publicity, Feedback & Budget', icon: <MessageSquare size={16} /> },
    { name: 'Dr. Killol Pandya', role: 'Faculty Coordinator', designation: 'Stage Committee', icon: <Award size={16} /> },
    { name: 'Dr. Manthan Manavadaria', role: 'Faculty Coordinator', designation: 'Stage & Feedback', icon: <Award size={16} /> },
    { name: 'Timil Patel', role: 'Faculty Coordinator', designation: 'Stage Committee', icon: <Award size={16} /> },
    { name: 'Nikul Patel', role: 'Faculty Coordinator', designation: 'Stage Committee', icon: <Award size={16} /> },
    { name: 'Ashish Patel', role: 'Faculty Coordinator', designation: 'Stage Committee', icon: <Award size={16} /> },
    { name: 'Dr. Miral Desai', role: 'Faculty Coordinator', designation: 'Website Committee', icon: <Monitor size={16} /> },
    { name: 'Dr. Brijesh Kundaliya', role: 'Faculty Coordinator', designation: 'Website & Media', icon: <Monitor size={16} /> },
    { name: 'Dr. Arpita Patel', role: 'Faculty Coordinator', designation: 'Decoration Committee', icon: <Palette size={16} /> },
    { name: 'Dr. Poonam Thanki', role: 'Faculty Coordinator', designation: 'Decoration & Registration', icon: <Palette size={16} /> },
    { name: 'Prof. Dhara M Patel', role: 'Faculty Coordinator', designation: 'Decoration, Reg & Stationery', icon: <Palette size={16} /> },
    { name: 'Dr. Kanwar Preet Kaur', role: 'Faculty Coordinator', designation: 'Decoration & Feedback', icon: <Palette size={16} /> },
    { name: 'Prof. Dhruvika Sonar', role: 'Faculty Coordinator', designation: 'Decoration & Media', icon: <Video size={16} /> },
    { name: 'Prof. Dhara Pomal', role: 'Faculty Coordinator', designation: 'Decoration & Registration', icon: <Palette size={16} /> },
    { name: 'Dr. Mayur Makwana', role: 'Faculty Coordinator', designation: 'Registration & Stationery', icon: <ClipboardList size={16} /> },
    { name: 'Dr. Hardik Modi', role: 'Faculty Coordinator', designation: 'Stationery Committee', icon: <IdCard size={16} /> },
    { name: 'Dr. Jitendra Chaudhary', role: 'Faculty Coordinator', designation: 'Feedback Committee', icon: <MessageSquare size={16} /> }
];

const CORE_COMMITTEE = [
    { name: 'Dhruti Panchal', role: 'Core Committee', designation: 'Decoration Head', icon: <Palette size={16} /> },
    { name: 'Dhruv Rupapara', role: 'Core Committee', designation: 'Stationery Head', icon: <IdCard size={16} /> },
    { name: 'Man Bhimani', role: 'Core Committee', designation: 'Budget Head', icon: <DollarSign size={16} /> }
];

const STUDENT_COORDINATORS = [
    { name: 'Kushal Pitaliya', role: 'Coordinator', designation: 'Website', image: PLACEHOLDER_IMG + "Kushal+Pitaliya", icon: <Monitor size={16} /> },
    { name: 'Tathya Bhatt', role: 'Coordinator', designation: 'Stage & Food', image: PLACEHOLDER_IMG + "Tathya+Bhatt", icon: <ClipboardList size={16} /> },
    { name: 'Jal Lathiya', role: 'Coordinator', designation: 'Publicity', image: PLACEHOLDER_IMG + "Jal+Lathiya", icon: <Share2 size={16} /> },
    { name: 'Archi Gujar', role: 'Coordinator', designation: 'Website', icon: <Monitor size={16} /> },
    { name: 'Mahi Kansagara', role: 'Coordinator', designation: 'Registration', icon: <ClipboardList size={16} /> },
    { name: 'Minaxi Dalsania', role: 'Coordinator', designation: 'Registration', icon: <ClipboardList size={16} /> },
    { name: 'Shlok Patel', role: 'Coordinator', designation: 'Media', icon: <Video size={16} /> },
    { name: 'Yashvi Kankotiya', role: 'Coordinator', designation: 'Feedback', icon: <MessageSquare size={16} /> }
];

const TeamMemberCard = ({ member }) => (
    <div className="team-card">
        <div className="card-image-container">
            <div className="card-image-wrapper">
                {member.image ? (
                    <img src={member.image} alt={member.name} />
                ) : (
                    <div className="placeholder-avatar">
                        <span className="initials">{member.name.charAt(0)}</span>
                    </div>
                )}
            </div>
            <div className="card-badge">
                {member.icon || <User size={14} />}
            </div>
        </div>

        <div className="card-content">
            <h3 className="card-name">{member.name}</h3>
            <div className="card-role-badge">
                {member.role === 'Faculty Coordinator' ? 'FACULTY' : member.role}
            </div>
            <p className="card-subtitle">{member.designation || 'CSPIT, CHARUSAT'}</p>
        </div>
    </div>
);

const Committee = () => {
    const [activeTab, setActiveTab] = useState('Conveners');

    const tabs = [
        'Conveners',
        'Faculty Coordinators',
        'Core Committee',
        'Student Coordinators'
    ];

    const getActiveData = () => {
        switch (activeTab) {
            case 'Conveners': return CONVENERS;
            case 'Faculty Coordinators': return FACULTY_COORDINATORS;
            case 'Core Committee': return CORE_COMMITTEE;
            case 'Student Coordinators': return STUDENT_COORDINATORS;
            default: return [];
        }
    };

    return (
        <div className="team-page">
            <Navbar />

            {/* Hero */}
            <section className="team-hero">
                <div className="hero-bg">
                    <div className="hero-grid" />
                    <div className="hero-glow hero-glow-1" />
                    <div className="hero-glow hero-glow-2" />
                    <ParticleField count={40} />
                </div>
                <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                    <div className="team-hero-content">
                        <span className="section-tag">The Organizers</span>
                        <h1>Excellence In <span className="text-gradient">Action</span></h1>
                        <p>
                            Meet the visionaries and executors behind Semiconductor Summit 2.0.
                        </p>
                    </div>
                </div>
            </section>

            {/* Tab Navigation */}
            <section className="team-tabs-section">
                <div className="container">
                    <div className="team-tabs-wrapper">
                        <div className="team-tabs">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    className={`team-tab ${activeTab === tab ? 'active' : ''}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Team Grid */}
                    <div className="team-grid-container">
                        <div className="team-grid">
                            {getActiveData().map((member, index) => (
                                <div key={index} className="team-grid-item" style={{ animationDelay: `${index * 0.05}s` }}>
                                    <TeamMemberCard member={member} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Committee;
