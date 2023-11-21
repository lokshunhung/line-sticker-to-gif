import cp from "child_process";
import fs from "fs";
import path from "path";

async function main() {
    if (process.argv.length !== 3) {
        console.log(`Missing sticker id argument, example:\n` + process.argv.slice(0, 2).concat("14176479").join(" "));
        process.exit(1);
    }
    const stickerId = process.argv[2];
    const scrapedDir = path.join(__dirname, "..", "dist", stickerId);
    const convertedDir = path.join(__dirname, "..", "dist", `${stickerId}-converted2`);

    if (!fs.existsSync(convertedDir)) {
        await fs.promises.mkdir(convertedDir, { recursive: true });
    }

    const entries = (await fs.promises.readdir(scrapedDir, { withFileTypes: true }))
        .filter(entry => entry.isFile() && path.extname(entry.name) === ".png")
        .map(entry => entry.name)
        .sort((a, b) => parseInt(a) - parseInt(b));

    for (const entry of entries) {
        console.log(`Processing: ${stickerId}/${entry}`);
        const inputFilePath = path.join(scrapedDir, entry);
        const outputFileName = entry.replace(/\.png$/, ".gif");
        const outputFilePath = path.join(convertedDir, outputFileName);
        // Note: see notes/experimental.md
        // prettier-ignore
        cp.spawnSync("ffmpeg", [
            "-f", "apng",
            "-i", inputFilePath,
            "-vf", "split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse",
            "-loop", "0",
            outputFilePath,
        ], { stdio: "ignore" });
    }
}

main().catch(console.error);
