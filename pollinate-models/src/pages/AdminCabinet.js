import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import Menu from "../components/Menu";
import "../components/Footer.css";
import "./AdminCabinet.css";

function AdminCabinet() {
    const [userInfo, setUserInfo] = useState(null);
    const [forms, setForms] = useState([]);
    const [updates, setUpdates] = useState([]);
    const navigate = useNavigate();
    const [expandedId, setExpandedId] = useState(null);

    const FIELDS = [
        { key: "phone", label: "Phone" },
        { key: "height", label: "Height (cm)" },
        { key: "bust", label: "Bust (cm)" },
        { key: "waist", label: "Waist (cm)" },
        { key: "hips", label: "Hips (cm)" },
        { key: "shoe", label: "Shoe (EU)" }
    ];

    const getChangedFields = (row) => {
        return FIELDS
            .map(field => {
                const oldVal = row[`current_${field.key}`];
                const newVal = row[field.key];

                if (newVal !== null && newVal !== oldVal) {
                    return {
                        label: field.label,
                        oldValue: oldVal,
                        newValue: newVal
                    };
                }
                return null;
            })
            .filter(Boolean);
    };

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

        const fetchForms = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/become-model-forms",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    });
                setForms(res.data);
            } catch (error) {
                console.error("Error while receiving applications:", error);
            }
        };

        const fetchUpdates = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/model-updates/pending", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUpdates(res.data);
            } catch (error) {
                console.error("Error fetching model updates:", error);
            }
        };

        fetchUserInfo();
        fetchForms();
        fetchUpdates();
    }, []);
    
    const handleFormClick = (id) => {
        navigate(`/admin-cabinet/view/${id}`);
    };

    const handleApprove = async (id) => {
        try {
            await axios.post(`http://localhost:5000/api/model-updates/approve/${id}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setUpdates((prev) => prev.filter((u) => u.id !== id));
            alert("Update approved!");
        } catch (err) {
            console.error(err);
            alert("Error approving update");
        }
    };

    const handleReject = async (id) => {
        try {
            await axios.post(`http://localhost:5000/api/model-updates/reject/${id}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setUpdates((prev) => prev.filter((u) => u.id !== id));
            alert("Update rejected!");
        } catch (err) {
            console.error(err);
            alert("Error rejecting update");
        }
    };

    const handleCardClick = (id) => {
        navigate(`/admin-cabinet/view/${id}`);
    };

    return (
        <div className="admin-cabinet-page">
            <Menu />
            <div className="admin-header">
                {userInfo ? (
                    <h1>Welcome back, {userInfo.name} {userInfo.surname}!</h1>
                ) : (
                    <p>Loading information...</p>
                )}
            </div>
            <section className="main-info-content">
                <h2>Administrator</h2>
                <p>
This admin panel allows you to manage applications submitted by aspiring models. You can also review profile updates submitted by models and either approves or rejects the changes.                </p>
                <h3>How to manage applications:</h3>
                <div className="admin-instructions">
                    <ul>
                        <li>click on an application to view full details;</li>
                        <li>contact applicants via Instagram if needed;</li>
                        <li>press "Accept" if the model meets the agency’s standards;</li>
                        <li>press "Reject" if the model does not meet the requirements.</li>
                    </ul>
                </div>
            </section>
            <div className="content">
                <section className="info-content">
                    <div className="forms-header">
                        <h2>
                            Forms «Become a model» ({forms.length})
                        </h2>
                    </div>

                    {forms.length === 0 ? (
                        <div className="no-session-a">
                            <p>There are no new applications at this time.</p>
                        </div>
                    ) : (
                        <div className="forms-container">
                            {forms.map((form) => (
                                <div
                                    key={form.id}
                                    className="form-card"
                                    onClick={() => handleCardClick(form.id)}
                                >
                                    <p><strong>{form.name} {form.surname}</strong></p>
                                    <p>
                                        <strong>Instagram:</strong>{" "}
                                        {form.social_link ? (
                                            <a
                                                href={
                                                    form.social_link.startsWith("http")
                                                        ? form.social_link
                                                        : `https://instagram.com/${form.social_link}`
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {form.social_link}
                                            </a>
                                        ) : (
                                            "Not provided"
                                        )}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
                <section className="info-content">
                    <h2>Pending profile updates ({updates.length})</h2>

                    {updates.length === 0 ? (
                        <p>No pending updates.</p>
                    ) : (
                        <table className="updates-table">
                            <thead>
                                <tr>
                                    <th>Model</th>
                                    <th>Phone</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>
                                {updates.map((update) => {
                                    const isOpen = expandedId === update.updateId;

                                    const changedFields = getChangedFields(update);

                                    return (
                                        <React.Fragment key={update.updateId}>
                                            <tr>
                                                <td>{update.name} {update.surname}</td>
                                                <td>{update.phone}</td>
                                                <td>
                                                    <span className="a-status-pending">Pending</span>
                                                </td>
                                                <td>
                                                    <button
                                                        className="view-btn"
                                                        onClick={() =>
                                                            setExpandedId(expandedId === update.updateId ? null : update.updateId)
                                                        }
                                                    >
                                                        {expandedId === update.updateId ? "Hide" : "View"}
                                                    </button>
                                                </td>
                                            </tr>

                                            {isOpen && (
                                                <tr className="expanded-row">
                                                    <td colSpan="5">
                                                        <div className="changes-box">
                                                            <table className="changes-table">
                                                                <thead>
                                                                    <tr>
                                                                        <th>Field</th>
                                                                        <th>Current</th>
                                                                        <th>Requested</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {changedFields.map((field, index) => (
                                                                        <tr key={index}>
                                                                            <td>{field.label}</td>
                                                                            <td className="old-value">
                                                                                {field.oldValue ?? "—"}
                                                                            </td>
                                                                            <td className="new-value">
                                                                                {field.newValue}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>

                                                            <div className="update-buttons">
                                                                <button
                                                                    className="approve-button"
                                                                    onClick={() => handleApprove(update.updateId)}
                                                                >
                                                                    Approve
                                                                </button>
                                                                <button
                                                                    className="reject-button"
                                                                    onClick={() => handleReject(update.updateId)}
                                                                >
                                                                    Reject
                                                                </button>
                                                                
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </section>
            </div>
            <footer className="footer">
                <p>© 2025 Pollinate Models. All Rights Reserved</p>
            </footer>
        </div>
    );
}

export default AdminCabinet;
