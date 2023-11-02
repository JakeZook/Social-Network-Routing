const { User, Thought } = require("../models");

module.exports = {
	//Gets all users
	async getAll(req, res) {
		try {
			const users = await User.find().select("-__v");
			res.status(200).json(users);
		} catch (err) {
			console.error(err);
			res.status(500).json(err);
		}
	},
	//Gets one user
	async getOne(req, res) {
		try {
			const user = await User.findOne({ _id: req.params.userId })
				.select("-__v")
				.populate("thoughts")
				.populate("friends");

			if (!user) {
				return res.status(404).json({ message: "No user found!" });
			}

			res.status(200).json(user);
		} catch (err) {
			console.error(err);
			res.status(500).json(err);
		}
	},
	//Creates a user
	async create(req, res) {
		try {
			const newUser = await User.create(req.body);
			res.status(200).json(newUser);
		} catch (err) {
			console.error(err);
			res.status(500).json(err);
		}
	},
	//Adds users friend
	async createFriend(req, res) {
		try {
			const { userId, friendId } = req.params;

			const user = await User.findOneAndUpdate(
				{ _id: userId },
				{ $addToSet: { friends: friendId } },
				{ new: true }
			);

			if (!user) {
				return res.status(404).json({ message: "No user found!" });
			}

			res.status(200).json(user);
		} catch (err) {
			console.error(err);
			res.status(500).json(err);
		}
	},
	//Updates a user
	async update(req, res) {
		try {
			const user = await User.findOneAndUpdate(
				{ _id: req.params.userId },
				{ $set: req.body },
				{ runValidators: true, new: true }
			);

			if (!user) {
				res.status(404).json({ message: "No user found!" });
			}

			res.status(200).json({ message: "User updated!" });
		} catch (err) {
			console.error(err);
			res.status(500).json(err);
		}
	},
	//Deletes user and associated thoughts
	async deleteOne(req, res) {
		try {
			const user = await User.findOneAndDelete({ _id: req.params.userId });

			if (!user) {
				res.status(404).json({ message: "No user found!" });
			}

			//Deletes all thoughts associated with this user
			await Thought.deleteMany({ _id: { $in: user.thoughts } });

			res.status(200).json({
				message: "Deleted!",
			});
		} catch (err) {
			console.error(err);
			res.status(500).json(err);
		}
	},
	//Remove friend
	async deleteFriend(req, res) {
		try {
			const { userId, friendId } = req.params;

			const user = await User.findOneAndUpdate(
				{ _id: userId },
				{ $pull: { friends: friendId } },
				{ new: true }
			);

			if (!user) {
				return res.status(404).json({ message: "No user found!" });
			}

			res.status(200).json(user);
		} catch (err) {
			console.error(err);
			res.status(500).json(err);
		}
	},
};
