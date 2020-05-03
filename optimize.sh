# `for file in public/images/**/*; do cwebp -q 80 "$file" -o "${file%.*}.webp"; done`
# `for file in public/images/*; do cwebp -q 80 "$file" -o "${file%.*}.webp"; done`

precision=(public/images/me.jpg public/images/header.jpg public/images/coding-min.jpg)

for file in "${precision[@]}"; do
    cwebp -q 100 "$file" -o "${file%.*}.webp";
done
