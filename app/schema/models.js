const { Schema, model } = require("mongoose");

const userSchema = new Schema({
	username: String,
	password: String,
});

const noteSchema = new Schema({
	title: String,
	body: String,
	tags: { type: [String], index: true },
	from: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = {
	Note: model("Note", noteSchema),
	User: model("User", userSchema),
};
