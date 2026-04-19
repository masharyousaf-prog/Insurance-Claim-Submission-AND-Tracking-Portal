const AppDataSource = require("../config/db");
const asyncHandler = require("../middleware/asyncHandler");

exports.createClaim = asyncHandler(async (req, res) => {
  const repo = AppDataSource.getRepository("Claim");
  const claim = repo.create({
    title: req.body.title,
    type: req.body.type, // Make sure to save the type
    description: req.body.description,
    documentMetadata: req.body.documentMetadata,
    user: { id: req.user.id },
  });
  await repo.save(claim);
  res.status(201).json(claim);
});

exports.getClaims = asyncHandler(async (req, res) => {
  const repo = AppDataSource.getRepository("Claim");
  // FIX: Destructure 'type' and 'sort' to prevent ReferenceError
  const { page = 1, limit = 10, status, type, search, sort = "DESC" } = req.query;

  const qb = repo
    .createQueryBuilder("claim")
    .leftJoinAndSelect("claim.user", "user")
    .leftJoinAndSelect("claim.assignedOfficer", "officer");

  if (req.user.role === "policyholder") {
    qb.andWhere("claim.user.id = :userId", { userId: req.user.id });
  }

  if (status) qb.andWhere("claim.status = :status", { status });
  if (type) qb.andWhere("claim.type = :type", { type });
  if (search) qb.andWhere("claim.title ILIKE :search", { search: `%${search}%` });

  // Add Sorting to satisfy PDF requirement
  qb.orderBy("claim.createdAt", sort.toUpperCase() === "ASC" ? "ASC" : "DESC");
  qb.skip((page - 1) * limit).take(limit);

  const [data, total] = await qb.getManyAndCount();

  res.json({
    data,
    total,
    page: Number(page),
    lastPage: Math.ceil(total / limit),
  });
});

// NEW: Fetch single claim to fix frontend scalability issue
exports.getClaimById = asyncHandler(async (req, res) => {
  const repo = AppDataSource.getRepository("Claim");
  const claim = await repo.findOne({
    where: { id: req.params.id },
    relations: ["user", "assignedOfficer"]
  });

  if (!claim) return res.status(404).json({ msg: "Claim not found" });

  // Security constraint
  if (req.user.role === "policyholder" && claim.user.id !== req.user.id) {
    return res.status(403).json({ msg: "Access denied" });
  }

  res.json(claim);
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const repo = AppDataSource.getRepository("Claim");
  await repo.update(req.params.id, { status: req.body.status });
  res.json({ msg: "Status updated" });
});

// NEW: Assign Officer to satisfy PDF requirement
exports.assignOfficer = asyncHandler(async (req, res) => {
  const repo = AppDataSource.getRepository("Claim");
  await repo.update(req.params.id, {
    assignedOfficer: { id: req.body.officerId }
  });
  res.json({ msg: "Officer assigned successfully" });
});