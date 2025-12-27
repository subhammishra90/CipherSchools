const https = require('https');

const LLM_PROVIDER = process.env.LLM_PROVIDER || 'openai';

/**
 * Generate a hint for the user without revealing the solution
 */
const generateHint = async ({ question, requirements, sampleData, userQuery, errorMessage }) => {
  const prompt = buildPrompt(question, requirements, sampleData, userQuery, errorMessage);

  if (LLM_PROVIDER === 'openai') {
    return await generateOpenAIHint(prompt);
  } else if (LLM_PROVIDER === 'gemini') {
    return await generateGeminiHint(prompt);
  } else {
    throw new Error('Unsupported LLM provider');
  }
};

/**
 * Build the prompt for the LLM
 */
const buildPrompt = (question, requirements, sampleData, userQuery, errorMessage) => {
  let prompt = `You are a helpful SQL tutor. A student is working on a SQL assignment and needs a hint.

ASSIGNMENT QUESTION:
${question}

REQUIREMENTS:
${requirements}

SAMPLE DATA SCHEMA:
${JSON.stringify(sampleData, null, 2)}

`;

  if (errorMessage) {
    prompt += `The student's query resulted in an error:
${errorMessage}

Please provide a hint about what might be wrong, but DO NOT give the complete solution.
`;
  } else if (userQuery) {
    prompt += `The student has written this query:
${userQuery}

Please provide a hint to guide them toward the solution, but DO NOT give the complete solution. Focus on:
- What SQL concepts they should consider
- What part of the question they should focus on
- General approach suggestions
`;
  } else {
    prompt += `The student is just starting. Please provide a helpful hint about:
- What SQL concepts they should use
- What tables/columns they should focus on
- General approach to solve this problem

DO NOT provide the complete solution or write any SQL code.
`;
  }

  prompt += `\nRemember: Provide guidance and hints only, NOT the complete solution.`;

  return prompt;
};

/**
 * Generate hint using OpenAI API
 */
const generateOpenAIHint = async (prompt) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }

  const data = JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful SQL tutor. Provide hints and guidance, but never give complete solutions.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    max_tokens: 300,
    temperature: 0.7
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.openai.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (parsed.error) {
            reject(new Error(parsed.error.message));
          } else {
            resolve(parsed.choices[0].message.content);
          }
        } catch (error) {
          reject(new Error('Failed to parse OpenAI response'));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
};

/**
 * Generate hint using Google Gemini API
 */
const generateGeminiHint = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }

  const data = JSON.stringify({
    contents: [{
      parts: [{
        text: prompt
      }]
    }],
    generationConfig: {
      maxOutputTokens: 300,
      temperature: 0.7
    }
  });

  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          if (parsed.error) {
            reject(new Error(parsed.error.message));
          } else {
            resolve(parsed.candidates[0].content.parts[0].text);
          }
        } catch (error) {
          reject(new Error('Failed to parse Gemini response'));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
};

module.exports = {
  generateHint
};

