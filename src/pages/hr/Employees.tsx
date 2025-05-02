import React, { useState, useEffect, useRef } from "react";
import Header from "@/components/layout/Header";
import { employees } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download, Mail, User, Phone, Calendar, Clock } from "lucide-react";
import Status from "@/components/common/Status";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const ClockPicker: React.FC<{
  selectedTime: string;
  onTimeSelect: (time: string) => void;
}> = ({ selectedTime, onTimeSelect }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentHand, setCurrentHand] = useState<'hour' | 'minute' | null>(null);
  const [time, setTime] = useState(() => {
    const [hours, minutes] = selectedTime.split(':').map(Number);
    return { hours, minutes };
  });

  useEffect(() => {
    drawClock();
  }, [time]);

  const drawClock = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw clock face
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw hour markers
    for (let i = 1; i <= 12; i++) {
      const angle = (i * 30 - 90) * (Math.PI / 180);
      const x = centerX + (radius - 15) * Math.cos(angle);
      const y = centerY + (radius - 15) * Math.sin(angle);
      
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#6b7280';
      ctx.fill();
    }

    // Draw hands
    const hourAngle = ((time.hours % 12 + time.minutes / 60) * 30 - 90) * (Math.PI / 180);
    const minuteAngle = (time.minutes * 6 - 90) * (Math.PI / 180);

    // Hour hand
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + radius * 0.5 * Math.cos(hourAngle),
      centerY + radius * 0.5 * Math.sin(hourAngle)
    );
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Minute hand
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + radius * 0.7 * Math.cos(minuteAngle),
      centerY + radius * 0.7 * Math.sin(minuteAngle)
    );
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Center dot
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#111827';
    ctx.fill();
  };

  const getAngleFromPoint = (x: number, y: number): { angle: number; distance: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { angle: 0, distance: 0 };

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    const dx = x - centerX;
    const dy = y - centerY;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;

    const distance = Math.sqrt(dx * dx + dy * dy);
    return { angle, distance };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const { angle, distance } = getAngleFromPoint(x, y);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    if (distance > radius * 0.5 && distance < radius * 0.7) {
      setCurrentHand('minute');
    } else if (distance > 0 && distance < radius * 0.5) {
      setCurrentHand('hour');
    }

    setIsDragging(true);
    updateTime(angle);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !currentHand) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const { angle } = getAngleFromPoint(x, y);

    updateTime(angle);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setCurrentHand(null);
  };

  const updateTime = (angle: number) => {
    if (!currentHand) return;

    if (currentHand === 'hour') {
      const hours = Math.floor(angle / 30);
      setTime(prev => ({ ...prev, hours: hours === 0 ? 12 : hours }));
    } else {
      const minutes = Math.floor(angle / 6);
      setTime(prev => ({ ...prev, minutes }));
    }

    const newTime = `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}`;
    onTimeSelect(newTime);
  };

  return (
    <div className="p-4">
      <canvas
        ref={canvasRef}
        width={200}
        height={200}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="cursor-pointer"
      />
      <div className="text-center mt-2 text-sm font-medium">
        {format(new Date(`2000-01-01T${selectedTime}`), 'h:mm a')}
      </div>
    </div>
  );
};

const Employees: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("09:00");
  const [showReschedule, setShowReschedule] = useState<string | null>(null);

  // Get unique departments for filter
  const departments = ["all", ...new Set(employees.map(emp => emp.department))];
  
  // Filter employees based on search query and filters
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = departmentFilter === "all" || employee.department === departmentFilter;
    const matchesStatus = statusFilter === "all" || employee.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleReschedule = (employeeId: string) => {
    // Here you would typically make an API call to update the schedule
    console.log(`Rescheduling for employee ${employeeId} to ${format(selectedDate!, 'yyyy-MM-dd')} at ${selectedTime}`);
    setShowReschedule(null);
  };

  return (
    <div className="h-full min-h-screen bg-muted/30">
      <Header title="Employees" />
      
      <main className="container py-6 space-y-6 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder="Search employees..." 
              className="pl-10 w-full sm:w-80"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
              <Filter size={16} className="text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="not_submitted">Not Submitted</SelectItem>
                  <SelectItem value="reschedule_requested">Reschedule Requested</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" size="sm" className="gap-2">
              <Download size={16} />
              Export
            </Button>
          </div>
        </div>
        
        <div className="glass-card overflow-hidden">
          <div className="p-5 border-b border-border">
            <h3 className="text-lg font-medium">Employee Directory</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/40">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Employee ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Department</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Recent Mood</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Scheduled Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Reschedule</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-muted/20">
                    <td className="px-4 py-3 text-sm">{employee.id}</td>
                    <td className="px-4 py-3 text-sm">{employee.name}</td>
                    <td className="px-4 py-3 text-sm">{employee.department}</td>
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
                    <td className="px-4 py-3 text-sm">
                      <Status status={employee.status} />
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {employee.scheduledDate}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {showReschedule === employee.id ? (
                        <div className="flex flex-col gap-2">
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-[240px] justify-start text-left font-normal",
                                  !selectedDate && "text-muted-foreground"
                                )}
                              >
                                <Calendar className="mr-2 h-4 w-4" />
                                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <CalendarComponent
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-[240px] justify-start text-left font-normal"
                              >
                                <Clock className="mr-2 h-4 w-4" />
                                {format(new Date(`2000-01-01T${selectedTime}`), 'h:mm a')}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[240px] p-0" align="start">
                              <ClockPicker
                                selectedTime={selectedTime}
                                onTimeSelect={setSelectedTime}
                              />
                            </PopoverContent>
                          </Popover>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleReschedule(employee.id)}
                            >
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setShowReschedule(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowReschedule(employee.id)}
                        >
                          Reschedule
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredEmployees.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No employees found matching your search criteria.</p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-3">Department Distribution</h3>
              <div className="space-y-3">
                {departments.filter(d => d !== "all").map(dept => {
                  const count = employees.filter(e => e.department === dept).length;
                  const percentage = Math.round((count / employees.length) * 100);
                  
                  return (
                    <div key={dept} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{dept}</span>
                        <span className="text-muted-foreground">{count} ({percentage}%)</span>
                      </div>
                      <div className="h-2 bg-muted overflow-hidden rounded-full">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-3">Feedback Status</h3>
              <div className="space-y-3">
                {["submitted", "not_submitted", "reschedule_requested"].map(status => {
                  const count = employees.filter(e => e.status === status).length;
                  const percentage = Math.round((count / employees.length) * 100);
                  
                  return (
                    <div key={status} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Status status={status as any} size="sm" />
                        </div>
                        <span className="text-muted-foreground">{count} ({percentage}%)</span>
                      </div>
                      <div className="h-2 bg-muted overflow-hidden rounded-full">
                        <div 
                          className={`h-full ${
                            status === "submitted" 
                              ? "bg-green-500" 
                              : status === "not_submitted" 
                              ? "bg-red-500" 
                              : "bg-blue-500"
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-3">Mood Distribution</h3>
              <div className="space-y-3">
                {["excited", "happy", "okay", "sad", "frustrated"].map(mood => {
                  const count = employees.filter(e => e.recentMood === mood).length;
                  const notSubmitted = employees.filter(e => !e.recentMood).length;
                  const total = employees.length - notSubmitted;
                  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                  
                  return (
                    <div key={mood} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: `var(--mood-${mood})` }}
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
                            backgroundColor: `var(--mood-${mood})`
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
                
                <div className="space-y-1 pt-2 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span>Not Submitted</span>
                    <span className="text-muted-foreground">
                      {employees.filter(e => !e.recentMood).length} (
                      {Math.round((employees.filter(e => !e.recentMood).length / employees.length) * 100)}%)
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Employees;
