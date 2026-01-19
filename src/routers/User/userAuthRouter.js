import express from "express";
import authController, {
  authLogin,
  authRegister,
} from "../../Controllers/User/UserAuthControllers.js";

const router = express.Router();

router.post("/auth/register", authRegister);
router.post("/auth/login", authLogin);

export default router;
