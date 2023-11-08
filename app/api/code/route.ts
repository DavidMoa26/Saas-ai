import { NextResponse } from "next/server";
import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';



const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const instructionMessage = {
  role: "system",
  content: "You are a code generator. You must answer only in markdown code snippers. Use code comments for explanations."
}


export async function POST(
  req: Request,
) {
  try {
    const body = await req.json();
    const { messages } = body

    if (!process.env.OPENAI_API_KEY) {
      return new NextResponse("Invalid api key", { status: 500 });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      temperature: 0.9,
      max_tokens: 256,
      stream: true,
      messages: [instructionMessage, ...messages],
    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}