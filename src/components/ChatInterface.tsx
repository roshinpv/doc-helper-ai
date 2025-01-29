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
    <div className="flex flex-col h-full bg-white/70 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200/50">
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
                "max-w-[80%] rounded-lg p-4 shadow-sm",
                message.role === 'user'
                  ? 'bg-[#9b87f5] text-white'
                  : 'bg-gray-50 text-gray-800 border border-gray-200/50'
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
            <div className="bg-gray-50 text-gray-800 rounded-lg p-4 border border-gray-200/50 shadow-sm">
              Thinking...
            </div>
          </div>
        )}
      </div>
      <div className="border-t border-gray-200/50 p-4 bg-white/50">
        <div className="mb-2 flex gap-2 items-center">
          {['bold', 'italic', 'code', 'list', 'link'].map((format) => (
            <Button
              key={format}
              variant="ghost"
              size="icon"
              onClick={() => formatText(format)}
              title={format.charAt(0).toUpperCase() + format.slice(1)}
              className="text-gray-600 hover:bg-gray-100"
            >
              {format === 'bold' && <Bold className="h-4 w-4" />}
              {format === 'italic' && <Italic className="h-4 w-4" />}
              {format === 'code' && <Code className="h-4 w-4" />}
              {format === 'list' && <List className="h-4 w-4" />}
              {format === 'link' && <LinkIcon className="h-4 w-4" />}
            </Button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="text-gray-600 hover:bg-gray-100"
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
            <div className="min-h-[100px] p-3 border rounded-lg bg-gray-50">
              <ReactMarkdown className="prose dark:prose-invert">
                {input}
              </ReactMarkdown>
            </div>
          ) : (
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message... (Markdown supported)"
              className="editor-input min-h-[100px] w-full rounded-lg border border-gray-200/50 bg-white/80 px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9b87f5] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          )}
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white transition-colors duration-200"
            >
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
