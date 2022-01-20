import archiver from "archiver";
import fastify from "fastify";
import fastifyPlugin from "fastify-plugin";
import fetch from "node-fetch";
import path from "path";
import { Browser, chromium } from "playwright-core";

let numOutStandingRequests = 0;

declare module "fastify" {
    interface FastifyInstance {
        browser: Browser;
    }
}

const app = fastify({
    logger: true,
});

app.register(
    fastifyPlugin(async (app, options) => {
        const browser = await chromium.launch();
        app.decorate("browser", browser);
    })
);

app.addHook("onClose", async app => {
    await app.browser.close();
});

app.route({
    method: "GET",
    url: "/a",
    handler: async (request, reply) => {
        reply.header("Content-Type", "application/zip");
        reply.header("Content-Disposition", `attachment; filename=a.zip`);

        const archive = archiver("zip", { zlib: { level: 9 } });
        archive.on("error", error => reply.send(error));
        archive.on("warning", error => reply.send(error));

        archive.append("hi", { name: "a.txt" });
        archive.append("88", { name: "b.txt" });

        archive.pipe(reply.raw);
        await archive.finalize();
    },
});

app.route({
    method: "GET",
    url: "/api/sticker/:stickerId",
    handler: async (request, reply) => {
        if (numOutStandingRequests > 10) {
            reply.status(503).send();
            return;
        }

        ++numOutStandingRequests;

        const stickerId = request.params["stickerId"];

        const page = await app.browser.newPage();
        await page.goto(`https://store.line.me/stickershop/product/${stickerId}/en`);
        const stickerList = await page.locator("ul.FnStickerList").elementHandle();
        const imageURLs = await stickerList.$$eval("li.FnStickerPreviewItem", items => {
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

        reply.header("Content-Type", "application/zip");
        reply.header("Content-Disposition", `attachment; filename=${stickerId}.zip`);

        const archive = archiver("zip", { zlib: { level: 9 } });
        archive.on("error", error => reply.send(error));
        archive.on("warning", error => reply.send(error));

        for (let i = 0; i < imageURLs.length; ++i) {
            app.log.info({ stickerId, index: i + 1, total: imageURLs.length });
            const imageURL = new URL(imageURLs[i]);
            const response = await fetch(imageURL);
            const buffer = await response.buffer();
            archive.append(buffer, { name: `${i + 1}${path.extname(imageURL.pathname)}` });
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        archive.pipe(reply.raw);
        await archive.finalize();
        app.log.info({ stickerId, bytes: archive.pointer() });

        --numOutStandingRequests;
    },
});

app.listen(3000, (error, address) => {
    console.log({ msg: "app started", error, address });
});

/**
 * TODO: stream is not pumped
curl -X GET http://localhost:3000/api/sticker/11366335 --output 11366335.zip
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:--  0:00:20 --:--:--     0
  0     0    0     0    0     0      0      0 --:--:--  0:00:21 --:--:--     0
  0     0    0     0    0     0      0      0 --:--:--  0:00:22 --:--:--     0
  0     0    0     0    0     0      0      0 --:--:--  0:00:23 --:--:--     0
  0     0    0     0    0     0      0      0 --:--:--  0:00:24 --:--:--     0
  0     0    0     0    0     0      0      0 --:--:--  0:00:25 --:--:--     0
  0     0    0     0    0     0      0      0 --:--:--  0:00:26 --:--:--     0
  0     0    0     0    0     0      0      0 --:--:--  0:00:27 --:--:--     0
  0     0    0     0    0     0      0      0 --:--:--  0:00:28 --:--:--     0
  0     0    0     0    0     0      0      0 --:--:--  0:00:29 --:--:--     0
  0     0    0     0    0     0      0      0 --:--:--  0:00:30 --:--:--     0
  0     0    0     0    0     0      0      0 --:--:--  0:00:31 --:--:--     0
100 2779k    0 2779k    0     0  88763      0 --:--:--  0:00:32 --:--:--  744k
 */
