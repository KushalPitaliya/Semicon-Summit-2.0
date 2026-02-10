import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, User, GraduationCap, ArrowLeft, ChevronDown } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './Committee.css';

const COMMITTEES = [
    {
        id: 1,
        name: 'Inauguration & Valedictory Committee',
        description: 'Responsible for planning and executing the opening and closing ceremonies of the summit.',
        facultyCoordinators: ['Faculty Coordinator 1', 'Faculty Coordinator 2'],
        studentCoordinators: ['Student Coordinator 1', 'Student Coordinator 2', 'Student Coordinator 3']
    },
    {
        id: 2,
        name: 'Registration & Certificate Committee',
        description: 'Manages participant registration, verification, and certificate distribution.',
        facultyCoordinators: ['Faculty Coordinator 1', 'Faculty Coordinator 2'],
        studentCoordinators: ['Student Coordinator 1', 'Student Coordinator 2', 'Student Coordinator 3']
    },
    {
        id: 3,
        name: 'Workshop & Technical Events Committee',
        description: 'Organizes the RTL to GDS II and Verilog & FPGA hands-on workshop sessions.',
        facultyCoordinators: ['Faculty Coordinator 1', 'Faculty Coordinator 2'],
        studentCoordinators: ['Student Coordinator 1', 'Student Coordinator 2', 'Student Coordinator 3']
    },
    {
        id: 4,
        name: 'Panel Discussion & Insight Sessions Committee',
        description: 'Coordinates the Fabless Startups panel and Embedded vs VLSI & AI in VLSI sessions.',
        facultyCoordinators: ['Faculty Coordinator 1', 'Faculty Coordinator 2'],
        studentCoordinators: ['Student Coordinator 1', 'Student Coordinator 2', 'Student Coordinator 3']
    },
    {
        id: 5,
        name: 'Silicon Shark Tank Committee',
        description: 'Manages the industry-driven idea pitching competition including judges and evaluation.',
        facultyCoordinators: ['Faculty Coordinator 1', 'Faculty Coordinator 2'],
        studentCoordinators: ['Student Coordinator 1', 'Student Coordinator 2', 'Student Coordinator 3']
    },
    {
        id: 6,
        name: 'Wafer to Chip Demo & Gallery Walk Committee',
        description: 'Coordinates the Monk9 demonstration stall and Silent Silicon Ideas Gallery Walk.',
        facultyCoordinators: ['Faculty Coordinator 1', 'Faculty Coordinator 2'],
        studentCoordinators: ['Student Coordinator 1', 'Student Coordinator 2', 'Student Coordinator 3']
    },
    {
        id: 7,
        name: 'Silicon Jackpot & Technical Activities Committee',
        description: 'Organizes the technical treasure hunt and interactive engagement activities.',
        facultyCoordinators: ['Faculty Coordinator 1', 'Faculty Coordinator 2'],
        studentCoordinators: ['Student Coordinator 1', 'Student Coordinator 2', 'Student Coordinator 3']
    },
    {
        id: 8,
        name: 'Publicity & Social Media Committee',
        description: 'Handles all promotional activities, social media campaigns, and event coverage.',
        facultyCoordinators: ['Faculty Coordinator 1', 'Faculty Coordinator 2'],
        studentCoordinators: ['Student Coordinator 1', 'Student Coordinator 2', 'Student Coordinator 3']
    },
    {
        id: 9,
        name: 'Sponsorship & Finance Committee',
        description: 'Manages sponsorship procurement, budgeting, and financial planning.',
        facultyCoordinators: ['Faculty Coordinator 1', 'Faculty Coordinator 2'],
        studentCoordinators: ['Student Coordinator 1', 'Student Coordinator 2', 'Student Coordinator 3']
    },
    {
        id: 10,
        name: 'Hospitality & Logistics Committee',
        description: 'Handles venue arrangements, food, transport, and guest hospitality.',
        facultyCoordinators: ['Faculty Coordinator 1', 'Faculty Coordinator 2'],
        studentCoordinators: ['Student Coordinator 1', 'Student Coordinator 2', 'Student Coordinator 3']
    }
];

const Committee = () => {
    const [expandedId, setExpandedId] = useState(null);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="committee-page">
            <Navbar />

            {/* Header */}
            <section className="committee-hero">
                <div className="container">
                    <Link to="/" className="back-link">
                        <ArrowLeft size={20} />
                        Back to Home
                    </Link>
                    <div className="committee-hero-content">
                        <span className="section-tag">Our Team</span>
                        <h1>Organizing <span className="text-gradient">Committees</span></h1>
                        <p>
                            Semiconductor Summit 2.0 is organized by 10 dedicated committees
                            comprising faculty and student coordinators from the Department of
                            Electronics & Communication Engineering, CSPIT - CHARUSAT.
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
                                <h3>20+</h3>
                                <p>Faculty Coordinators</p>
                            </div>
                        </div>
                        <div className="committee-stat">
                            <User size={24} />
                            <div>
                                <h3>30+</h3>
                                <p>Student Coordinators</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Committee List */}
            <section className="committee-list-section">
                <div className="container">
                    <div className="committee-grid">
                        {COMMITTEES.map((committee, index) => (
                            <div
                                key={committee.id}
                                className={`committee-card ${expandedId === committee.id ? 'expanded' : ''}`}
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <div className="committee-card-header" onClick={() => toggleExpand(committee.id)}>
                                    <div className="committee-number">{String(committee.id).padStart(2, '0')}</div>
                                    <div className="committee-card-info">
                                        <h3>{committee.name}</h3>
                                        <p>{committee.description}</p>
                                    </div>
                                    <ChevronDown size={20} className={`expand-icon ${expandedId === committee.id ? 'rotated' : ''}`} />
                                </div>

                                {expandedId === committee.id && (
                                    <div className="committee-card-body">
                                        <div className="coordinator-section">
                                            <h4><GraduationCap size={18} /> Faculty Coordinators</h4>
                                            <ul>
                                                {committee.facultyCoordinators.map((name, i) => (
                                                    <li key={i}>{name}</li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="coordinator-section">
                                            <h4><User size={18} /> Student Coordinators</h4>
                                            <ul>
                                                {committee.studentCoordinators.map((name, i) => (
                                                    <li key={i}>{name}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                )}
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
