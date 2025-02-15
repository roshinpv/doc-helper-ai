import { useState } from 'react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarHeader } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Plus, Bot, FileText } from "lucide-react";
import { FileUploadModal } from './FileUploadModal';
import { AddAgentModal } from './AddAgentModal';

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
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAddAgentModal, setShowAddAgentModal] = useState(false);

  return (
    <>
      <Sidebar className="border-r border-gray-200/50 bg-white/50 backdrop-blur-sm">
        <SidebarHeader className="p-4 border-b border-gray-200/50">
          <h2 className="text-lg font-semibold text-gray-800">AI Agents</h2>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <div className="px-3 py-2">
              <Button 
                className="w-full justify-start bg-white hover:bg-gray-50 text-gray-700 border border-gray-200/50 shadow-sm" 
                variant="outline"
                onClick={() => setShowAddAgentModal(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Agent
              </Button>
            </div>
            <div className="space-y-1 p-3">
              {agents.map((agent) => (
                <Button
                  key={agent.id}
                  variant={selectedAgent === agent.id ? "secondary" : "ghost"}
                  className={`w-full justify-start transition-all duration-200 ${
                    selectedAgent === agent.id 
                      ? 'bg-[#9b87f5]/10 text-[#7E69AB] hover:bg-[#9b87f5]/20' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
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
              <h3 className="mb-2 px-4 text-sm font-semibold text-gray-600">Documents</h3>
              <Button 
                variant="outline" 
                className="w-full justify-start bg-white hover:bg-gray-50 text-gray-700 border border-gray-200/50 shadow-sm"
                onClick={() => setShowUploadModal(true)}
              >
                <FileText className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </div>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <FileUploadModal 
        open={showUploadModal} 
        onClose={() => setShowUploadModal(false)} 
      />
      
      <AddAgentModal 
        open={showAddAgentModal} 
        onClose={() => setShowAddAgentModal(false)} 
      />
    </>
  );
}