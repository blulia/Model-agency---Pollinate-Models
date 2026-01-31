import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { useNavigate, Link } from "react-router-dom";
import Menu from "../components/Menu";
import "../components/Footer.css";
import "./ModelCabinet.css";
import { socket } from "../components/Chat/socket";

function ModelCabinet() {
    const [sessions, setSessions] = useState([]);
    const [applications, setApplications] = useState([]);
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();
    const [myChats, setMyChats] = useState([]);

    useEffect(() => {
        if (userInfo?.id) {
            axios.get(`http://localhost:5000/api/chats/my/${userInfo.id}/model`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
                .then(res => setMyChats(res.data))
                .catch(err => console.error("Error fetching chats:", err));
        }
    }, [userInfo]);

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
                        console.log("Fetched userInfo:", response.data);
                    }
                }
            } catch (error) {
                console.error("Error retrieving model data:", error);
            }
        };

        const fetchSessions = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/sessions", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setSessions(res.data);
            } catch (error) {
                console.error("Error while receiving photo sessions:", error);
            }
        };
        fetchUserInfo();
        fetchSessions();
    }, []);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                if (userInfo?.id && sessions.length > 0) {
                    const sessionIds = sessions.map(session => session.id);

                    const requests = sessionIds.map(sessionId =>
                        axios
                            .get(`http://localhost:5000/api/model-application-status/${userInfo.id}/${sessionId}`, {
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                                },
                            })
                            .then(res => res.data)
                            .catch(err => {
                                if (err.response && err.response.status === 404) {
                                    return null;
                                } else {
                                    throw err;
                                }
                            })
                    );

                    const results = await Promise.all(requests);
                    const fetchedApplications = results.filter(app => app !== null);
                    setApplications(fetchedApplications);
                }
            } catch (error) {
                console.error("Error while receiving applications:", error);
            }
        };

        fetchApplications();
    }, [userInfo?.id, sessions]);

    const handleSubmitApplication = async (sessionId) => {
        try {
            if (userInfo && userInfo.id) {
                await axios.post(
                    "http://localhost:5000/api/submit-application",
                    {
                        modelId: userInfo.id,
                        sessionId,
                        name: userInfo.name,
                        surname: userInfo.surname,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                alert("The application has been successfully submitted!");
            } else {
                alert("Could not retrieve model information.");
            }
        } catch (error) {
            console.error("Error when submitting an application:", error);
        }
    };

    return (
        <div className="model-cabinet">
            <Menu />
            <div className="model-header">
                <h1>Hi, {userInfo ? `${userInfo.name} ${userInfo.surname}!` : 'Loading...'}</h1>
            </div>
            <section className="sessions">
                <h2>Model</h2>
                <p>
                    This model panel allows you to view available photoshoots, submit applications for them, and track the status of your applications. After submitting an application, you can message the photographer to clarify details. You can also{' '}
                    {userInfo && (
                        <Link to={`/model-cabinet/${userInfo.id}`} className="profile-link">
                            go to your profile
                        </Link>
                    )}{' '} and update your parameters if any changes occur.
                </p>
            </section>
            <div className="sessions-header">
                <h2>
                    Available photo shoots ({sessions.length})
                </h2>
            </div>
            {sessions.length === 0 ? (
                <div className="no-session">
                    <p>Currently, there are no photo sessions available.</p>
                </div>
            ) : (
                <div className="sessions-container">
                    {sessions.map((session) => {
                        const application = applications.find((app) => app.session_id === session.id);
                        return (
                            <div key={session.id} className="session-card">
                                <h3>{session.title}</h3>
                                <p>Description: {session.description}</p>
                                <p>Date: {new Date(session.date).toLocaleDateString('en-US')}</p>
                                <p>Location: {session.location}</p>
                                {application ? (
                                    <>
                                        <p
                                            className={`status ${application.status === "accepted"
                                                    ? "status-accepted"
                                                    : application.status === "rejected"
                                                        ? "status-rejected"
                                                        : "status-pending"
                                                }`}
                                        >
                                            {application.status === "pending"
                                                ? "Waiting for a decision"
                                                : application.status === "accepted"
                                                    ? "Approved"
                                                    : "Rejected"}
                                        </p>

                                        {application.status !== "rejected" && (
                                            <button
                                                className="open-chat-btn"
                                                onClick={async () => {
                                                    try {
                                                        let chatId = application.chat_id;

                                                        if (!chatId) {
                                                            const res = await axios.post(
                                                                "http://localhost:5000/api/chats/start",
                                                                {
                                                                    photographer_id: session.photographer_id,
                                                                    model_id: userInfo.id,
                                                                    photosession_id: session.id
                                                                },
                                                                {
                                                                    headers: {
                                                                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                                                                    },
                                                                }
                                                            );
                                                            chatId = res.data.id; 
                                                        }

                                                        navigate(`/chat/${chatId}`);
                                                    } catch (err) {
                                                        console.error("Error starting chat:", err);
                                                    }
                                                }}
                                            >
                                                Open chat
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <div className="button-wrapper">
                                        <button
                                            className="submit-app"
                                            onClick={() => handleSubmitApplication(session.id)}
                                        >
                                            Submit an application
                                        </button>
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

export default ModelCabinet;
