import { NextRequest, NextResponse } from "next/server";

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HF_INFERENCE = "https://api-inference.huggingface.co/models";

export async function POST(req: NextRequest) {
  if (!HF_API_KEY) {
    return NextResponse.json({ error: "AI is not configured." }, { status: 500 });
  }

  try {
    const { prompt } = await req.json();

    const res = await fetch(`${HF_INFERENCE}/black-forest-labs/FLUX.1-schnell`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { width: 512, height: 512 },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("HF image error:", res.status, errText);
      return NextResponse.json(
        { error: `Image generation failed (${res.status}).` },
        { status: res.status },
      );
    }

    const contentType = res.headers.get("content-type") ?? "";

    if (contentType.startsWith("image/")) {
      const buffer = await res.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      const dataUrl = `data:${contentType};base64,${base64}`;
      return NextResponse.json({ url: dataUrl });
    }

    // Some models return JSON with a path or error
    const data = await res.json();
    if (data?.error) {
      return NextResponse.json({ error: data.error }, { status: 500 });
    }

    return NextResponse.json({ error: "Unexpected response from image API." }, { status: 500 });
  } catch {
    return NextResponse.json({ error: "Image generation failed." }, { status: 500 });
  }
}
