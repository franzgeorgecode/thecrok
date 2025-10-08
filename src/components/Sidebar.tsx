import React, { useState } from 'react';
import { FileText, Plus, LogOut, Star, Globe, Lock, FolderOpen } from 'lucide-react';
import { Document } from '../types';

interface SidebarProps {
  onNewDocument: () => void;
  onLogout: () => void;
  username: string;
  documents: Document[];
  onSelectDocument: (doc: Document) => void;
  currentUserId: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  onNewDocument,
  onLogout,
  username,
  documents,
  onSelectDocument,
  currentUserId,
}) => {
  const [activeView, setActiveView] = useState<'all' | 'favorites' | 'public' | 'private'>('all');

  const favoritesDocs = documents.filter(doc => doc.isFavorite);
  const publicDocs = documents.filter(doc => doc.isPublic);
  const privateDocs = documents.filter(doc => !doc.isPublic && doc.createdBy === currentUserId);

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-6 h-6" />
          <span className="text-xl font-bold">Crok</span>
        </div>
        <div className="text-sm text-gray-600 mb-3">
          {username}
        </div>
        <button
          onClick={onNewDocument}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Document
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          <button
            onClick={() => setActiveView('all')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
              activeView === 'all' ? 'bg-white border border-gray-200' : 'hover:bg-gray-100'
            }`}
          >
            <FolderOpen className="w-4 h-4" />
            <span className="flex-1">All Documents</span>
            <span className="text-xs text-gray-500">{documents.length}</span>
          </button>

          <button
            onClick={() => setActiveView('favorites')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
              activeView === 'favorites' ? 'bg-white border border-gray-200' : 'hover:bg-gray-100'
            }`}
          >
            <Star className="w-4 h-4" />
            <span className="flex-1">Favorites</span>
            <span className="text-xs text-gray-500">{favoritesDocs.length}</span>
          </button>

          <button
            onClick={() => setActiveView('public')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
              activeView === 'public' ? 'bg-white border border-gray-200' : 'hover:bg-gray-100'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span className="flex-1">Public</span>
            <span className="text-xs text-gray-500">{publicDocs.length}</span>
          </button>

          <button
            onClick={() => setActiveView('private')}
            className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${
              activeView === 'private' ? 'bg-white border border-gray-200' : 'hover:bg-gray-100'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span className="flex-1">Private</span>
            <span className="text-xs text-gray-500">{privateDocs.length}</span>
          </button>
        </div>

        {/* Quick Access Documents */}
        <div className="mt-6">
          <div className="px-3 py-2 text-xs font-bold text-gray-500">RECENT</div>
          <div className="space-y-1">
            {documents
              .sort((a, b) => new Date(b.lastEditedAt).getTime() - new Date(a.lastEditedAt).getTime())
              .slice(0, 5)
              .map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => onSelectDocument(doc)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-100 transition-colors group"
                >
                  <span className="text-lg">{doc.icon || '📄'}</span>
                  <span className="flex-1 truncate text-sm">{doc.title || 'Untitled'}</span>
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 hover:border-black transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};
