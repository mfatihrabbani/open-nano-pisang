import express from "express";
import { GoogleGenAI } from "@google/genai";
import { Buffer } from "buffer";
import { z } from "zod";

const router = express.Router();

// Schema for validating the request body
const editRequestSchema = z.object({
  apiKey: z.string().min(1),
  prompt: z.string().min(1),
  images: z.array(
    z.object({
      mimeType: z.string(),
      data: z.string(),
    }),
  ),
  model: z.string().optional().default("gemini-2.5-flash-image-preview"),
});

// Maximum dimensions for images
const MAX_DIM = 2048; // px

// Helper function to resize an image to maximum dimensions
async function resizeToMax(
  file: Buffer,
  mimeType: string,
): Promise<{ mimeType: string; data: string }> {
  // Create a canvas element (we'll need to use a library like sharp in production)
  // For now, we'll return the original image
  // In a real implementation, you would use sharp or another image processing library

  // This is a placeholder implementation
  // In production, you would use sharp or another image processing library
  return {
    mimeType,
    data: file.toString("base64"),
  };
}

// POST /api/edit - Edit images based on prompt
router.post("/edit", async (req, res) => {
  try {
    // Validate the request body
    const validatedData = editRequestSchema.parse(req.body);
    const { apiKey, prompt, images, model } = validatedData;

    // Initialize the Google Generative AI
    const ai = new GoogleGenAI({ apiKey });

    // Convert images to the format expected by the AI
    const imageParts = images.map((image) => ({
      inlineData: {
        mimeType: image.mimeType,
        data: image.data,
      },
    }));

    // Create the content parts
    const contentParts = [{ text: prompt }, ...imageParts];

    // Generate content using the AI model
    const response = await ai.models.generateContent({
      model,
      contents: contentParts,
    });

    // Process the response
    const resultImages = [];
    for (const candidate of response.candidates[0].content.parts) {
      if (candidate.inlineData) {
        resultImages.push({
          mimeType: candidate.inlineData.mimeType,
          data: candidate.inlineData.data,
        });
      }
    }

    // Return the result
    res.json({
      images: resultImages,
    });
  } catch (error) {
    console.error("Error processing edit request:", error);
    res.status(500).json({
      error: "Failed to process edit request",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

// GET /api/health - Health check endpoint
router.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

export default router;
