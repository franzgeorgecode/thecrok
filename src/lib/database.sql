-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'Untitled',
  icon TEXT,
  cover_image TEXT,
  is_public BOOLEAN DEFAULT false,
  is_favorite BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_edited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  parent_id UUID REFERENCES documents(id) ON DELETE CASCADE
);

-- Blocks table
CREATE TABLE IF NOT EXISTS blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  content TEXT DEFAULT '',
  properties JSONB DEFAULT '{}',
  block_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_created_by ON documents(created_by);
CREATE INDEX IF NOT EXISTS idx_documents_is_public ON documents(is_public);
CREATE INDEX IF NOT EXISTS idx_documents_is_favorite ON documents(is_favorite);
CREATE INDEX IF NOT EXISTS idx_documents_last_edited ON documents(last_edited_at DESC);
CREATE INDEX IF NOT EXISTS idx_blocks_document_id ON blocks(document_id);
CREATE INDEX IF NOT EXISTS idx_blocks_order ON blocks(document_id, block_order);
CREATE INDEX IF NOT EXISTS idx_tags_document_id ON tags(document_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- Policies for users (users can only read their own data)
CREATE POLICY "Users can read own data" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (true);

-- Policies for documents
CREATE POLICY "Public documents are viewable by everyone" ON documents
  FOR SELECT USING (is_public = true OR auth.uid()::text = created_by::text);

CREATE POLICY "Users can insert own documents" ON documents
  FOR INSERT WITH CHECK (auth.uid()::text = created_by::text);

CREATE POLICY "Users can update own documents or public documents" ON documents
  FOR UPDATE USING (created_by::text = auth.uid()::text OR is_public = true);

CREATE POLICY "Users can delete own documents" ON documents
  FOR DELETE USING (created_by::text = created_by::text);

-- Policies for blocks
CREATE POLICY "Blocks viewable if document is viewable" ON blocks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM documents 
      WHERE documents.id = blocks.document_id 
      AND (documents.is_public = true OR documents.created_by::text = auth.uid()::text)
    )
  );

CREATE POLICY "Users can insert blocks in their documents or public documents" ON blocks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM documents 
      WHERE documents.id = blocks.document_id 
      AND (documents.created_by::text = auth.uid()::text OR documents.is_public = true)
    )
  );

CREATE POLICY "Users can update blocks in their documents or public documents" ON blocks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM documents 
      WHERE documents.id = blocks.document_id 
      AND (documents.created_by::text = auth.uid()::text OR documents.is_public = true)
    )
  );

CREATE POLICY "Users can delete blocks in their documents or public documents" ON blocks
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM documents 
      WHERE documents.id = blocks.document_id 
      AND (documents.created_by::text = auth.uid()::text OR documents.is_public = true)
    )
  );

-- Policies for tags
CREATE POLICY "Tags viewable if document is viewable" ON tags
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM documents 
      WHERE documents.id = tags.document_id 
      AND (documents.is_public = true OR documents.created_by::text = auth.uid()::text)
    )
  );

CREATE POLICY "Users can manage tags in their documents or public documents" ON tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM documents 
      WHERE documents.id = tags.document_id 
      AND (documents.created_by::text = auth.uid()::text OR documents.is_public = true)
    )
  );
