import { Module } from "@nestjs/common";
import { BrowserModule } from "../browser/browser.module";
import { StickersController } from "./stickers.controller";
import { StickersService } from "./stickers.service";

@Module({
    controllers: [
        StickersController,
    ],
    providers: [
        StickersService,
    ],
    imports: [
        BrowserModule,
    ],
})
export class StickersModule {}
