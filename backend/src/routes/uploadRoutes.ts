import path from "path";
import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import multer, { type FileFilterCallback } from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "../uploads");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 2,
  },
});

router.post("/", upload.array("images", 2), (req: Request, res: Response) => {
  if (!req.files || req.files.length === 0) {
    console.error("Ошибка: файлы не загружены");

    res.status(400).json({ message: "Необходимо загрузить хотя бы один файл" });
    return;
  }

  const imagePaths = (req.files as Express.Multer.File[]).map(
    (file) => `/uploads/${file.filename}`
  );
  res.json({
    message: `Картинки успешно загружены`,
    images: imagePaths,
  });
});

export default router;
