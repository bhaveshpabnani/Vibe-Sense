
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
import { Bell, Shield, LogOut, Save, User, Mail } from "lucide-react";

const EmployeeSettings: React.FC = () => {
  const { user, logout } = useAuth();
  const [accountForm, setAccountForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "555-987-6543",
    department: "Engineering",
    position: "Software Developer",
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    feedbackReminders: true,
    feedbackSummaries: false,
    productUpdates: false,
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    anonymousFeedback: true,
    dataSharing: "minimal",
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
  
  const handlePrivacySettingChange = (setting: keyof typeof privacySettings, value: string | boolean) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }));
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
              <TabsTrigger value="privacy" className="gap-2">
                <Shield size={16} /> Privacy
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="p-6">
            <TabsContent value="account" className="mt-0">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Account Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage your personal information and account preferences.
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
                        <Label htmlFor="department">Department</Label>
                        <Input 
                          id="department" 
                          value={accountForm.department} 
                          onChange={(e) => setAccountForm(prev => ({ ...prev, department: e.target.value }))}
                          disabled
                        />
                        <p className="text-xs text-muted-foreground">
                          Department can only be changed by HR.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="position">Position</Label>
                        <Input 
                          id="position" 
                          value={accountForm.position} 
                          onChange={(e) => setAccountForm(prev => ({ ...prev, position: e.target.value }))}
                          disabled
                        />
                        <p className="text-xs text-muted-foreground">
                          Position can only be changed by HR.
                        </p>
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
                    Customize how and when you receive notifications.
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
                          Receive reminders about upcoming feedback sessions
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
                        <Label htmlFor="feedback-summaries">Feedback Summaries</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive summaries of your feedback history
                        </p>
                      </div>
                      <Switch 
                        id="feedback-summaries" 
                        checked={notificationSettings.feedbackSummaries} 
                        onCheckedChange={() => handleNotificationToggle('feedbackSummaries')} 
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="product-updates">Product Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive updates about new features and improvements
                        </p>
                      </div>
                      <Switch 
                        id="product-updates" 
                        checked={notificationSettings.productUpdates} 
                        onCheckedChange={() => handleNotificationToggle('productUpdates')} 
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
            
            <TabsContent value="privacy" className="mt-0">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Privacy Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Control how your data is used and shared.
                  </p>
                </div>
                
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="anonymous-feedback">Anonymous Feedback</Label>
                        <p className="text-sm text-muted-foreground">
                          Submit feedback anonymously to managers and HR
                        </p>
                      </div>
                      <Switch 
                        id="anonymous-feedback" 
                        checked={privacySettings.anonymousFeedback as boolean} 
                        onCheckedChange={(checked) => handlePrivacySettingChange('anonymousFeedback', checked)} 
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="data-sharing">Data Sharing Level</Label>
                        <p className="text-sm text-muted-foreground">
                          Control how much of your feedback data is shared with the organization
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {['minimal', 'standard', 'full'].map(level => (
                          <Button 
                            key={level}
                            type="button"
                            variant={privacySettings.dataSharing === level ? "default" : "outline"}
                            onClick={() => handlePrivacySettingChange('dataSharing', level)}
                            className="justify-start capitalize"
                          >
                            <Shield size={16} className="mr-2" />
                            {level}
                          </Button>
                        ))}
                      </div>
                      
                      <p className="text-xs text-muted-foreground mt-2">
                        Minimal: Only share mood data without comments. Standard: Share mood data and general comments. Full: Share all feedback data including specific comments.
                      </p>
                    </div>
                    
                    <Separator />
                    
                    <div className="pt-2">
                      <Button variant="outline" className="w-full justify-start">
                        <Mail size={16} className="mr-2" />
                        Request My Data
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        Request a copy of all your personal data stored in the system.
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

export default EmployeeSettings;