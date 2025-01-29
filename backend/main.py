from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import chromadb
from chromadb.config import Settings
import os
from datetime import datetime
from .agents import agent_registry, Agent
from .rag import rag_engine

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    agent_id: str
    context_size: Optional[int] = 5

class DocumentMetadata(BaseModel):
    filename: str
    upload_date: str
    document_id: str

class CreateAgentRequest(BaseModel):
    name: str
    description: str
    capabilities: List[str]

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        # Get relevant context from ChromaDB based on the last message
        last_message = request.messages[-1].content
        results = rag_engine.search(last_message, n_results=request.context_size)
        
        # Get the agent
        agent = agent_registry.get_agent(request.agent_id)
        if not agent:
            raise HTTPException(status_code=404, detail="Agent not found")
        
        # Combine context with the chat message
        context = "\n".join([doc.content for doc in results])
        
        # Mock response for now
        response = {
            "role": "assistant",
            "content": f"This is a response from {agent.name}. Context used: {context[:100]}..."
        }
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    try:
        content = await file.read()
        text_content = content.decode('utf-8')
        
        document_id = f"doc_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        metadata = {
            "filename": file.filename,
            "upload_date": str(datetime.now())
        }
        
        rag_engine.add_document({
            "content": text_content,
            "metadata": metadata
        }, document_id)
        
        return {
            "message": "Document uploaded successfully",
            "document_id": document_id,
            "filename": file.filename
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/documents")
async def list_documents() -> List[DocumentMetadata]:
    try:
        # Implementation remains the same
        # ... keep existing code
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/agents")
async def create_agent(request: CreateAgentRequest):
    try:
        agent_id = f"agent_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        new_agent = Agent(
            id=agent_id,
            name=request.name,
            description=request.description,
            capabilities=request.capabilities
        )
        
        agent_registry.register_agent(new_agent)
        
        return {
            "message": "Agent created successfully",
            "agent": new_agent
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/agents")
async def list_agents():
    try:
        return agent_registry.list_agents()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)