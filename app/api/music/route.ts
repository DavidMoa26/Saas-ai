import { NextResponse } from "next/server";
import Replicate from 'replicate'


const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});


export async function POST(
  req: Request,
) {
  try {
    const body = await req.json();
    const { prompt } = body

    if (!prompt) {
      return new NextResponse("prompt is required", { status: 401 });
    }

    if (!process.env.REPLICATE_API_TOKEN) {
      return new NextResponse("Invalid api key", { status: 500 });
    }


    const response = await replicate.run(
      "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
      {
        input: {
          prompt_a: prompt
        }
      }
    );


    return NextResponse.json(response);

  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}