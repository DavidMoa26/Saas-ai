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
      "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
      {
        input: {
          prompt
        }
      }
    );


    return NextResponse.json(response);

  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}