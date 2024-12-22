import OpenAI from 'openai';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

const systemPrompt =  `
Provide the following details from a Medical Certificate (MC) in the exact format: Patient Name, Start Date in UNIX time (milliseconds), Duration in days, Clinic Name.

Instructions:
Extract the Patient Name. If there is a comma in the name, omit it.
Convert the Start Date (given as dd/mm/yyyy in the MC) to UNIX time in milliseconds.
Extract the Duration of the MC in days.
Extract the Clinic Name.
Output Example:
John Doe, 1640995200000, 7, Medical Clinic

Ensure the format is followed precisely without additional text or formatting.
`;

export default async function retrieveDataFromMC(medicalCertUrl) {
    const data = await client.chat.completions.create({
        model: "gpt-4o",
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