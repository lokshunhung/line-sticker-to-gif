# Experimental

## Replacing `apng2gif` with `ffmpeg` to generate GIF (with loop fix):

Command:

```sh
$ cd dist/654f0d4061d46e24927970e3
$ ffmpeg \
    -f apng \
    -i 2.png \
    -vf "split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
    -loop 0 \
    2.gif
```

Explanation:
- `-f apng` (before `-i`)  
  specify the input format to be "apng"
- `-i 2.gif`  
  specify the input file path
- `-vf "split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse"`  
  `-vf` Create [filtergraph](https://ffmpeg.org/ffmpeg-filters.html#Filtering-Introduction) of:
  - `split[s0][s1]` [Split stream](https://ffmpeg.org/ffmpeg-filters.html#split_002c-asplit) into `s0`, `s1`
  - Take `s0` as input to [`palettegen`](https://ffmpeg.org/ffmpeg-filters.html#palettegen-1) and name output palette as `p`
  - Take `s1`, `p` as input to [`paletteuse`](https://ffmpeg.org/ffmpeg-filters.html#paletteuse) to preserve GIF quality
- `-loop 0`  
  infinite GIF loop (No-Loop=-1; Infinite-Loop=0; N-Times=N)

Filtergraph:
```
                 [s1]
input --> split ----------------> paletteuse --> output
           |                        ^
           | [s0]               [p] |
           +------> palettegen -----+
```
