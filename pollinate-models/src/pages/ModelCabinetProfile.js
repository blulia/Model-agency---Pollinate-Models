import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Menu from "../components/Menu";
import axios from "axios";
import "./ViewModelForm.css";
import "./ModelCabinetProfile.css";

function ModelCabinetProfile() {
    const { id } = useParams();
    const [model, setModel] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [message, setMessage] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();
    const [application, setApplication] = useState(null);
    const location = useLocation();
    const currentUserId = localStorage.getItem("userId"); 
    const isOwner = model && currentUserId && Number(currentUserId) === Number(model.id);

    useEffect(() => {
        const fetchModel = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/users/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                });
                setModel(res.data);
            } catch (err) {
                setMessage("Error loading data");
                console.error("Error fetching model:", err);
            }
        };
        fetchModel();
    }, [id]);

    useEffect(() => {
        if (location.state?.application) {
            setApplication(location.state.application);
        }
    }, [location]);

    useEffect(() => {
        const fetchPhotos = async () => {
            if (!model) return;
            try {
                const res = await axios.get(
                    `http://localhost:5000/api/users-photos/${model.name}/${model.surname}`,
                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                );
                setPhotos(res.data);
            } catch (error) {
                console.error("Could not fetch photos:", error);
            }
        };
        fetchPhotos();
    }, [model]);

    useEffect(() => {
        if (model) {
            setFormData({
                height: model.height || "",
                bust: model.bust || "",
                waist: model.waist || "",
                hips: model.hips || "",
                shoe: model.shoe || ""
            });
        }
    }, [model, photos]);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const numericFields = ["height", "bust", "waist", "hips", "shoe"];
            const payload = { ...formData, userId: id };

            numericFields.forEach(key => {
                payload[key] = payload[key] ? Number(payload[key]) : 0;
            });

            await axios.post("http://localhost:5000/api/model-updates", payload, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            alert("The changes are recorded, after acceptance by the administrator they will be visible to everyone.");
            setEditMode(false);
        } catch (err) {
            console.error("Error submitting profile changes:", err.response?.data || err);

            if (err.response?.data?.error) {
                alert(err.response.data.error);
            } else {
                alert("Unable to save changes. Check the console for details.");
            }
        }
    };

    if (!model) {
        return <div>{message || "Loading..."}</div>;
    }

    return (
        <div className="view-model-form">
            <Menu />
            <div className="border">
                <div className="profile-container">
                    <div className="parameters">
                        {!editMode ? (
                            <>
                                <h2>Personal Info</h2>
                                <p>Name: {model.name}</p>
                                <p>Surname: {model.surname}</p>
                                <p>Phone: {model.phone}</p>

                                <h2>Parameters</h2>
                                <p>Height: {model.height} cm</p>
                                <p>Bust: {model.bust} cm</p>
                                <p>Waist: {model.waist} cm</p>
                                <p>Hips: {model.hips} cm</p>
                                <p>Shoe: {model.shoe} eu</p>
                            </>
                        ) : (
                            <form onSubmit={handleSubmit} className="edit-form">
                                <h2>Personal Info (cannot edit)</h2>
                                <p>Name: {model.name}</p>
                                <p>Surname: {model.surname}</p>
                                <p>Phone: {model.phone}</p>

                                <h2>Parameters</h2>
                                    <div className="parameters-list">
                                        {["height", "bust", "waist", "hips", "shoe"].map(key => (
                                            <div key={key} className="form-group">
                                                <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                                                <input
                                                    type="number"
                                                    name={key}
                                                    value={formData[key]}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                <div className="buttons">
                                    <button className="save-button" type="submit">Save Changes</button>
                                    <button className="cancel-button" type="button" onClick={() => setEditMode(false)}>Cancel</button>
                                </div>
                            </form>
                        )}
                        {model && !editMode && (
                            <button onClick={() => setEditMode(true)} className="edit-profile-button">
                                Edit Profile
                            </button>
                        )}
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
                    {photos.length <= 1 ? (
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
        </div>
    );
}

export default ModelCabinetProfile;
