import React from "react";
import { useParams, Link } from "react-router-dom";
import Menu from "../components/Menu";
import "./GirlProfile.css";

const girlsData = {
    1: {
        name: "Daria",
        mainPhoto: `${process.env.PUBLIC_URL}/images/dariamain.jpg`,
        parameters: {
            height: "177 cm",
            bust: "78 cm",
            waist: "60 cm",
            hips: "91 cm",
            shoe: "39 eu",
        },
        instagram: "https://www.instagram.com/daria_bashchynska",  
        additionalPhotos: [
            `${process.env.PUBLIC_URL}/images/daria1.jpeg`,
            `${process.env.PUBLIC_URL}/images/daria2.jpg`,
            `${process.env.PUBLIC_URL}/images/daria3.jpeg`,
            `${process.env.PUBLIC_URL}/images/daria4.jpg`,
        ],
    },

    2: {
        name: "Lilith",
        mainPhoto: `${process.env.PUBLIC_URL}/images/lilithmain.jpg`,
        parameters: {
            height: "175 cm",
            bust: "88 cm",
            waist: "61 cm",
            hips: "89 cm",
            shoe: "39 eu",
        },
        instagram: "https://www.instagram.com/khlilith",  
        additionalPhotos: [
            `${process.env.PUBLIC_URL}/images/lilith1.jpg`,
            `${process.env.PUBLIC_URL}/images/lilith2.jpg`,
            `${process.env.PUBLIC_URL}/images/lilith3.jpg`,
            `${process.env.PUBLIC_URL}/images/lilith4.jpg`,
        ],
    },

    3: {
        name: "Anisia",
        mainPhoto: `${process.env.PUBLIC_URL}/images/anisiamain.jpg`,
        parameters: {
            height: "172 cm",
            bust: "75 cm",
            waist: "60 cm",
            hips: "88 cm",
            shoe: "38 eu",
        },
        instagram: "https://www.instagram.com/ani.sia.a",  
        additionalPhotos: [
            `${process.env.PUBLIC_URL}/images/anisia1.jpg`,
            `${process.env.PUBLIC_URL}/images/anisia2.jpg`,
            `${process.env.PUBLIC_URL}/images/anisia3.jpg`,
            `${process.env.PUBLIC_URL}/images/anisia4.jpg`,
        ],
    },

    4: {
        name: "Soni",
        mainPhoto: `${process.env.PUBLIC_URL}/images/sonimain.jpg`,
        parameters: {
            height: "176 cm",
            bust: "79.5 cm",
            waist: "63 cm",
            hips: "89 cm",
            shoe: "39 eu",
        },
        instagram: "https://www.instagram.com/sonidzes",  
        additionalPhotos: [
            `${process.env.PUBLIC_URL}/images/soni1.jpg`,
            `${process.env.PUBLIC_URL}/images/soni2.jpg`,
            `${process.env.PUBLIC_URL}/images/soni3.jpg`,
            `${process.env.PUBLIC_URL}/images/soni4.jpg`,
        ],
    },
};

const extractInstagramUsername = (url) => {
    const regex = /https:\/\/www\.instagram\.com\/([a-zA-Z0-9._-]+)/;
    const match = url.match(regex);
    return match ? match[1] : '';
};

const GirlProfile = () => {
    const { id } = useParams();
    const girl = girlsData[id];

    if (!girl) {
        return <p>Model not found</p>;
    }

    const instagramUsername = extractInstagramUsername(girl.instagram);

    return (
        <div className="girl-profile">
            <Menu />
            <h1 className="model-name-g">{girl.name}</h1>
            <div className="profile-container-g">
                <div className="parameters-g">
                    <h2>Parameters</h2>
                    <p>Height: {girl.parameters.height}</p>
                    <p>Bust: {girl.parameters.bust}</p>
                    <p>Waist: {girl.parameters.waist}</p>
                    <p>Hips: {girl.parameters.hips}</p>
                    <p>Shoe: {girl.parameters.shoe}</p>
                    <p>
                        <a href={girl.instagram} target="_blank" rel="noopener noreferrer">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
                                alt="Instagram"
                                className="instagram-icon"
                            />
                            {instagramUsername}
                        </a>
                    </p>
                </div>
                <div className="main-photo-g">
                    <img src={girl.mainPhoto} alt={girl.name} />
                </div>
            </div>
            <div className="additional-photos-g">
                <h2>Additional Photos</h2>
                <div className="photos-grid-g">
                    {girl.additionalPhotos.map((photo, index) => (
                        <img key={index} src={photo} alt={`${girl.name} ${index + 1}`} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GirlProfile;
