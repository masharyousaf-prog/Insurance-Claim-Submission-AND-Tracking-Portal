const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppDataSource = require("../config/db");
const asyncHandler = require("../middleware/asyncHandler");

exports.register = async (req, res) => {
  const repo = AppDataSource.getRepository("User");

  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = repo.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      role: 'policyholder', 
    });

    await repo.save(user);

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = asyncHandler(async (req, res) => {
  const repo = AppDataSource.getRepository("User");

  const user = await repo.findOneBy({ email: req.body.email });

  if (!user) {
    return res.status(400).json({ msg: "User not found" });
  }

  const isMatch = await bcrypt.compare(req.body.password, user.password);

  if (!isMatch) {
    return res.status(400).json({ msg: "Wrong password" });
  }

  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET
  );

  res.json({ token, user });
});