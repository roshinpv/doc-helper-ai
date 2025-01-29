import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

interface AddAgentModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddAgentModal({ open, onClose }: AddAgentModalProps) {
  const { toast } = useToast();
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [capabilities, setCapabilities] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          capabilities: capabilities.split(',').map(cap => cap.trim()),
        }),
      });

      if (!response.ok) throw new Error('Failed to create agent');

      toast({
        title: "Success",
        description: "Agent created successfully",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create agent",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Agent</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Agent Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Research Assistant"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this agent does..."
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="capabilities">
              Capabilities (comma-separated)
            </Label>
            <Input
              id="capabilities"
              value={capabilities}
              onChange={(e) => setCapabilities(e.target.value)}
              placeholder="e.g., research, analysis, writing"
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-accent hover:bg-accent/90"
            >
              Create Agent
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}