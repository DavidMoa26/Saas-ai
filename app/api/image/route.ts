import { NextResponse } from "next/server";
import OpenAI from 'openai';

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


    const { prompt, amount = 1, resolution = "512x512" } = body

    if (!process.env.OPENAI_API_KEY) {
      return new NextResponse("Invalid api key", { status: 500 });
    }

    if (!prompt || !amount || !resolution) {
      return new NextResponse("Body request error", { status: 500 });
    }


    const response = await openai.images.generate({
      prompt,
      n: parseInt(amount, 10),
      size: resolution,
    });


    return new NextResponse(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}