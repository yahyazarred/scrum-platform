import React from 'react';
import type { ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({ 
    variant = 'primary', 
    children, 
    className, 
    ...props 
}) => {
    return (
        <button 
            className={`${styles.button} ${styles[variant]} ${className || ''}`}
            {...props}
        >
            {children}
        </button>
    );
};
