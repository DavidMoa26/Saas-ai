import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from 'openai';
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";

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
    const { userId } = auth();
    const body = await req.json();


    const { prompt, amount = 1, resolution = "512x512" } = body

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return new NextResponse("Invalid api key", { status: 500 });
    }

    if (!prompt || !amount || !resolution) {
      return new NextResponse("Body request error", { status: 500 });
    }

    const freeTrial = await checkApiLimit()

    if (!freeTrial) {
      return new NextResponse("Free trial expired", { status: 403 });
    }

    const response = await openai.images.generate({
      prompt,
      n: parseInt(amount, 10),
      size: resolution,
    });

    await increaseApiLimit()

    return new NextResponse(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}