import React from "react";
import { useParams, Link } from "react-router-dom";
import Menu from "../components/Menu";
import "./BoyProfile.css";

const boysData = {
    1: {
        name: "Artur",
        mainPhoto: `${process.env.PUBLIC_URL}/images/arturmain.jpg`,
        parameters: {
            height: "184 cm",
            bust: "98 cm",
            waist: "75 cm",
            hips: "91 cm",
            shoe: "44 eu",
        },
        instagram: "https://www.instagram.com/arturhondar",  
        additionalPhotos: [
            `${process.env.PUBLIC_URL}/images/artur1.jpg`,
            `${process.env.PUBLIC_URL}/images/artur2.jpg`,
            `${process.env.PUBLIC_URL}/images/artur3.jpg`,
            `${process.env.PUBLIC_URL}/images/artur4.jpg`,
        ],
    },

    2: {
        name: "Dima",
        mainPhoto: `${process.env.PUBLIC_URL}/images/dimamain.jpg`,
        parameters: {
            height: "187 cm",
            bust: "96 cm",
            waist: "76 cm",
            hips: "94 cm",
            shoe: "45 eu",
        },
        instagram: "https://www.instagram.com/tsybrii_/",  
        additionalPhotos: [
            `${process.env.PUBLIC_URL}/images/dima1.jpg`,
            `${process.env.PUBLIC_URL}/images/dima2.jpg`,
            `${process.env.PUBLIC_URL}/images/dima3.jpg`,
            `${process.env.PUBLIC_URL}/images/dima4.jpg`,
        ],
    },

    3: {
        name: "Borys",
        mainPhoto: `${process.env.PUBLIC_URL}/images/borysmain.jpg`,
        parameters: {
            height: "185 cm",
            bust: "95 cm",
            waist: "75 cm",
            hips: "98 cm",
            shoe: "43 eu",
        },
        instagram: "https://www.instagram.com/bo_dikontus",  
        additionalPhotos: [
            `${process.env.PUBLIC_URL}/images/borys1.jpg`,
            `${process.env.PUBLIC_URL}/images/borys2.jpg`,
            `${process.env.PUBLIC_URL}/images/borys3.jpg`,
            `${process.env.PUBLIC_URL}/images/borys4.jpg`,
        ],
    },

    4: {
        name: "Danyil",
        mainPhoto: `${process.env.PUBLIC_URL}/images/danyilmain.jpg`,
        parameters: {
            height: "182 cm",
            bust: "92 cm",
            waist: "77 cm",
            hips: "99 cm",
            shoe: "43 eu",
        },
        instagram: "https://www.instagram.com/lovvelly_model", 
        additionalPhotos: [
            `${process.env.PUBLIC_URL}/images/danyil1.jpg`,
            `${process.env.PUBLIC_URL}/images/danyil2.jpg`,
            `${process.env.PUBLIC_URL}/images/danyil3.jpg`,
            `${process.env.PUBLIC_URL}/images/danyil4.jpg`,
        ],
    },
};

const extractInstagramUsername = (url) => {
    const regex = /https:\/\/www\.instagram\.com\/([a-zA-Z0-9._-]+)/;
    const match = url.match(regex);
    return match ? match[1] : '';
};

const BoyProfile = () => {
    const { id } = useParams();
    const boy = boysData[id];

    if (!boy) {
        return <p>Model not found</p>;
    }

    const instagramUsername = extractInstagramUsername(boy.instagram);

    return (
        <div className="boy-profile">
            <Menu />
            <h1 className="model-name">{boy.name}</h1>
            <div className="profile-container">
                <div className="parameters">
                    <h2>Parameters</h2>
                    <p>Height: {boy.parameters.height}</p>
                    <p>Bust: {boy.parameters.bust}</p>
                    <p>Waist: {boy.parameters.waist}</p>
                    <p>Hips: {boy.parameters.hips}</p>
                    <p>Shoe: {boy.parameters.shoe}</p>
                    <p>
                        <a href={boy.instagram} target="_blank" rel="noopener noreferrer">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
                                alt="Instagram"
                                className="instagram-icon"
                            />
                            {instagramUsername}
                        </a>
                    </p>
                </div>
                <div className="main-photo">
                    <img src={boy.mainPhoto} alt={boy.name} />
                </div>
            </div>
            <div className="additional-photos">
                <h2>Additional Photos</h2>
                <div className="photos-grid">
                    {boy.additionalPhotos.map((photo, index) => (
                        <img key={index} src={photo} alt={`${boy.name} ${index + 1}`} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BoyProfile;
