import OpenAI from 'openai';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export default async function retrieveDataFromMC(medicalCertImage) {
    // Create an assistant to read the medical certificate
    const assistant = await client.beta.assistants.create({
        name: "Medical Certificate Data Assistant",
        instructions: `
            You are an analyst supposed to read various information from a medical certificate provided to you.
            Read the Medical Certificate, and provide the following information in an array format, in the order of:
            1. Patient Name
            2. Start Date of the Medical Certificate but convert it to UNIX time in Miliseconds
            3. Duration of the Medical Certificate
            4. Clinic Name
            It should look something like: John Doe, 1640995200000, 7, Medical Clinic
        `,
        model: "gpt-4o-mini",
        tools: [{ type: "file_search" }]
    });

    
    const medicalCertificateFileData = await client.files.create({
        file: fs.createReadStream(medicalCertImage.path),
        purpose: "assistants"
    })

    const thread = await client.beta.threads.create({
        messages: [
            {
                role: "user",
                content: "Read the medical certificate and provide the required information",
                attachments: [{ file_id: medicalCertificateFileData.id, tools: [{ type: "file_search" }] }]
            }
        ]
    })

    
}