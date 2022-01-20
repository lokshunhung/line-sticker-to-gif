import { Controller, Get, Header, Param } from "@nestjs/common";
import { StickersService } from "./stickers.service";

@Controller("sticker")
export class StickersController {
    constructor(
        private readonly stickersService: StickersService,
    ) {}

    @Get(":stickerId")
    @Header("Content-Type", "application/zip")
    async getStickerPackArchiveById(@Param("stickerId") stickerId: string) {
        return await this.stickersService.getStickerPackArchiveById(stickerId);
    }

    @Get(":stickerId/urls")
    async getStickerURLsById(@Param("stickerId") stickerId: string) {
        return await this.stickersService.getStickerURLsById(stickerId);
    }
}
