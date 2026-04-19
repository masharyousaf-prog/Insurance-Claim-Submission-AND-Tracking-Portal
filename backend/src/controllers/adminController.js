const AppDataSource = require("../config/db");
const bcrypt = require("bcrypt"); 

exports.getStats = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository("Claim");

    // 1. Get the system-wide total stats
    const stats = {
      total: await repo.count(),
      submitted: await repo.countBy({ status: "submitted" }),
      under_review: await repo.countBy({ status: "under review" }),
      info_required: await repo.countBy({ status: "additional info required" }),
      approved: await repo.countBy({ status: "approved" }),
      rejected: await repo.countBy({ status: "rejected" }),
      settled: await repo.countBy({ status: "settled" }),
    };

    // 2. Build the aggregate query for individual officers (New Code)
    const rawOfficerStats = await repo.createQueryBuilder("claim")
      .leftJoin("claim.assignedOfficer", "officer")
      // We only want to list claims that actually have an officer
      .where("officer.id IS NOT NULL")
      .select("officer.name", "officerName")
      // Count total claims handled by this officer
      .addSelect("COUNT(claim.id)", "totalProcessed")
      // Sum the pending ones
      .addSelect("SUM(CASE WHEN claim.status IN ('submitted', 'under review', 'additional info required') THEN 1 ELSE 0 END)", "pending")
      // Sum the approved ones
      .addSelect("SUM(CASE WHEN claim.status = 'approved' THEN 1 ELSE 0 END)", "approved")
      // Sum the rejected ones
      .addSelect("SUM(CASE WHEN claim.status = 'rejected' THEN 1 ELSE 0 END)", "rejected")
      // Sum the settled ones
      .addSelect("SUM(CASE WHEN claim.status = 'settled' THEN 1 ELSE 0 END)", "settled")
      .groupBy("officer.id")
      .addGroupBy("officer.name")
      .getRawMany();

    // PostgreSQL raw queries often return counts/sums as strings. 
    // We map over them to ensure they are clean integers for the frontend.
    const officerStats = rawOfficerStats.map(stat => ({
      officerName: stat.officerName,
      totalProcessed: parseInt(stat.totalProcessed) || 0,
      pending: parseInt(stat.pending) || 0,
      approved: parseInt(stat.approved) || 0,
      rejected: parseInt(stat.rejected) || 0,
      settled: parseInt(stat.settled) || 0,
    }));

    // 3. Return both the global stats and the new officer array
    res.json({
      ...stats,
      officerStats
    });

  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

exports.createOfficer = async (req, res) => {
  try {
    const repo = AppDataSource.getRepository("User");
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please provide all required fields" });
    }

    // Check if user already exists
    const existingUser = await repo.findOneBy({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User with this email already exists" });
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Force role to 'officer'
    const user = repo.create({
      name,
      email,
      password: hashedPassword,
      role: "officer",
    });

    await repo.save(user);

    // Remove password from the response for security
    delete user.password;
    res.status(201).json({ msg: "Officer account created successfully", user });
  } catch (error) {
    console.error("Create Officer Error:", error);
    res.status(500).json({ error: "Failed to create officer account" });
  }
};