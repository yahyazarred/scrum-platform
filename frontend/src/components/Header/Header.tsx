import React from 'react';
import logo from '../../assets/ScrumbleLogo2.png';
import styles from './Header.module.css';

interface HeaderProps {
    children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ children }) => {
    return (
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <div className={styles.logoPlaceholder}>
                    <img src={logo} alt="Logo" />
                </div>
                <span className={styles.logoText}>Scrum<span>ble</span></span>
            </div>
            
            <div className={styles.rightSide}>
                {children}
            </div>
        </header>
    );
};
