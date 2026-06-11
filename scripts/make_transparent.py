from PIL import Image
import glob
import os
import shutil

# First, copy the original images from the brain directory over to assets so we have a fresh start
brain_dir = r"C:\Users\Prathmesh\.gemini\antigravity-ide\brain\c34e48f2-d5fc-4930-946b-992fbd1accc0"
asset_dir = r"e:\VSCodeCodes\BankRoll\assets\images\avatars"

# We will use the V1 images because we know all 8 exist.
images_to_process = {
    "boot": "avatar_boot_1781111960965.png",
    "briefcase": "avatar_briefcase_1781111906760.png",
    "car": "avatar_car_1781111944688.png",
    "crown": "avatar_crown_1781112021045.png",
    "diamond": "avatar_diamond_1781111933035.png",
    "dog": "avatar_dog_1781111976914.png",
    "tophat": "avatar_tophat_1781112005814.png",
    "vault": "avatar_vault_1781111995849.png",
}

for name, filename in images_to_process.items():
    src = os.path.join(brain_dir, filename)
    dst = os.path.join(asset_dir, f"t_avatar_{name}.png")
    
    if os.path.exists(src):
        # Open the original opaque image
        img = Image.open(src).convert("RGBA")
        datas = img.getdata()
        
        newData = []
        for item in datas:
            # Calculate luminance
            lum = int(0.299 * item[0] + 0.587 * item[1] + 0.114 * item[2])
            
            # The background is cream (~240 luminance)
            # Anything lighter than a medium-light gray (e.g. 200) should be fully transparent
            if lum > 200:
                newData.append((0, 0, 0, 0)) # Fully transparent
            else:
                # For black lines (lum close to 0) and anti-aliasing pixels (lum 0-200)
                # Map luminance to alpha to preserve anti-aliasing edges softly
                # E.g. lum=0 -> alpha=255
                # lum=200 -> alpha=0
                alpha = int(255 * (1 - (lum / 200)))
                newData.append((0, 0, 0, alpha))
                
        img.putdata(newData)
        img.save(dst, "PNG")
        print(f"Processed {name} perfectly!")
    else:
        print(f"Missing {src}")
