import { Injectable, Logger } from "@nestjs/common";
import { BrowserService } from "../browser/browser.service";

@Injectable()
export class StickersService {
    private readonly logger = new Logger("StickersService", { timestamp: true });

    constructor(
        private readonly browserService: BrowserService,
    ) {}

    async getStickerPackArchiveById(stickerId: string) {
        const stickerURLs = await this.getStickerURLsById(stickerId);
        // TODO: build archive
        return;
    }

    async getStickerURLsById(stickerId: string) {
        const page = await this.browserService.newPage();
        await page.goto(`https://store.line.me/stickershop/product/${stickerId}/en`);
        const stickerList = await page.locator("ul.FnStickerList").elementHandle();
        const imageURLs = await stickerList!.$$eval("li.FnStickerPreviewItem", items => {
            const imageURLs: string[] = [];
            items.forEach(item => {
                const preview = JSON.parse(item.dataset.preview);
                let imageURL = preview.animationUrl;
                if (!imageURL) imageURL = preview.fallbackStaticUrl;
                if (!imageURL) imageURL = preview.staticUrl;
                imageURLs.push(imageURL);
            });
            return imageURLs;
        });
        await page.close();
        this.logger.log(`sticker pack:${stickerId} = ${imageURLs.length} stickers`);
        return imageURLs;
    }
}
