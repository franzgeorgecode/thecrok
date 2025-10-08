export interface User {
  id: string;
  username: string;
  password: string;
}

export interface Block {
  id: string;
  type: 'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'bulletList' | 'numberedList' | 'todo' | 'quote' | 'code' | 'divider' | 'image' | 'table';
  content: string;
  properties?: {
    checked?: boolean;
    language?: string;
    url?: string;
    level?: number;
    rows?: string[][];
  };
  order: number;
}

export interface Document {
  id: string;
  title: string;
  icon?: string;
  coverImage?: string;
  blocks: Block[];
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
  lastEditedAt: string;
  parentId?: string;
  isFavorite?: boolean;
  tags?: string[];
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export interface DBDocument {
  id: string;
  title: string;
  icon?: string;
  cover_image?: string;
  is_public: boolean;
  is_favorite: boolean;
  created_by: string;
  created_at: string;
  last_edited_at: string;
  parent_id?: string;
}

export interface DBBlock {
  id: string;
  document_id: string;
  type: string;
  content: string;
  properties: any;
  block_order: number;
}

export interface DBTag {
  id: string;
  document_id: string;
  tag: string;
}
