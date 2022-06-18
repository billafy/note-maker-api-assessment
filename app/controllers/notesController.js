const { User, Note } = require("../schema/models");

const validateNote = ({ title, body, tags }, res) => {
	if (!title || !body || !tags) {
		res.json({
			success: false,
			body: { message: "Incomplete information provided" },
		}).status(400);
		return false;
	}
	if (tags.length < 2) {
		res.json({
			success: false,
			body: { message: "Add atleast 2 tags" },
		}).status(400);
		return false;
	}
	for (let i = 0; i < tags.length; ++i) {
		if (!tags[i]) {
			res.json({
				success: false,
				body: { message: "Invalid tag" },
			}).status(400);
			return false;
		}
	}
	if (new Set(tags).size < tags.length) {
		res.json({
			success: false,
			body: { message: "Cannot add duplicate tags" },
		}).status(400);
		return false;
	}
	return true;
};

const getNotes = async (req, res) => {
	let tags = [],
		notes;
	Object.values(req.query).forEach((tag) => tags.push(tag.toLowerCase()));
	if (tags.length)
		notes = await Note.find({ from: req.user._id, tags: { $all: tags } });
	else notes = await Note.find({ from: req.user._id });
	res.json({
		success: true,
		body: { message: `${notes.length} note(s) found`, notes },
	}).status(200);
};

const addNote = async (req, res) => {
	const { title, body, tags } = req.body;
	if (!validateNote({ title, body, tags }, res)) return;
	for (let i = 0; i < tags.length; ++i) tags[i] = tags[i].toLowerCase();
	const user = await User.findById(req.user._id);
	let note = new Note({
		title,
		body,
		tags,
		from: user._id,
	});
	note = await note.save();
	res.json({ success: true, body: { message: "Note added", note } }).status(
		201
	);
};

const updateNote = async (req, res) => {
	const { _id } = req.params;
	const { title, body, tags } = req.body;
	if (!validateNote({ title, body, tags }, res)) return;
	for (let i = 0; i < tags.length; ++i) tags[i] = tags[i].toLowerCase();
	let note = await Note.findById(_id);
	if (!note)
		return res
			.json({
				success: false,
				body: { message: "Invalid note ID" },
			})
			.status(400);
	if (note.from.toString() !== req.user._id.toString())
		return res
			.json({
				success: false,
				body: { message: "Unauthorized to update" },
			})
			.status(401);
	note.title = title;
	note.body = body;
	note.tags = tags;
	note = await note.save();
	res.json({ success: true, body: { message: "Note updated", note } }).status(
		200
	);
};

const deleteNote = async (req, res) => {
	const { _id } = req.params;
	let note = await Note.findById(_id);
	if (!note)
		return res.json({
			success: false,
			body: { message: "Invalid note ID" },
		});
	if (note.from.toString() !== req.user._id)
		return res
			.json({
				success: false,
				body: { message: "Unauthorized to update" },
			})
			.status(401);
	await Note.deleteOne({ _id });
	res.json({ success: true, body: { message: "Note deleted" } }).status(200);
};

module.exports = {
	getNotes,
	addNote,
	updateNote,
	deleteNote,
};