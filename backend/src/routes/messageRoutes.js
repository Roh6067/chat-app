import express from "express";
import { getAllContacts, getMessagesByUserId, sendMessage, getChatMessages  } from "../controller/message.controller.js";
import { protectedRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
const router = express.Router();

router.use(arcjetProtection, protectedRoute);

router.get("/contact", getAllContacts);
router.get("/chats", getChatMessages);
router.get("/:id", getMessagesByUserId);
router.post("/send/:id", sendMessage);


export default router;