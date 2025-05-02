import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import { sampleConversation, feedbackData, qaData, ChatMessage } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
import { CalendarClock, BookOpen, LineChart, ArrowRight, CheckCircle2, Calendar, MessageSquare, Send, X, User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
// Import the recognition imbalance assessment tree
import recognitionImbalanceTree from "@/data/recognition_imbalance.json";
// Import Supabase client and functions
import { saveFeedback } from "@/integrations/supabase/client";

// Define types for the assessment tree
type AssessmentOption = string;

type AssessmentQuestion = {
  question_id: string;
  question_text: string;
  answer_options: AssessmentOption[];
  branches: AssessmentBranch[];
};

type AssessmentBranch = {
  if_answers: AssessmentOption[];
  next_question?: AssessmentQuestion;
  outcome?: string;
};

type AssessmentTree = {
  tree_name: string;
  root_question: AssessmentQuestion;
};

// Define types for the mood questions
type MoodOption = {
  label: string;
  value: string;
  color: string;
};

type MoodQuestion = {
  id: number;
  question: string;
  options: MoodOption[];
};

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedQA, setSelectedQA] = useState<number | null>(null);
  const [showRescheduleForm, setShowRescheduleForm] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(true);
  const [showMoodSurvey, setShowMoodSurvey] = useState(false);
  
  // State for the assessment tree
  const [currentQuestion, setCurrentQuestion] = useState<AssessmentQuestion | null>(null);
  const [assessmentHistory, setAssessmentHistory] = useState<{question: AssessmentQuestion, answer: string}[]>([]);
  const [assessmentOutcome, setAssessmentOutcome] = useState<string | null>(null);
  
  // Old mood survey states (can be removed later)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{[key: number]: string}>({});
  const [isComplete, setIsComplete] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  
  // Initialize the assessment with the root question
  useEffect(() => {
    if (showMoodSurvey && !currentQuestion && !assessmentOutcome) {
      setCurrentQuestion((recognitionImbalanceTree as AssessmentTree).root_question);
    }
  }, [showMoodSurvey, currentQuestion, assessmentOutcome]);
  
  // Define the mood questions and options
  const moodQuestions: MoodQuestion[] = [
    {
      id: 1,
      question: "How would you rate your overall work satisfaction today?",
      options: [
        { label: "Very Dissatisfied", value: "very_dissatisfied", color: "#f87171" },
        { label: "Dissatisfied", value: "dissatisfied", color: "#fb923c" },
        { label: "Neutral", value: "neutral", color: "#facc15" },
        { label: "Satisfied", value: "satisfied", color: "#a3e635" },
        { label: "Very Satisfied", value: "very_satisfied", color: "#4ade80" }
      ]
    },
    {
      id: 2,
      question: "How are you feeling about your work-life balance?",
      options: [
        { label: "Very Poor", value: "very_poor", color: "#f87171" },
        { label: "Poor", value: "poor", color: "#fb923c" },
        { label: "Adequate", value: "adequate", color: "#facc15" },
        { label: "Good", value: "good", color: "#a3e635" },
        { label: "Excellent", value: "excellent", color: "#4ade80" }
      ]
    },
    {
      id: 3,
      question: "How would you describe your stress levels at work?",
      options: [
        { label: "Extremely High", value: "extremely_high", color: "#f87171" },
        { label: "High", value: "high", color: "#fb923c" },
        { label: "Moderate", value: "moderate", color: "#facc15" },
        { label: "Low", value: "low", color: "#a3e635" },
        { label: "Very Low", value: "very_low", color: "#4ade80" }
      ]
    },
    {
      id: 4,
      question: "How connected do you feel with your team members?",
      options: [
        { label: "Very Disconnected", value: "very_disconnected", color: "#f87171" },
        { label: "Somewhat Disconnected", value: "disconnected", color: "#fb923c" },
        { label: "Neutral", value: "neutral", color: "#facc15" },
        { label: "Connected", value: "connected", color: "#a3e635" },
        { label: "Very Connected", value: "very_connected", color: "#4ade80" }
      ]
    },
    {
      id: 5,
      question: "How motivated are you feeling about your current projects?",
      options: [
        { label: "Not Motivated At All", value: "not_at_all", color: "#f87171" },
        { label: "Slightly Motivated", value: "slightly", color: "#fb923c" },
        { label: "Moderately Motivated", value: "moderately", color: "#facc15" },
        { label: "Motivated", value: "motivated", color: "#a3e635" },
        { label: "Highly Motivated", value: "highly", color: "#4ade80" }
      ]
    }
  ];
  
  useEffect(() => {
    document.body.classList.add("modern-homepage", "page", "basicpage", "header--enabled");
    document.body.style.fontFamily = "'Open Sans', Arial, sans-serif";
    
    return () => {
      document.body.classList.remove("modern-homepage", "page", "basicpage", "header--enabled");
      document.body.style.fontFamily = "";
    };
  }, []);
  
  const userFeedback = feedbackData.filter(fb => {
    // In real app, we would filter by actual user ID
    return fb.employeeId === "EMP-1001";
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  // Set specific feedback date: March 30, 2025 at 4:30 PM
  const nextScheduledDate = new Date(2025, 2, 30, 16, 30, 0);
  
  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSent(true);
    setShowRescheduleForm(false);
    // In a real app, this would send the request to the backend
  };
  
  const handleNewMessage = (message: ChatMessage) => {
    // Add the message to chat history
    setChatHistory(prev => [message, ...prev]);
  };
  
  const handleSendMessage = () => {
    if (message.trim()) {
      handleNewMessage({
        id: Date.now().toString(),
        message: message,
        sender: "user",
        timestamp: new Date().toISOString()
      });
      setMessage("");
      // In a real app, this would send the message to the backend
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFeedbackContinue = () => {
    setShowFeedbackPopup(false);
    setShowMoodSurvey(true);
    // Reset assessment state
    setCurrentQuestion((recognitionImbalanceTree as AssessmentTree).root_question);
    setAssessmentHistory([]);
    setAssessmentOutcome(null);
  };

  const handleFeedbackLater = () => {
    setShowFeedbackPopup(false);
  };
  
  // Handle assessment answer selection
  const handleAssessmentAnswer = (answer: string) => {
    if (!currentQuestion) return;
    
    // Save the current question and answer to history
    setAssessmentHistory(prev => [...prev, {
      question: currentQuestion,
      answer: answer
    }]);
    
    // Find the matching branch for this answer
    const matchingBranch = currentQuestion.branches.find(branch => 
      branch.if_answers.includes(answer)
    );
    
    if (matchingBranch) {
      if (matchingBranch.outcome) {
        // We've reached an outcome
        setAssessmentOutcome(matchingBranch.outcome);
        setCurrentQuestion(null);
      } else if (matchingBranch.next_question) {
        // Move to the next question
        setCurrentQuestion(matchingBranch.next_question);
      }
    }
  };
  
  // Reset the assessment
  const handleResetAssessment = () => {
    setCurrentQuestion((recognitionImbalanceTree as AssessmentTree).root_question);
    setAssessmentHistory([]);
    setAssessmentOutcome(null);
  };
  
  const handleOptionSelect = (optionValue: string) => {
    // Save the user's answer for the current question
    if (isEditMode && editingQuestionIndex !== null) {
      // If we're in edit mode, update the answer for the editing question
      setUserAnswers(prev => ({
        ...prev,
        [editingQuestionIndex]: optionValue
      }));
      
      // Exit edit mode after selecting a new option
      setEditingQuestionIndex(null);
    } else {
      // Normal mode - add answer for current question
      setUserAnswers(prev => ({
        ...prev,
        [currentQuestionIndex]: optionValue
      }));

      // Move to the next question or finish if this was the last question
      if (currentQuestionIndex < moodQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // This was the last question, show submit/edit options
        // Do NOT set isComplete to true yet
      }
    }
  };

  const handleSurveyComplete = () => {
    // Here you would typically send the answers to your API
    console.log("Survey completed with answers:", userAnswers);
    
    // Show thank you message
    setIsComplete(true);
    setIsEditMode(false);
    setEditingQuestionIndex(null);
  };
  
  const handleStartEditing = () => {
    setIsEditMode(true);
    setEditingQuestionIndex(null); // No specific question yet, user needs to click on a response
  };
  
  const handleSubmitFinal = async () => {
    // Determine mood based on assessment outcome (this is a simple example)
    let mood = "neutral";
    if (assessmentOutcome) {
      if (assessmentOutcome.toLowerCase().includes("positive") || 
          assessmentOutcome.toLowerCase().includes("good") ||
          assessmentOutcome.toLowerCase().includes("well")) {
        mood = "positive";
      } else if (assessmentOutcome.toLowerCase().includes("negative") || 
                assessmentOutcome.toLowerCase().includes("poor") ||
                assessmentOutcome.toLowerCase().includes("concern")) {
        mood = "negative";
      }
    }

    try {
      // Check if we have assessment data
      if (!assessmentHistory || assessmentHistory.length === 0) {
        console.warn("No assessment history to submit");
      } else {
        console.log("Submitting assessment history with", assessmentHistory.length, "items");
      }
      
      // Format assessment history for JSON storage if needed
      const formattedAssessmentHistory = assessmentHistory.map(item => ({
        question_id: item.question.question_id,
        question_text: item.question.question_text,
        answer: item.answer
      }));
      
      // Save feedback with all data
      const result = await saveFeedback(
        "current_user", // Use the authenticated user's ID
        mood,
        "", // No additional comments for now
        {
          assessment_outcome: assessmentOutcome,
          assessment_history: formattedAssessmentHistory, // Send formatted assessment history
          assessment_type: "recognition_imbalance",
          feedback_source: "employee_dashboard"
        }
      );
      
      if (result) {
        console.log("Feedback submitted successfully with complete data:", result);
        
        // Show thank you message
        handleSurveyComplete();
        
        // Close the mood survey popup
        setShowMoodSurvey(false);
        
        // Prevent the feedback popup from showing again in this session
        setShowFeedbackPopup(false);
      } else {
        console.error("Failed to submit feedback");
        alert("There was a problem submitting your feedback. Please try again later.");
      }
    } catch (error) {
      console.error("Error in handleSubmitFinal:", error);
      alert("There was an error submitting your feedback. Please try again later.");
    }
  };
  
  const handleEditResponse = (questionIndex: number) => {
    setEditingQuestionIndex(questionIndex);
  };
  
  return (
    <div className="h-full min-h-screen bg-muted/30">
      <Header title="Employee Dashboard" />
      
      <main className="container py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-6 mb-6">
            <div className="glass-card p-6 animate-fade-in delay-1">
              <h3 className="text-lg font-medium mb-4">Welcome back, {user?.name || "Employee"}</h3>
              <p className="text-muted-foreground mb-6">
                Use the <span className="inline-flex items-baseline">VibeSense<span className="inline-block w-2 h-2 rounded-full bg-[#43d13b] ml-[0.5px]"></span></span> assistant to share your feedback and improve your workplace experience.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-primary/10 rounded-lg p-4 flex items-start gap-3">
                  <div className="p-2 bg-white text-black border-2 border-white rounded-md">
                    <CalendarClock size={18} className="text-deloitte-green" />
                  </div>
                  <div>
                    <h4 className="font-medium">Next Feedback Due</h4>
                    <p className="text-sm text-muted-foreground">
                      {nextScheduledDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                      {' '}at{' '}
                      {nextScheduledDate.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </p>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button 
                        onClick={() => setShowMoodSurvey(true)}
                        className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-md button-hover flex items-center gap-1"
                      >
                        Give Feedback <ArrowRight size={12} />
                      </button>
                      
                      {!requestSent && !showRescheduleForm && (
                        <button 
                          onClick={() => setShowRescheduleForm(true)}
                          className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded-md button-hover"
                        >
                          Reschedule
                        </button>
                      )}
                      
                      {requestSent && (
                        <span className="px-3 py-1 text-xs bg-muted text-muted-foreground rounded-md flex items-center gap-1">
                          <CheckCircle2 size={12} className="text-green-500" /> Request Sent
                        </span>
                      )}
                    </div>
                    
                    {showRescheduleForm && (
                      <form onSubmit={handleSendRequest} className="mt-3 space-y-3">
                        <div>
                          <label htmlFor="reschedule-date" className="block text-xs font-medium mb-1">
                            New Date
                          </label>
                          <input
                            id="reschedule-date"
                            type="date"
                            value={rescheduleDate}
                            onChange={(e) => setRescheduleDate(e.target.value)}
                            className="w-full p-2 text-xs rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="reschedule-reason" className="block text-xs font-medium mb-1">
                            Reason
                          </label>
                          <textarea
                            id="reschedule-reason"
                            value={rescheduleReason}
                            onChange={(e) => setRescheduleReason(e.target.value)}
                            className="w-full p-2 text-xs rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary h-20 resize-none"
                            required
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-md button-hover"
                          >
                            Send Request
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowRescheduleForm(false)}
                            className="px-3 py-1 text-xs bg-muted text-muted-foreground rounded-md"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
                
                <div className="bg-primary/10 rounded-lg p-4 flex items-start gap-3">
                  <div className="p-2 bg-primary rounded-md text-primary-foreground">
                    <LineChart size={18} />
                  </div>
                  <div>
                    <h4 className="font-medium">Your Recent Mood</h4>
                    <div className="mt-2 space-y-2">
                      {userFeedback.slice(0, 3).map((feedback, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: `var(--mood-${feedback.mood})` }}
                          />
                          <span className="text-sm capitalize">{feedback.mood}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(feedback.date).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                    <button 
                      className="mt-3 px-3 py-1 text-xs bg-muted text-muted-foreground rounded-md button-hover flex items-center gap-1"
                    >
                      View History <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-6 animate-fade-in delay-2">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={18} className="text-deloitte-green" />
                <h3 className="text-lg font-medium">FAQ & Resources</h3>
              </div>
              
              <div className="space-y-3">
                {qaData.slice(0, selectedQA !== null ? 3 : 5).map((qa, index) => (
                  <div 
                    key={index} 
                    className={cn(
                      "p-3 rounded-lg bg-muted/40 cursor-pointer transition-all hover:bg-muted/60",
                      selectedQA === index ? "bg-muted/60" : ""
                    )}
                    onClick={() => setSelectedQA(selectedQA === index ? null : index)}
                  >
                    <h4 className="text-sm font-medium flex items-center justify-between">
                      {qa.question}
                      <span className="text-xs">{selectedQA === index ? '−' : '+'}</span>
                    </h4>
                    {selectedQA === index && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {qa.answer}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="glass-card p-6 animate-fade-in delay-1">
              <div className="flex items-center gap-2 mb-4">
                <Calendar size={18} className="text-deloitte-green" />
                <h3 className="text-lg font-medium">Upcoming Schedule</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/40">
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="hover:bg-muted/20">
                      <td className="px-4 py-3 text-sm">{nextScheduledDate.toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-sm">Regular Feedback</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Scheduled
                        </span>
                      </td>
                    </tr>
                    {requestSent && (
                      <tr className="hover:bg-muted/20">
                        <td className="px-4 py-3 text-sm">{new Date(rescheduleDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-sm">Rescheduled Feedback</td>
                        <td className="px-4 py-3 text-sm">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pending Approval
                          </span>
                        </td>
                      </tr>
                    )}
                    <tr className="hover:bg-muted/20">
                      <td className="px-4 py-3 text-sm">{new Date(nextScheduledDate).setDate(nextScheduledDate.getDate() + 2)}</td>
                      <td className="px-4 py-3 text-sm">Regular Feedback</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Scheduled
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        
        </div>
      </main>
      
      {showFeedbackPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-md mx-4 animate-fade-in">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h3 className="text-lg font-semibold">Feedback Reminder</h3>
              <button 
                onClick={handleFeedbackLater}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <MessageSquare size={32} className="text-deloitte-green" />
                </div>
              </div>
              <p className="text-center font-medium text-xl mb-2">Submit Your Feedback</p>
              <p className="text-center text-muted-foreground mb-6">
                Your feedback helps us improve our workplace and ensures your voice is heard.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleFeedbackLater}
                  className="flex-1 px-4 py-2 border border-border rounded-md text-sm font-medium hover:bg-muted/60 transition-colors"
                >
                  Ask Me Later
                </button>
                <button
                  onClick={handleFeedbackContinue}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showMoodSurvey && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-2xl mx-4 h-[600px] flex flex-col animate-fade-in">
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Bot size={20} className="text-deloitte-green" />
                VibeSense Feedback
              </h3>
              <button 
                onClick={() => setShowMoodSurvey(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Welcome message */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot size={16} className="text-deloitte-green" />
                </div>
                <div className="bg-muted/40 p-3 rounded-lg rounded-tl-none max-w-[80%]">
                  <p className="text-sm">
                    Hi {user?.name || "there"}! I'd like to ask you a few questions about your work experience to help us understand how you feel about recognition at work.
                  </p>
                </div>
              </div>
              
              {/* Render assessment history */}
              {assessmentHistory.map((item, index) => (
                <React.Fragment key={index}>
                  {/* Render the question */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot size={16} className="text-deloitte-green" />
                    </div>
                    <div className="bg-muted/40 p-3 rounded-lg rounded-tl-none max-w-[80%]">
                      <p className="text-sm mb-1">
                        <span className="font-medium">Question {index + 1}:</span>
                      </p>
                      <p className="text-sm">
                        {item.question.question_text}
                      </p>
                    </div>
                  </div>
                  
                  {/* Render the user's answer */}
                  <div className="flex items-start gap-3 justify-end">
                    <div className="bg-primary/10 p-3 rounded-lg rounded-tr-none max-w-[80%]">
                      <p className="text-sm font-medium">
                        {item.answer}
                      </p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-background border border-primary flex items-center justify-center flex-shrink-0">
                      <User size={16} className="text-primary" />
                    </div>
                  </div>
                </React.Fragment>
              ))}
              
              {/* Render current question if there is one */}
              {currentQuestion && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot size={16} className="text-deloitte-green" />
                  </div>
                  <div className="bg-muted/40 p-3 rounded-lg rounded-tl-none max-w-[80%]">
                    <p className="text-sm mb-1">
                      <span className="font-medium">Question {assessmentHistory.length + 1}:</span>
                    </p>
                    <p className="text-sm">
                      {currentQuestion.question_text}
                    </p>
                  </div>
                </div>
              )}
              
              {/* Render outcome if assessment is complete */}
              {assessmentOutcome && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot size={16} className="text-deloitte-green" />
                  </div>
                  <div className="bg-muted/40 p-3 rounded-lg rounded-tl-none max-w-[80%]">
                    <p className="text-sm font-medium mb-2">
                      Assessment Complete
                    </p>
                    <p className="text-sm mb-4">
                      {assessmentOutcome}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={handleResetAssessment}
                        className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90"
                      >
                        Start Over
                      </button>
                      <button
                        onClick={handleSubmitFinal}
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                      >
                        Submit Feedback
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Scroll to bottom whenever content changes */}
              <div ref={el => {
                if (el && el.parentElement) {
                  el.parentElement.scrollTop = el.parentElement.scrollHeight;
                }
              }} />
            </div>
            
            {/* Answer options - only show if there's a current question */}
            {currentQuestion && (
              <div className="p-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-3">Select your answer:</p>
                <div className="space-y-2">
                  {currentQuestion.answer_options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAssessmentAnswer(option)}
                      className="p-3 w-full border border-border rounded-md hover:bg-muted/40 transition-colors text-sm flex items-center gap-3"
                    >
                      <span className="font-medium">{option}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">
                    Question {assessmentHistory.length + 1}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;