// const fs = require("fs");
// const path = require("path");

// const folderPath = "./public/images/rod_curb";
// const outputFile = "files.txt";

// // Read all files in folder
// const files = fs.readdirSync(folderPath);

// // Filter + remove extensions
// const names = files
//     .filter(file => file.endsWith(".jpg") || file.endsWith(".jpeg"))
//     .map(file => path.parse(file).name); // removes extension

// // Write to txt file
// fs.writeFileSync(outputFile, names.join("\n"));

// console.log("Done! File list written to files.txt");

const fs = require("fs");
const path = require("path");

const folderPath = "./public/images/jay_photos"; // Change this to your folder path
const outputFile = "files.txt";

function getFilesRecursive(folder) {
    let results = [];

    const entries = fs.readdirSync(folder, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(folder, entry.name);

        if (entry.isDirectory()) {
            // Recursively search this subfolder
            results = results.concat(getFilesRecursive(fullPath));
        } else if (
            entry.isFile() &&
            (entry.name.endsWith(".jpg") || entry.name.endsWith(".jpeg"))
        ) {
            // Remove extension
            results.push(path.relative(folderPath, fullPath).replace(/\.(jpg|jpeg)$/i, ""));
            // results.push(path.parse(entry.name).name);
        }
    }

    return results;
}

const names = getFilesRecursive(folderPath);

fs.writeFileSync(outputFile, names.join("\n"));

console.log(`Done! Found ${names.length} files. File list written to ${outputFile}`);