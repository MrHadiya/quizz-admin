const AccountType=require("../models/accountType.model")
const HTTP = require("../helper/http");
const path = require("path");
const fs = require("fs");

const addAccountType=async(req,res)=>{
    try{
        const {account_type,description}=req.body
        const accountDetalis={
            icon: req.file.filename,
            account_type:account_type,
            description:description
        }
        const data=await AccountType.create(accountDetalis)
        return res.status(HTTP.SUCCESS).send({
            status: true,
            code: HTTP.SUCCESS,
            message: "Add Successfully",
            data: data,
          });
        
    }catch (error) {
      console.log(error);
        return res.status(HTTP.BAD_REQUEST).send({
          status: false,
          code: HTTP.BAD_REQUEST,
          error: "error",
          data: {},
        });
      }
}

const accountTypeGet=async(req,res)=>{
    try{
        const {accountType_id}=req.query
        if(accountType_id){
        var data=await AccountType.findOne({_id:accountType_id})
        }
       else{
        var data=await AccountType.find()
       }
        return res.status(HTTP.SUCCESS).send({
            status: true,
            code: HTTP.SUCCESS,
            message: "Get Data",
            data:data,
          });
    }
    catch (error) {
        return res.status(HTTP.BAD_REQUEST).send({
          status: false,
          code: HTTP.BAD_REQUEST,
          error: "error",
          data: {},
        });
      }
}
const accountTypeUpdate=async(req,res)=>{
    try{
      // console.log(req.body);
      // console.log(req.file);
      //   const {account_type,description}=req.body
        // const {accounttype_id}=req.query
        // console.log(accountType_id);
      //     const accountDetalies={
      //       account_type:account_type,
      //       description:description
      //     }
      //     if(req.file){
      //     icon=req.file.filename;
      //       const imgUpdate=await AccountType.findById(accounttype_id)
      //       if (imgUpdate.icon) {
      //           fs.unlinkSync(imgUpdate.icon);
      //         }
      //     }
      //     const updateData = await AccountType.findOneAndUpdate({ _id: accounttype_id }, accountDetalies, {
      //       new: true,})
      //       return res.status(HTTP.SUCCESS).send({
      //           status: true,
      //           code: HTTP.SUCCESS,
      //           mesaage: "Updated Successfully",
      //           data: updateData,
      //         });
    // });
    const { accountType_id } = req.query;
    const { account_type, description } = req.body;

    const accountType = await AccountType.findById({_id:accountType_id});
    if (!accountType) {
      return res.status(HTTP.BAD_REQUEST).send({
        status: false,
        code: HTTP.BAD_REQUEST,
        message: 'Account type not found',
      });
    }

    let updatedDetails = {
      account_type: account_type,
      description: description,
    };
    if (req.file) {
      if (accountType.icon) {
        const oldFilePath = path.join(__dirname, 'images', accountType.icon);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      updatedDetails.icon = req.file.filename;
    }

    await accountType.update(updatedDetails);

    return res.status(HTTP.SUCCESS).send({
      status: true,
      code: HTTP.SUCCESS,
      message: 'Updated Successfully',
      data: accountType,
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

const accountTypeDelete=async(req,res)=>{
    try{
        const {accountType_id}=req.query
        await AccountType.findByIdAndDelete({_id:accountType_id})
        return res.status(HTTP.SUCCESS).send({
            status: true,
            code: HTTP.SUCCESS,
            message: "delete Successfully",
            data: {},
          });
    }
    catch (error) {
        return res.status(HTTP.BAD_REQUEST).send({
          status: false,
          code: HTTP.BAD_REQUEST,
          error: "error",
          data: {},
        });
      }
}

const homeDeshboard =async (req, res) => {
  res.render("main-deshboard")
};
const accountEdit=async(req,res)=>{
  res.render("accountedit")
}
const accountTypes =async (req, res) => {
  try{
   let  account = await AccountType.find();
   res.render("account", { account });
  }
  catch(error){
   console.log(error);
   return res.status(HTTP.BAD_REQUEST).send({
     status: false,
     code: HTTP.BAD_REQUEST,
     error: "error",
     data: {},
   });
  }
 };



module.exports={addAccountType,accountTypeGet,accountTypeUpdate,accountTypeDelete,homeDeshboard,accountTypes,accountEdit}