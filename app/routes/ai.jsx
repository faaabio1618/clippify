import {Configuration, OpenAIApi} from "openai";
import generateImage from "~/lib/imageGenerator";

const configuration = new Configuration({
  apiKey: process.env.OPEN_API_KEY
});

const openai = new OpenAIApi(configuration);


export const getChatStream = async ({message}) => {
  return await openai.createChatCompletion({
    model: "gpt-4",
    messages: [
      {
        "role": "user",
        "content": message
      }
    ],
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  }).then(res => res.data);
};

function withCors() {
  const headers = new Headers();

  headers.append('Access-Control-Allow-Origin', '*');

  headers.append(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, referer-path'
  );

  return headers;
}

export const loader = async ({request}) => {
  const url = new URL(request.url);
  const firstName = url.searchParams.get("firstName");
  const title1 = url.searchParams.get("title1");
  const title2 = url.searchParams.get("title2");
  const customerName = firstName ? "Their name is " + firstName + "." : ""
  let cartMessage;
  if (title2) {
    cartMessage = `They have purchased ${title1} and ${title2}. And you should explain how good they go together.`
  } else {
    cartMessage = `They have purchased ${title1} and you should find a good reason to use it.`
  }
  const prompt = `You are a shop assistant that is helping a customer. ${customerName} You want them to be happy about their purchase.
  ${cartMessage} Say that in a short sentence suggesting that they should buy it. Be assertive. Don't put it in quotes.`

  let res = await getChatStream({
    message: prompt
  }).then(res => res.choices[0]?.message?.content || "Sorry, your taste is too good, I'm speechless.");

  res = generateImage(res);
  console.log(generateImage("                                                             Hi! Ready to complete your purchase? I'm here to make your checkout quick and easy."));
  return new Response(res, {headers: withCors()});
};
