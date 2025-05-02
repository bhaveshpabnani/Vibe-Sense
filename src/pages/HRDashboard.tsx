import React, { useState } from "react";
import Header from "@/components/layout/Header";
import StatsCard from "@/components/dashboard/StatsCard";
import MoodChart from "@/components/dashboard/MoodChart";
import { employees, feedbackData, scheduleData } from "@/data/mockData";
import { Users, BarChart3, CheckCircle, AlertCircle, Calendar } from "lucide-react";

const HRDashboard: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<"week" | "month" | "quarter" | "year">("month");

  // Calculate statistics
  const totalEmployees = employees.length;
  const submittedFeedbacks = employees.filter(emp => emp.status === "submitted").length;
  const feedbackPercentage = Math.round((submittedFeedbacks / totalEmployees) * 100);
  
  const recentFeedbackCount = feedbackData
    .filter(fb => {
      const feedbackDate = new Date(fb.date);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - feedbackDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    })
    .length;

  // Calculate percentage change from previous period
  const prevPeriodFeedbacks = 120; // Mock data
  const feedbackChange = Math.round(((recentFeedbackCount - prevPeriodFeedbacks) / prevPeriodFeedbacks) * 100);

  return (
    <div className="h-full min-h-screen bg-muted/30">
      <Header title="HR Dashboard" />
      
      <main className="container py-6 space-y-6 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Employees"
            value={totalEmployees}
            icon={<Users size={18} />}
          />
          
          <StatsCard
            title="Feedback Submission"
            value={`${feedbackPercentage}%`}
            icon={<CheckCircle size={18} />}
            change={5}
            changeLabel="vs last period"
          />
          
          <StatsCard
            title="Recent Feedbacks"
            value={recentFeedbackCount}
            icon={<BarChart3 size={18} />}
            change={feedbackChange}
            changeLabel="vs previous week"
          />
          
          <StatsCard
            title="Scheduled Today"
            value={scheduleData.find(s => s.date === new Date().toISOString().split('T')[0])?.scheduled || 0}
            icon={<Calendar size={18} />}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <MoodChart 
            feedbackData={feedbackData} 
            timeRange={selectedTimeRange}
            className="lg:col-span-2"
          />
          
          <div className="glass-card p-5">
            <h3 className="text-lg font-medium mb-4">Mood Analysis</h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="time-range" className="block text-sm font-medium mb-1">
                  Time Range
                </label>
                <select
                  id="time-range"
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value as "week" | "month" | "quarter" | "year")}
                  className="w-full p-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="week">Last 7 days</option>
                  <option value="month">Last 30 days</option>
                  <option value="quarter">Last 90 days</option>
                  <option value="year">Last 365 days</option>
                </select>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Key Insights</h4>
                
                <div className="p-3 bg-accent/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-sm font-medium">Positive Trend</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Overall employee sentiment has improved by 12% compared to last month
                  </p>
                </div>
                
                <div className="p-3 bg-destructive/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-destructive" />
                    <span className="text-sm font-medium">Attention Needed</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Engineering department shows 15% increase in "Frustrated" responses
                  </p>
                </div>
                
                <div className="p-3 bg-accent/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-sm font-medium">High Engagement</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    92% participation rate achieved this month, exceeding the 85% target
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HRDashboard;