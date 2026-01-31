import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import Menu from "../components/Menu";
import { jwtDecode } from 'jwt-decode';
import "../components/Footer.css";

const Login = () => {
    const [formData, setFormData] = useState({
        phone: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [isPasswordEntered, setIsPasswordEntered] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "phone") {
            let raw = value.replace(/[^\d()+]/g, ""); 

            const plusCount = (raw.match(/\+/g) || []).length;
            const openParenCount = (raw.match(/\(/g) || []).length;
            const closeParenCount = (raw.match(/\)/g) || []).length;

            if (plusCount > 1 || openParenCount > 1 || closeParenCount > 1) return;

            const digitCount = raw.replace(/\D/g, "").length;

            if (digitCount <= 15) {
                setFormData((prevData) => ({ ...prevData, phone: raw }));
            }
        } else {
            setFormData({ ...formData, [name]: value });

            if (name === 'password' && value.length > 0) {
                setIsPasswordEntered(true);
            } else {
                setIsPasswordEntered(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const phoneDigits = formData.phone.replace(/\D/g, "");
        if (phoneDigits.length === 0 || phoneDigits.length > 15) {
            setErrorMessage("Phone number must contain only numbers (up to 15 characters).");
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/login', formData);

            if (response.data.success) {
                const token = response.data.token;
                localStorage.setItem('token', token);
                localStorage.setItem("userId", response.data.userId);

                const decoded = jwtDecode(token);
                const role = decoded.role;

                switch (role) {
                    case 'admin':
                        navigate('/admin-cabinet');
                        break;
                    case 'photographer':
                        navigate('/photographer-cabinet');
                        break;
                    case 'model':
                    default:
                        navigate('/model-cabinet');
                        break;
                }
            } else {
                setErrorMessage(response.data.message || 'Incorrect data.');
            }
        } catch (err) {
            console.error(err);
            setErrorMessage('Login error, please try again.');
        }
    };

    return (
        <div className="login-page">
            <Menu />
            <div className="login-container">
                <div className="branding">
                    <img src="/logo_agency.png" alt="Pollinate Models" className="logo-login" />
                    <h1 className="site-title">Pollinate Models</h1>
                </div>

                <div className="no-have-account">
                    <div className="account-row">
                        <span>Don't have an account?</span>
                        <Link to="/register">
                            <button className="sign-up-button">Sign up</button>
                        </Link>
                    </div>
                </div>
                <div className="login-form-wrapper">
                    <h2>Sign in</h2>
                    <form className="login-form" onSubmit={handleSubmit}>
                        <label>Phone number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
                        <button
                            type="submit"
                            className="sign-in-button-login"
                        >
                            Sign in
                        </button>
                    </form>
                </div>
            </div>
            <footer className="footer">
                <p>© 2025 Pollinate Models. All Rights Reserved</p>
            </footer>
        </div>
    );
}

export default Login;
