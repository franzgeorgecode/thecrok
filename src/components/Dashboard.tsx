import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { DocumentList } from './DocumentList';
import { DocumentEditor } from './DocumentEditor';
import { useAuth } from '../context/AuthContext';
import { useDocuments } from '../hooks/useDocuments';
import { Document } from '../types';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const {
    documents,
    createDocument,
    updateDocument,
    deleteDocument,
    canEdit,
  } = useDocuments(user?.id);

  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const handleNewDocument = () => {
    setSelectedDocument(null);
    setIsCreatingNew(true);
  };

  const handleSaveDocument = async (docData: Partial<Document>) => {
    if (selectedDocument) {
      await updateDocument(selectedDocument.id, docData);
      setSelectedDocument(null);
    } else {
      await createDocument({
        title: docData.title || 'Untitled',
        icon: docData.icon,
        coverImage: docData.coverImage,
        blocks: docData.blocks || [],
        isPublic: docData.isPublic ?? true,
        isFavorite: docData.isFavorite,
        tags: docData.tags,
        createdBy: user!.id,
      });
      setIsCreatingNew(false);
    }
  };

  const handleSelectDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setIsCreatingNew(false);
  };

  const handleCloseEditor = () => {
    setSelectedDocument(null);
    setIsCreatingNew(false);
  };

  return (
    <div className="h-screen flex">
      <Sidebar
        onNewDocument={handleNewDocument}
        onLogout={logout}
        username={user!.username}
        documents={documents}
        onSelectDocument={handleSelectDocument}
        currentUserId={user!.id}
      />

      {selectedDocument || isCreatingNew ? (
        <DocumentEditor
          document={selectedDocument}
          onClose={handleCloseEditor}
          onSave={handleSaveDocument}
          onDelete={deleteDocument}
          canEdit={selectedDocument ? canEdit(selectedDocument) : true}
          currentUserId={user!.id}
        />
      ) : (
        <DocumentList
          documents={documents}
          onSelect={handleSelectDocument}
          currentUserId={user!.id}
        />
      )}
    </div>
  );
};
