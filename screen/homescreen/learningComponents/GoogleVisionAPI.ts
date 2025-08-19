import axios, { AxiosResponse } from "axios";

// Bạn cần thay thế 'YOUR_API_KEY' bằng khóa API thực tế của bạn
const GOOGLE_VISION_API_KEY: string = "AIzaSyCOXqDY2VLPONkbA-cKWiHMA_TqmjUse6Y";

interface VisionAnnotationResponse {
  responses: {
    textAnnotations: {
      description: string;
    }[];
  }[];
}

export const GoogleVisionAPI = {
  recognizeHandwriting: async (base64Image: string): Promise<string> => {
    try {
      console.log(
        "[GoogleVisionAPI] Đang gửi request tới Google Vision API..."
      );
      const response: AxiosResponse<VisionAnnotationResponse> =
        await axios.post(
          `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`,
          {
            requests: [
              {
                image: {
                  content: base64Image.split(",")[1],
                },
                features: [
                  {
                    type: "TEXT_DETECTION",
                  },
                ],
              },
            ],
          }
        );

      console.log(
        "[GoogleVisionAPI] Đã nhận được phản hồi từ API:",
        response.data
      );

      if (response.data && response.data.responses.length > 0) {
        const textAnnotations = response.data.responses[0].textAnnotations;
        if (textAnnotations && textAnnotations.length > 0) {
          const recognizedText = textAnnotations[0].description;
          return recognizedText.trim();
        }
      }
      return "";
    } catch (error) {
      console.error("[GoogleVisionAPI] Lỗi khi gọi Google Vision API:", error);
      return "";
    }
  },
};
