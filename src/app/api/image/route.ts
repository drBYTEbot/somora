import { NextRequest, NextResponse } from "next/server";

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

export async function POST(req: NextRequest) {
  if (!HF_API_KEY) {
    return NextResponse.json({ error: "AI is not configured." }, { status: 500 });
  }

  try {
    const { prompt } = await req.json();

    const res = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
          "x-wait-for-model": "true",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { width: 512, height: 512 },
        }),
        signal: AbortSignal.timeout(25000),
      },
    );

    if (!res.ok) {
      const errText = await res.text().catch(() => "unknown");
      console.error("HF image error:", res.status, errText);
      return NextResponse.json(
        { error: `Image generation failed (${res.status}).` },
        { status: 500 },
      );
    }

    const contentType = res.headers.get("content-type") ?? "";

    if (contentType.startsWith("image/")) {
      const buffer = await res.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      return NextResponse.json({ url: `data:${contentType};base64,${base64}` });
    }

    const data = await res.json().catch(() => ({}));
    if (data?.error) {
      return NextResponse.json({ error: data.error }, { status: 500 });
    }

    return NextResponse.json({ error: "Unexpected image response." }, { status: 500 });
  } catch (err) {
    console.error("Image route error:", err);
    return NextResponse.json({ error: "Image generation failed." }, { status: 500 });
  }
}
