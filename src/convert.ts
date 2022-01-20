import fs from "fs";
import path from "path";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

async function main() {
    if (process.argv.length !== 3) {
        console.log(`Missing sticker id argument, example:\n` + process.argv.slice(0, 2).concat("14176479").join(" "));
        process.exit(1);
    }
    const stickerId = process.argv[2];
    const scrapedDir = path.join(__dirname, "..", "dist", stickerId);
    const convertedDir = path.join(__dirname, "..", "dist", `${stickerId}-converted`);

    if (!fs.existsSync(scrapedDir)) {
        console.log(`Cannot find directory "${scrapedDir}"`);
        process.exit(1);
    }

    if (!fs.existsSync(convertedDir)) {
        await fs.promises.mkdir(convertedDir, { recursive: true });
    }

    const entries = (
        await fs.promises.readdir(scrapedDir, {
            withFileTypes: true,
        })
    )
        .filter(entry => entry.isFile() && path.extname(entry.name) === ".png")
        .map(entry => entry.name);

    const ffmpeg = createFFmpeg({
        corePath: require.resolve("@ffmpeg/core"),
        log: true,
    });
    await ffmpeg.load();

    for (const entry of entries) {
        console.log("Processing: " + entry);
        const outputName = path.basename(entry, path.extname(entry)) + ".gif";

        ffmpeg.FS("writeFile", entry, await fetchFile(path.join(scrapedDir, entry)));
        await ffmpeg.run("-y", "-f", "apng", "-i", entry, "-f", "gif", outputName);
        await fs.promises.writeFile(path.join(convertedDir, outputName), ffmpeg.FS("readFile", outputName));

        await new Promise(resolve => setTimeout(resolve, 5000));
    }
}

main();
