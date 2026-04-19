const AppDataSource = require("../config/db");
const asyncHandler = require("../middleware/asyncHandler");

exports.addComment = asyncHandler(async (req, res, next) => {
  const repo = AppDataSource.getRepository("Comment");

  if (!req.body.message || !req.body.claimId) {
    return res.status(400).json({ msg: "Message and claimId are required" });
  }

  const comment = repo.create({
    message: req.body.message,
    claim: { id: req.body.claimId },
    user: { id: req.user.id },
  });

  await repo.save(comment);
  res.status(201).json(comment);
});

exports.getComments = asyncHandler(async (req, res, next) => {
  const repo = AppDataSource.getRepository("Comment");
  const comments = await repo.find({
    where: { claim: { id: req.params.claimId } },
    order: { createdAt: "ASC" }, // Best practice: chronological timeline
  });
  res.json(comments);
});
