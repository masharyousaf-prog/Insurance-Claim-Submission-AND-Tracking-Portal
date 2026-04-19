const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const ctrl = require("../controllers/claimController");
const commentCtrl = require("../controllers/commentController");

router.post("/", auth, ctrl.createClaim);
router.get("/", auth, ctrl.getClaims);
router.get("/:id", auth, ctrl.getClaimById); // NEW
router.put("/:id", auth, role("officer", "admin"), ctrl.updateStatus);
router.put("/:id/assign", auth, role("admin", "officer"), ctrl.assignOfficer);

router.post("/comment", auth, commentCtrl.addComment);
router.get("/comment/:claimId", auth, commentCtrl.getComments);

module.exports = router;