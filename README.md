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

---

Example: run server and download [11366335](https://store.line.me/stickershop/product/11366335/en)

```sh
$ yarn app  # starts server
$ curl -X GET http://localhost:3000/api/sticker/11366335 --output 11366335.zip
```
