import OpenAI from "openai";

console.log(process.env.NEXT_PUBLIC_OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true 
});

async function generate(type, word, description, where) {
  if (!openai.apiKey) {
    throw new Error("OpenAI API key not configured, please follow instructions in README.md");
  }

  if (word.trim().length === 0) {
    throw new Error("Please enter a valid word");
  }
  if (description.trim().length === 0) {
    throw new Error("Please enter a valid description");
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: 'system', content: `
        You are a game developer creating new Pokemon. 
        We will provide the type of pokemon and a brief description. 
        You will generate a name and a description for the new pokemon.
        Provide a HP value, height (in feet and inches) and weight (in pounds).
        The description should be no longer than 120 charecters.
        chose one or two moves already existing `
      }, 
      { role: 'user', content: `This is a ${word} Pokemon with a type of ${type} and the following description: ${description}. This pokemon lives in ${where}` },
    ],
    temperature: 0.6,
  });
  return completion.choices;
}

export default generate;
