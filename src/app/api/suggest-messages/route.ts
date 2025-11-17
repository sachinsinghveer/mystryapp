import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.




export async function POST(req: Request) {
  try {
    const { topic } = await req.json();
    const ai = new GoogleGenAI({});

    const prompt = `
   Generate exactly 5 short anonymous feedback messages about: ${topic}.

Return ONLY a JSON array of 5 strings.
No explanations.
No markdown.
No numbering.
Output valid JSON.

    `;

    const result =await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  const text = result.text;
 if(text===undefined){
    throw new Error("No suggestions generated");
 }
  // const suggestions = text
  // .split('\n')                // split on new lines
  // .map(s => s.replace(/^\d+\.\s*/, ""))  // remove "1. ", "2. " etc.
  // .filter(Boolean);           // remove empty lines
  
  //  console.log("Gemini Result:", suggestions);
   
    
    return Response.json({ suggestions: text });
  } catch (err) {
    console.error("Gemini Error:", err);
    return Response.json({ error: "Failed to generate suggestions" }, { status: 500 });
  }
}
