// Code templates for different programming languages
export const CODE_TEMPLATES: Record<string, string> = {
  javascript: `// JavaScript Template
console.log("Hello, World!");

// Function example
function solve(input) {
    // Your code here
    return input;
}

// Test your function
const result = solve("test input");
console.log(result);`,
  python: `# Python Template
print("Hello, World!")

# Function example
def solve(input_data):
    # Your code here
    return input_data

# Test your function
result = solve("test input")
print(result)`,
  java: `// Java Template
public class Solution {
    public static void main(String[] args) {
        System.out.println("Hello, World!");

        // Test your solution
        Solution sol = new Solution();
        String result = sol.solve("test input");
        System.out.println(result);
    }

    public String solve(String input) {
        // Your code here
        return "result";
    }
}`,
  cpp: `// C++ Template
#include <iostream>
#include <string>
using namespace std;

string solve(string input) {
    // Your code here
    return "result";
}

int main() {
    cout << "Hello, World!" << endl;

    // Test your solution
    string result = solve("test input");
    cout << result << endl;

    return 0;
}`,
  c: `// C Template
#include <stdio.h>
#include <string.h>

void solve(char* input, char* output) {
    // Your code here
    strcpy(output, "result");
}

int main() {
    printf("Hello, World!\\n");

    // Test your solution
    char result[100];
    solve("test input", result);
    printf("%s\\n", result);

    return 0;
}`,
  ruby: `# Ruby Template
puts "Hello, World!"

# Method example
def solve(input)
    # Your code here
    return "result"
end

# Test your method
result = solve("test input")
puts result`,
  go: `// Go Template
package main

import "fmt"

func solve(input string) string {
    // Your code here
    return "result"
}

func main() {
    fmt.Println("Hello, World!")

    // Test your function
    result := solve("test input")
    fmt.Println(result)
}`,
  rust: `// Rust Template
fn solve(input: &str) -> String {
    // Your code here
    String::from("result")
}

fn main() {
    println!("Hello, World!");

    // Test your function
    let result = solve("test input");
    println!("{}", result);
}`
};

// Exam question templates with complete input/output structure
export const EXAM_TEMPLATES: Record<string, { editable: string; complete: string }> = {
  javascript: {
    editable: `function solution(n) {
    // Write your code here
    // You can use console.log() for debugging
    return n;
}`,
    complete: `// READ INPUT
const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
const n = parseInt(input);

// SOLUTION FUNCTION - Write your code here
function solution(n) {
    // You can use console.log() for debugging
    return n;
}

// ⚠️ DO NOT MODIFY BELOW THIS LINE - Output logic
const result = solution(n);
console.log(result);`
  },
  python: {
    editable: `def solution(n):
    # Write your code here
    # You can use print() for debugging
    return n`,
    complete: `# READ INPUT
import sys
input_data = sys.stdin.read().strip()
n = int(input_data)

# SOLUTION FUNCTION - Write your code here
def solution(n):
    # You can use print() for debugging
    return n

# ⚠️ DO NOT MODIFY BELOW THIS LINE - Output logic
result = solution(n)
print(result)`
  },
  java: {
    editable: `public class Solution {
    public static int solution(int n) {
        // Write your code here
        // You can use System.out.println() for debugging
        return n;
    }
}`,
    complete: `import java.util.Scanner;

public class Solution {
    // SOLUTION FUNCTION - Write your code here
    public static int solution(int n) {
        // You can use System.out.println() for debugging
        return n;
    }

    // ⚠️ DO NOT MODIFY BELOW THIS LINE - Input/Output logic
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int input = scanner.nextInt();
        int result = solution(input);
        System.out.println(result);
        scanner.close();
    }
}`
  },
  cpp: {
    editable: `#include <iostream>
using namespace std;

int solution(int n) {
    // Write your code here
    // You can use cout for debugging
    return n;
}`,
    complete: `#include <iostream>
using namespace std;

// SOLUTION FUNCTION - Write your code here
int solution(int n) {
    // You can use cout for debugging
    return n;
}

// ⚠️ DO NOT MODIFY BELOW THIS LINE - Input/Output logic
int main() {
    int input;
    cin >> input;
    int result = solution(input);
    cout << result << endl;
    return 0;
}`
  },
  c: {
    editable: `#include <stdio.h>

int solution(int n) {
    // Write your code here
    // You can use printf() for debugging
    return n;
}`,
    complete: `#include <stdio.h>

// SOLUTION FUNCTION - Write your code here
int solution(int n) {
    // You can use printf() for debugging
    return n;
}

// ⚠️ DO NOT MODIFY BELOW THIS LINE - Input/Output logic
int main() {
    int input;
    scanf("%d", &input);
    int result = solution(input);
    printf("%d\\n", result);
    return 0;
}`
  },
  ruby: {
    editable: `def solution(n)
    # Write your code here
    # You can use puts for debugging
    return n
end`,
    complete: `# READ INPUT
input = gets.to_i

# SOLUTION FUNCTION - Write your code here
def solution(n)
    # You can use puts for debugging
    return n
end

# ⚠️ DO NOT MODIFY BELOW THIS LINE - Output logic
result = solution(input)
puts result`
  },
  go: {
    editable: `package main

import "fmt"

func solution(n int) int {
    // Write your code here
    // You can use fmt.Println() for debugging
    return n
}`,
    complete: `package main

import "fmt"

// SOLUTION FUNCTION - Write your code here
func solution(n int) int {
    // You can use fmt.Println() for debugging
    return n
}

// ⚠️ DO NOT MODIFY BELOW THIS LINE - Input/Output logic
func main() {
    var input int
    fmt.Scan(&input)
    result := solution(input)
    fmt.Println(result)
}`
  },
  rust: {
    editable: `fn solution(n: i32) -> i32 {
    // Write your code here
    // You can use println!() for debugging
    n
}`,
    complete: `use std::io::{self, BufRead};

// SOLUTION FUNCTION - Write your code here
fn solution(n: i32) -> i32 {
    // You can use println!() for debugging
    n
}

// ⚠️ DO NOT MODIFY BELOW THIS LINE - Input/Output logic
fn main() {
    let stdin = io::stdin();
    let input: i32 = stdin.lock().lines().next().unwrap().unwrap().trim().parse().unwrap();
    let result = solution(input);
    println!("{}", result);
}`
  },
  typescript: {
    editable: `function solution(n: number): number {
    // Write your code here
    // You can use console.log() for debugging
    return n;
}`,
    complete: `// READ INPUT
const fs = require('fs');
const input = fs.readFileSync(0, 'utf-8').trim();
const n = parseInt(input);

// SOLUTION FUNCTION - Write your code here
function solution(n: number): number {
    // You can use console.log() for debugging
    return n;
}

// ⚠️ DO NOT MODIFY BELOW THIS LINE - Output logic
const result = solution(n);
console.log(result);`
  },
  "c#": {
    editable: `using System;

public class Solution {
    public static int solution(int n) {
        // Write your code here
        // You can use Console.WriteLine() for debugging
        return n;
    }
}`,
    complete: `using System;

public class Solution {
    // SOLUTION FUNCTION - Write your code here
    public static int solution(int n) {
        // You can use Console.WriteLine() for debugging
        return n;
    }

    // ⚠️ DO NOT MODIFY BELOW THIS LINE - Input/Output logic
    public static void Main(string[] args) {
        int input = int.Parse(Console.ReadLine());
        int result = solution(input);
        Console.WriteLine(result);
    }
}`
  }
};

// Language configurations for syntax highlighting and execution
export const LANGUAGE_CONFIG = {
  javascript: {
    name: "JavaScript",
    extension: ".js",
    monacoLanguage: "javascript",
    judge0Id: 63,
    color: "#F7DF1E"
  },
  python: {
    name: "Python",
    extension: ".py",
    monacoLanguage: "python", 
    judge0Id: 71,
    color: "#3776AB"
  },
  java: {
    name: "Java",
    extension: ".java",
    monacoLanguage: "java",
    judge0Id: 62,
    color: "#ED8B00"
  },
  cpp: {
    name: "C++",
    extension: ".cpp",
    monacoLanguage: "cpp",
    judge0Id: 54,
    color: "#00599C"
  },
  c: {
    name: "C",
    extension: ".c",
    monacoLanguage: "c",
    judge0Id: 50,
    color: "#A8B9CC"
  },
  ruby: {
    name: "Ruby",
    extension: ".rb",
    monacoLanguage: "ruby",
    judge0Id: 72,
    color: "#CC342D"
  },
  go: {
    name: "Go",
    extension: ".go",
    monacoLanguage: "go",
    judge0Id: 60,
    color: "#00ADD8"
  },
  rust: {
    name: "Rust",
    extension: ".rs",
    monacoLanguage: "rust",
    judge0Id: 73,
    color: "#CE422B"
  }
};