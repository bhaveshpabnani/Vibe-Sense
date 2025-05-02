
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { employees, scheduleData } from "@/data/mockData";
import { format } from "date-fns";
import Status from "@/components/common/Status";

const HRCalendar: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const formattedDate = format(date, "yyyy-MM-dd");
  
  // Filter employees scheduled for the selected date
  const scheduledEmployees = employees.filter(
    (employee) => employee.scheduledDate === formattedDate
  );
  
  // Get schedule data for the selected date
  const scheduleInfo = scheduleData.find(
    (schedule) => schedule.date === formattedDate
  ) || { date: formattedDate, scheduled: 0, submitted: 0, notSubmitted: 0 };
  
  return (
    <div className="h-full min-h-screen bg-muted/30">
      <Header title="Feedback Calendar" />
      
      <main className="container py-6 space-y-6 px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="glass-card p-6 flex flex-col items-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="rounded-md"
            />
          </div>
          
          <div className="glass-card p-6 lg:col-span-2">
            <h3 className="text-lg font-medium mb-4">
              Schedule for {format(date, "MMMM d, yyyy")}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 flex flex-col items-center">
                  <span className="text-muted-foreground text-sm">Scheduled</span>
                  <span className="text-3xl font-bold">{scheduleInfo.scheduled}</span>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 flex flex-col items-center">
                  <span className="text-muted-foreground text-sm">Submitted</span>
                  <span className="text-3xl font-bold text-green-500">{scheduleInfo.submitted}</span>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 flex flex-col items-center">
                  <span className="text-muted-foreground text-sm">Not Submitted</span>
                  <span className="text-3xl font-bold text-red-500">{scheduleInfo.notSubmitted}</span>
                </CardContent>
              </Card>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/40">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Employee</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Department</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Recent Mood</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {scheduledEmployees.length > 0 ? (
                    scheduledEmployees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-muted/20">
                        <td className="px-4 py-3 text-sm">{employee.name}</td>
                        <td className="px-4 py-3 text-sm">{employee.department}</td>
                        <td className="px-4 py-3 text-sm">
                          <Status status={employee.status} />
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {employee.recentMood ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                                  style={{ 
                                    backgroundColor: `var(--mood-${employee.recentMood})`,
                                    color: employee.recentMood === 'okay' ? '#555' : '#fff'
                                  }}>
                              {employee.recentMood.charAt(0).toUpperCase() + employee.recentMood.slice(1)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">Not submitted</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                        No employees scheduled for this date.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6">
          <h3 className="text-lg font-medium mb-4">Monthly Overview</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/40">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Scheduled</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Submitted</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Not Submitted</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Submission Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {scheduleData.slice(0, 7).map((schedule) => {
                  const submissionRate = schedule.scheduled > 0 
                    ? Math.round((schedule.submitted / schedule.scheduled) * 100) 
                    : 0;
                  
                  return (
                    <tr 
                      key={schedule.date} 
                      className={`hover:bg-muted/20 ${schedule.date === formattedDate ? 'bg-primary/5' : ''}`}
                      onClick={() => {
                        const newDate = new Date(schedule.date);
                        newDate.setHours(0, 0, 0, 0);
                        setDate(newDate);
                      }}
                    >
                      <td className="px-4 py-3 text-sm">
                        {format(new Date(schedule.date), "MMMM d, yyyy")}
                      </td>
                      <td className="px-4 py-3 text-sm">{schedule.scheduled}</td>
                      <td className="px-4 py-3 text-sm text-green-500">{schedule.submitted}</td>
                      <td className="px-4 py-3 text-sm text-red-500">{schedule.notSubmitted}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${
                                submissionRate >= 75 ? 'bg-green-500' : 
                                submissionRate >= 50 ? 'bg-yellow-500' : 
                                'bg-red-500'
                              }`}
                              style={{ width: `${submissionRate}%` }}
                            />
                          </div>
                          <span>{submissionRate}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HRCalendar;
