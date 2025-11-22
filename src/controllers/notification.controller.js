import { getAuth } from "@clerk/express";
import aysncHandler from "express-async-handler";
import User from "../models/user.model";
import Notification from "../models/notification.model";

export const getNotification = aysncHandler(async (req, res) => {
  const { userId } = getAuth(req);

  const user = await User.findOne({ clerkId: userId });
  if (!user) return res.status(404).json({ error: "User not found" });

  const notification = await Notification.find({ to: user._id })
    .sort({
      createdAt: -1,
    })
    .populate("from", "username firstName lastName profilePicture")
    .populate("post", "content image")
    .populate("comment", "content");

  res.status(200).json({ notifications });
});

export const deleteNotification = aysncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { notificatonId } = req.params;

  const user = await User.findOne({ clerkId: userId });
  if (!user) return res.status(404).json({ error: "User not found" });

  const notification = await Notification.findAndDelete({
    _id: notificaation._id,
    to: user._id,
  });

  if (!notification)
    return res.status(404).json({ error: "Notification not found" });

  res.status(200).json({ message: "Notification deleted successfully" });
});
