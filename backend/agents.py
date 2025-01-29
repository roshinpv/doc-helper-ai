from pydantic import BaseModel
from typing import List, Optional

class Agent(BaseModel):
    id: str
    name: str
    description: str
    capabilities: List[str]
    parameters: Optional[dict] = None

class AgentRegistry:
    def __init__(self):
        self.agents = {}
        self._initialize_default_agents()
    
    def _initialize_default_agents(self):
        default_agents = [
            Agent(
                id="general",
                name="General Assistant",
                description="A general-purpose AI assistant that can help with various tasks.",
                capabilities=["chat", "analysis", "writing"]
            ),
            Agent(
                id="researcher",
                name="Research Assistant",
                description="Specialized in research, document analysis, and information retrieval.",
                capabilities=["research", "summarization", "citation"]
            ),
            Agent(
                id="coder",
                name="Code Assistant",
                description="Expert in programming and technical tasks.",
                capabilities=["coding", "debugging", "code review"]
            )
        ]
        
        for agent in default_agents:
            self.register_agent(agent)
    
    def register_agent(self, agent: Agent):
        self.agents[agent.id] = agent
    
    def get_agent(self, agent_id: str) -> Optional[Agent]:
        return self.agents.get(agent_id)
    
    def list_agents(self) -> List[Agent]:
        return list(self.agents.values())
    
    def remove_agent(self, agent_id: str):
        if agent_id in self.agents:
            del self.agents[agent_id]

# Create a global instance of the registry
agent_registry = AgentRegistry()