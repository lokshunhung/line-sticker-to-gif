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
$ yarn scrape 14176479
$ yarn convert 14176479
```

gif output directory `./dist/14176479`
