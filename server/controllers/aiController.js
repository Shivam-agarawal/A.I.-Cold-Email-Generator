const axios = require("axios");
const EmailHistory = require("../models/EmailHistory");


exports.generateEmail = async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
    }
    try {
        const systemPrompt = `
            You are an expert copywriter specializing in high-converting cold outreach. 
            Your task is to generate a complete 5-email cold outreach sequence based on the user's prompt.

            The sequence must include:
            1. Email 1: Initial Cold Email
            2. Email 2: First Follow-up (2-3 days later)
            3. Email 3: Second Follow-up (3-4 days later)
            4. Email 4: Value-Add / Resource Share (4-5 days later)
            5. Email 5: Last Chance / Breakup (5-7 days later)

            CRITICAL INSTRUCTIONS:
            - Analyze the user's prompt and identify the target audience, pain points, and desired outcome.
            - Use a friendly, professional, and conversational tone.
            - Personalize the emails using placeholders like: {name}, {company}, {role}.
            - Make the emails concise and easy to read (under 150 words each).
            - Include a clear Call to Action (CTA) in each email.
            - Focus on providing value, not just selling.
            - Do NOT use emojis or excessive exclamation marks.
            - Do NOT include any special formatting like bold or italics.
            - Output ONLY the 5 emails in the following JSON format:
              {
                "email1": {
                  "subject": "Subject Line",
                  "body": "Email Body"
                },
                "email2": {
                  "subject": "Subject Line",
                  "body": "Email Body"
                },
                "email3": {
                  "subject": "Subject Line",
                  "body": "Email Body"
                },
                "email4": {
                  "subject": "Subject Line",
                  "body": "Email Body"
                },
                "email5": {
                  "subject": "Subject Line",
                  "body": "Email Body"
                }
              }
            - Do not include any additional text or explanation outside the JSON object.
            
            User Prompt:
        `
        const emailHistory = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'user', content: systemPrompt + "\n\nUSER PROMPT: " + prompt }
            ],
            max_tokens: 1024,
            temperature: 0.7,
        }, {
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json",
                "accept": "application/json"
            },
            timeout: 20000,
        });

    } catch (error) {
        console.error("Error generating email:", error);
        res.status(500).json({ message: "Error generating email", error: error.message });
    }
}
const { subject, emailBody, linkedinDM, followUpEmail } = JSON.parse(emailHistory.data.choices[0].message.content);
const emailHistory = await EmailHistory.create({
    user: req.user._id,
    prompt,
    subject,
    emailBody,
    linkedinDM,
    followUpEmail
})
await emailHistory.save();
res.status(201).json({ message: "Email generated successfully", emailHistory });