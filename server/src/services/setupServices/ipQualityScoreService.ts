import dotenv from 'dotenv';

dotenv.config();

interface AsyncParams {
  valid: boolean;
  disposable: boolean;
  fraud_score: number;
  leaked: boolean;
}

// API Services from ipqualityscore.com
export async function ipQualityScoreService(email: string) {
  const url = `https://www.ipqualityscore.com/api/json/email/${process.env.IPQS_API_KEY}/${email}?timeout=10`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const { valid, disposable, fraud_score, leaked } =
      (await response.json()) as AsyncParams;

    if (
      valid === true &&
      disposable === false &&
      fraud_score < 90 &&
      leaked === false
    ) {
      return { safe: true };
    } else {
      return { safe: false };
    }
  } catch (error) {
    console.warn('IPQS failed to fetch or parase:', error);
    return { safe: true };
  }
}
