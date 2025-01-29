import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bold, Italic, Code, List, Link as LinkIcon } from "lucide-react";
import MDEditor from '@uiw/react-md-editor';
import ReactMarkdown from 'react-markdown';
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "This is a simulated AI response. The backend integration will be implemented later.",
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const formatText = (format: string) => {
    const formats: { [key: string]: { prefix: string; suffix: string } } = {
      bold: { prefix: '**', suffix: '**' },
      italic: { prefix: '_', suffix: '_' },
      code: { prefix: '`', suffix: '`' },
      list: { prefix: '- ', suffix: '\n' },
      link: { prefix: '[', suffix: '](url)' },
    };

    const { prefix, suffix } = formats[format];
    const selectionStart = (document.querySelector('.editor-input') as HTMLTextAreaElement)?.selectionStart || 0;
    const selectionEnd = (document.querySelector('.editor-input') as HTMLTextAreaElement)?.selectionEnd || 0;
    const selectedText = input.substring(selectionStart, selectionEnd);
    const newText = selectedText ? prefix + selectedText + suffix : prefix + suffix;
    
    setInput(prev => 
      prev.substring(0, selectionStart) + newText + prev.substring(selectionEnd)
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-lg p-4",
                message.role === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-secondary text-secondary-foreground'
              )}
            >
              <ReactMarkdown className="prose dark:prose-invert">
                {message.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-secondary text-secondary-foreground rounded-lg p-4">
              Thinking...
            </div>
          </div>
        )}
      </div>
      <div className="border-t p-4">
        <div className="mb-2 flex gap-2 items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => formatText('bold')}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => formatText('italic')}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => formatText('code')}
            title="Code"
          >
            <Code className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => formatText('list')}
            title="List"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => formatText('link')}
            title="Link"
          >
            <LinkIcon className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? 'Edit' : 'Preview'}
          </Button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex flex-col gap-2"
        >
          {showPreview ? (
            <div className="min-h-[100px] p-3 border rounded-md bg-background">
              <ReactMarkdown className="prose dark:prose-invert">
                {input}
              </ReactMarkdown>
            </div>
          ) : (
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message... (Markdown supported)"
              className="editor-input min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          )}
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}