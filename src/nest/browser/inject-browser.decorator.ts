import { Inject } from "@nestjs/common";

export const BROWSER_INJECTION_TOKEN = "global/browser";

export function InjectBrowser() {
    return Inject(BROWSER_INJECTION_TOKEN);
}
