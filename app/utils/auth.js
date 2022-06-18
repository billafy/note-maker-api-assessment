const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;

/* password */

const hashPassword = async (password) => {
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	return hashedPassword;
};

const comparePassword = async (password, hashedPassword) => {
	const isValid = await bcrypt.compare(password, hashedPassword);
	return isValid;
};

/* access token */

const generateAccessToken = (user) => {
	return jwt.sign(
		{
			_id: user._id,
			username: user.username,
			password: user.password,
		},
		ACCESS_TOKEN_SECRET
	);
};

const verifyAccessToken = async (req, res, next) => {
	const { accessToken } = req.cookies;
	if (!accessToken)
		return res
			.json({ success: false, body: { message: "No access token" } })
			.status(401);
	jwt.verify(accessToken, ACCESS_TOKEN_SECRET, async (err, user) => {
		if (err)
			return res
				.json({
					success: false,
					body: { message: "Invalid access token" },
				})
				.status(401);
		req.user = user;
		next();
	});
};

module.exports = {
	hashPassword,
	comparePassword,
	generateAccessToken,
	verifyAccessToken,
};
