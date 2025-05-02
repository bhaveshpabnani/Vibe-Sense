
import React, { useState } from "react";
import Header from "@/components/layout/Header";
import { qaData } from "@/data/mockData";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const QAndA: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [askQuestion, setAskQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  
  // Filter Q&A based on search query
  const filteredQA = qaData.filter(item => 
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Group Q&A by category
  const qaByCategory = filteredQA.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof qaData>);
  
  const handleSubmitQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    setAskQuestion(false);
    setNewQuestion("");
    // In a real app, this would submit the question to the backend
  };
  
  return (
    <div className="h-full min-h-screen bg-muted/30">
      <Header title="Q&A Knowledge Base" />
      
      <main className="container py-6 space-y-6 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              placeholder="Search questions..." 
              className="pl-10 w-full sm:w-80"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Button 
            className="gap-2 w-full sm:w-auto" 
            onClick={() => setAskQuestion(true)}
          >
            <Plus size={16} />
            Ask a Question
          </Button>
        </div>
        
        {askQuestion && (
          <div className="glass-card p-6">
            <h3 className="text-lg font-medium mb-4">Ask a New Question</h3>
            <form onSubmit={handleSubmitQuestion} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="new-question" className="text-sm font-medium">
                  Your Question
                </label>
                <Input 
                  id="new-question"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Type your question here..."
                  className="w-full"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setAskQuestion(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Submit Question</Button>
              </div>
            </form>
          </div>
        )}
        
        <div className="glass-card overflow-hidden">
          <Tabs defaultValue="all" className="w-full">
            <div className="px-6 pt-6 pb-3 border-b border-border">
              <TabsList className="mb-2">
                <TabsTrigger value="all">All Questions</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
              </TabsList>
              
              <div className="text-sm text-muted-foreground">
                {filteredQA.length} questions available
              </div>
            </div>
            
            <div className="p-6">
              <TabsContent value="all" className="m-0">
                {Object.keys(qaByCategory).length > 0 ? (
                  Object.entries(qaByCategory).map(([category, items]) => (
                    <div key={category} className="mb-6">
                      <h3 className="text-lg font-medium mb-3 capitalize">{category}</h3>
                      <Accordion type="single" collapsible className="space-y-2">
                        {items.map((item, index) => (
                          <AccordionItem 
                            key={index} 
                            value={`${category}-${index}`}
                            className="bg-card px-4 rounded-lg border"
                          >
                            <AccordionTrigger className="py-4 hover:no-underline">
                              <span className="text-sm font-medium text-left">{item.question}</span>
                            </AccordionTrigger>
                            <AccordionContent className="pt-2 pb-4">
                              <p className="text-sm text-muted-foreground">{item.answer}</p>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No questions found matching your search.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="popular" className="m-0">
                <Accordion type="single" collapsible className="space-y-2">
                  {filteredQA.slice(0, 5).map((item, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`popular-${index}`}
                      className="bg-card px-4 rounded-lg border"
                    >
                      <AccordionTrigger className="py-4 hover:no-underline">
                        <span className="text-sm font-medium text-left">{item.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4">
                        <p className="text-sm text-muted-foreground">{item.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
              
              <TabsContent value="recent" className="m-0">
                <Accordion type="single" collapsible className="space-y-2">
                  {filteredQA.slice(0, 5).reverse().map((item, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`recent-${index}`}
                      className="bg-card px-4 rounded-lg border"
                    >
                      <AccordionTrigger className="py-4 hover:no-underline">
                        <span className="text-sm font-medium text-left">{item.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="pt-2 pb-4">
                        <p className="text-sm text-muted-foreground">{item.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default QAndA;