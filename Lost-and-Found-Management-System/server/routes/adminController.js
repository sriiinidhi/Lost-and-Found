const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/AdminSchema');
const User = require('../models/UserSchema');
const Item = require('../models/ItemSchema');
const Claimant = require('../models/ClaimantSchema');
const Helper = require('../models/HelperSchema');
const { validateAdminSignup, validateAdminLogin } = require('../middleware/validationMiddleware');
const requireAuth = require('../middleware/requireAuth');

// Admin Signup
router.post('/signup', validateAdminSignup, async (req, res) => {
  try {
    const { adminId, username, password } = req.body;

    if (password !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: "Invalid admin password. Access denied." 
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ 
      $or: [{ adminId }, { username }] 
    });

    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "Admin already exists with this ID or email"
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const admin = await Admin.create({
      adminId,
      username,
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      admin: {
        id: admin._id,
        adminId: admin.adminId,
        username: admin.username,
        role: admin.role
      }
    });

  } catch (error) {
    console.error("Admin signup error:", error);
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Admin already exists with this ID or email"
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error during signup"
    });
  }
});

// Admin Login
router.post('/login', validateAdminLogin, async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const passwordMatch = bcrypt.compareSync(password, admin.password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const expirationTime = Date.now() + 1000 * 60 * 60 * 24 * 30; // 30 days

    const token = jwt.sign(
      { 
        sub: admin._id, 
        role: "admin", 
        expirationTime 
      },
      process.env.SECRETKEY,
      { expiresIn: '30d' }
    );

    res.cookie("AdminAuth", token, {
      expires: new Date(expirationTime),
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === "production"
    });

    res.json({
      success: true,
      token,
      admin: {
        id: admin._id,
        adminId: admin.adminId,
        username: admin.username,
        role: admin.role
      }
    });

  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during login"
    });
  }
});

// Admin Logout
router.get('/logout', (req, res) => {
  try {
    res.clearCookie("AdminAuth");
    res.json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error("Admin logout error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during logout"
    });
  }
});

// Admin Management Routes (protected)
router.get('/users', requireAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error("Fetch users error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users"
    });
  }
});

router.get('/items', requireAuth, async (req, res) => {
  try {
    const items = await Item.find();
    res.json({
      success: true,
      count: items.length,
      items
    });
  } catch (error) {
    console.error("Fetch items error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching items"
    });
  }
});

router.get('/claimants', requireAuth, async (req, res) => {
  try {
    const claimants = await Claimant.find();
    res.json({
      success: true,
      count: claimants.length,
      claimants
    });
  } catch (error) {
    console.error("Fetch claimants error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching claimants"
    });
  }
});

router.get('/helpers', requireAuth, async (req, res) => {
  try {
    const helpers = await Helper.find();
    res.json({
      success: true,
      count: helpers.length,
      helpers
    });
  } catch (error) {
    console.error("Fetch helpers error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching helpers"
    });
  }
});

module.exports = router;










// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const Admin = require('../models/AdminSchema');
// const User = require('../models/UserSchema');
// const Item = require('../models/ItemSchema');
// const Claimant = require('../models/ClaimantSchema');
// const Helper = require('../models/HelperSchema');

// const signup = async (req, res) => {
//   try {
//     const { adminId, username, password } = req.body;

//     if (password !== 'admin') {
//       return res.status(403).json({ message: "Invalid admin password. Access denied." });
//     }

//     const hashedPassword = bcrypt.hashSync(password, 8);

//     const admin = await Admin.create({
//       adminId,
//       username,
//       password: hashedPassword
//     });

//     res.status(201).json({ admin });
//   } catch (error) {
//     console.error("Admin signup error:", error);
//     res.status(500).send("Internal Server Error");
//   }
// };

// const login = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     const admin = await Admin.findOne({ username }).select("+password");

//     if (!admin) return res.sendStatus(401);

//     const passwordMatch = bcrypt.compareSync(password, admin.password);

//     if (!passwordMatch) return res.sendStatus(401);

//     const expirationTime = Date.now() + 1000 * 60 * 60 * 24 * 30;

//     const token = jwt.sign(
//       { sub: admin._id, role: "admin", expirationTime },
//       process.env.SECRETKEY
//     );

//     res.cookie("AdminAuth", token, {
//       expires: new Date(expirationTime),
//       httpOnly: true,
//       sameSite: 'lax',
//       secure: process.env.NODE_ENV === "production"
//     });

//     res.json({ token });
//   } catch (error) {
//     console.error("Admin login error:", error);
//     res.status(500).send("Internal Server Error");
//   }
// };

// const logout = (req, res) => {
//   try {
//     res.clearCookie("AdminAuth");
//     res.sendStatus(200);
//   } catch (error) {
//     console.error("Admin logout error:", error);
//     res.status(500).send("Internal Server Error");
//   }
// };

// // Management operations
// const fetchAllUsers = async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json({ users });
//   } catch (error) {
//     console.error("Fetch users error:", error);
//     res.status(500).send("Internal Server Error");
//   }
// };

// const fetchAllItems = async (req, res) => {
//   try {
//     const items = await Item.find();
//     res.json({ items });
//   } catch (error) {
//     console.error("Fetch items error:", error);
//     res.status(500).send("Internal Server Error");
//   }
// };

// const fetchAllClaimants = async (req, res) => {
//   try {
//     const claimants = await Claimant.find();
//     res.json({ claimants });
//   } catch (error) {
//     console.error("Fetch claimants error:", error);
//     res.status(500).send("Internal Server Error");
//   }
// };

// const fetchAllHelpers = async (req, res) => {
//   try {
//     const helpers = await Helper.find();
//     res.json({ helpers });
//   } catch (error) {
//     console.error("Fetch helpers error:", error);
//     res.status(500).send("Internal Server Error");
//   }
// };

// module.exports = {
//   signup,
//   login,
//   logout,
//   fetchAllUsers,
//   fetchAllItems,
//   fetchAllClaimants,
//   fetchAllHelpers,
// };
