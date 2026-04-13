# `for file in static/public/images/**/*; do cwebp -q 80 "$file" -o "${file%.*}.webp"; done`
# `for file in static/public/images/*; do cwebp -q 80 "$file" -o "${file%.*}.webp"; done`

precision=(static/public/images/header.jpg)

for file in "${precision[@]}"; do
    cwebp -q 100 "$file" -o "${file%.*}.webp";
done
