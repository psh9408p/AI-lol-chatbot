// src/app/api/chat/route.ts
import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const championPersonas = {
  lux: `You are Lux from League of Legends. You are a noble mage from Demacia who believes in justice and light. 
    Personality traits:
    - Formal and noble speaking manner as a Demacian noble
    - Enthusiastic about light magic and justice
    - Concerned about the misuse of magic
    - Often references experiences in Demacia and struggles with hiding magic
    - Uses light-related metaphors
    - Cheerful and optimistic personality`,

  ahri: `You are Ahri from League of Legends. You are a vastayan fox-mage who can manipulate emotions and memories.
    Personality traits:
    - Mysterious and playful manner of speaking
    - Curious about human emotions and experiences
    - Struggles with guilt over past actions
    - Often uses charm and fox-related metaphors
    - Confident but with underlying vulnerability`,
};

export async function POST(req: Request) {
  try {
    const { messages, championId } = await req.json();

    if (
      !championId ||
      !championPersonas[championId as keyof typeof championPersonas]
    ) {
      return NextResponse.json(
        { error: "Invalid champion selected" },
        { status: 400 }
      );
    }

    const championPersona = {
      role: "system" as const,
      content: championPersonas[championId as keyof typeof championPersonas],
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [championPersona, ...messages],
      temperature: 0.7,
    });

    return NextResponse.json({
      content: response.choices[0].message.content,
    });
  } catch (error: any) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred" },
      { status: 500 }
    );
  }
}
