import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

dotenv.config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface AIPromptOptions {
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
}

export async function callClaudeAI(options: AIPromptOptions): Promise<string> {
  const { systemPrompt, userPrompt, maxTokens = 4096 } = options;

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: maxTokens,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === 'text') {
      return content.text;
    }

    throw new Error('Unexpected response type from Claude API');
  } catch (error) {
    console.error('Error calling Claude AI:', error);
    throw error;
  }
}

export async function enrichBusinessData(
  businessName: string,
  location: string,
  existingData: Record<string, any>
): Promise<any> {
  const systemPrompt = `You are a data enrichment assistant specializing in food security businesses, farmers markets, and urban farms in Massachusetts and Rhode Island.

Your task is to find and verify missing information about businesses based on publicly available data.

Return your response as valid JSON with the following structure:
{
  "suggestions": [
    {
      "field": "field_name",
      "value": "suggested_value",
      "confidence": "high|medium|low",
      "source": "description of source",
      "reasoning": "why you believe this is correct"
    }
  ]
}

Only suggest information you're confident about. If you can't find reliable information, don't make suggestions for that field.`;

  const userPrompt = `Please help enrich data for this business:

Business Name: ${businessName}
Location: ${location}

Current Data:
${JSON.stringify(existingData, null, 2)}

Please suggest values for any missing or incomplete fields such as:
- website (full URL)
- phone (format: XXX-XXX-XXXX)
- email
- hours (operating hours)
- season (when they operate)
- snap_hip (Yes/No - do they accept SNAP/HIP benefits)
- latitude and longitude (precise coordinates)
- black_owned (Yes/No/Unknown)
- indoor_outdoor (Indoor/Outdoor/Hybrid)
- ej_zone (Yes/No - is it in an Environmental Justice zone)

Provide your response as JSON.`;

  const response = await callClaudeAI({
    systemPrompt,
    userPrompt,
  });

  return JSON.parse(response);
}

export async function verifyBusinessData(
  business: Record<string, any>
): Promise<any> {
  const systemPrompt = `You are a data verification assistant for food security businesses. Your task is to identify potentially incorrect, outdated, or suspicious information.

Return your response as valid JSON with the following structure:
{
  "verifications": [
    {
      "field": "field_name",
      "isValid": true|false,
      "issues": ["list", "of", "issues"],
      "suggestions": ["list", "of", "suggestions"]
    }
  ]
}`;

  const userPrompt = `Please verify the data for this business and identify any issues:

${JSON.stringify(business, null, 2)}

Check for:
- Invalid phone numbers or email formats
- Broken or suspicious website URLs
- Inconsistent location information
- Missing coordinates when address is provided
- Logical inconsistencies (e.g., "Year-round" season but "Outdoor" location in New England)

Provide your response as JSON.`;

  const response = await callClaudeAI({
    systemPrompt,
    userPrompt,
  });

  return JSON.parse(response);
}

export async function discoverNewMarkets(
  searchArea: string
): Promise<any> {
  const systemPrompt = `You are a research assistant specializing in finding farmers markets, urban farms, and food access resources in Massachusetts and Rhode Island.

Your task is to identify potential new businesses that should be added to the directory, focusing on:
- Farmers markets
- Urban farms
- CSA programs
- Food co-ops
- Community gardens with public access
- Mobile food markets

Return your response as valid JSON with the following structure:
{
  "discoveries": [
    {
      "business_name": "name",
      "location": "city/area, state",
      "activity": "description of what they do",
      "website": "URL if found",
      "confidence": "high|medium|low",
      "source": "where you found this information",
      "notes": "any additional relevant information"
    }
  ]
}`;

  const userPrompt = `Please research and identify farmers markets, urban farms, and food access resources in the ${searchArea} area that might not be in our existing directory.

Focus on:
1. Community-based organizations
2. Black-owned or minority-led businesses
3. Markets in Environmental Justice zones
4. SNAP/HIP accepting locations
5. Year-round or seasonal operations

Provide your response as JSON with your findings.`;

  const response = await callClaudeAI({
    systemPrompt,
    userPrompt,
    maxTokens: 4096,
  });

  return JSON.parse(response);
}
