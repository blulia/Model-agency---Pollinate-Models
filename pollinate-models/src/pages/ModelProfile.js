import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Menu from "../components/Menu";
import axios from "axios";
import "./ViewModelForm.css";
import "./ModelProfile.css";

function ModelProfile() {
    const { id } = useParams();
    const [model, setModel] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [message, setMessage] = useState("");
    const [showNotification, notificationChatId] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [applications, setApplications] = useState([]);
    const navigate = useNavigate();
    const [application, setApplication] = useState(null);
    const location = useLocation();
    const { application: appFromState, session } = location.state || {};

    useEffect(() => {
        if (appFromState) {
            setApplication(appFromState);
        }
    }, [appFromState]);


    useEffect(() => {
        const fetchModel = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/users/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
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
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                setPhotos(res.data);
            } catch (error) {
                console.error("Could not upload photo:", error);
            }
        };

        fetchPhotos();
    }, [model]);

    if (!model) {
        return <div>{message || "Loading..."}</div>;
    }

    const acceptApplication = async () => {
        try {
            await axios.post(`http://localhost:5000/api/model-applications/accept/${application.id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            alert("Application accepted!");
            navigate(-1); 
        } catch (error) {
            console.error("Error accepting application:", error);
        }
    };

    const rejectApplication = async () => {
        try {
            await axios.post(`http://localhost:5000/api/model-applications/reject/${application.id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            alert("Application rejected!");
            navigate(-1);
        } catch (error) {
            console.error("Error rejecting application:", error);
        }
    };
    
    const startChat = async () => {
        try {
            const res = await axios.post("http://localhost:5000/api/chats/start", {
                photographer_id: session.photographer_id, 
                model_id: model.id,
                photosession_id: session.id
            });

            navigate(`/chat/${res.data.id}`);
        } catch (error) {
            console.error("Error starting chat:", error);
            alert("Failed to start chat");
        }
    };

    return (
        <div className="view-model-form">
            <Menu />
            <div className="border">
                <h1 className="model-name">{model.name} {model.surname}</h1>
                <div className="profile-container">
                    <div className="parameters">
                        <h2>Parameters</h2>
                        <p>Phone number: {model.phone}</p>
                        <p>Height: {model.height} cm</p>
                        <p>Bust: {model.bust} cm</p>
                        <p>Waist: {model.waist} cm</p>
                        <p>Hips: {model.hips} cm</p>
                        <p>Shoe: {model.shoe} eu</p>
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
            {application && application.status === "pending" && (
                <div className="buttons">
                    <button
                        className="open-chat-btn"
                        onClick={async () => {
                            try {
                                if (!session) {
                                    alert("Session data is missing!");
                                    return;
                                }

                                let chatId = application.chat_id;

                                if (!chatId) {
                                    const res = await axios.post(
                                        "http://localhost:5000/api/chats/start",
                                        {
                                            photographer_id: session.photographer_id,
                                            model_id: model.id,           // використовується model.id
                                            photosession_id: session.id
                                        },
                                        {
                                            headers: {
                                                Authorization: `Bearer ${localStorage.getItem("token")}`
                                            }
                                        }
                                    );
                                    chatId = res.data.id;

                                    setApplication(prev => ({ ...prev, chat_id: chatId }));
                                }

                                navigate(`/chat/${chatId}`);
                            } catch (err) {
                                console.error("Failed to start chat", err);
                                alert("Не вдалося відкрити чат");
                            }
                        }}
                    >
                        Open chat
                    </button>


                    <button
                        onClick={acceptApplication}
                        className="approve-button"
                    >
                        Approve
                    </button>

                    <button
                        onClick={rejectApplication}
                        className="reject-button"
                    >
                        Reject
                    </button>
                </div>
            )}

        </div>
    );
}

export default ModelProfile;
