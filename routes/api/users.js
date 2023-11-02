const router = require("express").Router();
const {
	getAll,
	getOne,
	create,
	createFriend,
	update,
	deleteOne,
	deleteFriend,
} = require("../../controllers/userControl");

router.route("/").get(getAll).post(create);

router.route("/:userId").get(getOne).put(update).delete(deleteOne);

router
	.route("/:userId/friends/:friendId")
	.post(createFriend)
	.delete(deleteFriend);

module.exports = router;
