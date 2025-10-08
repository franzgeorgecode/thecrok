import React, { useState, useEffect } from 'react';
import { Document, Block } from '../types';
import { X, Save, Trash2, Globe, Lock, Star, Tag, Image as ImageIcon } from 'lucide-react';
import { BlockEditor } from './BlockEditor';

interface DocumentEditorProps {
  document: Document | null;
  onClose: () => void;
  onSave: (doc: Partial<Document>) => void;
  onDelete: (id: string) => void;
  canEdit: boolean;
  currentUserId: string;
}

const EMOJI_LIST = ['📄', '📝', '📋', '📌', '💡', '🎯', '🚀', '⭐', '🔥', '💼', '📊', '🎨', '🔧', '📱', '💻', '📚', '🎓', '🏆', '💰', '🌟'];

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  document,
  onClose,
  onSave,
  onDelete,
  canEdit,
  currentUserId,
}) => {
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState('📄');
  const [coverImage, setCoverImage] = useState('');
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCoverUpload, setShowCoverUpload] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    if (document) {
      setTitle(document.title);
      setIcon(document.icon || '📄');
      setCoverImage(document.coverImage || '');
      setBlocks(document.blocks && document.blocks.length > 0 ? document.blocks : [createNewBlock(0)]);
      setIsPublic(document.isPublic);
      setIsFavorite(document.isFavorite || false);
      setTags(document.tags || []);
      setHasUnsavedChanges(false);
    } else {
      setTitle('');
      setIcon('📄');
      setCoverImage('');
      setBlocks([createNewBlock(0)]);
      setIsPublic(true);
      setIsFavorite(false);
      setTags([]);
      setHasUnsavedChanges(false);
    }
  }, [document]);

  useEffect(() => {
    if (document || title || blocks.some(b => b.content)) {
      setHasUnsavedChanges(true);
    }
  }, [title, blocks, isPublic, isFavorite, tags, icon, coverImage]);

  const createNewBlock = (order: number): Block => ({
    id: Date.now().toString() + Math.random(),
    type: 'paragraph',
    content: '',
    order,
  });

  const updateBlock = (index: number, updatedBlock: Block) => {
    const newBlocks = [...blocks];
    newBlocks[index] = updatedBlock;
    setBlocks(newBlocks);
  };

  const deleteBlock = (index: number) => {
    if (blocks.length === 1) {
      setBlocks([createNewBlock(0)]);
      return;
    }
    const newBlocks = blocks.filter((_, i) => i !== index);
    setBlocks(newBlocks.map((block, i) => ({ ...block, order: i })));
  };

  const addBlockBelow = (index: number) => {
    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, createNewBlock(index + 1));
    setBlocks(newBlocks.map((block, i) => ({ ...block, order: i })));
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverImage(reader.result as string);
      setShowCoverUpload(false);
    };
    reader.readAsDataURL(file);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSave = () => {
    const docData: Partial<Document> = {
      title: title || 'Untitled',
      icon,
      coverImage,
      blocks: blocks.filter(b => b.content || b.type === 'divider' || b.type === 'image' || b.type === 'table'),
      isPublic,
      isFavorite,
      tags,
    };

    if (document) {
      onSave({ ...docData, id: document.id });
    } else {
      onSave({ ...docData, createdBy: currentUserId });
    }
    setHasUnsavedChanges(false);
  };

  const handleDelete = () => {
    if (document && window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      onDelete(document.id);
      onClose();
    }
  };

  const handleClose = () => {
    if (hasUnsavedChanges && !window.confirm('You have unsaved changes. Are you sure you want to close?')) {
      return;
    }
    onClose();
  };

  const isOwner = document?.createdBy === currentUserId;
  const canEditDoc = !document || canEdit;

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Top Bar */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
            
            {canEditDoc && (
              <>
                <button
                  onClick={() => setIsPublic(!isPublic)}
                  className={`flex items-center gap-2 px-3 py-1.5 border transition-colors text-sm ${
                    isPublic
                      ? 'border-black bg-black text-white'
                      : 'border-gray-300 hover:border-black'
                  }`}
                  title={isPublic ? 'Public - Anyone can edit' : 'Private - Only you can edit'}
                >
                  {isPublic ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  <span>{isPublic ? 'Public' : 'Private'}</span>
                </button>

                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`p-2 rounded transition-colors ${
                    isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-gray-600'
                  }`}
                  title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Star className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {hasUnsavedChanges && canEditDoc && (
              <span className="text-sm text-gray-500 mr-2">Unsaved changes</span>
            )}
            {document && isOwner && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-colors flex items-center gap-2"
                title="Delete document"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            )}
            {canEditDoc && (
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
                title="Save document"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative">
        {coverImage ? (
          <div className="relative h-64 bg-gray-100">
            <img
              src={coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            {canEditDoc && (
              <div className="absolute top-4 right-4 flex gap-2">
                <label className="px-3 py-1.5 bg-white border border-gray-300 hover:border-black transition-colors text-sm cursor-pointer">
                  Change Cover
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={() => setCoverImage('')}
                  className="px-3 py-1.5 bg-white border border-gray-300 hover:border-black transition-colors text-sm"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        ) : (
          canEditDoc && (
            <div className="relative">
              {showCoverUpload ? (
                <div className="h-64 bg-gray-50 border-b border-gray-200 flex items-center justify-center">
                  <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:border-black cursor-pointer transition-colors">
                    <ImageIcon className="w-4 h-4" />
                    <span>Upload Cover Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <button
                  onClick={() => setShowCoverUpload(true)}
                  className="absolute top-4 right-4 px-3 py-1.5 bg-white border border-gray-300 hover:border-black transition-colors text-sm z-10"
                >
                  Add Cover
                </button>
              )}
            </div>
          )
        )}
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Icon and Title */}
        <div className="mb-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="relative">
              <button
                onClick={() => canEditDoc && setShowEmojiPicker(!showEmojiPicker)}
                className="text-6xl hover:bg-gray-100 rounded p-2 transition-colors disabled:cursor-not-allowed"
                disabled={!canEditDoc}
                title="Change icon"
              >
                {icon}
              </button>
              {showEmojiPicker && canEditDoc && (
                <div className="absolute top-full left-0 mt-2 bg-white border-2 border-black shadow-lg p-4 grid grid-cols-5 gap-2 z-10">
                  {EMOJI_LIST.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        setIcon(emoji);
                        setShowEmojiPicker(false);
                      }}
                      className="text-3xl hover:bg-gray-100 rounded p-2 transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled"
            disabled={!canEditDoc}
            className="text-5xl font-bold w-full outline-none disabled:bg-transparent mb-4"
          />

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 px-3 py-1 bg-gray-100 border border-gray-300 text-sm"
              >
                <Tag className="w-3 h-3" />
                {tag}
                {canEditDoc && (
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-red-600"
                    title="Remove tag"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
            {canEditDoc && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTag()}
                  placeholder="Add tag..."
                  className="px-3 py-1 border border-gray-300 text-sm outline-none focus:border-black"
                />
                <button
                  onClick={addTag}
                  className="px-3 py-1 bg-black text-white text-sm hover:bg-gray-800"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Blocks */}
        <div className="space-y-1">
          {blocks.map((block, index) => (
            <BlockEditor
              key={block.id}
              block={block}
              onUpdate={(updatedBlock) => updateBlock(index, updatedBlock)}
              onDelete={() => deleteBlock(index)}
              onAddBelow={() => addBlockBelow(index)}
              canEdit={canEditDoc}
            />
          ))}
        </div>

        {/* Metadata */}
        {document && (
          <div className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-500 space-y-1">
            <div>Created by: <span className="font-medium">{document.createdBy === currentUserId ? 'You' : document.createdBy}</span></div>
            <div>Created: <span className="font-medium">{new Date(document.createdAt).toLocaleString()}</span></div>
            <div>Last edited: <span className="font-medium">{new Date(document.lastEditedAt).toLocaleString()}</span></div>
          </div>
        )}
      </div>
    </div>
  );
};
