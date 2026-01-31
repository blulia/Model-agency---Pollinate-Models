import React from "react";
import Menu from "../components/Menu";
import "./ContactUs.css";
import "../components/Footer.css";

const ContactUs = () => {
    return (
        <div className="contact-us">
            <Menu />
            <div className="contacts">
                <h1>Contacts</h1>
                <p>Email: pollinate_models_agency@example.com</p>
                <p>Phone: +123 456 789</p>
                <div className="socials">
                    <a href="#">Instagram</a>
                    <a href="#">Facebook</a>
                    <a href="#">TikTok</a>
                </div>
            </div>
            <div className="map-container">
                <h2>Our Office Location</h2>
                <iframe
                    title="Google Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11663.29555632795!2d28.622222040698215!3d49.25005534017059!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d9214daab4fe35%3A0x50369d5b640f91b!2sKryvyi%20Rih%2C%20Dnipropetrovsk%20Oblast%2C%20Ukraine!5e0!3m2!1sen!2sua!4v1699604367794!5m2!1sen!2sua"
                    width="600"
                    height="450"
                    style={{ border: 0, display: "block", margin: "0 auto" }}
                    allowFullScreen=""
                    loading="lazy"
                ></iframe>
            </div>
            <footer className="footer">
                <p>© 2025 Pollinate Models. All Rights Reserved</p>
            </footer>
        </div>
    );
};

export default ContactUs;
