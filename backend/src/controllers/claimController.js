const AppDataSource = require("../config/db");
const asyncHandler = require("../middleware/asyncHandler");

// 🔑 CRITICAL FIX: Import the explicit Claim EntitySchema object
const Claim = require("../entities/Claim");

exports.createClaim = asyncHandler(async (req, res) => {
  // 🔑 CRITICAL FIX: Guard database initialization for serverless contexts
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  const repo = AppDataSource.getRepository(Claim);
  
  let docMeta = null;
  if (req.file) {
    docMeta = {
      fileUrl: req.file.path, 
      fileName: req.file.filename, 
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadDate: new Date().toISOString()
    };
  }

  const claim = repo.create({
    title: req.body.title,
    type: req.body.type,
    description: req.body.description,
    documentMetadata: docMeta, 
    user: { id: req.user.id },
  });
  
  await repo.save(claim);
  return res.status(201).json(claim);
});

exports.getClaims = asyncHandler(async (req, res) => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  const repo = AppDataSource.getRepository(Claim);
  const { page = 1, limit = 2, status, type, search, sort = "DESC", assignment } = req.query;

  const qb = repo
    .createQueryBuilder("claim")
    .leftJoinAndSelect("claim.user", "user")
    .leftJoinAndSelect("claim.assignedOfficer", "officer");

  if (req.user.role === "policyholder") {
    qb.andWhere("claim.user.id = :userId", { userId: req.user.id });
  } else if (req.user.role === "officer") {
    if (assignment === "unassigned") {
      qb.andWhere("officer.id IS NULL");
    } else if (assignment === "mine") {
      qb.andWhere("officer.id = :userId", { userId: req.user.id });
    }
  }

  if (status) qb.andWhere("claim.status = :status", { status });
  if (type) qb.andWhere("claim.type = :type", { type });
  if (search) qb.andWhere("claim.title ILIKE :search", { search: `%${search}%` });

  qb.orderBy("claim.createdAt", sort.toUpperCase() === "ASC" ? "ASC" : "DESC");
  qb.skip((page - 1) * limit).take(limit);

  const [data, total] = await qb.getManyAndCount();

  return res.json({
    data,
    total,
    page: Number(page),
    lastPage: Math.ceil(total / limit),
  });
});

exports.getClaimById = asyncHandler(async (req, res) => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  const repo = AppDataSource.getRepository(Claim);
  const claim = await repo.findOne({
    where: { id: req.params.id },
    relations: ["user", "assignedOfficer"]
  });

  if (!claim) return res.status(404).json({ msg: "Claim not found" });

  if (req.user.role === "policyholder" && claim.user.id !== req.user.id) {
    return res.status(403).json({ msg: "Access denied" });
  }

  if (req.user.role === "officer" && claim.assignedOfficer && claim.assignedOfficer.id !== req.user.id) {
    return res.status(403).json({ msg: "This claim is assigned to another officer" });
  }

  return res.json(claim);
});

exports.updateStatus = asyncHandler(async (req, res) => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  const repo = AppDataSource.getRepository(Claim);
  const claim = await repo.findOne({
    where: { id: req.params.id },
    relations: ["assignedOfficer"]
  });

  if (!claim) return res.status(404).json({ msg: "Claim not found" });

  if (req.user.role === "officer" && (!claim.assignedOfficer || claim.assignedOfficer.id !== req.user.id)) {
    return res.status(403).json({ msg: "You can only update statuses of claims assigned to you." });
  }

  await repo.update(req.params.id, { status: req.body.status });
  return res.json({ msg: "Status updated" });
});

exports.assignOfficer = asyncHandler(async (req, res) => {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  const repo = AppDataSource.getRepository(Claim);
  await repo.update(req.params.id, {
    assignedOfficer: { id: req.body.officerId }
  });
  return res.json({ msg: "Officer assigned successfully" });
});