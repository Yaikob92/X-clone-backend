import { getAuth } from "@clerk/express";
import asyncHandler from "express-async-handler";
import Post from "../models/post.model";
import User from "../models/user.model";

export const getComment = asyncHandler(async (req, res) => {
  const { postId } = getAuth(req);

  const comments = await Comment.find({ post: postId })
    .sort({ createdAt: -1 })
    .populate("user", "username firstName lastName profilePicture");

  res.status(200).json({ comments });
});

export const createComment = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { postId } = req.params;
  const { content } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ error: "Comment is required" });
  }

  const user = await User.findOne({ clerkId: userId });
  const post = await Post.findById(postId);

  if (!user || !post)
    return res.status(404).json({ error: "User or post not found" });

  const comment = Comment.creat({
    user: user._id,
    post: postId,
    content,
  });

  //   link the comment to the post

  await Post.findByIdAndUpdate(postId, {
    $push: { comments: commen._id },
  });

  //   create notification if not commenting on own post
  if (post.user.toString() !== user._id.toString()) {
    await Notification.create({
      from: user._id,
      to: post.user,
      type: "comment",
      post: postId,
      comment: comment._id,
    });
  }
  res.status(201).json({ comment });
});

export const deleteComment = asyncHandler(async (req, res) => {
  const { userId } = getAuth(req);
  const { commentId } = req.params;

  const user = await User.findOne({ clerkId: userId });
  const comment = await Comment.findById(commentId);

  if (!user || !comment) {
    return res.status(404).json({ error: "User or comment not found" });
  }

  if (comment.user.toString() !== user._id.toString()) {
    return res
      .status(403)
      .json({ error: "You can only delete you own comments" });
  }

  //   remove comment from post
  await Post.findByIdAndDelete(comment.post, {
    $pull: { comments: commentId },
  });

  //   delete the comment
  await Comment.findByIdAndDelete(commentId);

  res.status(200).json({ message: "Comment deleted succesfully" });
});
