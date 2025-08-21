import dotenv from 'dotenv';

dotenv.config();

interface AsyncParams {
  success: boolean;
  message: string;
  valid: boolean;
  disposable: boolean;
  fraud_score: number;
}

// API Services from ipqualityscore.com
export async function ipQualityScoreService(email: string) {
  const url = `https://www.ipqualityscore.com/api/json/email/${process.env.IPQS_API_KEY}/${email}?timeout=10`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const body = (await response.json()) as AsyncParams;

    // This is a temporary solution for testing purposes only.
    if (
      body.success === false &&
      body.message ===
        'You have exceeded your request quota of 20 per day. Please upgrade to increase your request quota.'
    ) {
      return { safe: true };
    }
    const { valid, disposable, fraud_score } = body;

    if (valid === true && disposable === false && fraud_score < 90) {
      return { safe: true };
    } else {
      return { safe: false };
    }
  } catch (error) {
    console.warn('IPQS failed to fetch or parase:', error);
    return { safe: true };
  }
}
