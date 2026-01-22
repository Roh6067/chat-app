import { set } from "mongoose";
import cloudinary from "../lib/cloudinary.js";
import Message from  "../models/message.js";
import User from "../models/user.js";

export const getAllContacts = async (req, res) => {
    try {
        // Logic to fetch all contacts for the user
        const loggedInUserId = req.user._id;
        const filteredusers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json({ filteredusers });
    } catch (error) {
        console.log("error in getAllContacts: ", error);
        res.status(500).json({ message: "Server Error", error });
    }
};

export const getMessagesByUserId = async (req, res) => {
    try {
        const myId = req.user._id;
        const { id:userToChatId } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        }).sort({ createdAt: 1 }); // Sort messages by creation time in ascending order

        res.status(200).json(messages);
    }catch (error) {
        console.log("error in getMessages controller: ", error);
        res.status(500).json({ error: "internal Server Error", error });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;       
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        if (!text && !image) {
            return res.status(400).json({ message: "Text or image is required" });
        }

        if(senderId.equals(receiverId)){
            return res.status(400).json({ message: "You cannot send message to yourself" });
        }
        const receiverExists = await User.exists({ _id: receiverId });
        if(!receiverExists){
            return res.status(404).json({ message: "Receiver user not found" });
        }
        
        let imageUrl;
        if(image){
            // upload image 64 to cloudinary
            const uploadedImage = await cloudinary.uploader.upload(image);
            imageUrl = uploadedImage.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });
        await newMessage.save();

        // send message in real time using socket.io
        res.status(201).json(newMessage);

    }catch (error) {
        console.log("error in sendMessage controller: ", error);
        res.status(500).json({ error: "internal Server Error", error });
    }
};

export const getChatMessages = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        // Find all unique user IDs that the logged-in user has chatted with
        const messages = await Message.find({
            $or: [
                { senderId: loggedInUserId },
                { receiverId: loggedInUserId }
            ]
        });

        const chatPatnerIds = [
                ...new Set(
                messages.map((msg) => 
                msg.senderId.toString() === loggedInUserId.toString()
                ? msg.receiverId.toString()
                : msg.senderId.toString()
                )
            ),
        ];

        const chatPatner = await User.find({ _id: { $in: chatPatnerIds } }).select("-password");

        res.status(200).json({ chatPatner });
    }
    catch (error) {
        console.log("error in getChatMessages controller: ", error);
        res.status(500).json({ error: "internal Server Error", error });
    }
}