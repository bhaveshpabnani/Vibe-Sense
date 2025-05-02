import React, { useState } from "react";
import Header from "@/components/layout/Header";
import { feedbackData } from "@/data/mockData";
import { Calendar, Filter, Download, BarChart, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart as RechartsBarChart, Bar } from "recharts";
import { useAuth } from "@/context/AuthContext";

const moodValue = {
  frustrated: 1,
  sad: 2,
  okay: 3,
  happy: 4,
  excited: 5
};

const moodColors = {
  frustrated: "#FF5A5A",
  sad: "#FFB15A",
  okay: "#FFE15A",
  happy: "#82D158",
  excited: "#5A9CFF"
};

const History: React.FC = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<"week" | "month" | "quarter" | "year">("month");
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  
  const userFeedback = feedbackData.filter(feedback => feedback.employeeId === "EMP-1001");
  
  const sortedFeedback = [...userFeedback].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const filteredFeedback = sortedFeedback.filter(feedback => {
    const feedbackDate = new Date(feedback.date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - feedbackDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    switch (timeRange) {
      case "week": return diffDays <= 7;
      case "month": return diffDays <= 30;
      case "quarter": return diffDays <= 90;
      case "year": return diffDays <= 365;
      default: return true;
    }
  });
  
  const chartData = filteredFeedback.map(feedback => ({
    date: new Date(feedback.date).toLocaleDateString(),
    mood: feedback.mood,
    moodValue: moodValue[feedback.mood],
    moodColor: moodColors[feedback.mood],
    comments: feedback.comments
  }));
  
  const moodCounts = Object.fromEntries(
    Object.keys(moodValue).map(mood => [
      mood, 
      filteredFeedback.filter(f => f.mood === mood).length
    ])
  );
  
  const moodDistribution = Object.entries(moodCounts).map(([mood, count]) => ({
    mood,
    count,
    percentage: Math.round((count / filteredFeedback.length) * 100) || 0
  }));
  
  const averageMood = filteredFeedback.length 
    ? filteredFeedback.reduce((sum, feedback) => sum + moodValue[feedback.mood], 0) / filteredFeedback.length
    : 0;
  
  const moodImprovement = filteredFeedback.length >= 2
    ? moodValue[filteredFeedback[filteredFeedback.length - 1].mood] - moodValue[filteredFeedback[0].mood]
    : 0;
  
  return (
    <div className="h-full min-h-screen bg-muted/30">
      <Header title="Feedback History" />
      
      <main className="container py-6 space-y-6 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-xl font-medium">Your Mood History</h2>
            <p className="text-muted-foreground">Track how your mood has changed over time</p>
          </div>
          
          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
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
            
            <Button variant="outline" size="sm" className="gap-2">
              <Download size={16} />
              Export
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <div className="text-muted-foreground mb-2">Average Mood</div>
              <div className="text-4xl font-bold mb-2">
                {averageMood.toFixed(1)}
              </div>
              <div className="flex gap-2 items-center">
                {Object.keys(moodValue).map((mood, index) => {
                  const active = index + 1 === Math.round(averageMood);
                  return (
                    <div 
                      key={mood} 
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                        active 
                          ? 'ring-2 ring-offset-2 ring-primary scale-110' 
                          : 'opacity-50'
                      }`}
                      style={{ 
                        backgroundColor: moodColors[mood as keyof typeof moodColors],
                        color: mood === 'okay' ? '#555' : '#fff'
                      }}
                    >
                      {index + 1}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <div className="text-muted-foreground mb-2">Feedback Count</div>
              <div className="text-4xl font-bold mb-2">
                {filteredFeedback.length}
              </div>
              <div className="text-sm text-muted-foreground">
                submissions in the selected period
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center">
              <div className="text-muted-foreground mb-2">Mood Trend</div>
              <div className="text-4xl font-bold mb-2 flex items-center">
                {moodImprovement > 0 ? (
                  <span className="text-green-500">↑ {moodImprovement.toFixed(1)}</span>
                ) : moodImprovement < 0 ? (
                  <span className="text-red-500">↓ {Math.abs(moodImprovement).toFixed(1)}</span>
                ) : (
                  <span className="text-yellow-500">― 0.0</span>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                from first to last feedback
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="glass-card overflow-hidden">
          <div className="p-5 border-b border-border flex justify-between items-center">
            <h3 className="text-lg font-medium">Mood Trends</h3>
            <div className="flex gap-2">
              <Button 
                variant={chartType === "line" ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType("line")}
                className="gap-1 h-8"
              >
                <LineChart size={14} />
                Line
              </Button>
              <Button 
                variant={chartType === "bar" ? "default" : "outline"}
                size="sm"
                onClick={() => setChartType("bar")}
                className="gap-1 h-8"
              >
                <BarChart size={14} />
                Bar
              </Button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="h-64">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "line" ? (
                    <RechartsLineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        domain={[0, 6]} 
                        ticks={[1, 2, 3, 4, 5]} 
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        formatter={(value, name) => {
                          const record = chartData.find(d => d.moodValue === value);
                          return [record?.mood || value, "Mood"];
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="moodValue" 
                        stroke="#8884d8" 
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                    </RechartsLineChart>
                  ) : (
                    <RechartsBarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        domain={[0, 6]} 
                        ticks={[1, 2, 3, 4, 5]} 
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        formatter={(value, name) => {
                          const record = chartData.find(d => d.moodValue === value);
                          return [record?.mood || value, "Mood"];
                        }}
                      />
                      <Bar 
                        dataKey="moodValue" 
                        radius={[4, 4, 0, 0]} 
                        fill="#8884d8"
                      />
                    </RechartsBarChart>
                  )}
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">No data available for the selected period</p>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
              {Object.entries(moodColors).map(([mood, color]) => (
                <div key={mood} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                  <span className="text-sm capitalize">{mood}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="glass-card overflow-hidden">
          <Tabs defaultValue="entries" className="w-full">
            <div className="p-5 border-b border-border">
              <TabsList>
                <TabsTrigger value="entries">Feedback Entries</TabsTrigger>
                <TabsTrigger value="distribution">Mood Distribution</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="entries" className="p-0 m-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/40">
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Mood</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Comments</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredFeedback.length > 0 ? (
                      filteredFeedback.map((feedback, index) => (
                        <tr key={index} className="hover:bg-muted/20">
                          <td className="px-4 py-3 text-sm">
                            {new Date(feedback.date).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                                  style={{ 
                                    backgroundColor: moodColors[feedback.mood],
                                    color: feedback.mood === 'okay' ? '#555' : '#fff'
                                  }}>
                              {feedback.mood.charAt(0).toUpperCase() + feedback.mood.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {feedback.comments || <span className="text-muted-foreground">No comment provided</span>}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-4 py-10 text-center text-muted-foreground">
                          No feedback entries found for the selected period
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="distribution" className="p-6 m-0">
              {filteredFeedback.length > 0 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {moodDistribution.map(({ mood, count, percentage }) => (
                      <Card key={mood}>
                        <CardContent className="p-4 flex flex-col items-center justify-center">
                          <div 
                            className="w-10 h-10 rounded-full mb-2 flex items-center justify-center text-sm font-medium"
                            style={{ 
                              backgroundColor: moodColors[mood as keyof typeof moodColors],
                              color: mood === 'okay' ? '#555' : '#fff'
                            }}
                          >
                            {percentage}%
                          </div>
                          <div className="text-sm font-medium capitalize">{mood}</div>
                          <div className="text-xs text-muted-foreground">{count} times</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-3">Mood Distribution</h4>
                    <div className="space-y-3">
                      {moodDistribution.map(({ mood, count, percentage }) => (
                        <div key={mood} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <span 
                                className="w-3 h-3 rounded-full" 
                                style={{ backgroundColor: moodColors[mood as keyof typeof moodColors] }}
                              />
                              <span className="capitalize">{mood}</span>
                            </div>
                            <span className="text-muted-foreground">{count} ({percentage}%)</span>
                          </div>
                          <div className="h-2 bg-muted overflow-hidden rounded-full">
                            <div 
                              className="h-full" 
                              style={{ 
                                width: `${percentage}%`,
                                backgroundColor: moodColors[mood as keyof typeof moodColors]
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center text-muted-foreground">
                  No feedback entries found for the selected period
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default History;
