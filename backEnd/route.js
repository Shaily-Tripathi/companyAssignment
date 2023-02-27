const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { User } = require("../models/user");
const { Comment } = require("../models/comment");

// Register a new user
router.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  const user = new User({ name, email, password });

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) throw err;
      user.password = hash;
      user
        .save()
        .then((user) => res.json(user))
        .catch((err) => res.status(400).json({ error: err }));
    });
  });
});

// Login with email and password
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        const payload = { user: { _id: user._id } };
        jwt.sign(payload, "mySecretKey", { expiresIn: "1h" }, (err, token) => {
          res.json({ token: `Bearer ${token}` });
        });
      } else {
        return res.status(400).json({ error: "Invalid password" });
      }
    });
  });
});

// Login with Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const payload = { user: { _id: req.user._id } };
    jwt.sign(payload, "mySecretKey", { expiresIn: "1h" }, (err, token) => {
      res.redirect(`http://localhost:3000/login?token=${token}`);
    });
  }
);

// Get all users
router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json({ error: err }));
});

// Get a specific user by id
router.get("/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    })
    .catch((err) => res.status(400).json({ error: err }));
});


// Update a specific user by id
router.put("/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.password = req.body.password || user.password;

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) throw err;
            user.password = hash;
            user
              .save()
              .then((user) => res.json(user))
              .catch((err) => res.status(400).json({ error: err }));
          });
        });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    })
    .catch((err) => res.status(400).json({ error: err }));
});

// Delete a specific user by id
router.delete("/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then((user) => {
      if (user) {
        res.json({ message: "User deleted successfully" });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    })
    .catch((err) => res.status(400).json({ error: err }));
});


// Update a specific comment by id
router.put("/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
  Comment.findById(req.params.id)
    .then((comment) => {
      if (comment) {
        comment.content = req.body.content || comment.content;
        comment
          .save()
          .then((comment) => res.json(comment))
          .catch((err) => res.status(400).json({ error: err }));
      } else {
        res.status(404).json({ error: "Comment not found" });
      }
    })
    .catch((err) => res.status(400).json({ error: err }));
});

// Delete a specific comment by id
router.delete("/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
  Comment.findByIdAndDelete(req.params.id)
    .then((comment) => {
      if (comment) {
        res.json({ message: "Comment deleted successfully" });
      } else {
        res.status(404).json({ error: "Comment not found" });
      }
    })
    .catch((err) => res.status(400).json({ error: err }));
});


// Create comment
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const { text } = req.body;
    const { id: userId } = req.user;
    const comment = await Comment.create({ text, user: userId });
    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get comments
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const comments = await Comment.find().populate('user', 'username');
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;



       
