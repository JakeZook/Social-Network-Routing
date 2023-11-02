const { Schema, model } = require("mongoose");

// Schema to create the User model
const userSchema = new Schema(
	{
		username: {
			type: String,
			unique: true,
			required: true,
			trimmed: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
		},
		thoughts: [
			{
				type: Schema.Types.ObjectId,
				ref: "thought",
			},
		],
		friends: [
			{
				type: Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	{
		toJSON: {
			virtuals: true,
		},
		id: false,
	}
);

userSchema.virtual("friendCount").get(function () {
	return this.friends.length;
});

const User = model("User", userSchema);

module.exports = User;
