const fs = require("fs");
const path = require("path");
const textRef = "txt/vanasonad.txt";
const dirPath = path.join(__dirname, '../')
const textPath = path.join(dirPath, textRef);

const readTextFile = function() {
    return fs.readFileSync(textPath, "utf-8");
}

module.exports = {readTextFile: readTextFile};