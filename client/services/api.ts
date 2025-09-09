import {
  EditImage,
  EditRequestBody,
  EditSuccessResponse,
  EditErrorResponse,
} from "@shared/api";

class ApiService {
  private baseUrl: string;

  constructor() {
    // In development, we'll use the Vite proxy
    this.baseUrl = import.meta.env.PROD ? "" : "/api";
  }

  async editImages(
    apiKey: string,
    prompt: string,
    images: EditImage[],
    model?: string,
  ): Promise<EditSuccessResponse> {
    const requestBody: EditRequestBody = {
      apiKey,
      prompt,
      images,
      model,
    };

    try {
      const response = await fetch(`${this.baseUrl}/edit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData: EditErrorResponse = await response.json();
        throw new Error(errorData.error || "Failed to edit images");
      }

      const data: EditSuccessResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error editing images:", error);
      throw error;
    }
  }

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      if (!response.ok) {
        throw new Error("Health check failed");
      }
      return await response.json();
    } catch (error) {
      console.error("Health check error:", error);
      throw error;
    }
  }
}

export default new ApiService();
