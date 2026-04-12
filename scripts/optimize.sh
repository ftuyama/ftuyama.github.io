# `for file in public/images/**/*; do cwebp -q 80 "$file" -o "${file%.*}.webp"; done`
# `for file in public/images/*; do cwebp -q 80 "$file" -o "${file%.*}.webp"; done`

precision=(public/images/brands/unipds.png)

for file in "${precision[@]}"; do
    cwebp -q 100 "$file" -o "${file%.*}.webp";
done
