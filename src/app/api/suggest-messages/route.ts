import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
     console.log("Hit /api/suggest-messages");
    const { message } = await req.json();
    console.log("Message:", message);

    if (!process.env.GEMINI_API_KEY) {
      return Response.json({success:false,
        message:"Gemini API key not configured"}, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 
"What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?".
Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.
`;

    const result = await model.generateContent(prompt);
    const raw = result.response.text().trim();

    const questions = raw.split("||").map(q => q.trim()).filter(Boolean);

  return Response.json({success:true,
        questions}, { status: 200 });
  } catch (err) {
    console.error("Gemini API error:", err);
     return Response.json({success:false,
        message:"somthing went wrong"}, { status: 500 });
  }
}
