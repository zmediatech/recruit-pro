const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyDummyKeyForInitialization");

/**
 * Parses CV text and extracts psychometric signals and professional metadata.
 */
async function analyzeCV(text, jobDescription = "") {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
        Analyze the following CV text and extract metrics for a Recruitment Orchestration System.
        Return ONLY a JSON object with this structure:
        {
            "skillMatch": number (0-100),
            "experienceDepth": "Junior" | "Mid" | "Senior" | "Lead",
            "missingCompetencies": string[],
            "suitabilityScore": number (0-100),
            "riskSignals": string[],
            "summary": string
        }

        JOB CONTEXT (if any): ${jobDescription}
        CV TEXT: ${text}
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const jsonText = response.text().replace(/```json|```/g, "").trim();
        return JSON.parse(jsonText);
    } catch (err) {
        console.error("Gemini Analysis Error:", err);
        return {
            skillMatch: 50,
            experienceDepth: "Unknown",
            missingCompetencies: [],
            suitabilityScore: 50,
            riskSignals: ["Analysis failure - potential data corruption"],
            summary: "AI analysis was unable to process this dossier at this time."
        };
    }
}

/**
 * Generates dynamic technical questions based on the role and candidate's CV.
 */
async function generateAdaptiveTest(candidateProfile, jobTitle) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
        Generate 5 advanced technical interview questions for a candidate applying for: ${jobTitle}.
        Candidate Background: ${candidateProfile}
        
        Focus on:
        - Systemic thinking
        - Edge cases
        - Reasoning under pressure
        
        Each question should have:
        1. Question Text
        2. Expected Answer Keypoints
        3. Difficulty (1-10)
        
        Return as JSON array of objects.
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const jsonText = response.text().replace(/```json|```/g, "").trim();
        return JSON.parse(jsonText);
    } catch (err) {
        console.error("Test Generation Error:", err);
        return [];
    }
}

module.exports = { analyzeCV, generateAdaptiveTest };
