import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Menu from "../components/Menu";
import "../components/Footer.css";
import "./Register.css";

function Register() {
    const [formData, setFormData] = useState({
        name: "",
        surname: "",
        phone: "",
        password: "",
        role: "model",
    });

    const [message, setMessage] = useState("");
    const [passwordValid, setPasswordValid] = useState({
        length: false,
        upper: false,
        lower: false,
        number: false,
        special: false,
    }); 
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "name" || name === "surname") {
            const latinOnly = value.replace(/[^A-Za-z]/g, "");
            setFormData((prevData) => ({ ...prevData, [name]: latinOnly }));
        } else if (name === "phone") {
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
            setFormData((prevData) => ({ ...prevData, [name]: value }));
        }

        if (name === "password") {
            setFormData((prevData) => ({ ...prevData, password: value }));
            checkPasswordStrength(value);
        }
    };

    const checkPasswordStrength = (password) => {
        const length = password.length >= 8;
        const upper = /[A-Z]/.test(password);
        const lower = /[a-z]/.test(password);
        const number = /\d/.test(password);
        const special = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        setPasswordValid({
            length,
            upper,
            lower,
            number,
            special,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const latinRegex = /^[A-Za-z]+$/;
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

        if (!latinRegex.test(formData.name) || !latinRegex.test(formData.surname)) {
            setMessage("Only Latin characters are allowed in the field Name and Surname.");
            return;
        }

        if (!/^\+?\d{1,15}$/.test(formData.phone)) {
            setMessage("The phone number must contain only numbers (up to 15 characters) and can start with +.");
            return;
        }

        if (!passwordRegex.test(formData.password)) {
            setMessage(
                "The password must contain at least 8 characters, including uppercase and lowercase letters, a number, and a special character."
            );
            return;
        }

        try {
            const res = await axios.post("http://localhost:5000/api/register", formData);
            setMessage(res.data.message);

            if (res.data.success) {
                localStorage.setItem("token", res.data.token);
                window.location.href = `/${formData.role}-cabinet`; 
            }
        } catch (err) {
            console.error(err);
            setMessage("The user already exists.");
        }
    };

    return (
        <div className="register-page">
            <Menu />
            <div className="branding">
                <img src="/logo_agency.png" alt="Pollinate Models" className="logo-register" />
                <h1 className="site-title">Pollinate Models</h1>
            </div>

            <div className="already-have-account">
                <div className="account-row">
                    <span>Already have an account?</span>
                    <Link to="/login">
                        <button className="sign-in-button">Sign in</button>
                    </Link>
                </div>
            </div>
            <div className="register-container">
                <h2>Create an account</h2>
                <form className="register-form" onSubmit={handleSubmit}>
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <label>Surname</label>
                    <input
                        type="text"
                        name="surname"
                        value={formData.surname}
                        onChange={handleChange}
                        required
                    />

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
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <div className="password-requirements">
                        <ul>
                            <li className={passwordValid.length ? "valid" : "invalid"}>
                                8 or more characters
                            </li>
                            <li className={passwordValid.upper ? "valid" : "invalid"}>
                                1 or more capital letters
                            </li>
                            <li className={passwordValid.lower ? "valid" : "invalid"}>
                                1 or more lower case letters
                            </li>
                            <li className={passwordValid.number ? "valid" : "invalid"}>
                                1 or more digits
                            </li>
                            <li className={passwordValid.special ? "valid" : "invalid"}>
                                1 or more special characters
                            </li>
                        </ul>
                    </div>

                    <label>Role</label>
                    <select name="role" value={formData.role} onChange={handleChange}>
                        <option value="model">Model</option>
                        <option value="photographer">Photographer</option>
                        <option value="admin">Admin</option>
                    </select>
                    <button
                        type="submit"
                        className="create-account-button"
                    >
                        Sign up
                    </button>
                    {message && <p className="message">{message}</p>}
                </form>
            </div>
            <footer className="footer">
                <p>© 2025 Pollinate Models. All Rights Reserved</p>
            </footer>
        </div>
    );
}

export default Register;
