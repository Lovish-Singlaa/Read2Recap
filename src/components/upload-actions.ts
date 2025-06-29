"use server";

import { generateSummaryFromGemini } from "@/lib/gemini";
import { extractTextFromFile } from "@/lib/langchain";

export const generateSummary = async (response: {
    serverData: {
        userId: string;
        file: {
            url: string;
            name: string;
        }
    }
}) => {
    const {userId, file} = response.serverData;
    if(!userId || !file){
        return {
            success: false,
            message: "File upload failed",
            data: null,
        }
    }

    const text = await extractTextFromFile(file.url);
    // console.log("text: ", text);

    const summary = await generateSummaryFromGemini(text);
    return {
        success: true,
        message: "Summary generated successfully",
        data: summary,
    }    
}