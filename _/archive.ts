import archiver from "archiver";
import fs from "fs";
import path from "path";

function archiveFiles(writable: NodeJS.WritableStream, fn: (archive: archiver.Archiver) => void) {
    return new Promise<{ writtenKB: number }>((resolve, reject) => {
        const archive = archiver("zip", { zlib: { level: 9 } });
        // prettier-ignore
        archive.on("warning", reject)
               .on("error", reject)
               .pipe(writable)
        try {
            Promise.resolve(fn(archive))
                .then(() => archive.finalize())
                .then(() => resolve({ writtenKB: Math.round(archive.pointer() / 1.024) / 1000 }));
        } catch (error) {
            reject(error);
        }
    });
}

async function main() {
    if (process.argv.length !== 3) {
        console.log(`Missing sticker id argument, example:\n` + process.argv.slice(0, 2).concat("14176479").join(" "));
        process.exit(1);
    }
    const stickerId = process.argv[2];
    const convertedDir = path.join(__dirname, "..", "dist", `${stickerId}-converted`);

    const archiveName = `${stickerId}.zip`;
    const output = fs.createWriteStream(path.join(convertedDir, archiveName));
    console.log(`Writing to ${archiveName}`);

    const archiveResult = await archiveFiles(output, archive => {
        archive.glob("*.gif", { cwd: convertedDir });
    });

    console.log(`${archiveName} ${archiveResult.writtenKB}K written`);
}

main().catch(console.error);
