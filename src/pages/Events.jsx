import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, Award, Zap, Lightbulb, Cpu, Code, Trophy, Target } from 'lucide-react';
import './Events.css';

// Actual Semiconductor Summit 2.0 Events - March 17-19, 2026
const EVENTS_DATA = [
    {
        id: 'panel-discussion',
        name: 'Fabless Startups and Fabless MSMEs',
        subtitle: 'Amazing Semiconductor Growth',
        description: 'Panel discussion on fabless startups and MSMEs in semiconductor industry',
        fullDescription: 'Join industry leaders for an insightful panel discussion on the rise of fabless startups and MSMEs in the semiconductor ecosystem. Explore business models, challenges, opportunities, and the future of fabless semiconductor companies in India.',
        day: 'Day 1',
        date: 'March 17, 2026 (Tuesday)',
        time: '11:30 AM - 12:30 PM',
        venue: 'Main Auditorium, A6 Building',
        icon: <Users size={32} />,
        category: 'Panel Discussion',
        highlights: [
            'Fabless business model insights',
            'Startup ecosystem in semiconductors',
            'MSME opportunities and challenges',
            'Industry expert panel',
            'Interactive Q&A session'
        ],
        prerequisites: 'None - Open to all'
    },
    {
        id: 'rtl-gds-workshop',
        name: 'RTL to GDS II (Open Source)',
        description: 'Hands-on workshop on RTL to GDS II flow using open-source tools',
        fullDescription: 'Learn the complete chip design flow from RTL (Register Transfer Level) to GDSII using cutting-edge open-source EDA tools. This hands-on workshop covers the entire ASIC design flow including synthesis, place and route, and verification.',
        day: 'Day 1',
        date: 'March 17, 2026 (Tuesday)',
        time: '01:30 PM - 04:30 PM',
        venue: 'VLSI Lab, A6 Building',
        icon: <Code size={32} />,
        category: 'Hands-on Workshop',
        highlights: [
            'Complete RTL to GDSII flow',
            'Open-source EDA tools (OpenROAD, Yosys)',
            'Synthesis and place & route',
            'Timing analysis and verification',
            'Hands-on practical sessions'
        ],
        prerequisites: 'Basic knowledge of digital design, Verilog (for 6th semester students)'
    },
    {
        id: 'verilog-fpga-workshop',
        name: 'Getting Started with Verilog and FPGA',
        description: 'Hands-on workshop for beginners on Verilog and FPGA programming',
        fullDescription: 'Perfect for beginners! Learn the fundamentals of Verilog HDL and FPGA development. This hands-on workshop covers Verilog syntax, combinational and sequential logic, and implementing designs on real FPGAhardware.',
        day: 'Day 1',
        date: 'March 17, 2026 (Tuesday)',
        time: '01:30 PM - 04:30 PM',
        venue: 'Digital Lab, A6 Building',
        icon: <Cpu size={32} />,
        category: 'Hands-on Workshop',
        highlights: [
            'Verilog HDL fundamentals',
            'Combinational and sequential circuits',
            'FPGA architecture basics',
            'Hands-on FPGA programming',
            'Real hardware implementation'
        ],
        prerequisites: 'Basic digital electronics knowledge (for 3rd/4th semester students)'
    },
    {
        id: 'embedded-vlsi',
        name: 'Embedded vs VLSI - What Should I Choose?',
        description: 'Career guidance session on choosing between embedded systems and VLSI',
        fullDescription: 'Confused about choosing between embedded systems and VLSI career paths? This insight session provides comprehensive guidance on both domains, career prospects, required skills, industry trends, and how to make the right choice based on your interests.',
        day: 'Day 2',
        date: 'March 18, 2026 (Wednesday)',
        time: '09:45 AM - 11:00 AM',
        venue: 'Seminar Hall, A6 Building',
        icon: <Lightbulb size={32} />,
        category: 'Insight Session',
        highlights: [
            'Career path comparison',
            'Industry demand and trends',
            'Required skill sets',
            'Job roles and opportunities',
            'Expert career guidance'
        ],
        prerequisites: 'None - Especially valuable for 2nd and 3rd year students'
    },
    {
        id: 'silicon-shark-tank',
        name: 'Silicon Shark Tank',
        description: 'Industry-driven idea pitching competition for semiconductor innovations',
        fullDescription: 'Present your innovative semiconductor ideas to industry experts! Like the popular Shark Tank format, pitch your chip designs, semiconductor solutions, or hardware innovations to a panel of industry leaders and compete for recognition and prizes.',
        day: 'Day 2',
        date: 'March 18, 2026 (Wednesday)',
        time: '12:30 PM - 04:30 PM',
        venue: 'Innovation Center, A6 Building',
        icon: <Trophy size={32} />,
        category: 'Industry-Driven Idea Pitching',
        highlights: [
            'Pitch to industry experts',
            'Real-world problem solving',
            'Networking with professionals',
            'Prizes for best ideas',
            'Entrepreneurship exposure'
        ],
        prerequisites: 'Prepare a 5-minute pitch presentation'
    },
    {
        id: 'wafer-chip-demo',
        name: 'Wafer to Chip Demonstration by Monk9',
        description: 'Live demonstration of semiconductor manufacturing process',
        fullDescription: 'Witness the complete semiconductor manufacturing journey from wafer to chip! Monk9 presents a live demonstration showcasing the intricate steps of chip fabrication, packaging, and testing. A rare opportunity to see the hardware side of semiconductors.',
        day: 'Day 2',
        date: 'March 18, 2026 (Wednesday)',
        time: '12:30 PM - 04:30 PM',
        venue: 'Exhibition Area, A6 Building',
        icon: <Zap size={32} />,
        category: 'Stall Visit',
        highlights: [
            'Live chip manufacturing demo',
            'Wafer fabrication process',
            'Packaging and testing',
            'Industry equipment showcase',
            'Interactive demonstrations'
        ],
        prerequisites: 'None - Open to all'
    },
    {
        id: 'ai-vlsi',
        name: 'AI in VLSI: Will it Change or Replace the VLSI Engineer?',
        description: 'Exploring the impact of AI on VLSI design and engineering careers',
        fullDescription: 'Explore how artificial intelligence is transforming VLSI design. Will AI replace VLSI engineers or become a powerful tool? This session discusses AI-driven EDA tools, machine learning in chip design, and the future role of VLSI engineers in an AI-enhanced world.',
        day: 'Day 3',
        date: 'March 19, 2026 (Thursday)',
        time: '09:45 AM - 11:00 AM',
        venue: 'Seminar Hall, A6 Building',
        icon: <Target size={32} />,
        category: 'Insight Session',
        highlights: [
            'AI in chip design',
            'ML-driven EDA tools',
            'Future of VLSI careers',
            'Human-AI collaboration',
            'Industry perspectives'
        ],
        prerequisites: 'None - Open to all'
    },
    {
        id: 'silicon-jackpot',
        name: 'The Silicon Jackpot',
        subtitle: 'Technical Treasure Hunt',
        description: 'Technical treasure hunt with semiconductor-themed challenges',
        fullDescription: 'Embark on an exciting technical treasure hunt! Solve semiconductor-related technical puzzles, crack codes, and complete challenges to find the treasure. Test your knowledge, teamwork, and problem-solving skills in this thrilling competition.',
        day: 'Day 3',
        date: 'March 19, 2026 (Thursday)',
        time: '12:10 PM - 03:30 PM',
        venue: 'Campus-wide, Starting at A6 Building',
        icon: <Award size={32} />,
        category: 'Technical Treasure Hunt',
        highlights: [
            'Semiconductor-themed puzzles',
            'Team-based competition',
            'Campus-wide adventure',
            'Technical problem solving',
            'Exciting prizes'
        ],
        prerequisites: 'Form teams of 3-4 members'
    },
    {
        id: 'tech-engagement',
        name: 'Interactive Technical Engagement Activities',
        subtitle: 'Problem-Solving Challenges & Tech Games',
        description: 'Fun technical games and problem-solving challenges',
        fullDescription: 'Participate in a variety of technical challenges and tech games! From circuit debugging to algorithm challenges, these interactive activities combine learning with fun. Perfect for applying your technical knowledge in creative ways.',
        day: 'Day 3',
        date: 'March 19, 2026 (Thursday)',
        time: '12:10 PM - 03:30 PM',
        venue: 'Activity Zones, A6 Building',
        icon: <Zap size={32} />,
        category: 'Problem-Solving Challenges',
        highlights: [
            'Technical games and challenges',
            'Circuit debugging activities',
            'Algorithmic problem solving',
            'Interactive learning',
            'Team competitions'
        ],
        prerequisites: 'None - Open to all'
    },
    {
        id: 'gallery-walk',
        name: 'Silent Silicon Ideas Gallery Walk',
        description: 'Exhibition of student projects and semiconductor innovations',
        fullDescription: 'Explore innovative projects and ideas from students and participants! The Silent Silicon Ideas Gallery showcases creative semiconductor projects, research posters, and innovative designs. Learn from peers, get inspired, and network with fellow enthusiasts.',
        day: 'Day 2',
        date: 'March 18, 2026 (Wednesday)',
        time: '12:30 PM - 04:30 PM',
        venue: 'Gallery Area, A6 Building',
        icon: <Award size={32} />,
        category: 'Gallery Walk',
        highlights: [
            'Student project exhibitions',
            'Innovative chip designs',
            'Research poster presentations',
            'Peer learning opportunities',
            'Networking with innovators'
        ],
        prerequisites: 'None - Open to all participants and exhibitors'
    }
];

const Events = () => {
    const [selectedDay, setSelectedDay] = useState('all');

    // Filter events by day
    const filteredEvents = selectedDay === 'all'
        ? EVENTS_DATA
        : EVENTS_DATA.filter(event => event.day === selectedDay);

    const getDayEvents = (day) => EVENTS_DATA.filter(e => e.day === day).length;

    return (
        <div className="events-page">
            <div className="events-container">
                {/* Header */}
                <div className="events-header">
                    <h1>Event <span className="text-gradient">Schedule</span></h1>
                    <p>SEMICONDUCTOR Summit 2.0 | March 17-19, 2026 | CHARUSAT</p>
                    <div className="header-note">
                        <Award size={20} />
                        <span>All 10 events included in your registration fee of ₹299</span>
                    </div>
                </div>

                {/* Day Filter */}
                <div className="day-filter">
                    <button
                        className={`day-btn ${selectedDay === 'all' ? 'active' : ''}`}
                        onClick={() => setSelectedDay('all')}
                    >
                        All Events ({EVENTS_DATA.length})
                    </button>
                    <button
                        className={`day-btn ${selectedDay === 'Day 1' ? 'active' : ''}`}
                        onClick={() => setSelectedDay('Day 1')}
                    >
                        Day 1 ({getDayEvents('Day 1')})
                    </button>
                    <button
                        className={`day-btn ${selectedDay === 'Day 2' ? 'active' : ''}`}
                        onClick={() => setSelectedDay('Day 2')}
                    >
                        Day 2 ({getDayEvents('Day 2')})
                    </button>
                    <button
                        className={`day-btn ${selectedDay === 'Day 3' ? 'active' : ''}`}
                        onClick={() => setSelectedDay('Day 3')}
                    >
                        Day 3 ({getDayEvents('Day 3')})
                    </button>
                </div>

                {/* Events Grid */}
                <div className="events-grid-detailed">
                    {filteredEvents.map((event, index) => (
                        <div key={event.id} className="event-detail-card" data-index={index}>
                            <div className="event-badge">
                                <span className="day-badge">{event.day}</span>
                                <span className="category-badge">{event.category}</span>
                            </div>

                            <div className="event-detail-header">
                                <div className="event-icon">
                                    {event.icon}
                                </div>
                                <div>
                                    <h2>{event.name}</h2>
                                    {event.subtitle && <p className="event-subtitle-alt">{event.subtitle}</p>}
                                    <p className="event-subtitle">{event.description}</p>
                                </div>
                            </div>

                            <p className="event-full-description">{event.fullDescription}</p>

                            <div className="event-meta-info">
                                <div className="meta-item">
                                    <Calendar size={18} />
                                    <span>{event.date}</span>
                                </div>
                                <div className="meta-item">
                                    <Clock size={18} />
                                    <span>{event.time}</span>
                                </div>
                                <div className="meta-item">
                                    <MapPin size={18} />
                                    <span>{event.venue}</span>
                                </div>
                            </div>

                            <div className="event-highlights">
                                <h3>What You'll Experience:</h3>
                                <ul>
                                    {event.highlights.map((highlight, i) => (
                                        <li key={i}>{highlight}</li>
                                    ))}
                                </ul>
                            </div>

                            {event.prerequisites && (
                                <div className="event-footer">
                                    <div className="prerequisites">
                                        <strong>Prerequisites:</strong> {event.prerequisites}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Schedule Summary */}
                <div className="schedule-summary">
                    <h2>Complete Schedule at a Glance</h2>
                    <div className="schedule-days">
                        <div className="schedule-day">
                            <h3>Day 1 - March 17</h3>
                            <ul>
                                <li>09:30-11:30: Welcome & Inaugural Talk</li>
                                <li>11:30-12:30: Panel Discussion</li>
                                <li>12:30-13:30: Lunch & Networking</li>
                                <li>13:30-16:30: Parallel Workshops (RTL to GDS + Verilog/FPGA)</li>
                            </ul>
                        </div>
                        <div className="schedule-day">
                            <h3>Day 2 - March 18</h3>
                            <ul>
                                <li>09:45-11:00: Embedded vs VLSI Session</li>
                                <li>11:00-12:10: Lunch & Networking</li>
                                <li>12:30-16:30: Silicon Shark Tank, Gallery Walk & Wafer Demo</li>
                            </ul>
                        </div>
                        <div className="schedule-day">
                            <h3>Day 3 - March 19</h3>
                            <ul>
                                <li>09:45-11:00: AI in VLSI Session</li>
                                <li>11:00-12:00: Lunch & Networking</li>
                                <li>12:10-15:30: Silicon Jackpot & Tech Activities</li>
                                <li>15:30-16:30: Awards & Closing Ceremony</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="events-cta">
                    <h2>Ready to Join?</h2>
                    <p>Register now for Semiconductor Summit 2.0 - Only ₹299</p>
                    <Link to="/register" className="btn btn-primary btn-large">
                        Register Now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Events;
