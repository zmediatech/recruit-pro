const { GoogleGenerativeAI } = require("@google/generative-ai");

// --- LOCAL MOCK DATABASE ---
const MOCK_QUESTIONS = {
    "Software Developer": [
        { "questionText": "Explain the difference between virtual DOM and real DOM in React.", "type": "ShortAnswer", "correctAnswer": "Virtual DOM is a lightweight copy of the real DOM. React uses it to batch updates and minimize layout thrashing." },
        { "questionText": "Which of these is NOT a primitive type in JavaScript?", "type": "MCQ", "options": ["String", "Number", "Object", "Boolean"], "correctAnswer": "Object" },
        { "questionText": "What is the time complexity of searching in a balanced Binary Search Tree?", "type": "MCQ", "options": ["O(1)", "O(n)", "O(log n)", "O(n^2)"], "correctAnswer": "O(log n)" },
        { "questionText": "Explain the concept of closures in JavaScript.", "type": "ShortAnswer", "correctAnswer": "A closure is the combination of a function bundled together (enclosed) with references to its surrounding state." },
        { "questionText": "Scenario: Your production backend is experiencing high latency. How do you identify the bottleneck?", "type": "Scenario", "correctAnswer": "Use profiling tools, check DB query logs, monitor CPU/Memory, and check network latency." }
    ],
    "UI/UX Designer": [
        { "questionText": "What is 'White Space' and why is it important in design?", "type": "ShortAnswer", "correctAnswer": "Negative space between elements. It improves readability and focuses user attention." },
        { "questionText": "Which principle describes how users perceive elements close to each other as related?", "type": "MCQ", "options": ["Contrast", "Proximity", "Repetition", "Alignment"], "correctAnswer": "Proximity" },
        { "questionText": "What does 'Affordance' refer to in UI design?", "type": "MCQ", "options": ["The cost of the software", "Visual clues to an object's function", "Slow loading speeds", "Color palette harmony"], "correctAnswer": "Visual clues to an object's function" },
        { "questionText": "Explain the 'Rule of Thirds'.", "type": "ShortAnswer", "correctAnswer": "A composition guide that divides an image into nine equal parts for better visual balance." },
        { "questionText": "Scenario: A client wants to put 10 items in the primary navigation. How do you convince them otherwise?", "type": "Scenario", "correctAnswer": "Reference Hick's Law, use heatmaps/analytics, and propose categorization or a mega-menu." }
    ],
    "Default": [
        { "questionText": "Explain your approach to learning a new technical domain within a week.", "type": "ShortAnswer", "correctAnswer": "Documentation study, hands-on tutorials, and building a small prototype." },
        { "questionText": "What is the primary benefit of version control systems?", "type": "MCQ", "options": ["Faster hardware", "Collaboration and history tracking", "Automatic code generation", "Virus protection"], "correctAnswer": "Collaboration and history tracking" },
        { "questionText": "Which tool is commonly used for project management?", "type": "MCQ", "options": ["VLC", "Jira", "Adobe Premiere", "Notepad"], "correctAnswer": "Jira" },
        { "questionText": "Explain 'Soft Skills' in a technical environment.", "type": "ShortAnswer", "correctAnswer": "Communication, empathy, and teamwork skills essential for professional success." },
        { "questionText": "Scenario: You have a critical deadline but a major bug is discovered. What is your priority?", "type": "Scenario", "correctAnswer": "Communicate with stakeholders, assess impact, and decide on a hotfix or feature delay." }
    ]
};

// Helper to get Gemini AI instance with latest env vars
function getGenAI() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "AIzaSyDummyKeyForInitialization" || apiKey.length < 20) {
        return null; // Force fallback
    }
    return new GoogleGenerativeAI(apiKey);
}

/**
 * Parses CV text and extracts psychometric signals and professional metadata.
 */
async function analyzeCV(text, jobDescription = "") {
    const genAI = getGenAI();
    if (!genAI) return mockAnalyzeCV(text, jobDescription);

    try {
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

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const jsonText = response.text().replace(/```json|```/g, "").trim();
        return JSON.parse(jsonText);
    } catch (err) {
        console.warn("Gemini API failed, falling back to mock analysis.");
        return mockAnalyzeCV(text, jobDescription);
    }
}

function mockAnalyzeCV(text, jobDescription) {
    return {
        skillMatch: 85,
        experienceDepth: "Senior",
        missingCompetencies: ["Advanced Cloud Architecture", "PostgreSQL Optimization"],
        suitabilityScore: 92,
        riskSignals: ["High expectation in Zero-API mode"],
        summary: "Analysis performed via Local System Fallback (No External API used)."
    };
}

/**
 * Generates dynamic technical questions based on the role and candidate's CV.
 */
async function generateAdaptiveTest(candidateProfile, jobTitle) {
    const genAI = getGenAI();
    if (!genAI) return mockGenerateAdaptiveTest(jobTitle);

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            Generate 5 advanced technical interview questions for a candidate applying for the position of: ${jobTitle}.
            Candidate Profile Context: ${candidateProfile}
            
            REQUIREMENTS:
            - Return EXACTLY 5 questions.
            - Question types must be balanced:
                - 2 Multiple Choice Questions (MCQ) - Provide 4 clear options.
                - 2 Short Answer/Problem Solving questions.
                - 1 Scenario-based question (contextual technical challenge).
            - Difficulty range: 6-10 (High complexity).
            
            JSON FORMAT (Return ONLY this structure):
            [
                {
                    "questionText": "The text of the question",
                    "type": "MCQ",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "correctAnswer": "The correct option text"
                },
                {
                    "questionText": "The text of the question",
                    "type": "ShortAnswer",
                    "correctAnswer": "Key technical points expected in the answer"
                },
                {
                    "questionText": "Scenario: ... What would you do?",
                    "type": "Scenario",
                    "correctAnswer": "Best architectural/logical approach"
                }
            ]
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const jsonText = response.text().replace(/```json|```/g, "").trim();
        return JSON.parse(jsonText);
    } catch (err) {
        console.warn("Gemini API failed, falling back to mock questions.");
        return mockGenerateAdaptiveTest(jobTitle);
    }
}

function mockGenerateAdaptiveTest(jobTitle) {
    console.log(`[SERVICE] Generating local mock questions for: ${jobTitle}`);
    const questions = MOCK_QUESTIONS[jobTitle] || MOCK_QUESTIONS["Default"];
    // Shuffle slightly if needed, but return exactly 5
    return questions.slice(0, 5);
}

/**
 * Evaluates candidate responses to technical questions.
 */
async function evaluateTechnicalAssessment(questions, answers, jobTitle) {
    const genAI = getGenAI();
    if (!genAI) return mockEvaluateTechnicalAssessment(questions, answers);

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const evalPrompt = `
            Evaluate the following candidate technical assessment for the position: ${jobTitle}.
            
            QUESTIONS & ANSWERS:
            ${questions.map((q, idx) => `Q: ${q.questionText}\nA: ${answers[idx] || "No answer provided"}\nRef Answer: ${q.correctAnswer}`).join('\n\n')}
            
            REQUIREMENTS:
            1. Provide an overall technical score (0-100).
            2. Provide a concise evaluation summary (2-3 sentences).
            3. List exactly 3 strengths and 2 weaknesses.
            4. Recommend a level: Beginner, Intermediate, or Advanced.
            
            JSON FORMAT (Return ONLY this structure):
            {
                "overallScore": number,
                "evaluationSummary": "string",
                "strengths": ["string", "string", "string"],
                "weaknesses": ["string", "string"],
                "recommendedLevel": "Beginner" | "Intermediate" | "Advanced"
            }
        `;

        const result = await model.generateContent(evalPrompt);
        const response = await result.response;
        const jsonText = response.text().replace(/```json|```/g, "").trim();
        return JSON.parse(jsonText);
    } catch (err) {
        console.warn("Gemini Evaluation failed, using mock evaluation.");
        return mockEvaluateTechnicalAssessment(questions, answers);
    }
}

function mockEvaluateTechnicalAssessment(questions, answers) {
    // Deterministic scoring based on answer length and keyword presence
    let totalScore = 0;
    answers.forEach((ans, idx) => {
        if (!ans) return;
        let qScore = 0;
        
        // Basic heuristic: length and keyword matching
        if (ans.length > 20) qScore += 40;
        if (ans.length > 50) qScore += 20;
        
        // Check for common technical keywords
        const keywords = ['logic', 'system', 'react', 'dom', 'function', 'approach', 'optimization'];
        keywords.forEach(kw => {
            if (ans.toLowerCase().includes(kw)) qScore += 10;
        });
        
        totalScore += Math.min(100, qScore);
    });

    const averageScore = Math.round(totalScore / questions.length);

    return {
        overallScore: averageScore,
        evaluationSummary: `Evaluation completed via Local System Logic. The candidate demonstrated ${averageScore > 70 ? 'strong' : 'moderate'} technical coherence with a total score of ${averageScore}%.`,
        strengths: ["Clear communication", "Practical approach", "Logical structuring"],
        weaknesses: ["Deep architectural detail", "Optimization nuances"],
        recommendedLevel: averageScore > 80 ? "Advanced" : averageScore > 50 ? "Intermediate" : "Beginner"
    };
}

module.exports = { analyzeCV, generateAdaptiveTest, evaluateTechnicalAssessment };
