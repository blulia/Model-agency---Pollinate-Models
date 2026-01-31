import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import Menu from "../components/Menu";
import "../components/Footer.css";
import "./PhotographerCabinet.css";

function PhotographerCabinet() {
    const [userInfo, setUserInfo] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [applications, setApplications] = useState([]);
    const [newSession, setNewSession] = useState({
        title: "",
        description: "",
        date: "",
        location: "",
    });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        const fetchUserInfo = async () => {
            try {
                if (token) {
                    const decoded = jwtDecode(token);
                    const phone = decoded.phone;

                    if (phone) {
                        const encodedPhone = encodeURIComponent(phone);
                        const response = await axios.get(`http://localhost:5000/api/users/by-phone?phone=${encodedPhone}`);
                        setUserInfo(response.data);
                    }
                }
            } catch (error) {
                console.error("Error retrieving user data:", error);
            }
        };

        const fetchSessions = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/sessions", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setSessions(res.data);
            } catch (error) {
                console.error("Error while receiving sessions:", error);
            }
        };

        const fetchApplications = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/model-applications", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setApplications(res.data);
            } catch (error) {
                console.error("Error while receiving applications:", error);
            }
        };
        fetchUserInfo();
        fetchSessions();
        fetchApplications();
    }, []);

    const isLatinOnly = (text) => /^[A-Za-z0-9\s.,!?'"()-]*$/.test(text);

    const createSession = async (e) => {
        e.preventDefault();

        if (!isLatinOnly(newSession.title) || !isLatinOnly(newSession.description)) {
            alert("Title and description must contain only Latin letters and common punctuation.");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:5000/api/sessions",
                {
                    ...newSession,
                    photographer_id: userInfo.id
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            setSessions([...sessions, response.data]);
            setNewSession({
                title: "",
                description: "",
                date: "",
                location: "",
            });
            alert("Session created successfully!");
        } catch (error) {
            console.error("Error creating session:", error);
            alert("Failed to create session.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        const latinRegex = /^[a-zA-Z0-9\s.,!?'"()\-]*$/;

        if ((name === "title" || name === "description") && !latinRegex.test(value)) {
            return;
        }

        setNewSession((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const renderStatusMessage = (status) => {
        if (status === 'accepted') {
            return <span style={{ color: '#386f44' }}>Approved</span>;
        } else if (status === 'rejected') {
            return <span style={{ color: '#be3501' }}>Rejected</span>;
        } else {
            return <span>Waiting for a decision</span>;
        }
    };

    const startChat = async (modelId, sessionId) => {
        try {
            const res = await axios.post(
                "http://localhost:5000/api/chats/start",
                {
                    photographer_id: userInfo.id,
                    model_id: modelId,
                    photosession_id: sessionId
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            navigate(`/chat/${res.data.id}`);
        } catch (error) {
            console.error("Error starting chat:", error);
        }
    };

    return (
        <div className="photographer-cabinet-page">
            <Menu />
            <div className="photographer-header">
                {userInfo ? (
                    <h1>Hello, {userInfo.name} {userInfo.surname}!</h1>
                ) : (
                    <p>Loading information...</p>
                )}
            </div>
            <section className="info-content-p">
                <h2>Photographer</h2>
                <p>
                    Here you can create photo session announcements and review applications from models. Additionally, when viewing a model's profile who applied for a photoshoot, you can start a chat to clarify any details.
                </p>
                <h3>Create new photo session (write briefly):</h3>
                <div className="create-session-form">
                    <form className="create-form" onSubmit={createSession}>
                        <label>Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={newSession.title}
                            onChange={handleInputChange}
                            required
                        />
                        <label>Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={newSession.description}
                            onChange={handleInputChange}
                            required
                        />
                        <label>Date</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={newSession.date}
                            onChange={handleInputChange}
                            required
                        />
                        <label>Location</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={newSession.location}
                            onChange={handleInputChange}
                            required
                        />
                        <button type="submit" className="create-button">Create Session</button>
                    </form>
                </div>
            </section>

            <div className="sessions-header-p">
                <h2>
                    Photo Sessions ({sessions.length})
                </h2>
            </div>

            {sessions.length === 0 ? (
                <div className="no-session-p">
                    <p>No sessions posted. You can create new ones.</p>
                </div>
            ) : (
                <div className="sessions-container-p">
                    {sessions.map((session) => {
                        const sessionApplications = applications.filter(app => app.session_id === session.id);

                        return (
                            <div key={session.id} className="session-card-p">
                                <h3>{session.title}</h3>
                                <p>Description: {session.description}</p>
                                <p>Date: {new Date(session.date).toLocaleDateString()}</p>
                                <p>Location: {session.location}</p>

                                <h4>Applications ({sessionApplications.length})</h4>
                                {sessionApplications.length === 0 ? (
                                    <p>No applications yet for this session.</p>
                                ) : (
                                    <div className="session-applications-list">
                                        {sessionApplications.map(application => (
                                            <div key={application.id} className="application-item">
                                                <Link to={`/model-profile/${application.model_id}`} state={{ application, session }}>
                                                    {application.name} {application.surname}
                                                </Link>{" "}
                                                {renderStatusMessage(application.status)}
                                                {application.status === 'pending'
                                                }
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
            <footer className="footer">
                <p>© 2025 Pollinate Models. All Rights Reserved</p>
            </footer>
        </div>
    );
}

export default PhotographerCabinet;
