import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

interface QuestionSuggestionsProps {
  questions: string[];
  onQuestionClick: (question: string) => void;
  onClose: () => void;
}

const QuestionSuggestions: React.FC<QuestionSuggestionsProps> = ({
  questions,
  onQuestionClick,
  onClose
}) => {
  if (questions.length === 0) return null;

  return (
    <Card className="w-full animate-fade-in border-primary/20 bg-gradient-to-br from-background to-primary/5">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">你可能想问</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground h-6 w-6 p-0"
          >
            ×
          </Button>
        </div>
        
        <div className="space-y-2">
          {questions.map((question, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => onQuestionClick(question)}
              className="w-full justify-start text-left h-auto p-3 text-sm bg-card hover:bg-accent/50 border-border"
            >
              <span className="text-xs text-muted-foreground mr-2 font-mono">
                {String(index + 1).padStart(2, '0')}
              </span>
              {question}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionSuggestions;