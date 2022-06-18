const { Router } = require("express");
const {
	getNotes,
	addNote,
	updateNote,
	deleteNote,
} = require("../controllers/notesController");
const { verifyAccessToken } = require("../utils/auth");

const router = Router();

router.get("/", verifyAccessToken, getNotes);

router.post("/", verifyAccessToken, addNote);

router.put("/:_id", verifyAccessToken, updateNote);

router.delete("/:_id", verifyAccessToken, deleteNote);

module.exports = router;
