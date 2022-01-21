import { Module } from "@nestjs/common";
import { BrowserModule } from "./browser/browser.module";
import { GlobalModule } from "./global/global.module";
import { StickersModule } from "./stickers/stickers.module";

@Module({
    imports: [
        GlobalModule,
        BrowserModule,
        StickersModule,
    ],
})
export class AppModule {}
