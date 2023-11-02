const { Thought, User } = require("../models");

module.exports = {
	//Gets all thoughts
	async getAll(req, res) {
		try {
			const thoughts = await Thought.find();
			res.status(200).json(thoughts);
		} catch (err) {
			console.error(err);
			res.status(500).json(err);
		}
	},
	//Gets one thought
	async getOne(req, res) {
		try {
			const thought = await Thought.findOne({
				_id: req.params.thoughtId,
			}).populate("reactions");

			if (!thought) {
				return res.status(404).json({ message: "No thought found!" });
			}

			res.status(200).json(thought);
		} catch (err) {
			console.error(err);
			res.status(500).json(err);
		}
	},
	//Creates a thought
	async create(req, res) {
		try {
			const { thoughtText, username } = req.body;

			const newThought = new Thought({
				thoughtText,
				username,
			});

			const savedThought = await newThought.save();

			const user = await User.findOneAndUpdate(
				{ username },
				{ $push: { thoughts: savedThought._id } },
				{ new: true }
			);

			if (!user) {
				return res.status(404).json({ message: "No user found!" });
			}

			res.status(200).json(savedThought);
		} catch (err) {
			console.error(err);
			res.status(500).json(err);
		}
	},
	//Adds a reaction
	async createReaction(req, res) {
		try {
			const thought = await Thought.findOneAndUpdate(
				{ _id: req.params.thoughtId },
				{ $addToSet: { reactions: req.body } },
				{ runValidators: true, new: true }
			);

			if (!thought) {
				return res.status(404).json({ message: "No thought found!" });
			}

			res.status(200).json(thought);
		} catch (err) {
			console.error(err);
			res.status(500).json(err);
		}
	},
	//Updates a thought
	async update(req, res) {
		try {
			const thought = await Thought.findOneAndUpdate(
				{ _id: req.params.thoughtId },
				{ $set: req.body },
				{ runValidators: true, new: true }
			);

			if (!thought) {
				return res.status(404).json({ message: "No thought found!" });
			}

			res.status(200).json(thought);
		} catch (err) {
			console.error(err);
			res.status(500).json(err);
		}
	},
	//Deletes a thought
	async deleteOne(req, res) {
		try {
			const thought = await Thought.findOneAndDelete({
				_id: req.params.thoughtId,
			});

			if (!thought) {
				return res.status(404).json({ message: "No thought found!" });
			}

			await User.findOneAndUpdate(
				{ username: thought.username },
				{ $pull: { thoughts: req.params.thoughtId } },
				{ runValidators: true, new: true }
			);

			res.status(200).json({ message: "Deleted!" });
		} catch (err) {
			console.error(err);
			res.status(500).json(err);
		}
	},
	//Deletes a reaction
	async deleteReaction(req, res) {
		try {
			const thought = await Thought.findOneAndUpdate(
				{ _id: req.params.thoughtId },
				{ $pull: { reactions: { reactionId: req.params.reactionId } } },
				{ runValidators: true, new: true }
			);

			if (!thought) {
				return res.status(404).json({ message: "No thought found!" });
			}

			res.status(200).json(thought);
		} catch (err) {
			console.error(err);
			res.status(500).json(err);
		}
	},
};
