const express = require("express");
const router = new express.Router();
const userdb = require("../models/userSchema");
var bcrypt = require("bcryptjs");
const authenticate = require("../middleware/authenticate");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const keysecret = "akldfjkdfkdfkdggkfjkdkadkfjirwekjrkdjfsd"

// email config
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: 'kamalbanjade2004@gmail.com',
        pass: 'sfio nrlp bnvy cszo',
    }
})

// User Registration
router.post("/register", async (req, res) => {
    console.log('Request Body:', req.body); // Log the request body

    const { fname, email, password, cpassword } = req.body;

    if (!fname || !email || !password || !cpassword) {
        return res.status(422).json({ error: "Fill all the details" });
    }   

    try {
        const preuser = await userdb.findOne({ email: email });

        if (preuser) {
            return res.status(422).json({ status: 'failed', message: "This Email is Already Exist" });
        } else if (password !== cpassword) {
            return res.status(422).json({ status: 'failed', message: "Password and Confirm Password do not match" });
        } else {
            const finalUser = new userdb({ fname, email, password, cpassword });
            const storeData = await finalUser.save();

            return res.status(201).json({ status: 'success', message: 'User registered successfully', storeData });
        }

    } catch (error) {
        return res.status(422).json({ status: 'failed', message: 'Registration failed', error });
    }
});

// User Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json({ status: 'failed', message: "Fill all the details" });
    }
    try {
        const userValid = await userdb.findOne({ email: email });

        if (userValid) {
            const isMatch = await bcrypt.compare(password, userValid.password);

            if (!isMatch) {
                return res.status(422).json({ status: 'failed', message: "Invalid details" });
            } else {
                // Token generation
                const token = await userValid.generateAuthtoken();

                // Cookie generation
                res.cookie("usercookie", token, {
                    expires: new Date(Date.now() + 9000000),
                    httpOnly: true
                });

                const result = { userValid, token };
                return res.status(201).json({ status: 'success', message: 'Login successful', result });
            }
        } else {
            return res.status(422).json({ status: 'failed', message: "Invalid Email" });
        }

    } catch (error) {
        return res.status(401).json({ status: 'failed', message: 'Login failed', error });
    }
});

// User validation
router.get("/validuser", authenticate, async (req, res) => {
    try {
        const ValidUserOne = await userdb.findOne({ _id: req.userId });
        return res.status(201).json({ status: 201, ValidUserOne });  // Add return
    } catch (error) {
        return res.status(401).json({ status: 401, error });  // Add return
    }
});

// User logout
router.get("/logout", authenticate, async (req, res) => {
    try {
        req.rootUser.tokens = req.rootUser.tokens.filter((curelem) => {
            return curelem.token !== req.token;
        });

        res.clearCookie("usercookie", { path: "/" });
        await req.rootUser.save();
        
        return res.status(201).json({ status: 201 });  // Add return
    } catch (error) {
        return res.status(401).json({ status: 401, error });  // Add return
    }
});

// Send password reset link via email
router.post("/sendpasswordlink", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(401).json({ status: 401, message: "Enter your email" });  // Add return
    }

    try {
        const userfind = await userdb.findOne({ email: email });

        const token = jwt.sign({ _id: userfind._id }, keysecret, { expiresIn: "120s" });

        const setusertoken = await userdb.findByIdAndUpdate({ _id: userfind._id }, { verifytoken: token }, { new: true });

        if (setusertoken) {
            const mailOptions = {
                from: "kamalbanjade2004@gmail.com",
                to: email,
                subject: "Sending Email For Password Reset",
                text: `This Link is valid for 2 MINUTES: http://localhost:5173/forgotpassword/${userfind.id}/${setusertoken.verifytoken}`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(401).json({ status: 401, message: "Email not sent" });  // Add return
                } else {
                    return res.status(201).json({ status: 201, message: "Email sent successfully" });  // Add return
                }
            });
        }
    } catch (error) {
        return res.status(401).json({ status: 401, message: "Invalid user" });  // Add return
    }
});

// Verify user for forgot password
router.get("/forgotpassword/:id/:token", async (req, res) => {
    const { id, token } = req.params;

    try {
        const validuser = await userdb.findOne({ _id: id, verifytoken: token });
        const verifyToken = jwt.verify(token, keysecret);

        if (validuser && verifyToken._id) {
            return res.status(201).json({ status: 201, validuser });  // Add return
        } else {
            return res.status(401).json({ status: 401, message: "User does not exist" });  // Add return
        }

    } catch (error) {
        return res.status(401).json({ status: 401, error });  // Add return
    }
});

// Change password
router.post("/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    try {
        const validuser = await userdb.findOne({ _id: id, verifytoken: token });
        const verifyToken = jwt.verify(token, keysecret);

        if (validuser && verifyToken._id) {
            const newpassword = await bcrypt.hash(password, 12);
            const setnewuserpass = await userdb.findByIdAndUpdate({ _id: id }, { password: newpassword });

            await setnewuserpass.save();
            return res.status(201).json({ status: 201, setnewuserpass });  // Add return
        } else {
            return res.status(401).json({ status: 401, message: "User does not exist" });  // Add return
        }

    } catch (error) {
        return res.status(401).json({ status: 401, error });  // Add return
    }
});

// Google Login
router.post("/google-login", async (req, res) => {
    const { token } = req.body;
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        const uid = decodedToken.uid;
        const email = decodedToken.email;

        let user = await userdb.findOne({ email });

        if (!user) {
            user = new userdb({ email, password: '', googleId: uid });
            await user.save();
        }

        const jwtToken = jwt.sign({ userId: user._id }, keysecret, { expiresIn: "1h" });

        return res.status(201).json({ status: 201, result: { token: jwtToken } });  // Add return
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized" });  // Add return
    }
});

// GitHub Login
router.post("/github-login", async (req, res) => {
    const { code } = req.body;
    try {
        const response = await axios.post('https://github.com/login/oauth/access_token', {
            client_id: 'your-github-client-id',
            client_secret: 'your-github-client-secret',
            code
        }, {
            headers: { accept: 'application/json' }
        });

        const accessToken = response.data.access_token;

        const userResponse = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const { id, login, email } = userResponse.data;
        let user = await userdb.findOne({ email });

        if (!user) {
            user = new userdb({ email, password: '', githubId: id });
            await user.save();
        }

        const jwtToken = jwt.sign({ userId: user._id }, keysecret, { expiresIn: "1h" });

        return res.status(201).json({ status: 201, result: { token: jwtToken } });  // Add return
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized" });  // Add return
    }
});

module.exports = router;
