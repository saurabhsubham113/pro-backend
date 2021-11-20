//creating result
const createResult = (error, data) => {
    let result = {}
    if (error) {
        result['success'] = false
        result['error'] = error
    } else {
        result['success'] = true
        result['data'] = data
    }

    return result

}
//cookie token creation
const cookieToken = async (user, res) => {
    const token = await user.getJwtToken()

    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRY * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }
    user.password = undefined
    res.status(200).cookie('token', token, options)
        .send(createResult(undefined, { token, user }))
}


module.exports = { createResult, cookieToken }