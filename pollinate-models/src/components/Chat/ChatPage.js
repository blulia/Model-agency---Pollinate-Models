import { useParams } from "react-router-dom";
import { socket } from "./socket";
import React, { useState, useEffect, useRef } from "react";
import "./Chat.css";
import "../Footer.css";
import Menu from "../Menu";

function ChatPage() {
    const { chatId } = useParams();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const messagesEndRef = useRef(null);

    const senderRole = "photographer"; 

    useEffect(() => {
        socket.emit("joinChat", chatId);

        fetch(`http://localhost:5000/api/chats/${chatId}/messages`)
            .then(res => res.json())
            .then(setMessages)
            .catch(err => console.error(err));

        socket.on("newMessage", msg => {
            if (msg.chatId === Number(chatId)) {
                setMessages(prev => [...prev, msg]);
            }
        });

        return () => socket.off("newMessage");
    }, [chatId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        const trimmedText = text.trim();
        if (!trimmedText) return;


        const latinRegex = /^[A-Za-z0-9 .,!?]*$/;
        if (!latinRegex.test(trimmedText)) {
            alert("Please use only Latin letters, numbers, and basic punctuation.");
            return;
        }

        const msg = {
            chatId: Number(chatId),
            text: trimmedText,
            sender_role: senderRole,
            id: Date.now(),
            created_at: new Date().toISOString(),
        };

        socket.emit("sendMessage", {
            chatId: Number(chatId),
            text: trimmedText
        });
        setText("");
    };

    return (
        <div className="page-container">
            <Menu />
            <div className="chat-container">
                <div className="chat-window">
                    <div className="messages">
                        {messages.map(m => (
                            <div
                                key={m.id}
                                className={`message-item ${m.sender_role === "model" ? "sender-model" : "sender-photographer"
                                    }`}
                            >
                                <span className="sender-name">{m.sender_role}</span>
                                <span className="message-text">{m.text}</span>
                                <span className="message-time">
                                    {new Date(m.created_at).toLocaleTimeString(['en-US'], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-input">
                        <input
                            placeholder="Type a message..."
                            value={text}
                            onChange={e => setText(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && sendMessage()}
                        />
                        <button onClick={sendMessage}>Send</button>
                    </div>
                </div>
            </div>
            <footer className="footer">
                <p>© 2025 Pollinate Models. All Rights Reserved</p>
            </footer>
        </div>
    );
}

export default ChatPage;
