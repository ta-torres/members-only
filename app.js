require("dotenv").config();
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");

const session = require("express-session");
const passport = require("./config/passport");

//test singup route
const bcrypt = require("bcryptjs");
const db = require("./db/db");

const app = express();
const PORT = process.env.PORT || 3000;

const authRoutes = require("./routes/authRoutes");
const indexRoutes = require("./routes/indexRoutes");
const messageRoutes = require("./routes/messageRoutes");

// Set up views folder and view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(expressLayouts);

// 1. Body parsing middleware (before session/passport)
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

// 2. Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.COOKIE_SECURE === "true",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// 3. Passport initialization setup is done in ./config/passport.js
// 4. Set up and initialize passport strategy BEFORE routes
app.use(passport.session());

// make user available in all ejs templates
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// 5. App routes
app.use("/", indexRoutes);
app.use("/auth", authRoutes);
app.use("/messages", messageRoutes);

app.get("/test-db", async (req, res) => {
  try {
    const hash = await bcrypt.hash("password", 10);
    const result = await db.query(
      "INSERT INTO users (first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *",
      ["Test", "User", "test@test.com", hash]
    );
    const adminUser = await db.query(
      "INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) RETURNING *",
      [result.rows[0].id, 3]
    );
    console.log(adminUser);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Error 500: Internal Server Error");
});

app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
