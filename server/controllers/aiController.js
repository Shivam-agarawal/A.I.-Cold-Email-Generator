const axios = require("axios");
const EmailHistory = require("../models/EmailHistory");


exports.generateEmail = async (req, res) => {
  const { prompt, tone, framework } = req.body;
  if (!prompt) {
    return res.status(400).json({ message: "Prompt is required" });
  }
  try {
    // Build dynamic tone/framework instructions
    const toneMap = {
      professional: "Use a professional, polished tone. Sound competent and authoritative.",
      casual: "Use a casual, friendly tone. Sound approachable and conversational.",
      persuasive: "Use a persuasive, compelling tone. Emphasize benefits and create urgency.",
      humorous: "Use a witty, humorous tone. Be clever but still professional.",
      urgent: "Use an urgent, time-sensitive tone. Create a sense of immediacy.",
    };

    const frameworkMap = {
      aida: "Structure using AIDA: Attention (hook), Interest (why it matters), Desire (benefits), Action (clear CTA).",
      pas: "Structure using PAS: Problem (identify pain point), Agitate (make it feel urgent), Solve (present the solution).",
      bab: "Structure using BAB: Before (current painful state), After (dream outcome), Bridge (how you get them there).",
    };

    const toneInstruction = tone && toneMap[tone] ? `\n\nTONE: ${toneMap[tone]}` : "";
    const frameworkInstruction = framework && frameworkMap[framework] ? `\n\nFRAMEWORK: ${frameworkMap[framework]}` : "";

    const systemPrompt = `You are an expert job outreach strategist.

Your task is to generate a HIGH-CONVERTING cold email to a recruiter for a job opportunity.

IMPORTANT:
- Even if the user gives only 2–4 words, assume realistic context.
- Do NOT ask for clarification.
- Make professional assumptions.
- Avoid generic phrases.
- Keep it concise and structured.
${toneInstruction}${frameworkInstruction}

====================================================
OUTPUT FORMAT (STRICT)
====================================================

Return ONLY valid JSON:

{
  "subject": "",
  "emailBody": "",
  "linkedinDM": "",
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

    let generatedEmail = aiResponse.data.choices[0].message.content;
    
    // Clean up markdown code blocks if the LLM adds them despite instructions
    if (generatedEmail.includes('```json')) {
        generatedEmail = generatedEmail.split('```json')[1].split('```')[0].trim();
    } else if (generatedEmail.includes('```')) {
        generatedEmail = generatedEmail.split('```')[1].split('```')[0].trim();
    }

    let parsed = {};
    try {
        parsed = JSON.parse(generatedEmail);
    } catch (e) {
        console.error("Failed to parse JSON:", generatedEmail);
        throw new Error("AI returned invalid JSON format");
    }

    const getIgnoreCase = (obj, target) => {
        const lowerTarget = target.toLowerCase();
        for (const k in obj) {
            if (k.toLowerCase() === lowerTarget || k.toLowerCase().replace(/[^a-z]/g, '') === lowerTarget) {
                return obj[k];
            }
        }
        return "";
    };

    const subject = getIgnoreCase(parsed, "subject");
    const emailBody = getIgnoreCase(parsed, "emailBody") || getIgnoreCase(parsed, "body");
    const linkedinDM = getIgnoreCase(parsed, "linkedinDM") || getIgnoreCase(parsed, "linkedin");
    const followUpEmail = getIgnoreCase(parsed, "followUpEmail") || getIgnoreCase(parsed, "followup");

    const emailHistory = await EmailHistory.create({
      user: req.user._id,
      prompt,
      generatedEmail,
      subject,
      emailBody,
      linkedinDM,
      followUpEmail,
      tone: tone || 'professional',
      framework: framework || null,
    });
    
    res.status(201).json({ message: "Email generated successfully", emailHistory, subject, emailBody, linkedinDM, followUpEmail });

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

exports.getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Total emails generated
    const totalEmails = await EmailHistory.countDocuments({ user: userId });

    // Emails per day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyData = await EmailHistory.aggregate([
      { $match: { user: userId, createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Fill in missing days with 0
    const emailsPerDay = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const found = dailyData.find((item) => item._id === dateStr);
      emailsPerDay.push({
        date: dateStr,
        label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        count: found ? found.count : 0,
      });
    }

    // Tone distribution
    const toneData = await EmailHistory.aggregate([
      { $match: { user: userId } },
      { $group: { _id: { $ifNull: ["$tone", "professional"] }, count: { $sum: 1 } } },
    ]);
    const toneDistribution = toneData.map((t) => ({
      name: t._id.charAt(0).toUpperCase() + t._id.slice(1),
      value: t.count,
    }));

    // Framework distribution
    const frameworkData = await EmailHistory.aggregate([
      { $match: { user: userId, framework: { $ne: null } } },
      { $group: { _id: "$framework", count: { $sum: 1 } } },
    ]);
    const frameworkDistribution = frameworkData.map((f) => ({
      name: f._id.toUpperCase(),
      value: f.count,
    }));

    // This week vs last week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const thisWeek = await EmailHistory.countDocuments({
      user: userId,
      createdAt: { $gte: oneWeekAgo },
    });
    const lastWeek = await EmailHistory.countDocuments({
      user: userId,
      createdAt: { $gte: twoWeeksAgo, $lt: oneWeekAgo },
    });

    // Average emails per day (last 30 days)
    const avgPerDay = totalEmails > 0 ? (emailsPerDay.reduce((s, d) => s + d.count, 0) / 30).toFixed(1) : "0";

    res.status(200).json({
      totalEmails,
      emailsPerDay,
      toneDistribution,
      frameworkDistribution,
      thisWeek,
      lastWeek,
      avgPerDay,
    });
  } catch (error) {
    console.error("Error getting stats:", error);
    res.status(500).json({ message: "Error getting stats", error: error.message });
  }
};