import React, { useState } from "react";
import { Link } from "react-router-dom";
import Menu from "../components/Menu";
import "./Boys.css";
import "../components/Footer.css";

const boysData = [
    { id: 1, name: "Artur", photo: `${process.env.PUBLIC_URL}/images/artur.jpg`, height: 180, age: 22 },
    { id: 2, name: "Dima", photo: `${process.env.PUBLIC_URL}/images/dima.jpg`, height: 175, age: 25 },
    { id: 3, name: "Borys", photo: `${process.env.PUBLIC_URL}/images/borys.jpg`, height: 182, age: 24 },
    { id: 4, name: "Danyil", photo: `${process.env.PUBLIC_URL}/images/danyil.jpg`, height: 178, age: 23 },
];

const Boys = () => {
    const [selectedHeight, setSelectedHeight] = useState("");
    const [selectedAge, setSelectedAge] = useState("");

    const filteredBoys = boysData.filter(boy => {
        let heightMatch = true;
        let ageMatch = true;

        // Фільтр за зростом
        if (selectedHeight) {
            if (selectedHeight === "170-175") heightMatch = boy.height >= 170 && boy.height <= 175;
            if (selectedHeight === "176-180") heightMatch = boy.height >= 176 && boy.height <= 180;
            if (selectedHeight === "181-185") heightMatch = boy.height >= 181 && boy.height <= 185;
        }

        // Фільтр за віком
        if (selectedAge) {
            if (selectedAge === "22-23") ageMatch = boy.age >= 22 && boy.age <= 23;
            if (selectedAge === "24-25") ageMatch = boy.age >= 24 && boy.age <= 25;
        }

        return heightMatch && ageMatch;
    });

    return (
        <div className="boys-page">
            <Menu />

            <h1>Boys</h1>

            {/* --- Фільтри --- */}
            <div className="filters">
                <label>
                    Height:
                    <select value={selectedHeight} onChange={e => setSelectedHeight(e.target.value)}>
                        <option value="">All</option>
                        <option value="170-175">170–175 cm</option>
                        <option value="176-180">176–180 cm</option>
                        <option value="181-185">181–185 cm</option>
                    </select>
                </label>
                <label>
                    Age:
                    <select value={selectedAge} onChange={e => setSelectedAge(e.target.value)}>
                        <option value="">All</option>
                        <option value="22-23">22–23 years</option>
                        <option value="24-25">24–25 years</option>
                    </select>
                </label>
            </div>

            <div className="boys-grid">
                {filteredBoys.length === 0 ? (
                    <p className="no-results">There are currently no models matching the selected filters.</p>
                ) : (
                    filteredBoys.map((boy) => (
                        <div key={boy.id} className={`boy-card ${boy.className || ""}`}>
                            <Link to={`/models/boys/${boy.id}`} className="boy-link-img">
                                <img src={boy.photo} alt={boy.name} />
                            </Link>
                            <Link to={`/models/boys/${boy.id}`} className="boy-link">
                                <p>{boy.name}</p>
                            </Link>
                        </div>
                    ))
                )}
            </div>

            <footer className="footer">
                <p>&copy; 2025 Model Agency. All rights reserved</p>
            </footer>
        </div>
    );
};

export default Boys;
