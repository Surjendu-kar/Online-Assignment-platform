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

// Exam question templates with editable and test wrapper sections
export const EXAM_TEMPLATES: Record<string, { editable: string; wrapper: string }> = {
  javascript: {
    editable: `function solution(n) {
    // Write your code here
    return n;
}`,
    wrapper: `
// ⚠️ DO NOT MODIFY BELOW THIS LINE - Test Wrapper
const fs = require('fs');
const input = fs.readFileSync('/dev/stdin', 'utf8').trim();
console.log(solution(parseInt(input)));`
  },
  python: {
    editable: `def solution(n):
    # Write your code here
    return n`,
    wrapper: `
# ⚠️ DO NOT MODIFY BELOW THIS LINE - Test Wrapper
import sys
input_data = sys.stdin.read().strip()
print(solution(int(input_data)))`
  },
  java: {
    editable: `public class Solution {
    public static int solution(int n) {
        // Write your code here
        return n;
    }`,
    wrapper: `
    // ⚠️ DO NOT MODIFY BELOW THIS LINE - Test Wrapper
    public static void main(String[] args) {
        java.util.Scanner scanner = new java.util.Scanner(System.in);
        int input = scanner.nextInt();
        System.out.println(solution(input));
        scanner.close();
    }
}`
  },
  cpp: {
    editable: `#include <iostream>
using namespace std;

int solution(int n) {
    // Write your code here
    return n;
}`,
    wrapper: `
// ⚠️ DO NOT MODIFY BELOW THIS LINE - Test Wrapper
int main() {
    int input;
    cin >> input;
    cout << solution(input) << endl;
    return 0;
}`
  },
  c: {
    editable: `#include <stdio.h>

int solution(int n) {
    // Write your code here
    return n;
}`,
    wrapper: `
// ⚠️ DO NOT MODIFY BELOW THIS LINE - Test Wrapper
int main() {
    int input;
    scanf("%d", &input);
    printf("%d\\n", solution(input));
    return 0;
}`
  },
  ruby: {
    editable: `def solution(n)
    # Write your code here
    return n
end`,
    wrapper: `
# ⚠️ DO NOT MODIFY BELOW THIS LINE - Test Wrapper
input = gets.to_i
puts solution(input)`
  },
  go: {
    editable: `package main

import "fmt"

func solution(n int) int {
    // Write your code here
    return n
}`,
    wrapper: `
// ⚠️ DO NOT MODIFY BELOW THIS LINE - Test Wrapper
func main() {
    var input int
    fmt.Scan(&input)
    fmt.Println(solution(input))
}`
  },
  rust: {
    editable: `fn solution(n: i32) -> i32 {
    // Write your code here
    n
}`,
    wrapper: `
// ⚠️ DO NOT MODIFY BELOW THIS LINE - Test Wrapper
fn main() {
    use std::io::{self, BufRead};
    let stdin = io::stdin();
    let input: i32 = stdin.lock().lines().next().unwrap().unwrap().trim().parse().unwrap();
    println!("{}", solution(input));
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