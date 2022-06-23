function adminAuth(req, res, next) {
    if (req.session.user != undefined) {
        next()
    } else {
        req.redirect("/login")
        
    }
}

module.exports = adminAuth