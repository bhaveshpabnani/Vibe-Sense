
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Filter, PieChart, BarChart, LineChart, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MoodChart from "@/components/dashboard/MoodChart";
import { employees, feedbackData } from "@/data/mockData";

const ReportCard: React.FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  date: string;
  onClick: () => void;
}> = ({ title, description, icon, date, onClick }) => (
  <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
    <CardContent className="p-0">
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            {icon}
          </div>
          <span className="text-sm text-muted-foreground">{date}</span>
        </div>
        <h3 className="font-medium mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="p-3 bg-muted/30 flex justify-between items-center border-t border-border">
        <span className="text-xs text-muted-foreground">View Report</span>
        <Button variant="ghost" size="sm" className="h-8">
          <Download size={14} />
        </Button>
      </div>
    </CardContent>
  </Card>
);

const Reports: React.FC = () => {
  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter" | "year">("month");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  
  // Get unique departments for filter
  const departments = ["all", ...new Set(employees.map(emp => emp.department))];
  
  const downloadReport = (reportType: string) => {
    console.log(`Downloading ${reportType} report...`);
    // In a real app, this would trigger a report download
  };

  return (
    <div className="h-full min-h-screen bg-muted/30">
      <Header title="Reports & Analytics" />
      
      <main className="container py-6 space-y-6 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-xl font-medium">Analytics Dashboard</h2>
            <p className="text-muted-foreground">Review feedback trends and generate reports</p>
          </div>
          
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-muted-foreground" />
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>
                      {dept === "all" ? "All Departments" : dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-muted-foreground" />
              <Select value={timeRange} onValueChange={(value) => setTimeRange(value as any)}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">Last 7 days</SelectItem>
                  <SelectItem value="month">Last 30 days</SelectItem>
                  <SelectItem value="quarter">Last 90 days</SelectItem>
                  <SelectItem value="year">Last 365 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" size="sm" className="gap-2" onClick={() => downloadReport("current")}>
              <Download size={16} />
              Export
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <MoodChart 
            feedbackData={feedbackData} 
            timeRange={timeRange}
            className="lg:col-span-2"
          />
          
          <div className="glass-card p-5">
            <h3 className="text-lg font-medium mb-4">Key Insights</h3>
            
            <div className="space-y-3">
              <Card className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 text-green-600 rounded-md">
                      <LineChart size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Mood Trend</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Overall mood has improved by 12% in the last {timeRange === "week" ? "week" : timeRange === "month" ? "month" : timeRange === "quarter" ? "quarter" : "year"}.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-md">
                      <BarChart size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Department Comparison</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Engineering team shows 8% better mood scores than average.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-md">
                      <PieChart size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Submission Rate</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        85% feedback submission rate achieved, exceeding the 80% target.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Generated Reports</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ReportCard
              title="Monthly Department Analysis"
              description="Mood trends broken down by department with key insights and recommendations."
              icon={<BarChart size={18} />}
              date="Generated Jun 12, 2023"
              onClick={() => downloadReport("monthly")}
            />
            
            <ReportCard
              title="Quarterly Mood Summary"
              description="Comprehensive analysis of employee sentiment for the past quarter."
              icon={<LineChart size={18} />}
              date="Generated Apr 01, 2023"
              onClick={() => downloadReport("quarterly")}
            />
            
            <ReportCard
              title="Employee Engagement Report"
              description="Detailed metrics on feedback submission rates and engagement levels."
              icon={<PieChart size={18} />}
              date="Generated May 15, 2023"
              onClick={() => downloadReport("engagement")}
            />
            
            <ReportCard
              title="Mood Improvement Analysis"
              description="Analysis of initiatives that have positively impacted employee mood."
              icon={<LineChart size={18} />}
              date="Generated Jun 01, 2023"
              onClick={() => downloadReport("improvement")}
            />
            
            <ReportCard
              title="Department Comparison"
              description="Comparative analysis of mood trends across different departments."
              icon={<BarChart size={18} />}
              date="Generated May 28, 2023"
              onClick={() => downloadReport("comparison")}
            />
            
            <ReportCard
              title="Annual Sentiment Report"
              description="Year-long analysis of mood patterns and recommendations."
              icon={<FileText size={18} />}
              date="Generated Jan 15, 2023"
              onClick={() => downloadReport("annual")}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;
