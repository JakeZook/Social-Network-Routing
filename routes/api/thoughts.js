const router = require("express").Router();
const {
	getAll,
	getOne,
	create,
	createReaction,
	update,
	deleteOne,
	deleteReaction,
} = require("../../controllers/thoughtControl");

router.route("/").get(getAll).post(create);

router.route("/:thoughtId").get(getOne).put(update).delete(deleteOne);

router.route("/:thoughtId/reactions").post(createReaction);

router.route("/:thoughtId/reactions/:reactionId").delete(deleteReaction);

module.exports = router;
