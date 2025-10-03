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