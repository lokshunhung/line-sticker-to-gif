# line-sticker-to-gif

Download and convert line stickers as gif with headless chromium

Prerequisites: node v14+, yarn v1

Install dependencies:

```sh
$ yarn
```

## Usage

Example: download line sticker pack [14176479](https://store.line.me/stickershop/product/14176479/en)

```sh
$ yarn scrape 14176479   # download .png stickers
$ yarn convert 14176479  # convert downloaded stickers to .gif
$ yarn archive 14176479  # archives converted .gif as zip
```

output directory `./dist/14176479-converted`

Example: download line emoji pack [6124aa4ae72c607c18108562](https://store.line.me/emojishop/product/6124aa4ae72c607c18108562/en)

```sh
$ yarn scrape 6124aa4ae72c607c18108562 --emoji # download .png stickers
$ yarn convert 6124aa4ae72c607c18108562        # convert downloaded emojis to .gif
```

---

Example: run server and download [11366335](https://store.line.me/stickershop/product/11366335/en)

```sh
$ yarn app  # starts server
$ curl -X GET http://localhost:3000/api/sticker/11366335 --output 11366335.zip
```

---

How to make gif loop infinitely with `ffmpeg` without degrading image quality:

```sh
$ ffmpeg -i 13.gif \
      -vf palettegen \
      13.palette.png && \
  ffmpeg -i 13.gif \
      -i 13.palette.png \
      -filter_complex paletteuse \
      -loop 0 \
      13.output.gif
```