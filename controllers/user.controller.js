const User=require("../models/user.model")
const HTTP = require("../helper/http");
const { hashSync, compareSync } = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const otpgenerate = require("otp-generator");

(async function signup(req, res) {
  try {
    const obj = {
      username: "admin",
      email: "radhimiyani218@gmail.com",
      password: "admin@#",
    };
     const exitsUser=await User.find({role:"admin"})
     
     if(exitsUser&&exitsUser.length!=0) return

      await User.create({
        username: obj.username,
        email: obj.email,
        password: hashSync(obj.password.trim(), 10),
        role:"admin"
      });
      // return res.status(HTTP.SUCCESS).send({
      //   status: true,
      //   code: HTTP.SUCCESS,
      //   message: "signup Successfully",
      //   data: obj,
      // });
    

  } catch (error) {
    // return res.status(HTTP.BAD_REQUEST).send({
    //   status: false,
    //   code: HTTP.BAD_REQUEST,
    //   error:error,
    //   data: {},
    // });
  }
})();

const registerUser = async (req, res) => {
  try {
    const { full_name, email, password, c_pass } = req.body;

    //email exist
    const existsUser = await User.findOne({ email: email });
    if (existsUser)
      return res.status(HTTP.SUCCESS).send({
        status: false,
        code: HTTP.CONFLICT,
        message: "This email ID already exists",
        data: {},
      });
    if (password != c_pass)
      return res.status(HTTP.SUCCESS).send({
        status: false,
        code: HTTP.CONFLICT,
        message: "confirm password not match",
        data: {},
      });
    const user = new User({
      email,
      password,
      password: hashSync(password.trim(), 10),
      full_name,
    });
    const userData = await user.save();

    if (!userData)
      return res.status(HTTP.SUCCESS).send({
        status: false,
        code: HTTP.BAD_REQUEST,
        message: "The user could not be created. Please try again.",
        data: {},
      });
    const secret = process.env.JWT_SECRET + user.password;
    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, secret, { expiresIn: "15m" });
      return res.redirect("/admin/login")
    // return res.status(HTTP.SUCCESS).send({
    //   status: true,
    //   code: HTTP.SUCCESS,
    //   message: "User account created successfully.",
    //   data: "Bearer " + token,
    // });
  } catch (e) {
    console.log(e);
    // var errObj = "Something went wrong!";
    // if (e.message)
    //   errObj =
    //     Object.values(errorFormatter(e.message))[0] == undefined
    //       ? errObj
    //       : errorFormatter(e.message);
    return res.status(HTTP.SUCCESS).send({
      status: false,
      code: HTTP.INTERNAL_SERVER_ERROR,
      message: e,
      data: {},
    });
  }
};

const signupGet = (req, res) => {
  res.render("signup");
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user)
      return res.status(HTTP.SUCCESS).send({
        status: false,
        code: HTTP.BAD_REQUEST,
        message: "The provided email or password is invalid.",
        data: {},
      });

    if (user.password === undefined || !compareSync(password, user.password))
      return res.status(HTTP.SUCCESS).send({
        status: false,
        code: HTTP.BAD_REQUEST,
        message: "The provided email or password is invalid.",
        data: {},
      });
    const roleArray = ["user"];
    if (!roleArray.includes(user.role))
      return res.status(HTTP.SUCCESS).send({
        status: false,
        code: HTTP.BAD_REQUEST,
        message: "Invalid credentials.",
        data: {},
      });

    if (user.is_active !== true)
      return res.status(HTTP.SUCCESS).send({
        status: false,
        code: HTTP.UNAUTHORIZED,
        message:
          "Your account has been deactivated. Please contact the administrator.",
        data: {}, 
      });

      let token = jwt.sign({ id: user._id }, "token");
      return res.redirect("/admin/deshboard")
    // return res.status(HTTP.SUCCESS).send({
    //   status: true,
    //   code: HTTP.SUCCESS,
    //   message: "Logged in successfully!",
    //   data: {
    //     user: {
    //       id: user._id,
    //       f_name: user.f_name,
    //       m_name: user.m_name,
    //       l_name: user.l_name,
    //       email: user.email,
    //       contact_no: user.contact_no,
    //       avatar: user.avatar,
    //       role: user.role,
    //       as_admin: user.as_admin,
    //     },
    //     token: "Bearer " + token,
    //   },
    // });
  } catch (e) {
    console.log(e);
    return res.status(HTTP.SUCCESS).send({
      status: false,
      code: HTTP.INTERNAL_SERVER_ERROR,
      message: "Something went wrong!",
      data: {},
    });
  }
};

const loginGet = (req, res) => {
  res.render("login");
};

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "radhimiyani218@gmail.com",
    pass: "wpegxfjyogpribjt",
  },
});
let storeOtp = {};

const forgotPassword = async (req, res) => {
  try {
    let { email } = req.body;
    const otp = otpgenerate.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
    });
    storeOtp.email = email;

    await User.findOneAndUpdate({ email: email }, { otp: otp }, { new: true });
    const mail = {
      from: "radhimiyani218@gmail.com",
      to: email,
      subject: "otp send",
      html: `Verify your OTP ${otp}`,
    };

    transport.sendMail(mail, (err, info) => {
      if (err) {
        console.log(err.message);
        return res.status(HTTP.BAD_REQUEST).send({
          status: false,
          code: HTTP.BAD_REQUEST,
          message: "Failer Otp",
          data: {},
        });
      }
      return res.redirect("/admin/verify");
      // return res.status(HTTP.SUCCESS).send({
      //   status: true,
      //   code: HTTP.SUCCESS,
      //   message: "OTP send Successfully",
      //   data: {},
      // });
    });
  } catch (error) {
    return res.status(HTTP.BAD_REQUEST).send({
      status: false,
      code: HTTP.BAD_REQUEST,
      error: error,
      data: {},
    });
  }
};

const otpVerify = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log(req.body);

    const otpFind = await User.findOne({ email });
    console.log(otpFind);
    if (otpFind.otp == otp) {
      return res.status(HTTP.SUCCESS).send({
        status: true,
        code: HTTP.SUCCESS,
        message: "OTP Verify Sucessfully",
        data: {},
      });
    }
    return res.status(HTTP.SUCCESS).send({
      status: true,
      code: HTTP.SUCCESS,
      message: "OTP Are Not Match",
      data: {},
    });
  } catch (error) {
    console.log(error);
    return res.status(HTTP.SUCCESS).send({
      status: false,
      code: HTTP.SUCCESS,
      error: error,
      data: {},
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (newPassword != confirmPassword) {
      return res.status(HTTP.SUCCESS).send({
        status: true,
        code: HTTP.SUCCESS,
        message: "Password has been Not Match",
        data: {},
      });
    }

    let updateData = await User.findOne({ email: email, status: true });
    if (updateData) {
      const pass = await bcrypt.hash(newPassword, 5);

      let data = await User.findByIdAndUpdate(
        { _id: updateData._id },
        { password: pass },
        { new: true }
      );
      return res.status(HTTP.SUCCESS).send({
        status: true,
        code: HTTP.SUCCESS,
        message: "password has been change",
        data: data,
      });
    }
  } catch (error) {
    return res.status(HTTP.BAD_REQUEST).send({
      status: true,
      code: HTTP.BAD_REQUEST,
      error: "error",
      data: {},
    });
  }
};

const forgot = (req, res) => {
  res.render("forgot");
};

const Verify = (req, res) => {
  res.render("verify");
};

const reset = (req, res) => {
  res.render("reset");
};



module.exports = {
  loginUser,
  loginGet,
  signupGet,
  registerUser,
  forgot,
  Verify,
  reset,
  forgotPassword,
  otpVerify,
  resetPassword,
};
