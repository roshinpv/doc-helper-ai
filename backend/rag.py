from typing import List, Optional
import chromadb
from chromadb.config import Settings
from pydantic import BaseModel

class Document(BaseModel):
    content: str
    metadata: dict

class RAGEngine:
    def __init__(self, collection_name: str = "documents"):
        self.client = chromadb.Client(Settings(
            chroma_db_impl="duckdb+parquet",
            persist_directory="db"
        ))
        self.collection = self.client.get_or_create_collection(name=collection_name)
    
    def add_document(self, document: Document, document_id: str):
        """Add a document to the vector store"""
        self.collection.add(
            documents=[document.content],
            metadatas=[document.metadata],
            ids=[document_id]
        )
    
    def search(self, query: str, n_results: int = 5) -> List[Document]:
        """Search for relevant documents based on a query"""
        results = self.collection.query(
            query_texts=[query],
            n_results=n_results
        )
        
        documents = []
        for i, doc in enumerate(results['documents'][0]):
            document = Document(
                content=doc,
                metadata=results['metadatas'][0][i]
            )
            documents.append(document)
        
        return documents
    
    def delete_document(self, document_id: str):
        """Delete a document from the vector store"""
        self.collection.delete(ids=[document_id])
    
    def get_document(self, document_id: str) -> Optional[Document]:
        """Retrieve a specific document by ID"""
        result = self.collection.get(ids=[document_id])
        if result['documents']:
            return Document(
                content=result['documents'][0],
                metadata=result['metadatas'][0]
            )
        return None

# Create a global instance of the RAG engine
rag_engine = RAGEngine()