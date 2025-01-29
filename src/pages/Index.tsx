import { SidebarProvider } from "@/components/ui/sidebar";
import { AgentSidebar } from "@/components/AgentSidebar";
import { ChatInterface } from "@/components/ChatInterface";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3]">
        <AgentSidebar />
        <main className="flex-1 flex flex-col p-4 md:p-6">
          <ChatInterface />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;