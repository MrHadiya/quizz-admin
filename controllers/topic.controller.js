const Topic=require("../models/topic.model")
const HTTP=require("../helper/http")
const path = require("path");
const fs = require("fs");

const addTopic=async(req,res)=>{
  try{
    const body=req.body
    const topiAdd={
      name:body.name,
      icon: req.file.filename,
      description:body.description,
      access:body.access,
      access_code:body.access_code,
      regional_relevance:body.regional_relevance,
      search_tags:body.search_tags,
      status:body.status,
      color_code:body.color_code,
      game_mode:body.game_mode,
      match_format:body.match_format,
      number_of_questions:body.number_of_questions,
      time_for_question:body.time_for_question,
      learning_point:body.learning_point,
      experience_point:body.experience_point
    }
    const data=await Topic.create(topiAdd)
    if (!data) return res.redirect("/topic/add");
    return res.redirect("/topic/list");
  }
  catch (error) {
    return res.redirect("/topic/add");
}
}

const getTopic=async(req,res)=>{
  try {
    const { topic_id } = req.query;
    if (topic_id) {
      var data = await Topic.findOne({ _id: topic_id }).populate("account_type_id").populate("category_id");
    } else {
      var data = await Topic.find();
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
}

const topicUpdate=async(req,res)=>{
  try{
      const { name, description, _id,access,access_code,regional_relevance,search_tags,game_mode,match_format,number_of_questions,time_for_question,learning_point,experience_point,color_code } = req.body;
      const Topics = await Topic.findById({ _id: _id });
      if (!Topics) {
        return res.status(HTTP.BAD_REQUEST).send({
          status: false,
          code: HTTP.BAD_REQUEST,
          message: "Topics not found",
        });
      }
      let updatedDetails = {
        name: name,
        description: description,
        access:access,
        access_code:access_code,
        regional_relevance:regional_relevance,
        search_tags:search_tags,
        game_mode:game_mode,
        match_format:match_format,
        number_of_questions:number_of_questions,
        time_for_question:time_for_question,
        learning_point:learning_point,
        experience_point:experience_point,
        color_code:color_code
      };
      if (req.file) {
        if (Topics.icon) {
          const oldFilePath = path.join(__dirname, "images", Topics.icon);
          if (fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
        }
        updatedDetails.icon = req.file.filename;
      }
      await Topic.findByIdAndUpdate(_id, updatedDetails, { new: true });
      return res.redirect("/topic/list");
  }catch (error) {
    console.log(error);
    return res.status(HTTP.BAD_REQUEST).send({
      status: false,
      code: HTTP.BAD_REQUEST,
      error: error,
      data: {},
    });
  }
}

const topicDelete=async(req,res)=>{
  try {
    const { topic_id } = req.query;
    await Topic.findByIdAndDelete({ _id: topic_id });
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
}
const topicList = async (req, res) => {
  try {
    let topic = await Topic.find();
    res.render("topic", { topic });
  } catch (error) {
    return res.status(HTTP.BAD_REQUEST).send({
      status: false,
      code: HTTP.BAD_REQUEST,
      error: "error",
      data: {},
    });
  }
};

const topicAddUi = async (req, res) => {
  res.render("topicadd");
};

const topicEdit = async (req, res) => {
  const { topic_id } = req.query;
  const topics = await Topic.findOneAndUpdate(
    { _id: topic_id },
    req.body,
    { new: true }
  );
  res.render("topicedit", { topics });
};


module.exports={addTopic,getTopic,topicUpdate,topicDelete,topicList,topicAddUi,topicUpdate,topicEdit}