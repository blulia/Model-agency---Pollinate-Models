import React from "react";
import Menu from "../components/Menu";
import "./Home.css";
import "../components/Footer.css";

const Home = () => {
    return (
        <div className="home">
            <Menu />
            <header className="header">
                <img src="/logo_agency.png" alt="Pollinate Models" className="logo" />
            </header>
            <div className="hero">
                <video autoPlay loop muted className="background-video">
                    <source
                        src="/videos/stock-video-bee-collects-nectar-echinacea-blossom-close-view-reveals-how-one.mp4"
                        type="video/mp4" />
                </video>
                <div className="overlay">
                    <h1>Pollinate Models</h1>
                </div>
            </div>
            <footer className="footer">
                <p>© 2025 Pollinate Models. All Rights Reserved</p>
            </footer>
        </div>
    );
};

export default Home;
