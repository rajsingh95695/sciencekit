import { GoogleGenAI } from "@google/genai";

export async function formatProductDataAI(data: { title: string; description: string; brand?: string; specs?: any; variants?: any[] }) {
  // If no Gemini API key is configured, fallback gracefully
  if (!process.env.GEMINI_API_KEY) {
    return {
      cleanTitle: data.title || "Imported Product",
      cleanDescription: `<p>${(data.description || "").substring(0, 500)}...</p>`,
      features: ["Provides general science utility.", "Requires manual review."]
    };
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `
      You are an expert e-commerce copywriter. I am providing you a raw scraped product data.
      Title: ${data.title}
      Description: ${data.description.substring(0, 3000)}
      Brand: ${data.brand || 'Unknown'}
      Specs: ${JSON.stringify(data.specs || {})}
      Variants: ${JSON.stringify(data.variants || [])}
      
      Return a JSON object with:
      - cleanTitle: A concise, SEO-friendly product title.
      - cleanDescription: A highly polished, HTML-formatted rich text description (using <p>, <strong>, <ul>, <li>). Include brand and spec details naturally if available.
      - features: An array of 3-5 bullet point strings highlighting key specifications or included components.
      
      Respond ONLY with valid JSON. Do not include markdown blocks.
    `;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });
    
    const text = response.text || "{}";
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const result = JSON.parse(cleanedText);
    
    return {
      cleanTitle: result.cleanTitle || data.title,
      cleanDescription: result.cleanDescription || data.description,
      features: result.features || []
    };
  } catch (error) {
    console.error("AI Formatting Error:", error);
    return {
      cleanTitle: data.title,
      cleanDescription: `<p>${data.description.substring(0, 500)}...</p>`,
      features: ["Auto-formatting failed."]
    };
  }
}
