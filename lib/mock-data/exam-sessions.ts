export interface Question {
  id: string;
  type: "mcq" | "saq" | "coding";
  question: string;
  options?: string[];
  points: number;
  timeLimit?: number;
}

export interface ExamSession {
  id: string;
  title: string;
  subject: string;
  totalQuestions: number;
  timeLimit: number;
  questions: Question[];
  startTime: Date;
  instructions: string;
  teacher: string;
  totalPoints: number;
  passingScore: number;
}

export const mockExamSessions: { [key: string]: ExamSession } = {
  "exam-001": {
    id: "exam-001",
    title: "Mathematics Final Exam",
    subject: "Mathematics",
    totalQuestions: 10,
    timeLimit: 120,
    startTime: new Date(),
    instructions:
      "Read all questions carefully. You have 2 hours to complete this exam. Make sure to save your answers regularly. This exam covers topics from chapters 1-8. Show all work for calculation problems.",
    teacher: "Dr. Smith",
    totalPoints: 100,
    passingScore: 70,
    questions: [
       {
        id: "q1",
        type: "coding",
        question:
          "Write a function to solve quadratic equations. The function should take coefficients a, b, c as parameters and return the roots.",
        points: 20,
      },
      {
        id: "q2",
        type: "mcq",
        question: "What is the derivative of f(x) = x² + 3x + 2?",
        options: ["2x + 3", "x² + 3", "2x + 2", "x + 3"],
        points: 5,
      },
      {
        id: "q3",
        type: "mcq",
        question: "Which of the following is a prime number?",
        options: ["15", "21", "17", "25"],
        points: 5,
      },
      {
        id: "q4",
        type: "saq",
        question:
          "Explain the fundamental theorem of calculus and provide an example of its application.",
        points: 15,
      },
      {
        id: "q5",
        type: "mcq",
        question: "The integral of sin(x) is -cos(x) + C.",
        options: ["True", "False"],
        points: 3,
      },
      {
        id: "q6",
        type: "mcq",
        question: "What is the value of π (pi) to 3 decimal places?",
        options: ["3.141", "3.142", "3.143", "3.140"],
        points: 5,
      },
     
      {
        id: "q7",
        type: "mcq",
        question: "If f(x) = 2x + 1, what is f(3)?",
        options: ["5", "6", "7", "8"],
        points: 5,
      },
      {
        id: "q8",
        type: "mcq",
        question: "A function can have more than one y-intercept.",
        options: ["True", "False"],
        points: 3,
      },
      {
        id: "q9",
        type: "mcq",
        question:
          "What is the slope of the line passing through points (2, 3) and (4, 7)?",
        options: ["2", "3", "4", "1"],
        points: 5,
      },
      {
        id: "q10",
        type: "saq",
        question:
          "Prove that the sum of the first n natural numbers is n(n+1)/2.",
        points: 25,
      },
    ],
  },
  "exam-002": {
    id: "exam-002",
    title: "Physics Quiz Chapter 5",
    subject: "Physics",
    totalQuestions: 5,
    timeLimit: 45,
    startTime: new Date(),
    instructions:
      "Answer all questions. Show your work for calculation problems. Formulas will be provided where necessary.",
    teacher: "Prof. Johnson",
    totalPoints: 40,
    passingScore: 28,
    questions: [
      {
        id: "q1",
        type: "mcq",
        question: "What is the unit of force in the SI system?",
        options: ["Newton", "Joule", "Watt", "Pascal"],
        points: 5,
      },
      {
        id: "q2",
        type: "mcq",
        question:
          "Which law states that for every action, there is an equal and opposite reaction?",
        options: [
          "Newton's First Law",
          "Newton's Second Law",
          "Newton's Third Law",
          "Law of Conservation",
        ],
        points: 5,
      },
      {
        id: "q3",
        type: "saq",
        question:
          "Calculate the force required to accelerate a 10 kg object at 5 m/s². Show your work.",
        points: 15,
      },
      {
        id: "q4",
        type: "mcq",
        question: "Velocity is a scalar quantity.",
        options: ["True", "False"],
        points: 3,
      },
      {
        id: "q5",
        type: "coding",
        question:
          "Write a function to calculate momentum given mass and velocity.",
        points: 12,
      },
    ],
  },
  "3": {
    id: "3",
    title: "Chemistry Lab Report",
    subject: "Chemistry",
    totalQuestions: 8,
    timeLimit: 90,
    startTime: new Date(),
    instructions:
      "Complete the chemistry lab report questions. Show all calculations and explain your reasoning.",
    teacher: "Dr. Williams",
    totalPoints: 100,
    passingScore: 70,
    questions: [
      {
        id: "q1",
        type: "saq",
        question:
          "Explain the process of titration and its applications in analytical chemistry.",
        points: 20,
      },
      {
        id: "q2",
        type: "mcq",
        question: "What is the pH of a neutral solution at 25°C?",
        options: ["0", "7", "14", "10"],
        points: 5,
      },
      {
        id: "q3",
        type: "coding",
        question:
          "Write a function to calculate the molarity of a solution given moles of solute and volume in liters.",
        points: 15,
      },
      {
        id: "q4",
        type: "saq",
        question:
          "Describe the difference between exothermic and endothermic reactions with examples.",
        points: 20,
      },
      {
        id: "q5",
        type: "mcq",
        question: "Which element has the highest electronegativity?",
        options: ["Oxygen", "Fluorine", "Nitrogen", "Chlorine"],
        points: 5,
      },
      {
        id: "q6",
        type: "mcq",
        question: "The atomic number of carbon is 6.",
        options: ["True", "False"],
        points: 3,
      },
      {
        id: "q7",
        type: "saq",
        question:
          "Explain the concept of chemical equilibrium and Le Chatelier's principle.",
        points: 22,
      },
      {
        id: "q8",
        type: "mcq",
        question: "What is the formula for water?",
        options: ["H2O", "CO2", "NaCl", "O2"],
        points: 10,
      },
    ],
  },
  "4": {
    id: "4",
    title: "English Literature Essay",
    subject: "English",
    totalQuestions: 3,
    timeLimit: 180,
    startTime: new Date(),
    instructions:
      "Write comprehensive essays on the given topics. Each essay should be well-structured with introduction, body paragraphs, and conclusion.",
    teacher: "Prof. Brown",
    totalPoints: 100,
    passingScore: 70,
    questions: [
      {
        id: "q1",
        type: "saq",
        question:
          "Analyze the themes of power and corruption in Shakespeare's 'Macbeth'. Support your analysis with specific examples from the text.",
        points: 35,
      },
      {
        id: "q2",
        type: "saq",
        question:
          "Discuss the role of symbolism in F. Scott Fitzgerald's 'The Great Gatsby'. How do symbols contribute to the novel's critique of the American Dream?",
        points: 35,
      },
      {
        id: "q3",
        type: "saq",
        question:
          "Compare and contrast the protagonists in 'Pride and Prejudice' and 'Jane Eyre'. How do their journeys reflect the social constraints of their respective time periods?",
        points: 30,
      },
    ],
  },
};