command -v magick >/dev/null 2>&1 || { echo "Error: magick not found. Install with: sudo apt install imagemagick"; exit 1; }

for img in *.png *.jpg *.jpeg; do
    [ -e "$img" ] || continue
    base="${img%.*}"
    out="${base}.avif"
    echo "Converting: $img → $out"

    magick "$img" -quality 100 -define heic:speed=0 -define avif:chroma-subsampling=4:4:4 "$out"
done
