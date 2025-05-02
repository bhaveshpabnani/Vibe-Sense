
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Bell, Shield, LogOut, Save, User, Mail, Calendar, MessageSquare, Clock } from "lucide-react";

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const [accountForm, setAccountForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "555-123-4567",
    jobTitle: "HR Manager",
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    feedbackReminders: true,
    weeklyDigest: true,
    reportGeneration: true,
  });
  
  const [feedbackSettings, setFeedbackSettings] = useState({
    defaultScheduleFrequency: "biweekly",
    reminderHours: "24",
    allowRescheduling: true,
    maxReschedulesPerMonth: "3",
    feedbackAnonymity: "partial",
  });
  
  const handleAccountUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Settings updated",
      description: "Your account settings have been saved successfully.",
    });
  };
  
  const handleNotificationToggle = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  const handleFeedbackSettingChange = (setting: keyof typeof feedbackSettings, value: string) => {
    setFeedbackSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  
  const handleFeedbackToggle = (setting: keyof typeof feedbackSettings) => {
    if (typeof feedbackSettings[setting] === 'boolean') {
      setFeedbackSettings(prev => ({
        ...prev,
        [setting]: !prev[setting]
      }));
    }
  };
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };
  
  return (
    <div className="h-full min-h-screen bg-muted/30">
      <Header title="Settings" />
      
      <main className="container py-6 px-4 sm:px-6">
        <Tabs defaultValue="account" className="glass-card">
          <div className="p-6 border-b border-border">
            <TabsList className="grid grid-cols-1 sm:grid-cols-3 w-full">
              <TabsTrigger value="account" className="gap-2">
                <User size={16} /> Account
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell size={16} /> Notifications
              </TabsTrigger>
              <TabsTrigger value="feedback" className="gap-2">
                <MessageSquare size={16} /> Feedback Settings
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="p-6">
            <TabsContent value="account" className="mt-0">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Account Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your account information and preferences.
                  </p>
                </div>
                
                <form onSubmit={handleAccountUpdate} className="space-y-8">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          value={accountForm.name} 
                          onChange={(e) => setAccountForm(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={accountForm.email} 
                          onChange={(e) => setAccountForm(prev => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          value={accountForm.phone} 
                          onChange={(e) => setAccountForm(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="jobTitle">Job Title</Label>
                        <Input 
                          id="jobTitle" 
                          value={accountForm.jobTitle} 
                          onChange={(e) => setAccountForm(prev => ({ ...prev, jobTitle: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-md font-medium">Security</h4>
                      <p className="text-sm text-muted-foreground">
                        Manage your security preferences and account access.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Button variant="outline" className="justify-start gap-2">
                        <Shield size={16} />
                        Change Password
                      </Button>
                      
                      <Button variant="outline" className="justify-start gap-2" onClick={handleLogout}>
                        <LogOut size={16} />
                        Logout
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" className="gap-2">
                      <Save size={16} />
                      Save Changes
                    </Button>
                  </div>
                </form>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="mt-0">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Notification Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Control how and when you receive notifications from the system.
                  </p>
                </div>
                
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch 
                        id="email-notifications" 
                        checked={notificationSettings.emailNotifications} 
                        onCheckedChange={() => handleNotificationToggle('emailNotifications')} 
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications in the browser
                        </p>
                      </div>
                      <Switch 
                        id="push-notifications" 
                        checked={notificationSettings.pushNotifications} 
                        onCheckedChange={() => handleNotificationToggle('pushNotifications')} 
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="feedback-reminders">Feedback Reminders</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive reminders about upcoming and overdue feedback
                        </p>
                      </div>
                      <Switch 
                        id="feedback-reminders" 
                        checked={notificationSettings.feedbackReminders} 
                        onCheckedChange={() => handleNotificationToggle('feedbackReminders')} 
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="weekly-digest">Weekly Digest</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive a weekly summary of all mood trends and insights
                        </p>
                      </div>
                      <Switch 
                        id="weekly-digest" 
                        checked={notificationSettings.weeklyDigest} 
                        onCheckedChange={() => handleNotificationToggle('weeklyDigest')} 
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="report-generation">Report Generation</Label>
                        <p className="text-sm text-muted-foreground">
                          Notifications when new reports are generated
                        </p>
                      </div>
                      <Switch 
                        id="report-generation" 
                        checked={notificationSettings.reportGeneration} 
                        onCheckedChange={() => handleNotificationToggle('reportGeneration')} 
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-end">
                  <Button className="gap-2">
                    <Save size={16} />
                    Save Changes
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="feedback" className="mt-0">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Feedback Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure how the feedback system works for your organization.
                  </p>
                </div>
                
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="schedule-frequency">Default Schedule Frequency</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {['daily', 'biweekly', 'weekly', 'bimonthly', 'monthly'].map(frequency => (
                          <Button 
                            key={frequency}
                            type="button"
                            variant={feedbackSettings.defaultScheduleFrequency === frequency ? "default" : "outline"}
                            onClick={() => handleFeedbackSettingChange('defaultScheduleFrequency', frequency)}
                            className="justify-start capitalize"
                          >
                            <Calendar size={16} className="mr-2" />
                            {frequency}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="reminder-hours">Reminder Hours Before Due</Label>
                        <Input 
                          id="reminder-hours" 
                          type="number" 
                          value={feedbackSettings.reminderHours} 
                          onChange={(e) => handleFeedbackSettingChange('reminderHours', e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="max-reschedules">Max Reschedules Per Month</Label>
                        <Input 
                          id="max-reschedules" 
                          type="number" 
                          value={feedbackSettings.maxReschedulesPerMonth} 
                          onChange={(e) => handleFeedbackSettingChange('maxReschedulesPerMonth', e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="allow-rescheduling">Allow Rescheduling</Label>
                        <p className="text-sm text-muted-foreground">
                          Let employees reschedule their feedback sessions
                        </p>
                      </div>
                      <Switch 
                        id="allow-rescheduling" 
                        checked={feedbackSettings.allowRescheduling as boolean} 
                        onCheckedChange={() => handleFeedbackToggle('allowRescheduling')} 
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <Label htmlFor="feedback-anonymity">Feedback Anonymity Level</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {['full', 'partial', 'none'].map(level => (
                          <Button 
                            key={level}
                            type="button"
                            variant={feedbackSettings.feedbackAnonymity === level ? "default" : "outline"}
                            onClick={() => handleFeedbackSettingChange('feedbackAnonymity', level)}
                            className="justify-start capitalize"
                          >
                            <Shield size={16} className="mr-2" />
                            {level}
                          </Button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Full: All feedback is anonymous. Partial: Only textual feedback is anonymous. None: All feedback is associated with employees.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-end">
                  <Button className="gap-2">
                    <Save size={16} />
                    Save Changes
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  );
};

export default Settings;
