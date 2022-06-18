const { User } = require("../schema/models");
const {
	hashPassword,
	comparePassword,
	generateAccessToken,
} = require("../utils/auth");

const login = async (req, res) => {
	const { username, password } = req.body;
	if (!username || !password)
		return res
			.json({
				success: false,
				body: { message: "Credentials not provided" },
			})
			.status(400);
	let user = await User.findOne({ username });
	if (!user) {
		const hashedPassword = await hashPassword(password);
		user = new User({
			username,
			password: hashedPassword,
		});
		user = await user.save();
	} else if (!(await comparePassword(password, user.password)))
		return res
			.json({
				success: false,
				body: { message: "Username and password do not match" },
			})
			.status(401);
	const accessToken = generateAccessToken(user);
	res.cookie("accessToken", accessToken, { sameSite: "None", secure: true });
	res.json({
		success: true,
		body: { message: "Logged in successfully", user },
	}).status(200);
};

const refresh = async (req, res) => {
	const user = await User.findById(req.user._id);
	res.json({
		success: true,
		body: { message: "Token was verified", user },
	}).status(200);
};

const logout = async (req, res) => {
	res.clearCookie("accessToken");
	res.json({
		success: true,
		body: { message: "Logged out successfully" },
	}).status(200);
};

module.exports = {
	login,
	refresh,
	logout,
};
