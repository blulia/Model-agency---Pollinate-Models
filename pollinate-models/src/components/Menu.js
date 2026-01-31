import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";
import './Menu.css';
import { jwtDecode } from "jwt-decode";

const Menu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded?.role) {
                    setIsLoggedIn(true);
                    setRole(decoded.role);
                }
            } catch (err) {
                console.error("Invalid token");
            }
        }
    }, []);

    const getCabinetPath = () => {
        if (role === 'admin') return '/admin-cabinet';
        if (role === 'model') return '/model-cabinet';
        if (role === 'photographer') return '/photographer-cabinet';
        return '/';
    };

    const closeMenu = () => setIsOpen(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setRole('');
    };

    return (
        <div>
            <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
                <motion.div
                    animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 5 : 0 }}
                    className="bar"
                ></motion.div>
                <motion.div
                    animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -5 : 0 }}
                    className="bar"
                ></motion.div>
            </div>
            {isOpen && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="menu"
                >
                    <ul>
                        <li><Link to="/" onClick={closeMenu}>Main</Link></li>
                        <li><Link to="/about-us" onClick={closeMenu}>About Us</Link></li>
                        <li><Link to="/models" onClick={closeMenu}>Models</Link></li>
                        <li><Link to="/become-model" onClick={closeMenu}>Become a Model</Link></li>
                        {isLoggedIn ? (
                            <>
                                <li>
                                    <Link to={getCabinetPath()} className="cabinet-link" onClick={closeMenu}>
                                        Profile
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/" onClick={handleLogout}>Log out</Link>
                                </li>
                            </>
                        ) : (
                            <li><Link to="/register" onClick={closeMenu}>Sign in/Sign up</Link></li>
                        )}
                        <li><Link to="/contact-us" onClick={closeMenu}>Contacts</Link></li>
                    </ul>
                </motion.div>
            )}
        </div>
    );
};

export default Menu;