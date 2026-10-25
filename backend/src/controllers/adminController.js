const AppDataSource = require("../config/db");
const bcrypt = require("bcrypt"); 
const Claim = require("../entities/Claim");
const User = require("../entities/User");

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

    const rawOfficerStats = await repo.createQueryBuilder("claim")
      .leftJoin("claim.assignedOfficer", "officer")
      .where("officer.id IS NOT NULL")
      .select("officer.name", "officerName")
      .addSelect("COUNT(claim.id)", "totalProcessed")
      .addSelect("SUM(CASE WHEN claim.status IN ('submitted', 'under review', 'additional info required') THEN 1 ELSE 0 END)", "pending")
      .addSelect("SUM(CASE WHEN claim.status = 'approved' THEN 1 ELSE 0 END)", "approved")
      .addSelect("SUM(CASE WHEN claim.status = 'rejected' THEN 1 ELSE 0 END)", "rejected")
      .addSelect("SUM(CASE WHEN claim.status = 'settled' THEN 1 ELSE 0 END)", "settled")
      .groupBy("officer.id")
      .addGroupBy("officer.name")
      .getRawMany();

    const officerStats = rawOfficerStats.map(stat => ({
      officerName: stat.officerName,
      totalProcessed: parseInt(stat.totalProcessed) || 0,
      pending: parseInt(stat.pending) || 0,
      approved: parseInt(stat.approved) || 0,
      rejected: parseInt(stat.rejected) || 0,
      settled: parseInt(stat.settled) || 0,
    }));

    return res.json({ ...stats, officerStats });
  } catch (error) {
    console.error("Stats Error:", error);
    return res.status(500).json({ error: "Failed to fetch stats" });
  }
};

exports.createOfficer = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository("User");
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please provide all required fields" });
    }

    const existingUser = await repo.findOneBy({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = repo.create({
      name,
      email,
      password: hashedPassword,
      role: "officer",
    });

    await repo.save(user);
    delete user.password;
    return res.status(201).json({ msg: "Officer account created successfully", user });
  } catch (error) {
    console.error("Create Officer Error:", error);
    return res.status(500).json({ error: "Failed to create officer account" });
  }
};