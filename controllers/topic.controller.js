const Topic=require("../models/topic.model")
const HTTP = require("../helper/http");

const addTopic=async(req,res)=>{
try{
    const body=req.body
    const addTopics={
        name:body.name,
        description:body.description,
        // access:body.access,
        // access_code:body.access_code,
        // regional_relevance:body.regional_relevance,
        // color_code:body.color_code,
        // search_tags:body.search_tags,
        // game_mode:body.game_mode,
        // match_format:body.match_format,
        // number_of_questions:body.number_of_questions,
        // time_for_question:body.time_for_question,
        // learning_point:body.learning_point,
        // experience_point:body.experience_point
    }
    console.log(addTopics);
    const data=await Topic.create(addTopics)
    return res.status(HTTP.SUCCESS).send({
        status: true,
        code: HTTP.SUCCESS,
        message: "Successfully",
        data: data,
      });
}
    catch (error) {
        console.log(error);
        return res.status(HTTP.BAD_REQUEST).send({
          status: false,
          code: HTTP.BAD_REQUEST,
          error: "error",
          data: {},
        });
      }
}
module.exports={addTopic}