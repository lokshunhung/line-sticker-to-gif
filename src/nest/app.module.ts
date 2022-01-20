import { Module } from "@nestjs/common";
import { GlobalModule } from "./global/global.module";
import { StickersModule } from "./stickers/stickers.module";

@Module({
    imports: [
        GlobalModule,
        StickersModule,
    ],
})
export class AppModule {}
