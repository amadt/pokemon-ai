import OpenAI from "openai";

console.log(process.env.NEXT_PUBLIC_OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true 
});

async function generate(type, description, where) {
  if (!openai.apiKey) {
    throw new Error("OpenAI API key not configured, please follow instructions in README.md");
  }

  if (description.trim().length === 0) {
    throw new Error("Please enter a valid description");
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: 'system', content: `
  You are a game developer creating new Pokemon. 
  We will provide the type of Pokemon and a brief description. 
  You will generate a name and a description for the new Pokemon.
  The description should be a maximum of 200 characters in length.
  You will need to provide a health point value with the min being 30 and the max being 340.
  Provide a one or two word classification.
  Include a height in feet and inches
  Include a weight in pounds.
  Include a weakness.
  Optional include a resistance.
  Include a retreat value.
  Include 1 or 2 moves.
  Each move should have an energy cost, name, damage, and move instructions if any.
  Damage should always be present and be a value over 10.
  The energy costs should have a label of "Energy: " and list out all energies needed individually. For example, if my energy cost is 2 fire and 1 Normal, it should be “Fire Fire Normal”.
  The move number and name should be listed together, like "1. Ember Charge". Then the energy, damage, and instructions will proceed.
  `
      }, 
      { role: 'user', content: `Generate a ${type} Pokemon with the following description: ${description}. This pokemon lives in ${where}` },
    ],
    temperature: 0.6,
  });
  return completion.choices;
}

export async function generateFromPrompt(prompt, instructions) {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: 'system', content: instructions }, 
      { role: 'user', content: prompt },
    ],
    temperature: 0.6,
  });
  return completion.choices;
}

export default generate;


