import React from 'react';
import { Link } from 'react-router-dom';
import { Users, User, GraduationCap, ArrowLeft, ChevronDown, Linkedin, Mail } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ParticleField from '../components/ParticleField';
import './Committee.css';

// Placeholder for images - ideally these would be real URLs
const PLACEHOLDER_IMG = "https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=";

const LEADERSHIP = [
    {
        name: "Dr. Principal Name",
        role: "Principal, CSPIT",
        image: PLACEHOLDER_IMG + "Principal"
    },
    {
        name: "Dr. HOD Name",
        role: "HOD, EC Department",
        image: PLACEHOLDER_IMG + "HOD"
    }
];

const COMMITTEES = [
    {
        id: 1,
        name: 'Publicity & Outreach Committee',
        description: '負責 promoting the summit and reaching out to potential participants.',
        facultyCoordinators: [
            { name: 'Dr. Sagar Patel' },
            { name: 'Prof. Vishal Shah' },
            { name: 'Dr. Dharmendra Chauhan' },
            { name: 'Dr. Tigmanshu Patel' },
            { name: 'Prof. Akshay Patel' }
        ],
        studentCoordinators: [
            { name: 'Jal Lathiya' }
        ]
    },
    {
        id: 2,
        name: 'Stage Committee',
        description: 'Manages stage setup, decoration, and flow of events.',
        facultyCoordinators: [
            { name: 'Dr. Killol Pandya' },
            { name: 'Dr. Manthan Manavadaria' },
            { name: 'Timil Patel' },
            { name: 'Nikul Patel' },
            { name: 'Ashish Patel' }
        ],
        studentCoordinators: [
            { name: 'Tathya Bhatt' }
        ]
    },
    {
        id: 3,
        name: 'Website Committee',
        description: 'Responsible for the official summit website design and maintenance.',
        facultyCoordinators: [
            { name: 'Dr. Miral Desai' },
            { name: 'Dr. Brijesh Kundaliya' }
        ],
        studentCoordinators: [
            { name: 'Kushal Pitaliya', role: 'Lead Developer', image: PLACEHOLDER_IMG + "Kushal+Pitaliya" },
            { name: 'Archi Gujar', image: PLACEHOLDER_IMG + "Archi+Gujar" }
        ]
    },
    {
        id: 4,
        name: 'Decoration Committee',
        description: 'Handles venue decoration and aesthetic arrangements.',
        facultyCoordinators: [
            { name: 'Dr. Arpita Patel' },
            { name: 'Dr. Poonam Thanki' },
            { name: 'Prof. Dhara M Patel' },
            { name: 'Dr. Kanwar Preet Kaur' },
            { name: 'Prof. Dhruvika Sonar' },
            { name: 'Prof. Dhara Pomal' }
        ],
        studentCoordinators: [
            { name: 'Dhruti Panchal' }
        ]
    },
    {
        id: 5,
        name: 'Registration, Help Desk & Attendance',
        description: 'Manages participant registration and help desk queries.',
        facultyCoordinators: [
            { name: 'Dr. Poonam Thanki' },
            { name: 'Prof. Dhara Pomal' },
            { name: 'Prof. Dhara M. Patel' },
            { name: 'Dr. Mayur Makwana' }
        ],
        studentCoordinators: [
            { name: 'Mahi Kansagara' },
            { name: 'Minaxi Dalsania' }
        ]
    },
    {
        id: 6,
        name: 'Food & Transportation Committee',
        description: 'Manages food catering and transportation logistics.',
        facultyCoordinators: [
            { name: 'Dr. Dharmendra Chauhan' },
            { name: 'Dr. Sagar Patel' }
        ],
        studentCoordinators: [
            { name: 'Tathya Bhatt' }
        ]
    },
    {
        id: 7,
        name: 'Stationery, ID & Merchandise Committee',
        description: 'Handles printing of ID cards, certificates, and merchandise.',
        facultyCoordinators: [
            { name: 'Dr. Hardik Modi' },
            { name: 'Dr. Tigmanshu Patel' },
            { name: 'Dr. Mayur Makwana' },
            { name: 'Prof. Dhara M Patel' }
        ],
        studentCoordinators: [
            { name: 'Dhruv Rupapara' }
        ]
    },
    {
        id: 8,
        name: 'Media Committee',
        description: 'Manages photography, videography, and media coverage.',
        facultyCoordinators: [
            { name: 'Dr. Brijesh Kundaliya' },
            { name: 'Dr. Dharmendra Chauhan' },
            { name: 'Dr. Tigmanshu Patel' },
            { name: 'Prof. Dhruvika Sonar' }
        ],
        studentCoordinators: [
            { name: 'Shlok Patel' }
        ]
    },
    {
        id: 9,
        name: 'Feedback & Reporting',
        description: 'Collects feedback and prepares the final event report.',
        facultyCoordinators: [
            { name: 'Dr. Jitendra Chaudhary' },
            { name: 'Dr. Kanwar Preet Kaur' },
            { name: 'Prof. Akshay Patel' },
            { name: 'Dr. Manthan Manavadaria' }
        ],
        studentCoordinators: [
            { name: 'Yashvi Kankotiya' }
        ]
    },
    {
        id: 10,
        name: 'Budget Committee',
        description: 'Manages the financial budget and expenses.',
        facultyCoordinators: [
            { name: 'Prof. Vishal Shah' },
            { name: 'Prof. Akshay Patel' }
        ],
        studentCoordinators: [
            { name: 'Man Bhimani' }
        ]
    }
];

const Committee = () => {


    return (
        <div className="committee-page">
            <Navbar />

            {/* Hero */}
            <section className="committee-hero">
                <div className="hero-bg">
                    <div className="hero-grid" />
                    <div className="hero-glow hero-glow-1" />
                    <div className="hero-glow hero-glow-2" />
                    <ParticleField count={40} />
                </div>
                <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                    <Link to="/" className="back-link">
                        <ArrowLeft size={20} />
                        Back to Home
                    </Link>
                    <div className="committee-hero-content">
                        <span className="section-tag">Our Team</span>
                        <h1>Organizing <span className="text-gradient">Committees</span></h1>
                        <p>
                            Meet the dedicated faculty and student coordinators working tirelessly
                            to make Semiconductor Summit 2.0 a grand success.
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="committee-stats">
                        <div className="committee-stat">
                            <Users size={24} />
                            <div>
                                <h3>10</h3>
                                <p>Committees</p>
                            </div>
                        </div>
                        <div className="committee-stat">
                            <GraduationCap size={24} />
                            <div>
                                <h3>25+</h3>
                                <p>Faculty Coordinators</p>
                            </div>
                        </div>
                        <div className="committee-stat">
                            <User size={24} />
                            <div>
                                <h3>10+</h3>
                                <p>Student Coordinators</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Leadership Section - Placeholders */}
            <section className="leadership-section">
                <div className="container">
                    <div className="section-header-cnt">
                        <h2>Leadership & Patrons</h2>
                        <div className="leadership-grid">
                            {LEADERSHIP.map((leader, index) => (
                                <div key={index} className="leader-card">
                                    <div className="leader-img-wrapper">
                                        <div className={`leader-img-placeholder ${leader.image ? 'has-image' : ''}`}>
                                            {leader.image ? (
                                                <img src={leader.image} alt={leader.name} />
                                            ) : (
                                                <User size={48} />
                                            )}
                                        </div>
                                    </div>
                                    <h3>{leader.name}</h3>
                                    <p>{leader.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Committee List */}
            <section className="committee-list-section">
                <div className="container">
                    <h2 className="section-title">Committee Allocation</h2>
                    <div className="committee-grid">
                        {COMMITTEES.map((committee, index) => (
                            <div
                                key={committee.id}
                                className="committee-card expanded"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <div className="committee-card-header static-header">
                                    <div className="committee-number">{String(committee.id).padStart(2, '0')}</div>
                                    <div className="committee-card-info">
                                        <h3>{committee.name}</h3>
                                    </div>
                                </div>

                                <div className="committee-card-body">
                                    <div className="coordinator-column">
                                        <h4 className="column-title faculty-title">
                                            <GraduationCap size={18} /> Faculty Coordinators
                                        </h4>
                                        <div className="coordinator-list">
                                            {committee.facultyCoordinators.map((faculty, i) => (
                                                <div key={i} className="coordinator-item">
                                                    <div className={`coordinator-avatar faculty-avatar ${faculty.image ? 'has-image' : ''}`}>
                                                        {faculty.image ? (
                                                            <img src={faculty.image} alt={faculty.name} />
                                                        ) : (
                                                            faculty.name.charAt(0)
                                                        )}
                                                    </div>
                                                    <div className="coordinator-info">
                                                        <span className="coordinator-name">{faculty.name}</span>
                                                        {faculty.role && <span className="coordinator-role">{faculty.role}</span>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="coordinator-column">
                                        <h4 className="column-title student-title">
                                            <User size={18} /> Student Coordinators
                                        </h4>
                                        <div className="coordinator-list">
                                            {committee.studentCoordinators.map((student, i) => (
                                                <div key={i} className={`coordinator-item ${student.isHighlight ? 'highlight-item' : ''}`}>
                                                    <div className={`coordinator-avatar student-avatar ${student.image ? 'has-image' : ''}`}>
                                                        {student.image ? (
                                                            <img src={student.image} alt={student.name} />
                                                        ) : (
                                                            student.name.charAt(0)
                                                        )}
                                                    </div>
                                                    <div className="coordinator-info">
                                                        <span className="coordinator-name">{student.name}</span>
                                                        {student.role && <span className="coordinator-role">{student.role}</span>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Committee;
