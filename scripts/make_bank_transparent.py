from PIL import Image
import os
import glob

# Get the latest bank image from brain dir
brain_dir = r"C:\Users\Prathmesh\.gemini\antigravity-ide\brain\c34e48f2-d5fc-4930-946b-992fbd1accc0"
asset_dir = r"e:\VSCodeCodes\BankRoll\assets\images\avatars"

files = glob.glob(os.path.join(brain_dir, "avatar_bank_*.png"))
if files:
    src = max(files, key=os.path.getmtime) # Get the newest one just in case
    dst = os.path.join(asset_dir, "t_avatar_bank.png")
    
    img = Image.open(src).convert("RGBA")
    datas = img.getdata()
    
    newData = []
    for item in datas:
        lum = int(0.299 * item[0] + 0.587 * item[1] + 0.114 * item[2])
        if lum > 200:
            newData.append((0, 0, 0, 0))
        else:
            alpha = int(255 * (1 - (lum / 200)))
            newData.append((0, 0, 0, alpha))
            
    img.putdata(newData)
    img.save(dst, "PNG")
    print("Bank image processed perfectly!")
else:
    print("Could not find bank image.")
