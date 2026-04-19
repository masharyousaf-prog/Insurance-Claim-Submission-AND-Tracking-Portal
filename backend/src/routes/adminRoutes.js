const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const ctrl = require("../controllers/adminController");

router.get("/stats", auth, role("admin"), ctrl.getStats);

router.post("/officer", auth, role("admin"), ctrl.createOfficer);

module.exports = router;