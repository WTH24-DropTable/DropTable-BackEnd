import OpenAI from 'openai';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

const systemPrompt =  `
    Read the Medical Certificate, and provide the following information in the order of:
    1. Patient Name
    2. Start Date of the Medical Certificate but convert it to UNIX time in Miliseconds
    3. Duration of the Medical Certificate
    4. Clinic Name
    The format should be: 'John Doe, 1640995200000, 7, Medical Clinic' FOLLOW IT EXACTLY, NO TEXT FORMATTING.
`;

export default async function retrieveDataFromMC(medicalCertUrl) {
    const data = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "system",
                content: [
                    {
                        type: "text",
                        text: systemPrompt
                    }
                ]
            },
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: "Give me the required information from this image."
                    },
                    {
                        type: "image_url",
                        image_url: {
                            url: medicalCertUrl
                        }
                    }
                ]
            }
        ]
    }).withResponse();

    const response = data.data.choices[0].message.content;
    const responseArray = response.split(", "); 
    const formattedResponse = {
        patientName: responseArray[0],
        startDate: responseArray[1],
        duration: responseArray[2],
        clinicName: responseArray[3]
    }
    return formattedResponse;
}