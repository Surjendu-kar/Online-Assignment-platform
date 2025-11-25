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

interface TestCase {
  input: string;
  output: string;
}

interface TestResult {
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  error?: string;
}

async function executeCodeWithInput(code: string, languageId: number, input: string) {
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
      stdin: Buffer.from(input).toString('base64'),
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

    const output = result.stdout ? Buffer.from(result.stdout, 'base64').toString().trim() : '';
    const error = result.stderr ? Buffer.from(result.stderr, 'base64').toString() : '';
    const compileError = result.compile_output ? Buffer.from(result.compile_output, 'base64').toString() : '';

    return {
      success: result.status.id === 3,
      output: output || error || compileError || 'No output',
      error: error || compileError,
      status: result.status.description,
      time: result.time,
      memory: result.memory,
    };
  }

  throw new Error('Execution timeout');
}

// Import test wrappers
const TEST_WRAPPERS: Record<string, string> = {
  javascript: `
// ⚠️ DO NOT MODIFY BELOW THIS LINE - Test Wrapper
const fs = require('fs');
const input = fs.readFileSync('/dev/stdin', 'utf8').trim();
console.log(solution(parseInt(input)));`,
  python: `
# ⚠️ DO NOT MODIFY BELOW THIS LINE - Test Wrapper
import sys
input_data = sys.stdin.read().strip()
print(solution(int(input_data)))`,
  java: `
    // ⚠️ DO NOT MODIFY BELOW THIS LINE - Test Wrapper
    public static void main(String[] args) {
        java.util.Scanner scanner = new java.util.Scanner(System.in);
        int input = scanner.nextInt();
        System.out.println(solution(input));
        scanner.close();
    }
}`,
  cpp: `
// ⚠️ DO NOT MODIFY BELOW THIS LINE - Test Wrapper
int main() {
    int input;
    cin >> input;
    cout << solution(input) << endl;
    return 0;
}`,
  c: `
// ⚠️ DO NOT MODIFY BELOW THIS LINE - Test Wrapper
int main() {
    int input;
    scanf("%d", &input);
    printf("%d\\n", solution(input));
    return 0;
}`,
  ruby: `
# ⚠️ DO NOT MODIFY BELOW THIS LINE - Test Wrapper
input = gets.to_i
puts solution(input)`,
  go: `
// ⚠️ DO NOT MODIFY BELOW THIS LINE - Test Wrapper
func main() {
    var input int
    fmt.Scan(&input)
    fmt.Println(solution(input))
}`,
  rust: `
// ⚠️ DO NOT MODIFY BELOW THIS LINE - Test Wrapper
fn main() {
    use std::io::{self, BufRead};
    let stdin = io::stdin();
    let input: i32 = stdin.lock().lines().next().unwrap().unwrap().trim().parse().unwrap();
    println!("{}", solution(input));
}`
};

export async function POST(request: NextRequest) {
  try {
    const { code, language, testCases, customInput } = await request.json();

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

    // Combine student code with test wrapper if test cases exist
    let finalCode = code;
    if (testCases && testCases.length > 0 && TEST_WRAPPERS[language]) {
      // Check if code already has the test wrapper
      if (!code.includes('DO NOT MODIFY BELOW THIS LINE')) {
        finalCode = code + TEST_WRAPPERS[language];
      }
    }

    // If customInput is provided (from Output tab), run with custom input
    if (customInput !== undefined && !testCases) {
      const result = await executeCodeWithInput(finalCode, languageId, customInput);
      return NextResponse.json({
        success: result.success,
        output: result.output,
        status: result.status,
        time: result.time,
        memory: result.memory,
      });
    }

    // If no test cases provided and no custom input, just run the code once without input
    if (!testCases || testCases.length === 0) {
      const result = await executeCodeWithInput(finalCode, languageId, '');
      return NextResponse.json({
        success: result.success,
        output: result.output,
        status: result.status,
        time: result.time,
        memory: result.memory,
      });
    }

    // Run code against all test cases
    const testResults: TestResult[] = [];
    let passedCount = 0;

    for (const testCase of testCases as TestCase[]) {
      try {
        const result = await executeCodeWithInput(finalCode, languageId, testCase.input);

        if (!result.success) {
          testResults.push({
            passed: false,
            input: testCase.input,
            expectedOutput: testCase.output,
            actualOutput: result.output,
            error: result.error || result.status,
          });
        } else {
          const actualOutput = result.output.trim();
          const expectedOutput = testCase.output.trim();
          const passed = actualOutput === expectedOutput;

          if (passed) {
            passedCount++;
          }

          testResults.push({
            passed,
            input: testCase.input,
            expectedOutput,
            actualOutput,
          });
        }
      } catch (error) {
        testResults.push({
          passed: false,
          input: testCase.input,
          expectedOutput: testCase.output,
          actualOutput: '',
          error: (error as Error).message,
        });
      }
    }

    return NextResponse.json({
      success: passedCount === testCases.length,
      testResults,
      passedCount,
      totalTests: testCases.length,
      message: `${passedCount}/${testCases.length} test cases passed`,
    });

  } catch (error) {
    console.error('Execute API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}