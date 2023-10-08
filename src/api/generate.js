import OpenAI from "openai";

console.log(process.env);

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true 
});

async function generate(animal) {
  if (!openai.apiKey) {
    throw new Error("OpenAI API key not configured, please follow instructions in README.md");
  }

  if (animal.trim().length === 0) {
    throw new Error("Please enter a valid animal");
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: 'system', content: 'Suggest three names for an animal that is a superhero.' }, 
      { role: 'user', content: 'Animal: Cat' },
      { role: 'assistant', content: 'Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline' },
      { role: 'user', content: 'Animal: Dog' },
      { role: 'assistant', content: 'Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot' },
      { role: 'user', content: `Animal: ${animal}` },
    ],
    temperature: 0.6,
  });
  return completion.choices;
}

export default generate;
