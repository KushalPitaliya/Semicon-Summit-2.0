import React from 'react';
import './SemiconLogo.css';

const SemiconLogo = ({ scale = 1, variant = 'navbar' }) => {
    return (
        <div className={`semicon-logo ${variant}`} style={{ '--scale': scale }}>
            <div className="logo-main-wrapper">
                <h1 className="logo-main-text">
                    SEMIC<span className="logo-chip-container"><div className="logo-chip-inner">O</div></span>NDUCTOR
                </h1>
            </div>
            <div className="logo-sub-wrapper">
                <div className="logo-bar logo-bar-left" />
                <span className="logo-sub-text">Summit 2.0</span>
                <div className="logo-bar logo-bar-right" />
            </div>
        </div>
    );
};

export default SemiconLogo;
