import OpenAI from 'openai';

export default async function handler(req, res) {
    const extractedText = req.body.extractedText;
    const api_key = req.body.api_key;


    if (!extractedText) {
        return res.status(400).send('You need a req input ');
    }

    const openai = new OpenAI({
        apiKey: api_key,
    });


    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{"role": "user", "content": `Summarize the following consent sign agreement in  Detailed Paragraph:${extractedText}`}],
    });
    
    return res.status(200).json({ text: chatCompletion.choices[0].message.content });
}
