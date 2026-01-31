const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const http = require("http");
const { Server } = require("socket.io");

const app = express();
const port = 5000;

const JWT_SECRET = "your_jwt_secret_key";

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

app.use(express.json());

// JWT для socket
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("No token"));

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        socket.user = decoded; 
        next();
    } catch (err) {
        next(new Error("Invalid token"));
    }
});

app.get("/api/test", (req, res) => {
    res.json({ message: "API працює!" });
});

io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("joinChat", (chatId) => {
        socket.join(`chat_${chatId}`);
    });

    socket.on("sendMessage", ({ chatId, text }) => {
        const sender_role = socket.user?.role;

        console.log("TRY INSERT:", chatId, text, sender_role);

        if (!sender_role) {
            console.error("NO SENDER ROLE, USER:", socket.user);
            return;
        }

        db.query(
            "INSERT INTO messages (chat_id, text, sender_role) VALUES (?, ?, ?)",
            [chatId, text, sender_role],
            (err, result) => {
                if (err) {
                    console.error("DB INSERT ERROR:", err);
                    return;
                }

                io.to(`chat_${chatId}`).emit("newMessage", {
                    id: result.insertId,
                    chatId,
                    text,
                    sender_role,
                    created_at: new Date(),
                });
            }
        );
    });

});

server.listen(port, () => {
    console.log("Server + Socket.io running on port 5000");
});

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Judy_2003",
    database: "models_database",
});

db.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
    } else {
        console.log("Connected to the database.");
    }
});

// Become a model
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { name, surname } = req.body;

        if (!name || !surname) {
            console.error("Error: Missing name or surname in request body.");
            return cb(new Error("Both name and surname are required"));
        }

        const folderName = `${name}_${surname}`;
        const modelFolder = path.join(__dirname, "uploads", folderName);

        console.log("Folder Path:", modelFolder);

        if (!fs.existsSync(modelFolder)) {
            fs.mkdirSync(modelFolder, { recursive: true });
        }

        cb(null, modelFolder);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = allowedTypes.test(file.mimetype);
        if (extName && mimeType) {
            cb(null, true);
        } else {
            cb(new Error("Only .jpeg, .jpg, and .png formats are allowed!"));
        }
    },
});

app.post("/api/models", upload.array("photos", 4), (req, res) => {
    const {
        name,
        surname,
        age,
        city,
        phone,
        height,
        bust,
        waist,
        hips,
        shoe,
        eyes,
        hair,
        socialLink,
        message,
    } = req.body;

    const phonePattern = /^[\d()+]*$/;
    if (!phonePattern.test(phone)) {
        return res.status(400).json({
            message: "The phone can only contain numbers, +, (, )",
        });
    }

    const plusCount = (phone.match(/\+/g) || []).length;
    const openParenCount = (phone.match(/\(/g) || []).length;
    const closeParenCount = (phone.match(/\)/g) || []).length;

    if (plusCount > 1 || openParenCount > 1 || closeParenCount > 1) {
        return res.status(400).json({
            message: "The symbols '+', '(' and ')' can only be used once each.",
        });
    }

    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length > 15) {
        return res.status(400).json({
            message: "The phone number must contain no more than 15 digits.",
        });
    }

    const numericFields = { age, height, bust, waist, hips, shoe };
    for (const [key, value] of Object.entries(numericFields)) {
        if (value < 0) {
            return res.status(400).json({ message: `${key} cannot be negative.` });
        }
    }

    const folderName = `${name}_${surname}`;
    const folderPath = `\\uploads\\${folderName}`;

    const query = `
        INSERT INTO models (name, surname, age, city, phone, height, bust, waist, hips, shoe, eyes, hair, social_link, message, photos_path)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        query,
        [name, surname, age, city, phone, height, bust, waist, hips, shoe, eyes, hair, socialLink, message, folderPath],
        (err, result) => {
            if (err) {
                console.error("Error inserting data:", err);
                res.status(500).json({ message: "Error saving data" });
            } else {
                res.status(200).json({ message: "Data saved successfully!" });
            }
        }
    );
});

// Register
app.post("/api/register", async (req, res) => {
    const { name, surname, phone, password, role } = req.body;

    const latinRegex = /^[A-Za-z]+$/;
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    const phoneDigits = phone.replace(/\D/g, "");

    const phonePattern = /^[\d()+]*$/;
    if (!phonePattern.test(phone)) {
        return res.status(400).json({
            success: false,
            message: "The phone can only contain numbers, +, (, )",
        });
    }

    const plusCount = (phone.match(/\+/g) || []).length;
    const openParenCount = (phone.match(/\(/g) || []).length;
    const closeParenCount = (phone.match(/\)/g) || []).length;

    if (plusCount > 1 || openParenCount > 1 || closeParenCount > 1) {
        return res.status(400).json({
            success: false,
            message: "The symbols '+', '(' and ')' can only be used once each.",
        });
    }

    if (!latinRegex.test(name) || !latinRegex.test(surname)) {
        return res.status(400).json({
            success: false,
            message: "Only Latin characters are allowed in the field Name and Surname.",
        });
    }

    if (!passwordRegex.test(password)) {
        return res.status(400).json({
            success: false,
            message:
                "The password must contain at least 8 characters, including uppercase and lowercase letters, a number, and a special character.",
        });
    }

    if (phoneDigits.length > 15) {
        return res.status(400).json({
            success: false,
            message: "The phone number must contain no more than 15 digits.",
        });
    }

    try {
        if (role === "model") {
            db.query(
                "SELECT * FROM already_models WHERE phone = ?",
                [phone],
                async (err, modelResult) => {
                    if (err) return res.status(500).json({ success: false, message: "DB error" });

                    if (modelResult.length === 0) {
                        return res.json({
                            success: false,
                            message: "You are not currently a model of Pollinate Models. First, fill out the Become a model form or contact the site administrator.",
                        });
                    }

                    const hashedPassword = await bcrypt.hash(password, 10);

                    db.query(
                        "INSERT INTO users (name, surname, phone, password, role) VALUES (?, ?, ?, ?, ?)",
                        [name, surname, phone, hashedPassword, role],
                        (err, result) => {
                            if (err) return res.status(500).json({ success: false, message: "DB insert error" });

                            const token = jwt.sign({ phone, role }, JWT_SECRET, {
                                expiresIn: "7d",
                            });

                            return res.json({ success: true, message: "Registration successful!", token });
                        }
                    );
                }
            );
        }

        else if (role === "photographer") {
            db.query(
                "SELECT * FROM photographers WHERE phone = ?",
                [phone],
                async (err, photographerResult) => {
                    if (err) return res.status(500).json({ success: false, message: "DB error" });

                    if (photographerResult.length === 0) {
                        return res.json({
                            success: false,
                            message: "You are not currently a photographer of Pollinate Models. Please contact the agency or the site administrator.",
                        });
                    }

                    const hashedPassword = await bcrypt.hash(password, 10);

                    db.query(
                        "INSERT INTO users (name, surname, phone, password, role) VALUES (?, ?, ?, ?, ?)",
                        [name, surname, phone, hashedPassword, role],
                        (err, result) => {
                            if (err) return res.status(500).json({ success: false, message: "DB insert error" });

                            const token = jwt.sign({ phone, role }, JWT_SECRET, {
                                expiresIn: "7d",
                            });

                            return res.json({ success: true, message: "Registration successful!", token });
                        }
                    );
                }
            );
        }

        else if (role === "admin") {
            db.query(
                "SELECT * FROM admins WHERE phone = ?",
                [phone],
                async (err, adminResult) => {
                    if (err) return res.status(500).json({ success: false, message: "DB error" });

                    if (adminResult.length === 0) {
                        return res.json({
                            success: false,
                            message: "You are not allowed to register as an administrator.",
                        });
                    }

                    const hashedPassword = await bcrypt.hash(password, 10);

                    db.query(
                        "INSERT INTO users (name, surname, phone, password, role) VALUES (?, ?, ?, ?, ?)",
                        [name, surname, phone, hashedPassword, role],
                        (err, result) => {
                            if (err) return res.status(500).json({ success: false, message: "DB insert error" });

                            const token = jwt.sign({ phone, role }, JWT_SECRET, {
                                expiresIn: "7d",
                            });

                            return res.json({ success: true, message: "Registration successful!", token });
                        }
                    );
                }
            );
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10);

            db.query(
                "INSERT INTO users (name, surname, phone, password, role) VALUES (?, ?, ?, ?, ?)",
                [name, surname, phone, hashedPassword, role],
                (err, result) => {
                    if (err) return res.status(500).json({ success: false, message: "DB insert error" });

                    const token = jwt.sign({ phone, role }, JWT_SECRET, {
                        expiresIn: "7d",
                    });

                    return res.json({ success: true, message: "Registration successful!", token });
                }
            );
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

// Login
app.get("/api/users/by-phone", (req, res) => {
    const phone = req.query.phone;

    if (!phone) {
        return res.status(400).json({ message: "Phone not transferred" });
    }

    const query = "SELECT id, name, surname, phone, role FROM users WHERE phone = ?";
    db.query(query, [phone], (err, results) => {
        if (err) {
            console.error("Request error:", err);
            return res.status(500).json({ message: "Server error" });
        }

        if (results.length > 0) {
            return res.json(results[0]);
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    });
});

app.post("/api/login", (req, res) => {
    const { phone, password } = req.body;

    db.query("SELECT * FROM users WHERE phone = ?", [phone], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: "DB error" });
        }

        if (results.length === 0) {
            return res.json({ success: false, message: "User not found" });
        }

        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Incorrect password" });
        }

        const token = jwt.sign(
            { id: user.id, phone: user.phone, role: user.role },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({ success: true, token });
    });
});

// Administrator
app.get("/api/model-updates/pending", async (req, res) => {
    try {
        const [updates] = await db.promise().query(`
      SELECT 
          mu.id AS updateId,
          mu.userId,
          mu.name,
          mu.surname,
          mu.phone,
          mu.height,
          mu.bust,
          mu.waist,
          mu.hips,
          mu.shoe,
          mu.status,
          mu.createdAt,
          m.phone AS current_phone,
          m.height AS current_height,
          m.bust AS current_bust,
          m.waist AS current_waist,
          m.hips AS current_hips,
          m.shoe AS current_shoe
      FROM model_updates mu
      JOIN already_models m ON mu.phone = m.phone
      WHERE mu.status = 'pending'
      ORDER BY mu.createdAt DESC
    `);

        res.json(updates);
    } catch (err) {
        console.error("Error fetching pending updates:", err);
        res.status(500).json({ error: "Error fetching pending updates" });
    }
});

app.post("/api/model-updates/approve/:id", async (req, res) => {
    const updateId = req.params.id;

    try {
        const [update] = await db.promise().query(
            "SELECT * FROM model_updates WHERE id = ?",
            [updateId]
        );

        if (!update.length) {
            return res.status(404).json({ error: "Update not found" });
        }

        const u = update[0];

        await db.promise().query(
            `UPDATE already_models 
             SET height = ?, bust = ?, waist = ?, hips = ?, shoe = ?
             WHERE phone = ?`,
            [u.height, u.bust, u.waist, u.hips, u.shoe, u.phone]
        );

        await db.promise().query(
            "UPDATE model_updates SET status='approved' WHERE id=?",
            [updateId]
        );

        res.json({ message: "Update approved" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error approving update" });
    }
});

app.post("/api/model-updates/reject/:id", async (req, res) => {
    const updateId = req.params.id;

    try {
        const [update] = await db.promise().query("SELECT * FROM model_updates WHERE id = ?", [updateId]);
        if (!update.length) {
            return res.status(404).json({ error: "Update not found" });
        }

        await db.promise().query("UPDATE model_updates SET status='rejected' WHERE id = ?", [updateId]);

        res.json({ message: "Update rejected" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error rejecting update" });
    }
});

// ViewModelForm
app.get("/api/become-model-forms", authenticateToken, (req, res) => {
    db.query("SELECT * FROM models", (err, results) => {
        if (err) {
            console.error("DB error when getting model forms:", err);
            return res.status(500).json({ message: "DB error" });
        }

        res.json(results);
    });
});

app.get("/api/become-model-forms/:id", authenticateToken, (req, res) => {
    const id = req.params.id;

    db.query("SELECT * FROM models WHERE id = ?", [id], (err, results) => {
        if (err) return res.status(500).json({ message: "DB error" });

        if (results.length === 0) {
            return res.status(404).json({ message: "Model not found" });
        }

        res.json(results[0]);
    });
});

const getModelPhotos = (folderName) => {
    const folderPath = path.join(__dirname, "uploads", folderName);
    if (!fs.existsSync(folderPath)) return [];

    const files = fs.readdirSync(folderPath);
    return files.map(file => `/uploads/${folderName}/${file}`);
};

app.get("/api/model-photos/:name/:surname", authenticateToken, (req, res) => {
    const folderName = `${req.params.name}_${req.params.surname}`;
    const photoUrls = getModelPhotos(folderName);
    res.json(photoUrls);
});

app.delete("/api/reject-model/:id", authenticateToken, (req, res) => {
    const id = req.params.id;
    db.query("DELETE FROM models WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json({ message: "Error while deleting" });
        res.json({ message: "Application rejected" });
    });
});

app.post("/api/approve-model/:id", authenticateToken, (req, res) => {
    const id = req.params.id;

    db.query("SELECT * FROM models WHERE id = ?", [id], (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ message: "Application not found" });

        const {
            name,
            surname,
            height,
            bust,
            waist,
            hips,
            shoe,
            photos_path,
            phone
        } = results[0];

        db.query(
            "INSERT INTO already_models (name, surname, height, bust, waist, hips, shoe, photo_url, phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [name, surname, height, bust, waist, hips, shoe, photos_path, phone],
            (err) => {
                if (err) {
                    console.error("Error adding to already_models:", err);
                    return res.status(500).json({ message: "Error adding to models" });
                }

                db.query("DELETE FROM models WHERE id = ?", [id], (err) => {
                    if (err) {
                        return res.status(500).json({ message: "Error while deleting application" });
                    }

                    res.json({ message: "Candidate added to the model database" });
                });
            }
        );
    });
});

// Photographer
app.post("/api/chats/start", (req, res) => {
    const { photographer_id, model_id, photosession_id } = req.body;

    if (!photographer_id || !model_id || !photosession_id) {
        return res.status(400).json({ error: "Missing fields" });
    }

    db.query(
        `SELECT status FROM model_applications 
         WHERE model_id = ? AND session_id = ?`,
        [model_id, photosession_id],
        (err, rows) => {
            if (err) {
                console.error("DB application error:", err);
                return res.status(500).json({ error: "Database error" });
            }

            if (rows.length === 0) {
                return res.status(403).json({ error: "Application not found" });
            }

            if (rows[0].status === "rejected") {
                return res.status(403).json({
                    error: "Chat is not allowed for rejected application"
                });
            }

            db.query(
                `SELECT * FROM chats 
                 WHERE photographer_id=? AND model_id=? AND photosession_id=?`,
                [photographer_id, model_id, photosession_id],
                (err, rows) => {
                    if (err) {
                        console.error("DB SELECT chat error:", err);
                        return res.status(500).json({ error: "Database SELECT error" });
                    }

                    if (rows.length > 0) return res.json(rows[0]);

                    db.query(
                        `INSERT INTO chats 
                         (photographer_id, model_id, photosession_id) 
                         VALUES (?, ?, ?)`,
                        [photographer_id, model_id, photosession_id],
                        (err, result) => {
                            if (err) {
                                console.error("DB INSERT chat error:", err);
                                return res.status(500).json({ error: "Database INSERT error" });
                            }
                            
                            res.json({ id: result.insertId });
                        }
                    );
                }
            );
        }
    );
});

app.get("/api/chats/:chatId/messages", (req, res) => {
    const { chatId } = req.params;

    db.query(
        "SELECT * FROM messages WHERE chat_id=? ORDER BY created_at ASC",
        [chatId],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        }
    );
});

// server.js
app.get("/api/chats/my/:modelId/model", async (req, res) => {
    const { modelId } = req.params;

    try {
        const [chats] = await db.promise().query(
            "SELECT * FROM chats WHERE model_id = ?",
            [modelId]
        );

        if (!chats || chats.length === 0) {
            return res.status(404).json({ message: "No chats found" });
        }

        res.json(chats);
    } catch (err) {
        console.error("Error fetching chats:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/api/sessions", authenticateToken, (req, res) => {
    const { title, description, date, location, photographer_id } = req.body;

    const isLatinOnly = (text) => /^[A-Za-z0-9\s.,!?'"()-]+$/.test(text);

    if (!title || !description || !date || !location) {
        return res.status(400).json({ message: "All fields must be filled in." });
    }

    if (!isLatinOnly(title) || !isLatinOnly(description) || !isLatinOnly(location)) {
        return res.status(400).json({ message: "The title, description and location must contain only Latin letters." });
    }

    db.query(
        "INSERT INTO sessions (title, description, date, location, photographer_id) VALUES (?, ?, ?, ?, ?)",
        [title, description, date, location, photographer_id],
        (err, results) => {
            if (err) {
                console.error("Error creating session:", err);
                return res.status(500).json({ message: "Error creating session" });
            }

            res.status(201).json({ message: "Session created successfully", sessionId: results.insertId });
        }
    );
});

app.get("/api/sessions", authenticateToken, (req, res) => {
    db.query("SELECT * FROM sessions", (err, results) => {
        if (err) {
            console.error("Error fetching sessions:", err);
            return res.status(500).json({ message: "Error fetching sessions" });
        }

        res.json(results);
    });
});

app.get("/api/sessions/:id", authenticateToken, (req, res) => {
    const sessionId = req.params.id;

    db.query("SELECT * FROM sessions WHERE id = ?", [sessionId], (err, results) => {
        if (err) {
            console.error("Error fetching session details:", err);
            return res.status(500).json({ message: "Error fetching session details" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Session not found" });
        }

        res.json(results[0]);
    });
});

app.get("/api/model-applications", authenticateToken, (req, res) => {
    db.query("SELECT * FROM model_applications", (err, results) => {
        if (err) {
            console.error("Error fetching model applications:", err);
            return res.status(500).json({ message: "Error fetching model applications" });
        }

        res.json(results);
    });
});

app.post("/api/model-applications/accept/:id", authenticateToken, (req, res) => {
    const applicationId = req.params.id;

    db.query("SELECT * FROM model_applications WHERE id = ?", [applicationId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ message: "Application not found" });
        }

        db.query(
            "UPDATE model_applications SET status = ? WHERE id = ?",
            ["accepted", applicationId],
            (err) => {
                if (err) {
                    console.error("Error updating application status:", err);
                    return res.status(500).json({ message: "Error updating application status" });
                }

                res.json({ message: "Model application accepted" });
            }
        );
    });
});

app.post("/api/model-applications/reject/:id", authenticateToken, (req, res) => {
    const applicationId = req.params.id;

    db.query("SELECT * FROM model_applications WHERE id = ?", [applicationId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ message: "Application not found" });
        }

        db.query(
            "UPDATE model_applications SET status = ? WHERE id = ?",
            ["rejected", applicationId],
            (err) => {
                if (err) {
                    console.error("Error updating application status:", err);
                    return res.status(500).json({ message: "Error updating application status" });
                }

                res.json({ message: "Application rejected" });
            }
        );
    });
});

// ModelProfile
app.get("/api/applications-for-photographer", authenticateToken, (req, res) => {
    db.query(
        `SELECT ma.id, ma.session_id, ma.status, ma.submitted_at, ma.name, ma.surname 
        FROM model_applications ma
        JOIN sessions s ON ma.session_id = s.id`,
        (err, results) => {
            if (err) {
                console.error("Error fetching applications:", err);
                return res.status(500).json({ message: "Error fetching applications" });
            }
            res.json(results);
        }
    );
});

app.get("/api/users/:id", authenticateToken, (req, res) => {
    const id = req.params.id;

    const query = `
        SELECT u.id, u.name, u.surname, u.phone, u.role, 
               am.height, am.bust, am.waist, am.hips, am.shoe, am.photo_url
        FROM users u
        LEFT JOIN already_models am ON REPLACE(REPLACE(REPLACE(REPLACE(u.phone, '+', ''), '-', ''), ' ', ''), '(', '') = 
                                       REPLACE(REPLACE(REPLACE(REPLACE(am.phone, '+', ''), '-', ''), ' ', ''), '(', '')
        WHERE u.id = ?
    `;

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error("DB error:", err);
            return res.status(500).json({ message: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(results[0]);
    });
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads_already", express.static(path.join(__dirname, "uploads_already")));

const getModelProfilePhotos = (folderName) => {
    const uploadsPaths = ["uploads", "uploads_already"];
    let photoUrls = [];

    for (const base of uploadsPaths) {
        const folderPath = path.join(__dirname, base, folderName);
        if (fs.existsSync(folderPath)) {
            const files = fs.readdirSync(folderPath);
            const urls = files.map(file => `/${base}/${folderName}/${file}`);
            photoUrls.push(...urls);
        }
    }

    return photoUrls;
};

app.get("/api/user-photos/:name/:surname", authenticateToken, (req, res) => {
    const folderName = `${req.params.name}_${req.params.surname}`;
    const photoUrls = getModelProfilePhotos(folderName);
    res.json(photoUrls);
});

app.get('/api/users-photos/:name/:surname', authenticateToken, (req, res) => {
    const { name, surname } = req.params;

    const folderName = `${name}_${surname}`;
    const photoUrls = getModelProfilePhotos(folderName);

    res.json(photoUrls);
});

app.get("/api/model-applications/status/:id", authenticateToken, (req, res) => {
    const applicationId = req.params.id;

    db.query("SELECT status FROM model_applications WHERE id = ?", [applicationId], (err, results) => {
        if (err || results.length === 0) {
            return res.status(404).json({ message: "Application not found" });
        }

        const status = results[0].status;
        res.json({ status });
    });
});

app.get("/api/model-applications", authenticateToken, (req, res) => {
    db.query(`
        SELECT ma.id, ma.status, ma.model_id, ma.session_id, ma.submitted_at, 
               m.name, m.surname
        FROM model_applications ma
        JOIN users u ON ma.model_id = m.id
    `, (err, results) => {
        if (err) {
            console.error("Error fetching model applications:", err);
            return res.status(500).json({ message: "Error fetching model applications" });
        }

        res.json(results);
    });
});

// Model
app.post("/api/model-updates", async (req, res) => {
    const { userId, height, bust, waist, hips, shoe } = req.body;

    try {
        const [rows] = await db.promise().query(
            "SELECT name, surname, phone FROM users WHERE id = ?",
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Model not found" });
        }

        const { name, surname, phone } = rows[0];

        const [pendingUpdates] = await db.promise().query(
            `
            SELECT height, bust, waist, hips, shoe
            FROM model_updates
            WHERE userId = ?
              AND status = 'pending'
            `,
            [userId]
        );

        const fields = ["height", "bust", "waist", "hips", "shoe"];
        const lockedFields = [];

        for (const update of pendingUpdates) {
            for (const field of fields) {
                if (
                    update[field] !== null &&
                    req.body[field] !== undefined &&
                    req.body[field] !== update[field]
                ) {
                    lockedFields.push(field);
                }
            }
        }

        if (lockedFields.length > 0) {
            return res.status(409).json({
                error:
                    `You cannot edit the following fields because the previous changes ` +
                    `have not yet been approved by the administrator: ` +
                    `${[...new Set(lockedFields)].join(", ")}. ` +
                    `Please wait for admin approval before editing these data again.`
            });
        }

        await db.promise().query(
            `
            INSERT INTO model_updates 
                (userId, name, surname, phone, height, bust, waist, hips, shoe, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
            `,
            [userId, name, surname, phone, height, bust, waist, hips, shoe]
        );

        res.json({ message: "Changes saved and pending admin approval" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error saving changes" });
    }
});

app.get("/api/sessions", authenticateToken, (req, res) => {
    db.query("SELECT * FROM sessions", (err, results) => {
        if (err) {
            console.error("DB error when getting sessions:", err);
            return res.status(500).json({ message: "DB error" });
        }

        res.json(results);
    });
});

app.get("/api/model-application-status/:modelId/:sessionId", authenticateToken, (req, res) => {
    const { modelId, sessionId } = req.params;

    db.query(
        "SELECT * FROM model_applications WHERE model_id = ? AND session_id = ?",
        [modelId, sessionId],
        (err, results) => {
            if (err) {
                console.error("DB error when getting application status:", err);
                return res.status(500).json({ message: "DB error" });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: "Application not found" });
            }

            res.json(results[0]);
        }
    );
});

app.post("/api/submit-application", authenticateToken, (req, res) => {
    const { modelId, sessionId, name, surname } = req.body;

    if (!modelId || !sessionId || !name || !surname) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    db.query(
        `INSERT INTO model_applications (model_id, session_id, name, surname, status)
        VALUES (?, ?, ?, ?, 'pending')`,
        [modelId, sessionId, name, surname],
        (err, result) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    console.error("Duplicate application:", err);
                    return res.status(400).json({ message: "You have already submitted an application for this session" });
                }
                console.error("Database error:", err);
                return res.status(500).json({ message: "Database error" });
            }
            res.status(200).json({ message: "Application submitted successfully" });
        }
    );
});

app.post('/api/model-applications/accept/:applicationId', authenticateToken, async (req, res) => {
    const { applicationId } = req.params;

    try {
        await db.query(
            'UPDATE applications SET status = "accepted" WHERE id = ?',
            [applicationId]
        );
        res.status(200).send('Application accepted!');
    } catch (error) {
        console.error("Error accepting application:", error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/api/model-applications/reject/:applicationId', authenticateToken, async (req, res) => {
    const { applicationId } = req.params;

    try {
        await db.query(
            'UPDATE applications SET status = "rejected" WHERE id = ?',
            [applicationId]
        );
        res.status(200).send('Application rejected!');
    } catch (error) {
        console.error("Error rejecting application:", error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/application-details/:applicationId', authenticateToken, async (req, res) => {
    try {
        const applicationId = req.params.applicationId;

        const applicationQuery = 'SELECT * FROM model_applications WHERE id = ?';
        const [application] = await db.query(applicationQuery, [applicationId]);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        const sessionQuery = 'SELECT * FROM sessions WHERE id = ?';
        const [session] = await db.query(sessionQuery, [application.session_id]);

        if (!session) {
            return res.status(404).json({ message: 'Photoshoot not found' });
        }

        res.json(session);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });
