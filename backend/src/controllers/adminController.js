const AppDataSource = require("../config/db");

exports.getStats = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository("Claim");

    const stats = {
      total: await repo.count(),
      submitted: await repo.countBy({ status: "submitted" }),
      under_review: await repo.countBy({ status: "under review" }),
      info_required: await repo.countBy({ status: "additional info required" }),
      approved: await repo.countBy({ status: "approved" }),
      rejected: await repo.countBy({ status: "rejected" }),
      settled: await repo.countBy({ status: "settled" }),
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};
