const Router = require("express");
const router = Router();
const {accountTypeValidation,categoryValidation}=require("../middleware/auth")
const multer=require("multer")

const adminController=require("../controllers/user.controller")

router.post("/admin/signup",adminController.registerUser)
router.get("/admin/signup",adminController.signupGet)
router.get("/admin/login",adminController.loginGet)
router.post("/admin/login",adminController.loginUser)
router.post("/admin/forgot-password",adminController.forgotPassword);
router.get("/admin/forgot",adminController.forgot)
router.post("/admin/otpverify",adminController.otpVerify)
router.get("/admin/verify",adminController.Verify)
router.post("/admin/resetpassword",adminController.resetPassword);
router.get("/admin/reset",adminController.reset)

const accountTypeControllers=require("../controllers/accountType.controller")

const store = multer.diskStorage({
    destination: "public/images",
    filename: (req, File, cb) => {
      cb(null, Date.now() + File.originalname);
    },
  });
  const upload = multer({
    storage: store,
  }).single("icon");

  router.post("/account-type/add",upload,accountTypeValidation,accountTypeControllers.addAccountType)
  router.get("/account-type/get",accountTypeControllers.accountTypeGet)
  router.post("/account-type/update",upload,accountTypeValidation,accountTypeControllers.accountTypeUpdate)
  router.get("/account-type/delete",accountTypeControllers.accountTypeDelete)
  router.get("/admin/deshboard",accountTypeControllers.homeDeshboard)
  router.get("/account-type/list",accountTypeControllers.accountTypes)
  router.get("/account-type/edit",accountTypeControllers.accountEdit)
  router.get("/account-type/add",accountTypeControllers.uiAdd)
  router.get("/account-type/search",accountTypeControllers.searchAccountType)

const categoryControllers=require("../controllers/category.controller")

router.post("/catgory/add",upload,categoryControllers.addCategory)
router.get("/category/get",categoryControllers.getCategory)
router.post("/category/update",upload,categoryControllers.updateCategory)
router.get("/category/delete",categoryControllers.categoryDelete)
router.get("/category/list",categoryControllers.getCategoryList)
router.get("/category/add",categoryControllers.categoryAddUi)
router.get("/category/edit",categoryControllers.categoryEdit)



const topicControllers=require("../controllers/topic.controller")

router.post("/topic/add",upload,topicControllers.addTopic)
router.get("/topic/get",topicControllers.getTopic)
router.post("/topic/update",upload,topicControllers.topicUpdate)
router.get("/topic/delete",topicControllers.topicDelete)
router.get("/topic/list",topicControllers.topicList)
router.get("/topic/add",topicControllers.topicAddUi)
router.get("/topic/edit",topicControllers.topicEdit)


module.exports = router;

