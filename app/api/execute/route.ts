import { NextRequest, NextResponse } from 'next/server';

const JUDGE0_API_URL = 'https://judge0-ce.p.rapidapi.com';
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '';

const LANGUAGE_IDS: Record<string, number> = {
  javascript: 63,
  python: 71,
  java: 62,
  cpp: 54,
  c: 50,
  ruby: 72,
  go: 60,
  rust: 73,
};

export async function POST(request: NextRequest) {
  try {
    const { code, language } = await request.json();

    if (!code || !language) {
      return NextResponse.json(
        { error: 'Code and language are required' },
        { status: 400 }
      );
    }

    const languageId = LANGUAGE_IDS[language];
    if (!languageId) {
      return NextResponse.json(
        { error: 'Unsupported language' },
        { status: 400 }
      );
    }

    const submissionResponse = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=true&wait=false`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      },
      body: JSON.stringify({
        language_id: languageId,
        source_code: Buffer.from(code).toString('base64'),
      }),
    });

    if (!submissionResponse.ok) {
      throw new Error('Failed to submit code');
    }

    const { token } = await submissionResponse.json();

    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const resultResponse = await fetch(`${JUDGE0_API_URL}/submissions/${token}?base64_encoded=true`, {
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        },
      });

      if (!resultResponse.ok) {
        throw new Error('Failed to get result');
      }

      const result = await resultResponse.json();

      if (result.status.id <= 2) {
        attempts++;
        continue;
      }

      const output = result.stdout ? Buffer.from(result.stdout, 'base64').toString() : '';
      const error = result.stderr ? Buffer.from(result.stderr, 'base64').toString() : '';
      const compileError = result.compile_output ? Buffer.from(result.compile_output, 'base64').toString() : '';

      return NextResponse.json({
        success: result.status.id === 3,
        output: output || error || compileError || 'No output',
        status: result.status.description,
        time: result.time,
        memory: result.memory,
      });
    }

    return NextResponse.json(
      { error: 'Execution timeout' },
      { status: 408 }
    );

  } catch (error) {
    console.error('Execute API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}