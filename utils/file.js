const fs = require('fs');
const fileHelper = (filePath) => {
    fs.unlink(filePath, (err) => {
        if (err) {
            throw new Error(err)
        }
    })
}

exports.fileHelper = fileHelper;