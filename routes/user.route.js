const Router = require("express");
const router = Router();
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

  router.post("/account-type/add",upload,accountTypeControllers.addAccountType)
  router.get("/account-type/get",accountTypeControllers.accountTypeGet)
  router.post("/account-type/update",upload,accountTypeControllers.accountTypeUpdate)
  router.get("/account-type/delete",accountTypeControllers.accountTypeDelete)
  router.get("/admin/deshboard",accountTypeControllers.homeDeshboard)
  router.get("/account-type/list",accountTypeControllers.accountTypes)
  router.get("/account-type/edit",accountTypeControllers.accountEdit)
  router.get("/account-type/add",accountTypeControllers.uiAdd)

const categoryControllers=require("../controllers/category.controller")

router.post("/catgory/add",upload,categoryControllers.addCategory)
router.get("/category/get",categoryControllers.getCategory)
router.put("/category/update",upload,categoryControllers.updateCategory)
router.delete("/category/delete",categoryControllers.categoryDelete)
router.get("/category/list",categoryControllers.getCategoryList)


const topicControllers=require("../controllers/topic.controller")

router.post("/topic/add",topicControllers.addTopic)

module.exports = router;

