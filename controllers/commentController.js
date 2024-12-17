import commentModel from "../models/commentModel.js";
import jwt from "jsonwebtoken";

const addComment = async (req, res) => {
  try {
    if (!req.cookies.SessionID) {
      return res.status(401).json({
        success: false,
        message: "Bạn không có quyền thực hiện thao tác này",
      });
    }
    const decoded = jwt.verify(
      req.cookies.SessionID,
      process.env.SECRET_ACCESS_TOKEN
    );
    const { content, point } = req.body;
    const newComment = new commentModel({
      content,
      point,
      customerId: decoded.id,
    });
    await newComment.save();
    return res.status(200).json({
      success: true,
      message: "Thêm bình luận thành công",
    });
  } catch (error) {
    console.log(error);
    return res.json({ message: error.message });
  }
};

const editComment = async (req, res) => {
  try {
    const { content, point, commentId } = req.body;
    const comment = await commentModel.findById(commentId);
    comment.content = content;
    comment.point = point;
    comment.isEdited = true;
    await comment.save();
    return res.status(200).json({
      success: true,
      message: "Sửa bình luận thành công",
    });
  } catch (error) {
    console.log(error);
  }
};

const fetchAllComments = async (req, res) => {
  const comments = await commentModel.find();
  return res.status(200).json({
    comments,
  });
};

const fetchOwnComments = async (req, res) => {
  const decoded = jwt.verify(
    req.cookies.SessionID,
    process.env.SECRET_ACCESS_TOKEN
  );
  const comments = await commentModel.find({ customerId: decoded.id });
  return res.status(200).json({
    comments,
  });
};

const fetchWishedComment = async (req, res) => {
  const { commentId } = req.body;
  const comment = await commentModel.findById(commentId);
  return res.status(200).json({ comment });
};

const deleteComment = async (req, res) => {
  const { commentId } = req.body;
  await commentModel.findByIdAndDelete(commentId);
  return res.status(200).json({
    success: true,
    message: "Xóa bình luận thành công",
  });
};

export {
  addComment,
  fetchOwnComments,
  fetchAllComments,
  fetchWishedComment,
  editComment,
  deleteComment,
};
