import { Module } from "@nestjs/common";
import { chromium } from "playwright-core";
import { BrowserService } from "./browser.service";
import { BROWSER_INJECTION_TOKEN } from "./inject-browser.decorator";

@Module({
    providers: [
        BrowserService,
        {
            provide: BROWSER_INJECTION_TOKEN,
            useFactory: async () => {
                const browser = await chromium.launch();
                return browser;
            },
        },
    ],
    exports: [
        BrowserService,
    ],
})
export class BrowserModule {}
