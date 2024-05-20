const jwt = require("jsonwebtoken");
const  User  = require("../models/user.model");
const HTTP = require("../helper/http");
const { body, validationResult } = require('express-validator');
const AccountType=require("../models/accountType.model")
const { mongoose } = require("mongoose");

const accountTypeValidation=[
    body('description').trim().isString().withMessage('description must be a string'),
    body('account_type').trim().isString().withMessage('name must be a string')
    .isLength({ min: 3 }).withMessage('name must be at least 3 characters long')
    .custom(async (value) => {
      const accounts= await AccountType.findOne({ account_type: value });
      if (accounts) {
        throw new Error('name already exists');
      }
   }),
  (req, res,next) => {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(HTTP.SUCCESS).send({
          status: true,
          code: HTTP.SUCCESS,
          message: "validaton error",
          error: error.array()[0].msg,
        });
      }
      next()
    }
  ]

  const categoryValidation=[
    body('description').trim().isString().withMessage('description must be a string'),
    body('title').trim().isString().withMessage('name must be a string')
    .isLength({ min: 3 }).withMessage('name must be at least 3 characters long')
    .custom(async (value) => {
      const accounts= await AccountType.findOne({ account_type: value });
      if (accounts) {
        throw new Error('name already exists');
      }
   }),
  (req, res,next) => {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(HTTP.SUCCESS).send({
          status: true,
          code: HTTP.SUCCESS,
          message: "validaton error",
          error: error.array()[0].msg,
        });
      }
      next()
    }
  ]

const hasRole = (user, roles) => {
    if (roles && roles.length) {
        return [].includes(user.role)
            ? true
            : roles.indexOf(user.role) > -1;
    }
    return false;
};

exports.authenticateJWT = function (roles, force = true) {
    return function (req, res, next) {
        const secretOrKey = process.env.JWT_SECRET;
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(" ")[1];
            jwt.verify(token, secretOrKey, async (err, jwtPayload) => {
                if (err) return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.UNAUTHORIZED, 'message': 'Please authenticate your-self', data: {} });

                if (jwtPayload) {
                    const existingUser = await User.findById({ _id: jwtPayload.id });
                    if (existingUser && hasRole(existingUser, roles)) { 
                        req.authenticated = true;
                        req.user = existingUser;

                        next();
                    } else {
                        return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.FORBIDDEN, 'message': 'You don t have sufficient permissions to access this endpoint', data: {} });
                    }
                } else if (!force) {
                    next();
                } else {
                    return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.FORBIDDEN, 'message': 'You dont have sufficient permissions to access this endpoint', data: {} });
                }
            });
        } else if (!force) {
            next();
        } else {
            return res.status(HTTP.SUCCESS).send({ 'status': false, 'code': HTTP.UNAUTHORIZED, 'message': 'Please authenticate your-self', data: {} });
        }
    };
};

module.exports={accountTypeValidation,categoryValidation}
