const express = require("express")
const router = express.Router()
const { createUser, 
    getUsers, getOneUser, updateOne, deleteOne
} = require("../../controllers/admin/usermanagement")
const { authenticateUser, isAdmin } = require("../../middlewares/authorizedUsers")
// const { authenticateUser } = require("../../middlewares/authorizedUsers")
// router.post(
//     "/",
//     createUser
// )

router.get(
    "/",
    authenticateUser, 
    isAdmin,
    getUsers
)

router.get(
    "/:id", 
    getOneUser
)
router.put(
    "/:id",
    updateOne
)
router.delete(
    "/:id",
    deleteOne
)
module.exports = router
