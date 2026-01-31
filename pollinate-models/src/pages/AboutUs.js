import React from 'react';
import Menu from "../components/Menu";
import './AboutUs.css';
import "../components/Footer.css";

const AboutUs = () => {
    return (
        <div className="about-us">
            <Menu />
            <header className="about-header">
                <h1>About Us</h1>
            </header>
            <section className="about-content">
                <h2>History of the agency</h2>
                <p>
                    The agency Pollinate Models was founded in 2024 by a team of professionals with experience in the world of fashion and modeling business. The idea of ​​creating the agency arose from the desire to unite talented models and develop the beauty industry through professionalism and creativity.
                </p>
                <p>
                    Our agency collaborates with leading designers, photographers and other companies in the fashion industry around the world. We actively work with creative teams in Europe, the USA and Asia to create new opportunities for our models.
                </p>
                <h2>Meet Our Team</h2>
                <div className="team-members">
                    <div className="agency-photo">
                        <img
                            src={`${process.env.PUBLIC_URL}/images/aboutUs.jpg`}
                            alt="Our agency collaboration"
                            className="about-us-photo"
                        />
                    </div>
                    <p>Here are our team from left to right:</p>
                    <div className="team-roles">
                        <ul>
                            <li><strong>Katia</strong> is responsible for managing model bookings and ensuring smooth communication between the models and clients. She coordinates schedules and ensures every event runs smoothly.</li>
                            <li><strong>Daria</strong> is in charge of creative direction and styling. She works closely with photographers and designers to ensure our models showcase the latest trends in fashion.</li>
                            <li><strong>Tania</strong> handles marketing and social media management. She is responsible for promoting the agency’s models and ensuring they have a strong online presence.</li>
                            <li><strong>Arina</strong> is a head of model development and training. She works closely with the models to help them improve their skills and prepare for photo shoots, runway shows, and other events.</li>
                            <li><strong>Sasha</strong> is legal advisor for the agency, ensuring that all contracts and agreements are in order. She works to protect the rights of our models and clients alike.</li>
                        </ul>
                    </div>
                </div>

                <h2>Our principles</h2>
                <p>
                    We firmly uphold the principles of ethics, mutual respect and openness. In our work, we do not cooperate with countries that support russian aggression against Ukraine.
                </p>
            </section>
            <footer className="footer">
                <p>© 2025 Pollinate Models. All Rights Reserved</p>
            </footer>
        </div>
    );
};

export default AboutUs;
