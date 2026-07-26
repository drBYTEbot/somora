import { NextRequest, NextResponse } from "next/server";

const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;

const MODELS = [
  "stabilityai/stable-diffusion-3-medium-diffusers",
  "stabilityai/stable-diffusion-xl-base-1.0",
  "stable-diffusion-v1-5/stable-diffusion-v1-5",
];

export async function POST(req: NextRequest) {
  if (!HF_API_KEY) {
    return NextResponse.json({ error: "AI is not configured." }, { status: 500 });
  }

  const { prompt } = await req.json();

  for (const model of MODELS) {
    try {
      const res = await fetch(
        `https://router.huggingface.co/hf-inference/models/${model}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${HF_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: prompt,
            parameters: { width: 512, height: 512 },
          }),
          signal: AbortSignal.timeout(50000),
        },
      );

      // Model loading — wait and retry this model once
      if (res.status === 503) {
        const data = await res.json().catch(() => ({}));
        const wait = Math.min((data.estimated_time ?? 20), 30);
        console.log(`Model ${model} loading, waiting ${wait}s...`);
        await new Promise((r) => setTimeout(r, wait * 1000));

        const retryRes = await fetch(
          `https://router.huggingface.co/hf-inference/models/${model}`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${HF_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              inputs: prompt,
              parameters: { width: 512, height: 512 },
            }),
            signal: AbortSignal.timeout(50000),
          },
        );

        if (retryRes.ok) {
          const contentType = retryRes.headers.get("content-type") ?? "";
          if (contentType.startsWith("image/")) {
            const buffer = await retryRes.arrayBuffer();
            const base64 = Buffer.from(buffer).toString("base64");
            return NextResponse.json({ url: `data:${contentType};base64,${base64}` });
          }
        }
        // Retry failed, try next model
        continue;
      }

      if (res.ok) {
        const contentType = res.headers.get("content-type") ?? "";
        if (contentType.startsWith("image/")) {
          const buffer = await res.arrayBuffer();
          const base64 = Buffer.from(buffer).toString("base64");
          return NextResponse.json({ url: `data:${contentType};base64,${base64}` });
        }
      }

      // Log and try next model
      const errText = await res.text().catch(() => "");
      console.error(`Model ${model} failed:`, res.status, errText.slice(0, 200));
    } catch (err) {
      console.error(`Model ${model} error:`, err);
    }
  }

  return NextResponse.json(
    { error: "Image generation failed. The AI might be busy — try again in a moment." },
    { status: 500 },
  );
}
