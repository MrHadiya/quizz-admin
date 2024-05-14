const Category = require("../models/category.model");
const HTTP = require("../helper/http");
const path = require("path");
const fs = require("fs");

const addCategory = async (req, res) => {
  try {
    const { account_type_id, title, description, color_code, created_by } =
      req.body;

    // function convertToParentDirectory(filePath) {
    //     return path.dirname(filePath);
    //   }
    //   const filePath = __dirname;
    //   const parentDirectory = convertToParentDirectory(filePath);

    const addCategory = {
      icon: req.file.filename,
      account_type_id: account_type_id,
      title: title,
      description: description,
      color_code: color_code,
      created_by: created_by,
    };
    const data = await Category.create(addCategory);
    return res.status(HTTP.SUCCESS).send({
      status: true,
      code: HTTP.SUCCESS,
      message: "add Successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(HTTP.BAD_REQUEST).send({
      status: false,
      code: HTTP.BAD_REQUEST,
      error: error,
      data: {},
    });
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
    const { title, description, color_code } = req.body;
    const { category_id } = req.query;
    function convertToParentDirectory(filePath) {
      return path.dirname(filePath);
    }
    const filePath = __dirname;
    const parentDirectory = convertToParentDirectory(filePath);
    const categoryDetalies = {
      title: title,
      description: description,
      color_code: color_code,
    };
    if (req.file) {
      categoryDetalies.icon = parentDirectory + "/" + req.file.path;
      const imgUpdate = await Category.findById(category_id);
      if (imgUpdate.icon) {
        fs.unlinkSync(imgUpdate.icon);
      }
    }
    const updateData = await Category.findOneAndUpdate(
      { _id: category_id },
      categoryDetalies,
      {
        new: true,
      }
    );
    return res.status(HTTP.SUCCESS).send({
      status: true,
      code: HTTP.SUCCESS,
      mesaage: "Updated Successfully",
      data: updateData,
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

module.exports = {
  addCategory,
  getCategory,
  updateCategory,
  categoryDelete,
  getCategoryList,
};
