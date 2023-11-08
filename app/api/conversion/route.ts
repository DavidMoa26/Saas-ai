import { NextResponse } from "next/server";
import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});


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
      model: 'gpt-3.5-turbo',
      stream: true,
      messages: messages,
    });


    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}