from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import chromadb
from chromadb.config import Settings
import os
from datetime import datetime

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ChromaDB
chroma_client = chromadb.Client(Settings(
    chroma_db_impl="duckdb+parquet",
    persist_directory="db"
))

# Create a collection for documents
collection = chroma_client.get_or_create_collection(name="documents")

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

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        # Get relevant context from ChromaDB based on the last message
        last_message = request.messages[-1].content
        results = collection.query(
            query_texts=[last_message],
            n_results=request.context_size
        )
        
        # Combine context with the chat message
        context = "\n".join(results['documents'][0]) if results['documents'] else ""
        
        # Here you would typically:
        # 1. Format the messages and context for your AI model
        # 2. Call your AI model
        # 3. Process the response
        
        # For now, we'll return a mock response
        response = {
            "role": "assistant",
            "content": f"This is a mock response. I would use this context: {context[:100]}..."
        }
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    try:
        # Read file content
        content = await file.read()
        text_content = content.decode('utf-8')
        
        # Generate a unique document ID
        document_id = f"doc_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        
        # Add document to ChromaDB
        collection.add(
            documents=[text_content],
            metadatas=[{"filename": file.filename, "upload_date": str(datetime.now())}],
            ids=[document_id]
        )
        
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
        # Get all documents from the collection
        all_metadata = collection.get()
        
        documents = []
        for i, metadata in enumerate(all_metadata['metadatas']):
            doc_metadata = DocumentMetadata(
                filename=metadata['filename'],
                upload_date=metadata['upload_date'],
                document_id=all_metadata['ids'][i]
            )
            documents.append(doc_metadata)
            
        return documents
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)