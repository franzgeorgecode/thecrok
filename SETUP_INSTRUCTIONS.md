# Instrucciones de Configuración de Supabase

## IMPORTANTE: Debes ejecutar estos pasos en tu dashboard de Supabase

### 1. Ve a tu proyecto de Supabase
URL: https://cxszktqbexynqqchxizm.supabase.co

### 2. Abre el SQL Editor
- En el menú lateral, haz clic en "SQL Editor"
- Haz clic en "New Query"

### 3. Copia y pega el siguiente SQL completo:

```sql
-- Eliminar tablas existentes si hay problemas
DROP TABLE IF EXISTS tags CASCADE;
DROP TABLE IF EXISTS blocks CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL DEFAULT 'Untitled',
  icon TEXT,
  cover_image TEXT,
  is_public BOOLEAN DEFAULT false,
  is_favorite BOOLEAN DEFAULT false,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_edited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  parent_id UUID REFERENCES documents(id) ON DELETE CASCADE
);

-- Blocks table
CREATE TABLE blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  content TEXT DEFAULT '',
  properties JSONB DEFAULT '{}',
  block_order INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tags table
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_documents_created_by ON documents(created_by);
CREATE INDEX idx_documents_is_public ON documents(is_public);
CREATE INDEX idx_documents_is_favorite ON documents(is_favorite);
CREATE INDEX idx_documents_last_edited ON documents(last_edited_at DESC);
CREATE INDEX idx_blocks_document_id ON blocks(document_id);
CREATE INDEX idx_blocks_order ON blocks(document_id, block_order);
CREATE INDEX idx_tags_document_id ON tags(document_id);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Public documents are viewable by everyone" ON documents;
DROP POLICY IF EXISTS "Users can insert own documents" ON documents;
DROP POLICY IF EXISTS "Users can update own documents or public documents" ON documents;
DROP POLICY IF EXISTS "Users can delete own documents" ON documents;
DROP POLICY IF EXISTS "Blocks viewable if document is viewable" ON blocks;
DROP POLICY IF EXISTS "Users can insert blocks in their documents or public documents" ON blocks;
DROP POLICY IF EXISTS "Users can update blocks in their documents or public documents" ON blocks;
DROP POLICY IF EXISTS "Users can delete blocks in their documents or public documents" ON blocks;
DROP POLICY IF EXISTS "Tags viewable if document is viewable" ON tags;
DROP POLICY IF EXISTS "Users can manage tags in their documents or public documents" ON tags;

-- Policies for users
CREATE POLICY "Users can read all data" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (true);

-- Policies for documents (MUY PERMISIVAS PARA TESTING)
CREATE POLICY "Anyone can view documents" ON documents
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert documents" ON documents
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update documents" ON documents
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete documents" ON documents
  FOR DELETE USING (true);

-- Policies for blocks (MUY PERMISIVAS PARA TESTING)
CREATE POLICY "Anyone can view blocks" ON blocks
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert blocks" ON blocks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update blocks" ON blocks
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete blocks" ON blocks
  FOR DELETE USING (true);

-- Policies for tags (MUY PERMISIVAS PARA TESTING)
CREATE POLICY "Anyone can view tags" ON tags
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert tags" ON tags
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update tags" ON tags
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete tags" ON tags
  FOR DELETE USING (true);
```

### 4. Haz clic en "RUN" para ejecutar el SQL

### 5. Verifica que las tablas se crearon
- Ve a "Table Editor" en el menú lateral
- Deberías ver las tablas: users, documents, blocks, tags

### 6. Verifica las variables de entorno en Netlify
- Ve a tu sitio en Netlify
- Site settings > Environment variables
- Verifica que existan:
  - VITE_SUPABASE_URL: https://cxszktqbexynqqchxizm.supabase.co
  - VITE_SUPABASE_ANON_KEY: (tu clave anon key)

### 7. Redeploy en Netlify
- Después de ejecutar el SQL, haz un nuevo deploy en Netlify
