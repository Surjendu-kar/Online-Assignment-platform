export interface Question {
  id: string;
  type: "multiple-choice" | "essay" | "true-false";
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
        type: "multiple-choice",
        question: "What is the derivative of f(x) = x² + 3x + 2?",
        options: ["2x + 3", "x² + 3", "2x + 2", "x + 3"],
        points: 5,
      },
      {
        id: "q2",
        type: "multiple-choice",
        question: "Which of the following is a prime number?",
        options: ["15", "21", "17", "25"],
        points: 5,
      },
      {
        id: "q3",
        type: "essay",
        question:
          "Explain the fundamental theorem of calculus and provide an example of its application.",
        points: 15,
      },
      {
        id: "q4",
        type: "true-false",
        question: "The integral of sin(x) is -cos(x) + C.",
        options: ["True", "False"],
        points: 3,
      },
      {
        id: "q5",
        type: "multiple-choice",
        question: "What is the value of π (pi) to 3 decimal places?",
        options: ["3.141", "3.142", "3.143", "3.140"],
        points: 5,
      },
      {
        id: "q6",
        type: "essay",
        question:
          "Describe three different methods for solving quadratic equations and give an example for each.",
        points: 20,
      },
      {
        id: "q7",
        type: "multiple-choice",
        question: "If f(x) = 2x + 1, what is f(3)?",
        options: ["5", "6", "7", "8"],
        points: 5,
      },
      {
        id: "q8",
        type: "true-false",
        question: "A function can have more than one y-intercept.",
        options: ["True", "False"],
        points: 3,
      },
      {
        id: "q9",
        type: "multiple-choice",
        question:
          "What is the slope of the line passing through points (2, 3) and (4, 7)?",
        options: ["2", "3", "4", "1"],
        points: 5,
      },
      {
        id: "q10",
        type: "essay",
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
        type: "multiple-choice",
        question: "What is the unit of force in the SI system?",
        options: ["Newton", "Joule", "Watt", "Pascal"],
        points: 5,
      },
      {
        id: "q2",
        type: "multiple-choice",
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
        type: "essay",
        question:
          "Calculate the force required to accelerate a 10 kg object at 5 m/s². Show your work.",
        points: 15,
      },
      {
        id: "q4",
        type: "true-false",
        question: "Velocity is a scalar quantity.",
        options: ["True", "False"],
        points: 3,
      },
      {
        id: "q5",
        type: "essay",
        question: "Explain the concept of momentum and provide the formula.",
        points: 12,
      },
    ],
  },
};
