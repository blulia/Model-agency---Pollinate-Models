import React, { useState } from "react";
import { Link } from "react-router-dom";
import Menu from "../components/Menu";
import "./Girls.css";
import "../components/Footer.css";

const girlsData = [
    { id: 1, name: "Daria", photo: `${process.env.PUBLIC_URL}/images/daria.jpg`, height: 177, age: 22 },
    { id: 2, name: "Lilith", photo: `${process.env.PUBLIC_URL}/images/lilith.jpg`, height: 175, age: 24 },
    { id: 3, name: "Anisia", photo: `${process.env.PUBLIC_URL}/images/anisia.jpg`, height: 172, age: 21 },
    { id: 4, name: "Soni", photo: `${process.env.PUBLIC_URL}/images/soni.jpg`, height: 176, age: 23 },
];

const Girls = () => {
    const [heightFilter, setHeightFilter] = useState("all");
    const [ageFilter, setAgeFilter] = useState("all");

    const filteredGirls = girlsData.filter(girl => {
        let heightMatch = true;
        let ageMatch = true;

        if (heightFilter === "<175") heightMatch = girl.height < 175;
        else if (heightFilter === "175-177") heightMatch = girl.height >= 175 && girl.height <= 177;
        else if (heightFilter === ">177") heightMatch = girl.height > 177;

        if (ageFilter === "<22") ageMatch = girl.age < 22;
        else if (ageFilter === "22-24") ageMatch = girl.age >= 22 && girl.age <= 24;
        else if (ageFilter === ">24") ageMatch = girl.age > 24;

        return heightMatch && ageMatch;
    });

    return (
        <div className="girls-page">
            <Menu />

            <h1>Girls</h1>

            <div className="filters">
                <label>
                    Height:
                    <select value={heightFilter} onChange={e => setHeightFilter(e.target.value)}>
                        <option value="all">All</option>
                        <option value="<175">Less than 175 cm</option>
                        <option value="175-177">175 - 177 cm</option>
                        <option value=">177">More than 177 cm</option>
                    </select>
                </label>

                <label>
                    Age:
                    <select value={ageFilter} onChange={e => setAgeFilter(e.target.value)}>
                        <option value="all">All</option>
                        <option value="<22">Less than 22</option>
                        <option value="22-24">22 - 24</option>
                        <option value=">24">More than 24</option>
                    </select>
                </label>
            </div>

            <div className="girls-grid">
                {filteredGirls.length > 0 ? (
                    filteredGirls.map(girl => (
                        <div key={girl.id} className={`girl-card ${girl.className || ""}`}>
                            <Link to={`/models/girls/${girl.id}`} className="girl-link-img">
                                <img src={girl.photo} alt={girl.name} />
                            </Link>
                            <Link to={`/models/girls/${girl.id}`} className="girl-link">
                                {girl.name}
                            </Link>
                        </div>
                    ))
                ) : (
                        <p className="no-results">There are currently no models matching the selected filters.</p>
                )}
            </div>

            <footer className="footer">
                <p>&copy; 2025 Pollinate Models. All rights reserved</p>
            </footer>
        </div>
    );
};

export default Girls;
