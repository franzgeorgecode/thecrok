import React, { useState } from 'react';
import { Document } from '../types';
import { FileText, Star, Globe, Lock, Search, SortAsc, Filter } from 'lucide-react';

interface DocumentListProps {
  documents: Document[];
  onSelect: (doc: Document) => void;
  currentUserId: string;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  onSelect,
  currentUserId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'title' | 'created'>('recent');
  const [filterBy, setFilterBy] = useState<'all' | 'public' | 'private' | 'favorites'>('all');

  const filteredAndSortedDocs = documents
    .filter((doc) => {
      const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.blocks.some(block => block.content.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesFilter = 
        filterBy === 'all' ||
        (filterBy === 'public' && doc.isPublic) ||
        (filterBy === 'private' && !doc.isPublic) ||
        (filterBy === 'favorites' && doc.isFavorite);

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'recent':
        default:
          return new Date(b.lastEditedAt).getTime() - new Date(a.lastEditedAt).getTime();
      }
    });

  return (
    <div className="flex-1 flex flex-col">
      {/* Search and Filters */}
      <div className="p-4 border-b border-gray-200 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 outline-none focus:border-black"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 flex-1">
            <SortAsc className="w-4 h-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="flex-1 px-2 py-1 border border-gray-300 outline-none focus:border-black text-sm"
            >
              <option value="recent">Last Edited</option>
              <option value="created">Date Created</option>
              <option value="title">Title</option>
            </select>
          </div>

          <div className="flex items-center gap-1 flex-1">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as any)}
              className="flex-1 px-2 py-1 border border-gray-300 outline-none focus:border-black text-sm"
            >
              <option value="all">All Documents</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="favorites">Favorites</option>
            </select>
          </div>
        </div>
      </div>

      {/* Document List */}
      <div className="flex-1 overflow-y-auto">
        {filteredAndSortedDocs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <FileText className="w-12 h-12 mb-2" />
            <p>No documents found</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {filteredAndSortedDocs.map((doc) => (
              <button
                key={doc.id}
                onClick={() => onSelect(doc)}
                className="w-full text-left p-3 hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{doc.icon || '📄'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium truncate">{doc.title || 'Untitled'}</h3>
                      {doc.isFavorite && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
                      )}
                      {doc.isPublic ? (
                        <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      ) : (
                        <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{new Date(doc.lastEditedAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{doc.createdBy === currentUserId ? 'You' : doc.createdBy}</span>
                    </div>
                    {doc.tags && doc.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {doc.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-gray-100 text-xs border border-gray-200"
                          >
                            {tag}
                          </span>
                        ))}
                        {doc.tags.length > 3 && (
                          <span className="px-2 py-0.5 text-xs text-gray-400">
                            +{doc.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
