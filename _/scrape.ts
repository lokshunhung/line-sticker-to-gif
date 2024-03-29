import path from "path";
import fs from "fs";
import fetch from "node-fetch";
import { chromium } from "playwright-core";

export async function main() {
    if (process.argv.length !== 3 && process.argv.length !== 4) {
        console.log(
            `Missing sticker id argument, example:\n`
                .concat(process.argv.slice(0, 2).concat("14176479").join(" "), "\n")
                .concat(process.argv.slice(0, 2).concat("61e4d2894539264dcc8fa2ea", "--emoji").join(" ")),
        );
        process.exit(1);
    }
    const stickerId = process.argv[2];
    const isEmoji = process.argv[3] === "--emoji";
    const outputDir = path.join(__dirname, "..", "dist", stickerId);

    const browser = await chromium.launch();

    const page = await browser.newPage();

    page.on("console", console.log);

    const url = `https://store.line.me/${isEmoji ? "emojishop" : "stickershop"}/product/${stickerId}/en`;
    console.log(`Loading stickers from ${url}`);
    await page.goto(`${url}`);

    const stickerList = await page.locator("[data-widget='StickerPreview'] ul").elementHandle();

    const imageURLs = await stickerList!.$$eval("li.FnStickerPreviewItem", items => {
        const imageURLs: string[] = [];
        items.forEach(item => {
            const preview = JSON.parse(item.dataset.preview!);
            let imageURL = preview.animationUrl;
            if (!imageURL) imageURL = preview.fallbackStaticUrl;
            if (!imageURL) imageURL = preview.staticUrl;
            imageURLs.push(imageURL);
        });
        return imageURLs;
    });

    await fs.promises.mkdir(outputDir, { recursive: true });

    for (let i = 0; i < imageURLs.length; ++i) {
        console.log(`Downloading stickers (${i + 1}/${imageURLs.length})`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        const imageURL = imageURLs[i];
        const res = await fetch(imageURL);
        const buf = await res.buffer();
        const outputPath = path.join(outputDir, `${i + 1}.png`);
        await fs.promises.writeFile(outputPath, buf);
    }

    await browser.close();
}

main().catch(console.error);
