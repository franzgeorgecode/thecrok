import React, { useState, useRef, useEffect } from 'react';
import { Block } from '../types';
import {
  Type,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  Minus,
  Image as ImageIcon,
  Table,
  Heading1,
  Heading2,
  Heading3,
  GripVertical,
  Plus,
  Trash2
} from 'lucide-react';

interface BlockEditorProps {
  block: Block;
  onUpdate: (block: Block) => void;
  onDelete: () => void;
  onAddBelow: () => void;
  canEdit: boolean;
}

export const BlockEditor: React.FC<BlockEditorProps> = ({
  block,
  onUpdate,
  onDelete,
  onAddBelow,
  canEdit
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [content, setContent] = useState(block.content);
  const [menuSearch, setMenuSearch] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setContent(block.content);
  }, [block.content]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
        setMenuSearch('');
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = inputRef.current.scrollHeight + 'px';
    }
  }, [content]);

  const handleContentChange = (value: string) => {
    setContent(value);
    onUpdate({ ...block, content: value });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && block.type !== 'code') {
      e.preventDefault();
      onAddBelow();
    } else if (e.key === '/' && content === '') {
      e.preventDefault();
      setShowMenu(true);
    } else if (e.key === 'Backspace' && content === '' && block.type === 'paragraph') {
      e.preventDefault();
      onDelete();
    } else if (e.key === 'Escape' && showMenu) {
      setShowMenu(false);
      setMenuSearch('');
    }
  };

  const changeBlockType = (type: Block['type']) => {
    if (type === 'table') {
      onUpdate({
        ...block,
        type,
        content: '',
        properties: { rows: [['', '', ''], ['', '', ''], ['', '', '']] }
      });
    } else if (type === 'image') {
      onUpdate({
        ...block,
        type,
        content: '',
        properties: { url: '' }
      });
    } else {
      onUpdate({ ...block, type, content: '' });
    }
    setShowMenu(false);
    setMenuSearch('');
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      onUpdate({
        ...block,
        type: 'image',
        properties: { url: reader.result as string }
      });
    };
    reader.readAsDataURL(file);
  };

  const toggleTodo = () => {
    onUpdate({
      ...block,
      properties: {
        ...block.properties,
        checked: !block.properties?.checked
      }
    });
  };

  const addTableRow = () => {
    const currentRows = block.properties?.rows || [];
    const columnCount = currentRows[0]?.length || 3;
    const newRow = Array(columnCount).fill('');
    onUpdate({
      ...block,
      properties: {
        ...block.properties,
        rows: [...currentRows, newRow]
      }
    });
  };

  const addTableColumn = () => {
    const currentRows = block.properties?.rows || [];
    const newRows = currentRows.map(row => [...row, '']);
    onUpdate({
      ...block,
      properties: {
        ...block.properties,
        rows: newRows
      }
    });
  };

  const deleteTableRow = (rowIndex: number) => {
    const currentRows = block.properties?.rows || [];
    if (currentRows.length <= 1) return;
    const newRows = currentRows.filter((_, i) => i !== rowIndex);
    onUpdate({
      ...block,
      properties: {
        ...block.properties,
        rows: newRows
      }
    });
  };

  const deleteTableColumn = (colIndex: number) => {
    const currentRows = block.properties?.rows || [];
    if (currentRows[0]?.length <= 1) return;
    const newRows = currentRows.map(row => row.filter((_, i) => i !== colIndex));
    onUpdate({
      ...block,
      properties: {
        ...block.properties,
        rows: newRows
      }
    });
  };

  const blockTypes = [
    { 
      category: 'BASIC BLOCKS',
      items: [
        { type: 'paragraph' as const, icon: <Type className="w-4 h-4" />, label: 'Text', desc: 'Just start writing with plain text', keywords: ['text', 'paragraph', 'plain'] },
        { type: 'heading1' as const, icon: <Heading1 className="w-4 h-4" />, label: 'Heading 1', desc: 'Big section heading', keywords: ['h1', 'heading', 'title', 'large'] },
        { type: 'heading2' as const, icon: <Heading2 className="w-4 h-4" />, label: 'Heading 2', desc: 'Medium section heading', keywords: ['h2', 'heading', 'subtitle', 'medium'] },
        { type: 'heading3' as const, icon: <Heading3 className="w-4 h-4" />, label: 'Heading 3', desc: 'Small section heading', keywords: ['h3', 'heading', 'small'] },
        { type: 'bulletList' as const, icon: <List className="w-4 h-4" />, label: 'Bulleted list', desc: 'Create a simple bulleted list', keywords: ['bullet', 'list', 'unordered', 'ul'] },
        { type: 'numberedList' as const, icon: <ListOrdered className="w-4 h-4" />, label: 'Numbered list', desc: 'Create a list with numbering', keywords: ['number', 'list', 'ordered', 'ol'] },
        { type: 'todo' as const, icon: <CheckSquare className="w-4 h-4" />, label: 'To-do list', desc: 'Track tasks with a to-do list', keywords: ['todo', 'task', 'checkbox', 'check'] },
        { type: 'quote' as const, icon: <Quote className="w-4 h-4" />, label: 'Quote', desc: 'Capture a quote', keywords: ['quote', 'blockquote', 'citation'] },
        { type: 'code' as const, icon: <Code className="w-4 h-4" />, label: 'Code', desc: 'Capture a code snippet', keywords: ['code', 'snippet', 'programming'] },
        { type: 'divider' as const, icon: <Minus className="w-4 h-4" />, label: 'Divider', desc: 'Visually divide blocks', keywords: ['divider', 'separator', 'line', 'hr'] },
      ]
    },
    {
      category: 'MEDIA',
      items: [
        { type: 'image' as const, icon: <ImageIcon className="w-4 h-4" />, label: 'Image', desc: 'Upload or embed with a link', keywords: ['image', 'picture', 'photo', 'upload'] },
        { type: 'table' as const, icon: <Table className="w-4 h-4" />, label: 'Table', desc: 'Add a table to organize data', keywords: ['table', 'grid', 'spreadsheet', 'data'] },
      ]
    }
  ];

  const filteredBlockTypes = blockTypes.map(category => ({
    ...category,
    items: category.items.filter(item => {
      if (!menuSearch) return true;
      const search = menuSearch.toLowerCase();
      return (
        item.label.toLowerCase().includes(search) ||
        item.desc.toLowerCase().includes(search) ||
        item.keywords.some(keyword => keyword.includes(search))
      );
    })
  })).filter(category => category.items.length > 0);

  const renderBlock = () => {
    switch (block.type) {
      case 'heading1':
        return (
          <textarea
            ref={inputRef}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Heading 1"
            disabled={!canEdit}
            className="w-full text-4xl font-bold outline-none resize-none overflow-hidden disabled:bg-transparent"
            style={{ minHeight: '3rem' }}
          />
        );

      case 'heading2':
        return (
          <textarea
            ref={inputRef}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Heading 2"
            disabled={!canEdit}
            className="w-full text-3xl font-bold outline-none resize-none overflow-hidden disabled:bg-transparent"
            style={{ minHeight: '2.5rem' }}
          />
        );

      case 'heading3':
        return (
          <textarea
            ref={inputRef}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Heading 3"
            disabled={!canEdit}
            className="w-full text-2xl font-bold outline-none resize-none overflow-hidden disabled:bg-transparent"
            style={{ minHeight: '2rem' }}
          />
        );

      case 'bulletList':
        return (
          <div className="flex items-start gap-2">
            <span className="mt-2 select-none">•</span>
            <textarea
              ref={inputRef}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="List"
              disabled={!canEdit}
              className="flex-1 outline-none resize-none overflow-hidden disabled:bg-transparent"
            />
          </div>
        );

      case 'numberedList':
        return (
          <div className="flex items-start gap-2">
            <span className="mt-2 select-none">{block.order + 1}.</span>
            <textarea
              ref={inputRef}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="List"
              disabled={!canEdit}
              className="flex-1 outline-none resize-none overflow-hidden disabled:bg-transparent"
            />
          </div>
        );

      case 'todo':
        return (
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={block.properties?.checked || false}
              onChange={toggleTodo}
              disabled={!canEdit}
              className="mt-2 w-4 h-4 cursor-pointer disabled:cursor-not-allowed"
            />
            <textarea
              ref={inputRef}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="To-do"
              disabled={!canEdit}
              className={`flex-1 outline-none resize-none overflow-hidden disabled:bg-transparent ${
                block.properties?.checked ? 'line-through text-gray-400' : ''
              }`}
            />
          </div>
        );

      case 'quote':
        return (
          <div className="border-l-4 border-black pl-4">
            <textarea
              ref={inputRef}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Empty quote"
              disabled={!canEdit}
              className="w-full italic outline-none resize-none overflow-hidden disabled:bg-transparent"
            />
          </div>
        );

      case 'code':
        return (
          <div className="bg-gray-100 p-4 font-mono text-sm border border-gray-300 rounded">
            <textarea
              ref={inputRef}
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Code"
              disabled={!canEdit}
              className="w-full bg-transparent outline-none resize-none overflow-hidden"
              style={{ minHeight: '4rem' }}
            />
          </div>
        );

      case 'divider':
        return (
          <div className="my-4">
            <hr className="border-t-2 border-gray-300" />
          </div>
        );

      case 'image':
        return (
          <div className="my-4">
            {block.properties?.url ? (
              <div className="relative group">
                <img
                  src={block.properties.url}
                  alt="Block image"
                  className="max-w-full border border-gray-200 rounded"
                />
                {canEdit && (
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => onUpdate({ ...block, properties: { url: '' } })}
                      className="px-3 py-1 bg-white border border-gray-300 hover:border-black transition-colors text-sm rounded"
                    >
                      Remove Image
                    </button>
                  </div>
                )}
              </div>
            ) : (
              canEdit && (
                <label className="flex items-center justify-center gap-2 p-8 border-2 border-dashed border-gray-300 cursor-pointer hover:border-black transition-colors rounded">
                  <ImageIcon className="w-6 h-6" />
                  <span>Click to upload image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )
            )}
          </div>
        );

      case 'table':
        return (
          <div className="overflow-x-auto my-4">
            <table className="w-full border-collapse border border-gray-300">
              <tbody>
                {(block.properties?.rows || [['', '', ''], ['', '', ''], ['', '', '']]).map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} className="border border-gray-300 p-2 min-w-[100px]">
                        <input
                          type="text"
                          value={cell}
                          onChange={(e) => {
                            const newRows = [...(block.properties?.rows || [])];
                            newRows[i][j] = e.target.value;
                            onUpdate({
                              ...block,
                              properties: { ...block.properties, rows: newRows }
                            });
                          }}
                          disabled={!canEdit}
                          className="w-full outline-none disabled:bg-transparent"
                          placeholder={i === 0 ? 'Header' : 'Cell'}
                        />
                      </td>
                    ))}
                    {canEdit && (
                      <td className="border border-gray-300 p-1 bg-gray-50">
                        <button
                          onClick={() => deleteTableRow(i)}
                          className="p-1 hover:bg-gray-200 rounded text-red-600"
                          title="Delete row"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {canEdit && (
                  <tr>
                    {(block.properties?.rows?.[0] || ['', '', '']).map((_, j) => (
                      <td key={j} className="border border-gray-300 p-1 bg-gray-50">
                        <button
                          onClick={() => deleteTableColumn(j)}
                          className="w-full p-1 hover:bg-gray-200 rounded text-red-600"
                          title="Delete column"
                        >
                          <Trash2 className="w-3 h-3 mx-auto" />
                        </button>
                      </td>
                    ))}
                  </tr>
                )}
              </tbody>
            </table>
            {canEdit && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={addTableRow}
                  className="px-3 py-1 border border-gray-300 hover:border-black transition-colors text-sm rounded"
                >
                  + Add Row
                </button>
                <button
                  onClick={addTableColumn}
                  className="px-3 py-1 border border-gray-300 hover:border-black transition-colors text-sm rounded"
                >
                  + Add Column
                </button>
              </div>
            )}
          </div>
        );

      default:
        return (
          <textarea
            ref={inputRef}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type '/' for commands or start writing..."
            disabled={!canEdit}
            className="w-full outline-none resize-none overflow-hidden disabled:bg-transparent"
          />
        );
    }
  };

  return (
    <div className="group relative py-1">
      {canEdit && (
        <div className="absolute -left-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title="Click to open menu"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded cursor-move transition-colors" title="Drag to reorder">
            <GripVertical className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="relative">
        {renderBlock()}

        {showMenu && canEdit && (
          <div ref={menuRef} className="absolute top-full left-0 mt-2 bg-white border border-gray-200 shadow-xl rounded-lg z-10 w-80 max-h-96 overflow-hidden">
            <div className="p-3 border-b border-gray-200">
              <input
                type="text"
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                placeholder="Search for a block type..."
                className="w-full px-3 py-2 border border-gray-300 rounded outline-none focus:border-black transition-colors text-sm"
                autoFocus
              />
            </div>
            <div className="overflow-y-auto max-h-80">
              {filteredBlockTypes.length > 0 ? (
                filteredBlockTypes.map((category) => (
                  <div key={category.category} className="p-2">
                    <div className="text-xs font-semibold text-gray-500 mb-1 px-2">{category.category}</div>
                    {category.items.map((item) => (
                      <button
                        key={item.type}
                        onClick={() => changeBlockType(item.type)}
                        className="w-full flex items-start gap-3 px-2 py-2.5 hover:bg-gray-100 text-left rounded transition-colors"
                      >
                        <div className="mt-0.5">{item.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900">{item.label}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500 text-sm">
                  No blocks found for "{menuSearch}"
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {canEdit && (
        <div className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onDelete}
            className="p-1.5 hover:bg-gray-100 rounded text-gray-400 hover:text-red-600 transition-colors"
            title="Delete block"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
