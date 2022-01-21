import { Injectable } from "@nestjs/common";
import { Browser } from "playwright-core";
import { InjectBrowser } from "./inject-browser.decorator";

@Injectable()
export class BrowserService {
    constructor(
        @InjectBrowser()
        private readonly browser: Browser,
    ) {}

    async newPage() {
        return await this.browser.newPage();
    }
}
