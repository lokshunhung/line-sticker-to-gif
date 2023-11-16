import cp from "child_process";
import fs from "fs";
import path from "path";

async function main() {
    if (process.argv.length !== 3) {
        console.log(`Missing sticker id argument, example:\n` + process.argv.slice(0, 2).concat("14176479").join(" "));
        process.exit(1);
    }
    const stickerId = process.argv[2];
    const convertedDir = path.join(__dirname, "..", "dist", `${stickerId}-converted`);
    const convertedFixedDir = path.join(__dirname, "..", "dist", `${stickerId}-converted-fixed`);

    if (!fs.existsSync(convertedDir)) {
        console.log(`Cannot find directory "${convertedDir}"`);
        process.exit(1);
    }

    if (!fs.existsSync(convertedFixedDir)) {
        await fs.promises.mkdir(convertedFixedDir, { recursive: true });
    }

    const entries = (await fs.promises.readdir(convertedDir, { withFileTypes: true }))
        .filter(entry => entry.isFile() && path.extname(entry.name) === ".gif")
        .map(entry => entry.name)
        .sort((a, b) => parseInt(a) - parseInt(b));

    for (const entry of entries) {
        console.log(`Processing: ${stickerId}-converted/${entry}`);
        const inputFilePath = path.join(convertedDir, entry);
        const paletteFileName = entry.replace(/\.gif$/, ".palette.png");
        const paletteFilePath = path.join(convertedFixedDir, paletteFileName);
        const outputFilePath = path.join(convertedFixedDir, entry);
        // prettier-ignore
        cp.spawnSync("ffmpeg", [
            "-i", inputFilePath,
            "-vf", "palettegen",
            paletteFilePath,
        ], { stdio: "ignore" });
        // prettier-ignore
        cp.spawnSync("ffmpeg", [
            "-i", inputFilePath,
            "-i", paletteFilePath,
            "-filter_complex", "paletteuse",
            "-loop", "0",
            outputFilePath,
        ], { stdio: "ignore" });
        fs.unlinkSync(paletteFilePath);
    }
}

main().catch(console.error);
