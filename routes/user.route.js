const express = require('express')
const router = express.Router()
const { isLoggedIn, customRole } = require('../middlewares/user.middleware')
const {
    signup, signin, signout,
    forgotPassword, passwordReset,
    getLoggedInUserDetails, updatePassword,
    updateUser, adminAlluser, managerAllUser, adminGetOneUser, adminUpdateOneUser, adminDeleteUser
} = require('../controllers/user.controller')

router.route('/signup').post(signup)
router.route('/signin').post(signin)
router.route('/signout').get(signout)
router.route('/forgotpassword').post(forgotPassword)
router.route('/password/reset/:token').post(passwordReset)
router.route('/userdashboard').get(isLoggedIn, getLoggedInUserDetails)
router.route('/password/update').post(isLoggedIn, updatePassword)
router.route('/userdashborad/update').put(isLoggedIn, updateUser)

//admin users
router.route("/admin/users").get(isLoggedIn, customRole('admin'), adminAlluser)
router.route("/admin/user/:id")
    .get(isLoggedIn, customRole('admin'), adminGetOneUser)
    .put(isLoggedIn, customRole('admin'), adminUpdateOneUser)
    .delete(isLoggedIn, customRole('admin'), adminDeleteUser)

//manager
router.route("/manager/users").get(isLoggedIn, customRole('manager'), managerAllUser)

module.exports = router