import multer from "multer"
import path from "path"

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "src/uploads/")
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    const fileName = file.originalname.split(".")[0]
    const ext = path.extname(file.originalname)
    console.log(ext)
    cb(null, fileName + "_" + uniqueSuffix + ext)
  },
})

export const upload = multer({ storage })
