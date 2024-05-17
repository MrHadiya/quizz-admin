const Category = require("../models/category.model");
const HTTP = require("../helper/http");
const path = require("path");
const fs = require("fs");

const addCategory = async (req, res) => {
  try {
    const { account_type_id, title, description, color_code, created_by } =
      req.body;
    const addCategory = {
      icon: req.file.filename,
      account_type_id: account_type_id,
      title: title,
      description: description,
      color_code: color_code,
      created_by: created_by,
    };
    const data = await Category.create(addCategory);
    if (!data) return res.redirect("/category/add");
    return res.redirect("/category/list");
    // return res.status(HTTP.SUCCESS).send({
    //   status: true,
    //   code: HTTP.SUCCESS,
    //   message: "add Successfully",
    //   data: data,
    // });
  } catch (error) {
    return res.redirect("/category/add");
  //   console.log(error);
  //   return res.status(HTTP.BAD_REQUEST).send({
  //     status: false,
  //     code: HTTP.BAD_REQUEST,
  //     error: error,
  //     data: {},
  //   });
  }
};

const getCategory = async (req, res) => {
  try {
    const { category_id } = req.query;
    if (category_id) {
      var data = await Category.findOne({ _id: category_id }).populate(
        "account_type_id"
      );
    } else {
      var data = await Category.find();
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
      error: error,
      data: {},
    });
  }
};
const updateCategory = async (req, res) => {
  try {
    const { title, description, _id } = req.body;
    const categorys = await Category.findById({ _id: _id });
    if (!categorys) {
      return res.status(HTTP.BAD_REQUEST).send({
        status: false,
        code: HTTP.BAD_REQUEST,
        message: "category not found",
      });
    }
    let updatedDetails = {
      title: title,
      description: description,
    };
    if (req.file) {
      if (categorys.icon) {
        const oldFilePath = path.join(__dirname, "images", categorys.icon);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      updatedDetails.icon = req.file.filename;
    }
    await Category.findByIdAndUpdate(_id, updatedDetails, { new: true });
    return res.redirect("/category/list");
  } catch (error) {
    return res.status(HTTP.BAD_REQUEST).send({
      status: false,
      code: HTTP.BAD_REQUEST,
      error: error,
      data: {},
    });
  }
};

const categoryDelete = async (req, res) => {
  try {
    const { category_id } = req.query;
    await Category.findByIdAndDelete({ _id: category_id });
    return res.status(HTTP.SUCCESS).send({
      status: true,
      code: HTTP.SUCCESS,
      message: "delete Successfully",
      data: {},
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

const getCategoryList = async (req, res) => {
  try {
    let category = await Category.find();
    res.render("category", { category });
  } catch (error) {
    return res.status(HTTP.BAD_REQUEST).send({
      status: false,
      code: HTTP.BAD_REQUEST,
      error: "error",
      data: {},
    });
  }
};
const categoryAddUi = async (req, res) => {
  res.render("categoryadd");
};
const categoryEdit = async (req, res) => {
  const { category_id } = req.query;
  const categorys = await Category.findOneAndUpdate(
    { _id: category_id },
    req.body,
    { new: true }
  );
  res.render("categoryedit", { categorys });
};

module.exports = {
  addCategory,
  getCategory,
  updateCategory,
  categoryDelete,
  getCategoryList,
  categoryAddUi,
  categoryEdit
};
