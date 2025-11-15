import express from "express";
import documentRoutes from "./documentRoutes.js";

const router = express.Router();

router.use("/documents", documentRoutes);

router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString(),
  });
});

export default router;
