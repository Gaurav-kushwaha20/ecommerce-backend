const User = require("../models/UserModel")
const Token = require("../models/TokenModel")
const crypto = require("crypto")
const bcrypt = require("bcrypt")
const sendEmail = require("../middlewares/emailSender")
var jwt = require('jsonwebtoken');
const saltrounds = 10
// let { expressjwt: jwt } = require("express-jwt")     :jwt mean name allias
let { expressjwt } = require("express-jwt")

// register
exports.register = async (req, res) => {
    /*
    take inputs from user
    check if username is already taken
    check if the username is already taken
    check if email is already registered
    encrypt password
    save user
    generate verification token
    send token in email
    send message to user
    */

    let { username, email, password } = req.body;
    let user = await User.findOne({ username })
    if (user) {
        {
            return res.status(400).json({ error: "username is already taken" })
        }
    }

    // check if email is already registered
    user = await User.findOne({ email })
    if (user) {
        {
            return res.status(400).json({ error: "email is already registered" })
        }
    }

    // encrypt password
    let salt = await bcrypt.genSalt(saltrounds)
    let hashed_password = await bcrypt.hash(password, salt)


    // save user in database
    user = await User.create({
        username, email, password: hashed_password
    })

    if (!user) {
        return res.status(400).json({ error: "Something went wrong" })
    }

    // generate verification token
    let token = await Token.create({
        user: user._id,
        token: crypto.randomBytes(24).toString('hex')
    })
    if (!token) {
        return res.status(400).json({ error: "can't generate token" })
    }

    // send token in email
    const url = `http://localhost:5173/verify/${token.token}`
    sendEmail({
        from: 'noreply@something.com',
        to: email,
        subject: 'Verify your email',
        text: `Click on this link to verify your email: ${url}`,
        html: `<a href='${url}'><button>verify</button></a>`
    })
    return res.status(200).json({ message: "user created successfully" })


}

// verify user
exports.verifyEmail = async (req, res) => {
    try {


        // check if token is valid or not
        let token = await Token.findOne({ token: req.params.token })
        if (!token) {
            return res.status(400).json({ error: "Invalid token or token may have expired" })
        }
        // find user
        let user = await User.findById(token.user)
        if (!user) {
            return res.status(400).json({ error: "User not found." })
        }
        // check if already verified
        if (user.isVerified) {
            return res.status(400).json({ error: "User already verified. Login to continue" })
        }
        // verify user
        user.isVerified = true
        user = await user.save()

        if (!user) {
            return res.status(400).json({ error: "Something went wrong" })
        }

        // send msg to user
        res.send({ message: "User verified successfully." })
    } catch {
        return res.status(400).json({ error: "Internal server error" })
    }
}

exports.forgotPassword = async (req, res) => {
    // check if email is registered
    let user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).json({ error: "Email not registered." })
    }
    // Generate password reset token
    let token = await Token.create({
        user: user._id,
        token: crypto.randomBytes(24).toString('hex')
    })

    if (!token) {
        return res.status(400).json({ error: "Something went wrong" })
    }

    // send token in email
    const URL = `http://localhost:5173/reset-password/${token.token}`
    sendEmail({
        from: 'noreply@something.com',
        to: req.body.email,
        subject: 'Reset Password Link',
        text: `Click on the link to reset your password: ${URL}`,
        html: `<a href="${URL}"><button>Reset Password</button></a>`
    })

    // send msz to user
    res.send({ message: "Password reset link sent to your email." })
}

exports.resetPassword = async (req, res) => {
    // check if toke  is valid or not
    let token = await Token.findOne({ token: req.params.token })
    if (!token) {
        return res.status(400).json({ error: "Invalid token or token may have expired" })
    }
    // find user
    let user = await User.findById(token.user)
    if (!user) {
        return res.status(400).json({ error: "User not found" })
    }
    // encrypt password and save in database
    let salt = await bcrypt.genSalt(10)
    let hashedPassword = await bcrypt.hash(req.body.password, salt)
    user.password = hashedPassword
    user = await user.save()

    if (!user) {
        return res.status(400).json({ error: "Something went wrong" })
    }

    res.send({ message: "password reset successfully" })
}

exports.resendVerification = async (req, res) => {
    // check email
    let user = await User.findOne({ email: req.params.email })
    if (!user) {
        return res.status(400).json({ error: "User not found" })
    }

    else if (user.isVerified) {
        return res.status(200).json({ message: "User already verified" })
    } else if (!user.isVerified) {
        // generate token
        let token = await Token.create({
            user: user._id,
            token: crypto.randomBytes(24).toString('hex'),
        })
        // check if already verified
        if (!token) {
            return res.status(400).json({ error: "can't generate the token id, please try again later" })
        }
        const url = `http://localhost:5173/verify/${token.token}`
        sendEmail({
            from: 'noreply@something.com',
            to: email,
            subject: 'Verify your email',
            text: `Click on this link to verify your email: ${url}`,
            html: `<a href='${url}'><button>verify</button></a>`
        })
        return res.status(200).json({ message: "user created successfully" })
    }




}
// user list
exports.userlist = async (req, res) => {
    let users = await User.find()
    if (!users) {
        return res.status(400).json({ error: "No users found" })
    }
    else if (users) {
        return res.status(200).json({ users })
    }
}

// user details
exports.userdetails = async (req, res) => {
    let email = req.params.email;
    let userid = req.params.id;

    let user = await User.findOne({ email: email, _id: userid })
    if (!user) {
        return res.status(400).json({ error: "User not found" })

    } else if (user) {
        return res.status(200).json({ user })
    }
}
// update user
exports.updateuser = async (req, res) => {
    let id = req.params.id;
    // check the username or email is already taken
    let user = await User.findOne


    user = await User.findByIdAndUpdate(id, req.body, { new: true })
    if (!user) {
        return res.status(400).json({ error: "User not found" })
    }
    else if (user) {
        return res.status(200).json({ user })
    }
}
// update username and email
exports.updateusernameandemail = async (req, res) => {
    let id = req.params.id;
    let user = await User.findById(id)
    if (!user) {
        return res.status(400).json({ error: "User not found" })
    } else if (user) {
        if (req.body.username) {
            let user = await User.findOne({ _id: id })
            if (user.username === req.body.username) {
                return res.status(400).json({ error: "please enter new username" })
            } else if (user.username != req.body.username) {
                user = await User.findOne({ username: req.body.username })
                if (user) {
                    return res.status(400).json({ error: "username already taken" })
                } else if (!user) {
                    user = await User.findByIdAndUpdate(id, { username: req.body.username }, { new: true })
                }
                if (user) {
                    return res.status(200).json({ user })
                }

            }
        }
        if (req.body.email) {
            let user = await User.findOne({ _id: id })
            if (user) {
                if (user.email === req.body.email) {
                    return res.status(400).json({ error: "please enter new email" })
                } else if (user.email != req.body.email) {
                    user = await User.findOne({ email: req.body.email })
                    if (user) {
                        return res.status(400).json({ error: "email already taken" })
                    } else if (!user) {
                        user = await User.findByIdAndUpdate(id, { email: req.body.email, isVerified: false }, { new: true })
                        if (user) {
                            // send the verification mail to verify
                            user = await User.findById({ _id: req.params.id })
                            if (!user) {
                                return res.status(400).json({ error: "User not found" })
                            }
                            else if (user.isVerified) {
                                return res.status(200).json({ message: "User already verified" })
                            } else if (!user.isVerified) {
                                // generate token
                                let token = await Token.create({
                                    user: user._id,
                                    token: crypto.randomBytes(24).toString('hex'),
                                })
                                // check if already verified
                                if (!token) {
                                    return res.status(400).json({ error: "can't generate the token id, please try again later" })
                                }
                                const url = `http://localhost:5000/verify/${token.token}`
                                sendEmail({
                                    from: 'noreply@something.com',
                                    to: req.body.email,
                                    subject: 'Verify your email',
                                    text: `Click on this link to verify your email: ${url}`,
                                    html: `<a href='${url}'><button>verify</button></a>`
                                })

                            }
                            return res.status(200).json({ user, message: "email updated successfully, please verify your email" })
                        } else {
                            return res.status(400).json({ error: "can't update you email" })
                        }
                    }
                }
            } else if (!user) {
                returnres.status(400).json({ error: "User not found" })
            }
        }
        else {
            return res.status(400).json({ error: "please provide email or username" })
        }

    }
}

// delete user

// login
exports.login = async (req, res) => {
    // check email
    // check password
    // check if verified or not
    // generate login token
    // set token in cookies
    // send information to user

    let { email, password } = req.body
    // check email exist or not
    let user = await User.findOne({ email: email })
    if (!user) {
        return res.status(400).json({ error: "Email not registered!" })
    }

    // check passwordd
    let passwordCorrect = await bcrypt.compare(password, user.password)
    if (!passwordCorrect) {
        return res.status(400).json({ error: "Password is incorrect!" })
    }

    // check if verfified or not
    if (!user.isVerified) {
        return res.status(400).json({ error: "User not verified!" })
    }
    let { _id, role, username } = user;
    let token = jwt.sign({
        _id, role, username, email
    }, process.env.JWT_SECREAT)

    //  set token in cookies
    res.cookie('jwt', token, { expire: Date.now() + 86400 })

    // send information to user
    res.send({
        token, user: { _id, email, username, role }
    })

}
// require user
exports.requireUser = (req, res, next) => {
    expressjwt({
        secret: process.env.JWT_SECREAT,
        algorithms: ['HS256'],
    })
        (req, res, err => {
            if (err) {
                return res.status(401).json({ error: "User not logged in!" })
            }
            next()
        })
}

// require admin
exports.requireAdmin = (req, res, next) => {
    expressjwt({
        secret: process.env.JWT_SECREAT,
        algorithms: ['HS256'],
        userProperty: 'auth'

    })(req, res, err => {
        if (err) {
            return res.status(401).json({ error: "User not logged in!" })
        } else if (req.auth.role === 0) {
            return res.status(403).json({ error: "You are not an admin!" })
        } else {
            next()
        }
    })
}

// sign out
exports.signout = (req, res) => {
    res.clearCookie('jwt')
    res.json({ message: "Sign out successfully" })
}