import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const deepseek = new OpenAI({
  baseURL: 'https://api.deepseek.com/v1',
  apiKey: process.env.DEEPSEEK_API_KEY || 'missing', 
});

const STYLE_PROMPTS: Record<string, string> = {
  ghibli: "Studio Ghibli aesthetic, Hayao Miyazaki drawing style, lush background landscape illustration",
  disney: "Disney 3D animation style, cinematic fairy tale background, royal wardrobe styling",
  onepiece: "One Piece manga profile sketch style, Eiichiro Oda layout artwork, dynamic sea pirate backdrop",
  naruto: "Naruto ninja manga illustration style, Hidden Leaf Village structural elements",
  chow: "1990s Hong Kong comedy movie grading, retro vintage color profiles, dramatic cinematic action shot",
  starwars: "Sci-fi universe space portrait cinematic, wearing galactic outfit accessories, dramatic space setting",
  jurassic: "Prehistoric scene composition, fantasy elements merging human features cleanly into dinosaur characteristics",
  kpop: "Vibrant high-fashion Kpop performance stage layout, glowing arena lighting setups",
  sports: "Professional dynamic sports stadium hero backdrop, high action dramatic tracking lighting look",
  harrypotter: "Hogwarts grand magic atmosphere background, wizards robes clothing styling layout"
};

export async function POST(req: Request) {
  try {
    if (!process.env.DEEPSEEK_API_KEY || !process.env.HUGGINGFACE_API_KEY) {
      return NextResponse.json({ error: "Configuration Error", details: "Missing DEEPSEEK_API_KEY or HUGGINGFACE_API_KEY variables inside Vercel Dashboard Settings." }, { status: 500 });
    }

    const { imageBase64, style } = await req.json();
    const targetVisualPrompt = STYLE_PROMPTS[style] || "Stylized thematic detailed portrait illustration";

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const rawBinaryPayload = Buffer.from(base64Data, 'base64');

    // Query standard image conversion inference engine
    const imageSyncEngineResponse = await fetch(
      "https://api-inference.huggingface.co/models/timbrooks/instruct-pix2pix",
      {
        headers: { 
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/octet-stream"
        },
        method: "POST",
        body: rawBinaryPayload,
      }
    );

    if (!imageSyncEngineResponse.ok) {
      throw new Error(`Visual transfer connection fault status: ${imageSyncEngineResponse.statusText}`);
    }

    const binaryImageArray = await imageSyncEngineResponse.arrayBuffer();
    const finalConvertedImageBase64 = Buffer.from(binaryImageArray).toString('base64');
    const displayImageURI = `data:image/jpeg;base64,${finalConvertedImageBase64}`;

    // Prompt script configuration for story generation
    const storyCompositionDirective = `
      Create a humorous, family-safe, catchy 3-sentence backstory snippet introducing an unexpected new character who just landed inside the '${style}' universe setting. Keep it clean, professional, safe, and highly entertaining. Do not include crude topics or graphic text.
    `;

    const modelDialogueResponse = await deepseek.chat.completions.create({
      messages: [{ role: 'user', content: storyCompositionDirective }],
      model: 'deepseek-chat',
      max_tokens: 160
    });

    const parsedStoryText = modelDialogueResponse.choices[0]?.message?.content || "Anomalous dimensional coordinates confirmed! You have successfully established an optimal thematic foothold inside this unknown space.";

    return NextResponse.json({ imageUrl: displayImageURI, story: parsedStoryText });

  } catch (err: any) {
    return NextResponse.json({ error: "System Pipeline Failed", details: err?.message || "Internal failure" }, { status: 500 });
  }
}