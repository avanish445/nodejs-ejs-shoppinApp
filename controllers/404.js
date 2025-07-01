exports.pageNotFound = (req, res, next) => {
    res.status(404).render('404',
        {
            title: '404 Page Not Found',
            path: '/404',
            isAuthenticated: req.session.isLoggedIn
        })
    // res.status(404).sendFile(path.join(__dirname, './views/404.html'))
}

exports.get500 = (req, res, next) => {
    res.status(500).render('500',
        {
            title: 'Error!',
            path: '/500',
            isAuthenticated: req.session.isLoggedIn
        })
    // res.status(404).sendFile(path.join(__dirname, './views/404.html'))
}