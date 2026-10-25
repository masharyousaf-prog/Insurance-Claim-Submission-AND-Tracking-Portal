const AppDataSource = require("../config/db");
const asyncHandler = require("../middleware/asyncHandler");

// 🔑 CRITICAL FIX: Import the explicit Comment EntitySchema object
const Comment = require("../entities/Comment");

exports.addComment = asyncHandler(async (req, res) => {
  // 🔑 CRITICAL FIX: Guard database initialization for serverless contexts
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  const repo = AppDataSource.getRepository(Comment);

  if (!req.body.message || !req.body.claimId) {
    return res.status(400).json({ msg: "Message and claimId are required" });
  }

  const comment = repo.create({
    message: req.body.message,
    claim: { id: req.body.claimId },
    user: { id: req.user.id },
  });

  await repo.save(comment);
  return res.status(201).json(comment);
});

exports.getComments = asyncHandler(async (req, res) => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  const repo = AppDataSource.getRepository(Comment);
  const comments = await repo.find({
    where: { claim: { id: req.params.claimId } },
    order: { createdAt: "ASC" }, 
  });
  return res.json(comments);
});