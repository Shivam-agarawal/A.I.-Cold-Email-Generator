const axios = require("axios");
const EmailHistory = require("../models/EmailHistory");


exports.generateEmail = async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ message: "Prompt is required" });
  }
  try {
    const systemPrompt = `You are an expert job outreach strategist.

Your task is to generate a HIGH-CONVERTING cold email to a recruiter for a job opportunity.

IMPORTANT:
- Even if the user gives only 2–4 words, assume realistic context.
- Do NOT ask for clarification.
- Make professional assumptions.
- Avoid generic phrases.
- Keep it concise and structured.

====================================================
OUTPUT FORMAT (STRICT)
====================================================

Return ONLY valid JSON:

{
  "subject": "",
  "emailBody": "",
  "linkedInDM": "",
  "followUpEmail": ""
}

No markdown.
No explanations.
Only JSON.

====================================================
CONTEXT ASSUMPTIONS
====================================================

Assume:
- Candidate has 2+ years experience
- Strong in DSA and system design
- Has worked on backend APIs or scalable systems
- Has contributed to production-level features
- Actively seeking Software Engineer roles

If prompt is short like:
"SDE role"
"Backend engineer"
"Startup job"
"Product company"

Create intelligent assumptions about:
- Scaling challenges
- Hiring urgency
- Performance or system reliability issues
- Team growth

====================================================
SUBJECT LINE RULES
====================================================

• 6–9 words
• Must sound confident
• No generic phrases like:
  - "Quick question"
  - "Looking for opportunity"
  - "Job application"
• Should highlight value or experience

Example styles:
"Backend engineer with 2+ yrs scaling APIs"
"Engineer focused on scalable system design"
"Software engineer improving system performance"

====================================================
EMAIL BODY STRUCTURE (STRICT)
====================================================

Keep 60–90 words.

Line 1: Personalized observation about hiring  
Line 2: Mention common hiring/scaling challenge  
Line 3-4: Candidate's experience and strengths  
Line 5: Specific impact or contribution  
Line 6: Clear CTA  
Line 7: Sign-off with name and title  

Tone:
• Confident
• Professional
• Not desperate
• No emojis
• No hype words

====================================================
LINKEDIN DM STRUCTURE
====================================================

30–50 words.
Short, conversational.
Observation + value + soft ask.

====================================================
FOLLOW-UP EMAIL STRUCTURE
====================================================

50–80 words.
New angle.
Emphasize long-term value.
Professional urgency.
Clear CTA.

====================================================

Return ONLY valid JSON.`;
    const aiResponse = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
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

    const generatedEmail = aiResponse.data.choices[0].message.content;
    const { subject, emailBody, linkedinDM, followUpEmail } = JSON.parse(generatedEmail);
    const emailHistory = await EmailHistory.create({
      user: req.user._id,
      prompt,
      generatedEmail,
      subject,
      emailBody,
      linkedinDM,
      followUpEmail
    });
    await emailHistory.save();
    res.status(201).json({ message: "Email generated successfully", emailHistory });

  } catch (error) {
    console.error("Error generating email:", error);
    res.status(500).json({ message: "Error generating email", error: error.message });
  }
}

exports.getHistory = async (req, res) => {
  try {
    const emailHistory = await EmailHistory.find({ user: req.user._id });
    res.status(200).json({ emailHistory });
  } catch (error) {
    console.error("Error getting history:", error);
    res.status(500).json({ message: "Error getting history", error: error.message });
  }
}