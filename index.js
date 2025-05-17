require('dotenv').config(); // Load .env variables
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB Atlas."))
.catch((err) => console.error("MongoDB connection error:", err));

// Schemas and Models
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});
const User = mongoose.model("User", userSchema);

const secretSchema = new mongoose.Schema({
  secret: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});
const Secret = mongoose.model("Secret", secretSchema);


// Middleware to protect routes
function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.redirect("/login");
    req.user = user;
    next();
  });
}

// Routes

// Home
app.get("/", (req, res) => {
  res.render("home");
});

// Register GET
// Register GET
app.get("/register", (req, res) => {
  res.render("register", { formData: {} });  // <-- pass empty formData object here
});

// Register POST
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,8}$/;

  if (!emailRegex.test(email)) {
    return res.status(400).render("register", {
      errorMessage: "❌ Invalid email format.",
      formData: { name, email }
    });
  }

  if (!passRegex.test(password)) {
    return res.status(400).render("register", {
      errorMessage: "❌ Password must be 6-8 chars with uppercase, lowercase, and number.",
      formData: { name, email }
    });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).render("register", {
        errorMessage: "❌ Email is already registered.",
        formData: { name, email }
      });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.redirect("/login");
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).render("register", {
      errorMessage: "❌ Error registering user.",
      formData: { name, email }
    });
  }
});

// Login GET
app.get("/login", (req, res) => {
  res.render("login");
});

// Login POST
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const foundUser = await User.findOne({ email: username });
    if (!foundUser) {
      return res.status(400).render("login", {
        errorMessage: "❌ No user found.",
        formData: { username }
      });
    }

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
      return res.status(400).render("login", {
        errorMessage: "❌ Incorrect password.",
        formData: { username }
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: foundUser._id, email: foundUser.email, name: foundUser.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Set it as HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set true if HTTPS
      sameSite: "lax",
      maxAge: 3600000 // 1 hour
    });

    res.redirect("/secrets");
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).render("login", {
      errorMessage: "❌ Login failed.",
      formData: { username }
    });
  }
});

// Secrets page - Protected
app.get("/secrets", authenticateToken, async (req, res) => {
  try {
    const foundSecrets = await Secret.find({ user: req.user.id });  // Only this user's secrets
    res.render("secrets", { secretsList: foundSecrets });
  } catch (err) {
    console.error("Error retrieving secrets:", err);
    res.status(500).send("❌ Error retrieving secrets.");
  }
});



// Submit secret GET - Protected
app.get("/submit", authenticateToken, (req, res) => {
  res.render("submit");
});

// Submit secret POST - Protected
app.post("/submit", authenticateToken, async (req, res) => {
  try {
    const newSecret = new Secret({
      secret: req.body.secret,
      user: req.user.id
    });
    await newSecret.save();
    res.redirect("/secrets");
  } catch (err) {
    console.error("Error saving secret:", err);
    res.status(500).send("❌ Failed to save secret.");
  }
});



// User info page - Protected
app.get("/user", authenticateToken, (req, res) => {
  res.render("user", { user: req.user });
});

// Logout
app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});

// Server start
app.listen(8000, () => {
  console.log("🚀 Server started on http://localhost:8000");
});
