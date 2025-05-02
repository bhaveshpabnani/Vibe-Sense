
// Mock data for the VibeConverse application

// Employee mood types
export type MoodType = "frustrated" | "sad" | "okay" | "happy" | "excited";

// Employee status types
export type StatusType = "submitted" | "not_submitted" | "reschedule_requested" | "rescheduled";

// Employee type
export type Employee = {
  id: string;
  name: string;
  email: string;
  department: string;
  recentMood?: MoodType;
  status: StatusType;
  scheduledDate: string;
  avatar?: string;
};

// Notification type
export type Notification = {
  id: string;
  employeeId: string;
  employeeName: string;
  type: "reschedule_request" | "reminder" | "feedback_update" | "request_accepted" | "request_rejected";
  message: string;
  date: string;
  read: boolean;
};

// Feedback type
export type Feedback = {
  id: string;
  employeeId: string;
  date: string;
  mood: MoodType;
  comments: string;
};

// Schedule data type
export type ScheduleData = {
  date: string;
  scheduled: number;
  submitted: number;
  notSubmitted: number;
  rescheduled: number;
};

// Chat message type
export type ChatMessage = {
  id: string;
  sender: "bot" | "user";
  message: string;
  timestamp: string;
};

// Generate random employees
export const employees: Employee[] = Array.from({ length: 35 }, (_, i) => {
  const moods: MoodType[] = ["frustrated", "sad", "okay", "happy", "excited"];
  const status: StatusType[] = ["submitted", "not_submitted", "reschedule_requested", "rescheduled"];
  const departments = ["Engineering", "Marketing", "HR", "Finance", "Product", "Design", "Sales", "Support"];
  
  return {
    id: `EMP-${1000 + i}`,
    name: `Employee ${1000 + i}`,
    email: `employee${1000 + i}@company.com`,
    department: departments[Math.floor(Math.random() * departments.length)],
    recentMood: Math.random() > 0.2 ? moods[Math.floor(Math.random() * moods.length)] : undefined,
    status: status[Math.floor(Math.random() * status.length)],
    scheduledDate: new Date(Date.now() + (Math.floor(Math.random() * 14) - 7) * 86400000).toISOString().split('T')[0],
  };
});

// Generate notifications
export const notifications: Notification[] = [
  {
    id: "not-001",
    employeeId: "EMP-1001",
    employeeName: "Employee 1001",
    type: "reschedule_request",
    message: "Requested to reschedule feedback from May 15 to May 18 due to time constraints.",
    date: "2023-05-14T10:30:00Z",
    read: false
  },
  {
    id: "not-002",
    employeeId: "EMP-1025",
    employeeName: "Employee 1025",
    type: "reschedule_request",
    message: "Requested to reschedule feedback from May 16 to May 20 due to personal reasons.",
    date: "2023-05-14T14:45:00Z",
    read: false
  },
  {
    id: "not-003",
    employeeId: "EMP-1010",
    employeeName: "Employee 1010",
    type: "feedback_update",
    message: "Mood changed from 'happy' to 'frustrated' in the last check-in.",
    date: "2023-05-13T09:15:00Z",
    read: true
  },
  {
    id: "not-004",
    employeeId: "EMP-1005",
    employeeName: "Employee 1005",
    type: "reminder",
    message: "5 employees have not submitted their feedback for today.",
    date: "2023-05-15T08:00:00Z",
    read: false
  }
];

// Generate feedback data
export const feedbackData: Feedback[] = Array.from({ length: 200 }, (_, i) => {
  const moods: MoodType[] = ["frustrated", "sad", "okay", "happy", "excited"];
  const comments = [
    "Feeling overwhelmed with current project timelines.",
    "Great collaboration with the team today!",
    "Just an average day, nothing special.",
    "Excited about the new project launch!",
    "Struggling with work-life balance currently.",
    "Feeling demotivated due to lack of recognition.",
    "The team meeting was very productive today.",
    "Need more clarity on my role and responsibilities.",
    "Very happy with the manager's support.",
    "Dealing with some personal issues affecting work."
  ];
  
  const randomEmployeeIndex = Math.floor(Math.random() * employees.length);
  const randomDate = new Date();
  randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 60)); // Past 60 days
  
  return {
    id: `FB-${i + 1}`,
    employeeId: employees[randomEmployeeIndex].id,
    date: randomDate.toISOString(),
    mood: moods[Math.floor(Math.random() * moods.length)],
    comments: comments[Math.floor(Math.random() * comments.length)]
  };
});

// Generate schedule data
export const scheduleData: ScheduleData[] = Array.from({ length: 31 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - 15 + i); // 15 days before to 15 days after
  
  const totalScheduled = 10 + Math.floor(Math.random() * 20);
  const submitted = Math.floor(Math.random() * totalScheduled);
  const rescheduled = Math.floor(Math.random() * (totalScheduled - submitted) / 2);
  const notSubmitted = totalScheduled - submitted - rescheduled;
  
  return {
    date: date.toISOString().split('T')[0],
    scheduled: totalScheduled,
    submitted,
    notSubmitted,
    rescheduled
  };
});

// Sample chat conversation for the bot
export const sampleConversation: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "bot",
    message: "Hello! I'm your VibeConverse assistant. I'm here to check in with you. How are you feeling today?",
    timestamp: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "msg-2",
    sender: "user",
    message: "I'm feeling a bit overwhelmed with the current project deadlines.",
    timestamp: new Date(Date.now() - 3500000).toISOString()
  },
  {
    id: "msg-3",
    sender: "bot",
    message: "I'm sorry to hear that you're feeling overwhelmed. Can you tell me more about what's causing this stress? Is it the timeline, the scope of work, or perhaps resources?",
    timestamp: new Date(Date.now() - 3400000).toISOString()
  },
  {
    id: "msg-4",
    sender: "user",
    message: "It's mainly the timeline. I feel like we don't have enough time to complete everything with the quality expected.",
    timestamp: new Date(Date.now() - 3300000).toISOString()
  },
  {
    id: "msg-5",
    sender: "bot",
    message: "Thank you for sharing that. It's important to maintain quality while meeting deadlines. Have you discussed this concern with your project manager? Sometimes adjusting timelines or priorities can help relieve pressure.",
    timestamp: new Date(Date.now() - 3200000).toISOString()
  }
];

// Sample Q&A data
export const qaData = [
  {
    question: "What is the purpose of the Vibemeter?",
    answer: "The Vibemeter is a tool designed to track employee mood and well-being regularly. It helps the organization understand overall employee sentiment, identify potential issues, and take proactive steps to maintain a positive work environment.",
    category: "General"
  },
  {
    question: "How often do I need to submit my feedback?",
    answer: "Feedback is typically collected every other day. However, your specific schedule may vary. You can check your personal schedule on your dashboard.",
    category: "Feedback"
  },
  {
    question: "How is my privacy protected when sharing feedback?",
    answer: "Your privacy is our priority. While individual responses are collected, reports are anonymized when shared with management. Specific comments are only escalated to HR with your consent or in cases where immediate intervention is needed.",
    category: "Privacy"
  },
  {
    question: "Can I reschedule my feedback submission?",
    answer: "Yes, you can request to reschedule your feedback submission through your dashboard. Your HR representative will review the request and approve it if possible.",
    category: "Scheduling"
  },
  {
    question: "How is the feedback data used?",
    answer: "The feedback data is used to monitor overall employee wellbeing, identify trends, provide support where needed, and improve workplace policies and practices. It helps the organization create a better work environment for everyone.",
    category: "Data Usage"
  }
];