import { NextResponse } from "next/server";
import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { getServerSession } from "next-auth";
import { getApiLimit, decrementApiLimit } from "@/lib/api-limit"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});


export async function POST(
  req: Request,
) {
  try {
    const body = await req.json();
    const { messages } = body
    const session = await getServerSession();


    if (!process.env.OPENAI_API_KEY) {
      return new NextResponse("Invalid api key", { status: 500 });
    }

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const apiLimit = await getApiLimit();

    if (apiLimit && apiLimit === 0) {
      return new NextResponse("API Limit Reached", { status: 429 });
    }

    await decrementApiLimit();

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