import { useState } from 'react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Plus, Bot, FileText } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  description: string;
}

const defaultAgents: Agent[] = [
  {
    id: '1',
    name: 'General Assistant',
    description: 'A general-purpose AI assistant'
  },
  {
    id: '2',
    name: 'Code Helper',
    description: 'Specialized in coding assistance'
  }
];

export function AgentSidebar() {
  const [agents, setAgents] = useState<Agent[]>(defaultAgents);
  const [selectedAgent, setSelectedAgent] = useState<string>(agents[0].id);

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-4">
        <h2 className="text-lg font-semibold">AI Agents</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <div className="px-3 py-2">
            <Button className="w-full justify-start" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              New Agent
            </Button>
          </div>
          <div className="space-y-1 p-3">
            {agents.map((agent) => (
              <Button
                key={agent.id}
                variant={selectedAgent === agent.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedAgent(agent.id)}
              >
                <Bot className="mr-2 h-4 w-4" />
                {agent.name}
              </Button>
            ))}
          </div>
        </SidebarGroup>
        <SidebarGroup>
          <div className="p-3">
            <h3 className="mb-2 px-4 text-sm font-semibold">Documents</h3>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Upload Document
            </Button>
          </div>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}