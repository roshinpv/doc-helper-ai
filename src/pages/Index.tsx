import { SidebarProvider } from "@/components/ui/sidebar";
import { AgentSidebar } from "@/components/AgentSidebar";
import { ChatInterface } from "@/components/ChatInterface";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AgentSidebar />
        <main className="flex-1 flex flex-col">
          <ChatInterface />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;