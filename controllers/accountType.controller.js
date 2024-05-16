const AccountType = require("../models/accountType.model");
const HTTP = require("../helper/http");
const path = require("path");
const fs = require("fs");
const Fuse = require("fuse.js");

const addAccountType = async (req, res) => {
  try {
    const { account_type, description } = req.body;
    const accountDetalis = {
      icon: req.file.filename,
      account_type: account_type,
      description: description,
    };
    const data = await AccountType.create(accountDetalis);
    if (!data) return res.redirect("/account-type/add");
    return res.redirect("/account-type/list");
  } catch (error) {
    return res.redirect("/account-type/add");
  }
};

const accountTypeGet = async (req, res) => {
  try {
    const { accountType_id } = req.query;
    if (accountType_id) {
      var data = await AccountType.findOne({ _id: accountType_id });
    } else {
      var data = await AccountType.find();
    }
    return res.status(HTTP.SUCCESS).send({
      status: true,
      code: HTTP.SUCCESS,
      message: "Get Data",
      data: data,
    });
  } catch (error) {
    return res.status(HTTP.BAD_REQUEST).send({
      status: false,
      code: HTTP.BAD_REQUEST,
      error: "error",
      data: {},
    });
  }
};
const accountTypeUpdate = async (req, res) => {
  try {
    const { account_type, description, _id } = req.body;
    const accountType = await AccountType.findById({ _id: _id });
    if (!accountType) {
      return res.status(HTTP.BAD_REQUEST).send({
        status: false,
        code: HTTP.BAD_REQUEST,
        message: "Account type not found",
      });
    }
    let updatedDetails = {
      account_type: account_type,
      description: description,
    };
    if (req.file) {
      if (accountType.icon) {
        const oldFilePath = path.join(__dirname, "images", accountType.icon);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      updatedDetails.icon = req.file.filename;
    }
    await AccountType.findByIdAndUpdate(_id, updatedDetails, { new: true });
    return res.redirect("/account-type/list");
  } catch (error) {
    return res.status(HTTP.BAD_REQUEST).send({
      status: false,
      code: HTTP.BAD_REQUEST,
      error: error,
      data: {},
    });
  }
};
const accountTypeDelete = async (req, res) => {
  try {
    const { accountType_id } = req.query;
    await AccountType.findByIdAndDelete({ _id: accountType_id });
    return res.status(HTTP.SUCCESS).send({
      status: true,
      code: HTTP.SUCCESS,
      message: "delete Successfully",
      data: {},
    });
  } catch (error) {
    return res.status(HTTP.BAD_REQUEST).send({
      status: false,
      code: HTTP.BAD_REQUEST,
      error: "error",
      data: {},
    });
  }
};

const homeDeshboard = async (req, res) => {
  res.render("main-deshboard");
};
const accountEdit = async (req, res) => {
  const { accountType_id } = req.query;
  const accounts = await AccountType.findOneAndUpdate(
    { _id: accountType_id },
    req.body,
    { new: true }
  );
  res.render("accountedit", { accounts });
};
const accountTypes = async (req, res) => {
  try {
    let account = await AccountType.find();
    res.render("account", { account });
  } catch (error) {
    console.log(error);
    return res.status(HTTP.BAD_REQUEST).send({
      status: false,
      code: HTTP.BAD_REQUEST,
      error: "error",
      data: {},
    });
  }
};
const uiAdd = async (req, res) => {
  res.render("accountadd");
};

const searchAccountType = async (req, res) => {
  try {
    console.log(req.query.search);
    let data = await AccountType.find({
      $or: [{ account_type: { $regex: req.query.search } }],
    });
    console.log(data,1);
    return res.status(HTTP.SUCCESS).send({
      status: true,
      code: HTTP.SUCCESS,
      message: "Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(HTTP.BAD_REQUEST).send({
      status: false,
      code: HTTP.BAD_REQUEST,
      error: "error",
      data: {},
    });
  }
};

module.exports = {
  addAccountType,
  accountTypeGet,
  accountTypeUpdate,
  accountTypeDelete,
  homeDeshboard,
  accountTypes,
  accountEdit,
  uiAdd,
  searchAccountType,
};
