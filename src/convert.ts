import cp from "child_process";
import fs from "fs";
import path from "path";
const ffmpeg = require("ffmpeg.js");

async function main() {
    if (process.argv.length !== 3) {
        console.log(`Missing sticker id argument, example:\n` + process.argv.slice(0, 2).concat("14176479").join(" "));
        process.exit(1);
    }
    const stickerId = process.argv[2];
    const outputDir = path.join(__dirname, "..", "dist", stickerId);

    if (!fs.existsSync(outputDir)) {
        console.log(`Cannot find directory "${outputDir}"`);
        process.exit(1);
    }

    const entries = (
        await fs.promises.readdir(outputDir, {
            withFileTypes: true,
        })
    )
        .filter(entry => entry.isFile() && path.extname(entry.name) === ".png")
        .map(entry => entry.name);

    for (const entry of entries) {
        console.log("Processing: " + entry);
        const outputName = path.basename(entry, path.extname(entry)) + ".gif";
        await new Promise((resolve, reject) => {
            ffmpeg({
                arguments: ["-y", "-i", "/data/" + entry, "-f", "gif", "/data/" + outputName],
                mounts: [
                    {
                        type: "NODEFS",
                        opts: { root: outputDir },
                        mountpoint: "/data",
                    },
                ],
                print: _ => console.log(_),
                printErr: _ => console.error(_),
                onExit: code => (code === 0 ? resolve : reject)(code),
            });
        });
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
}

main();
