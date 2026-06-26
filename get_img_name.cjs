const fs = require("fs");
const path = require("path");

const folderPath = "./src/assets/images/bank2curb_main";
const outputFile = "files.txt";

// Read all files in folder
const files = fs.readdirSync(folderPath);

// Filter + remove extensions
const names = files
    .filter(file => file.endsWith(".jpg") || file.endsWith(".jpeg"))
    .map(file => path.parse(file).name); // removes extension

// Write to txt file
fs.writeFileSync(outputFile, names.join("\n"));

console.log("Done! File list written to files.txt");
