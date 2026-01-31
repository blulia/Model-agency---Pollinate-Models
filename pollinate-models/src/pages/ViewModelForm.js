import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Menu from "../components/Menu";
import "./ViewModelForm.css"; 

function ViewModelForm() {
    const [formData, setFormData] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [message, setMessage] = useState("");
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/become-model-forms/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                setFormData(res.data);
            } catch (error) {
                setMessage("Error loading data");
                console.error("Error fetching form data:", error);
            }
        };

        fetchForm();
    }, [id]);

    useEffect(() => {
        if (!formData) return;

        const fetchPhotos = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/model-photos/${formData.name}/${formData.surname}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );
                setPhotos(response.data);
            } catch (error) {
                console.error("Could not upload photo:", error);
            }
        };

        fetchPhotos();
    }, [formData]);

    const handleApprove = async () => {
        try {
            await axios.post(`http://localhost:5000/api/approve-model/${id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );
            navigate("/admin-cabinet");
        } catch (error) {
            console.error("Error while approving the application:", error);
        }
    };

    const handleReject = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/reject-model/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            navigate("/admin-cabinet");
        } catch (error) {
            console.error("Error when rejecting the application:", error);
        }
    };

    if (!formData) {
        return <div>{message || "Loading..."}</div>;
    }

    return (
        <div className="view-model-form">
            <Menu />
            <div className="border">
                <h1 className="model-name">{formData.name} {formData.surname}</h1>
                <div className="profile-container">
                    <div className="parameters">
                        <h2>Parameters</h2>
                        <p>Age: {formData.age}</p>
                        <p>City: {formData.city}</p>
                        <p>Phone number: {formData.phone}</p>
                        <p>Height: {formData.height} cm</p>
                        <p>Bust: {formData.bust} cm</p>
                        <p>Waist: {formData.waist} cm</p>
                        <p>Hips: {formData.hips} cm</p>
                        <p>Shoe: {formData.shoe} eu</p>
                        <p>Eyes: {formData.eyes}</p>
                        <p>Hair: {formData.hair}</p>
                        <p>
                            <a href={formData.social_link} target="_blank" rel="noopener noreferrer">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
                                    alt="Instagram"
                                    className="instagram-icon-form"
                                />
                                {formData.social_link}
                            </a>
                        </p>
                    </div>

                    <div className="main-photo">
                        {photos.length === 0 ? (
                            <p>Photo not found</p>
                        ) : (
                            <img
                                src={`http://localhost:5000${photos[0]}`}
                                alt="main-photo"
                                className="main-photo-img"
                            />
                        )}
                    </div>
                </div>

                <div className="additional-photos-v">
                    <h2>Additional Photos</h2>
                    {photos.length === 0 ? (
                        <p>Photo not found</p>
                    ) : (
                        <div className="photos-grid-v">
                            {photos.slice(1, 4).map((url, index) => (  
                                <img
                                    key={index}
                                    src={`http://localhost:5000${url}`}
                                    alt={`model-photo-${index}`}
                                    className="additional-photo-v-img"
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="buttons">
                <button onClick={handleApprove} className="approve-button"> Approve</button>
                <button onClick={handleReject} className="reject-button"> Reject</button>
            </div>
        </div>
    );
}

export default ViewModelForm;
