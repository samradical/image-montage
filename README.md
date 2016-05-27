#tiled montage of images


node montage-images.js --d folder_of_images --r resize_image_to_height --fps --h target_motageHeight --w target_motageWidth

ffmpeg -framerate 25 -pattern_type glob -i "*.jpg" -c:v libx264 -preset slow -crf 22 -vf crop=853:480:0:0 movie.mp4

![alt-text](https://s3-eu-west-1.amazonaws.com/chromegno.me/_OUT.jpg)
