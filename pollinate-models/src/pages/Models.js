import React from "react";
import Menu from "../components/Menu";
import { Link } from "react-router-dom";
import "./Models.css";
import "../components/Footer.css";

const Models = () => {
    return (
        <div className="models-page">
            <Menu />
            <div className="hero-m">
                <h1 className="models-title">Models</h1>
                <div className="images-container">
                    <div className="model-card">
                        <Link to="/models/girls">
                            <img
                                src={`${process.env.PUBLIC_URL}/images/daria.jpg`}
                                alt="Girls"
                            />
                        </Link>
                        <Link to="/models/girls">Girls</Link>
                    </div>
                    <div className="model-card">
                        <Link to="/models/boys">
                            <img
                                src={`${process.env.PUBLIC_URL}/images/artur.jpg`}
                                alt="Boys"
                            />
                        </Link>
                        <Link to="/models/boys">Boys</Link>
                    </div>
                </div>
            </div>
            <footer className="footer">
                <p>© 2025 Pollinate Models. All Rights Reserved</p>
            </footer>
        </div>
    );
};

export default Models;
