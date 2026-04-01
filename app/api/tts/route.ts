import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { text, lang_code, voice, speed, split_pattern } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Texte invalide." }, { status: 400 });
    }

    const response = await fetch(`${process.env.API_URL}/tts?download=${process.env.DOWNLOAD_FLAG}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.TTS_API_TOKEN}`,
      },
      body: JSON.stringify({
        text,
        lang_code,
        voice,
        speed,
        split_pattern,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `TTS API error ${response.status}: ${errorText}` },
        { status: 502 }
      );
    }

    const audioBuffer = await response.arrayBuffer();
    const upstreamType = response.headers.get("content-type") ?? "audio/wav";
    const upstreamDisposition =
      response.headers.get("content-disposition") ??
      'attachment; filename="tts.wav"';

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": upstreamType,
        "Content-Disposition": upstreamDisposition,
      },
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Erreur serveur pendant la génération audio." },
      { status: 500 }
    );
  }
}