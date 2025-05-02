
import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from "recharts";
import { cn } from "@/lib/utils";

type MoodType = 'frustrated' | 'sad' | 'okay' | 'happy' | 'excited';

type FeedbackData = {
  date: string;
  employeeId: string;
  mood: MoodType;
};

type MoodChartProps = {
  feedbackData: FeedbackData[];
  timeRange?: "week" | "month" | "quarter" | "year";
  className?: string;
};

const moodColors = {
  frustrated: "#FF5A5A",
  sad: "#FFB15A",
  okay: "#FFE15A",
  happy: "#82D158",
  excited: "#00A86B" // Deloitte green
};

const moodLabels = {
  frustrated: "Frustrated",
  sad: "Sad",
  okay: "Okay",
  happy: "Happy",
  excited: "Excited"
};

const moodOrder: MoodType[] = ["frustrated", "sad", "okay", "happy", "excited"];

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded shadow border border-border">
        <p className="font-medium">{payload[0].payload.date}</p>
        {moodOrder.map((mood) => {
          const value = payload[0].payload[mood] || 0;
          if (value === 0) return null;
          return (
            <div key={mood} className="flex items-center gap-2 mt-1">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: moodColors[mood] }} />
              <span className="text-sm text-muted-foreground">
                {moodLabels[mood]}: <span className="font-medium text-foreground">{value}</span>
              </span>
            </div>
          );
        })}
      </div>
    );
  }
  return null;
};

const MoodChart: React.FC<MoodChartProps> = ({ 
  feedbackData, 
  timeRange = "month",
  className 
}) => {
  const chartData = useMemo(() => {
    // Determine date range based on timeRange
    const today = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case "week":
        startDate.setDate(today.getDate() - 7);
        break;
      case "month":
        startDate.setDate(today.getDate() - 30);
        break;
      case "quarter":
        startDate.setDate(today.getDate() - 90);
        break;
      case "year":
        startDate.setDate(today.getDate() - 365);
        break;
    }
    
    // Filter feedback within the date range
    const filteredFeedback = feedbackData.filter(
      (feedback) => new Date(feedback.date) >= startDate && new Date(feedback.date) <= today
    );
    
    // Group feedback by date and mood
    const groupedByDate: Record<string, Record<MoodType, number>> = {};
    
    filteredFeedback.forEach((feedback) => {
      const date = new Date(feedback.date).toISOString().split('T')[0];
      if (!groupedByDate[date]) {
        groupedByDate[date] = {
          frustrated: 0,
          sad: 0,
          okay: 0,
          happy: 0,
          excited: 0
        };
      }
      groupedByDate[date][feedback.mood]++;
    });
    
    // Convert to array and sort by date
    return Object.entries(groupedByDate)
      .map(([date, moods]) => ({
        date,
        ...moods
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [feedbackData, timeRange]);
  
  return (
    <div className={cn("glass-card p-5", className)}>
      <h3 className="text-lg font-medium mb-4">Mood Trends</h3>
      <div className="h-64">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">No feedback data available for the selected time range</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} stackOffset="sign">
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              
              {moodOrder.map((mood) => (
                <Bar 
                  key={mood}
                  dataKey={mood} 
                  stackId="stack" 
                  fill={moodColors[mood]} 
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      
      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
        {moodOrder.map((mood) => (
          <div key={mood} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: moodColors[mood] }} />
            <span className="text-sm">{moodLabels[mood]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodChart;
