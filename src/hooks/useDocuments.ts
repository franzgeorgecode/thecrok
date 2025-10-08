import { useState, useEffect } from 'react';
import { Document, DBDocument, DBBlock } from '../types';
import { supabase } from '../lib/supabase';

export const useDocuments = (userId: string | undefined) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, [userId]);

  const loadDocuments = async () => {
    try {
      console.log('Loading documents...');
      
      const { data: dbDocuments, error: docsError } = await supabase
        .from('documents')
        .select('*')
        .order('last_edited_at', { ascending: false });

      if (docsError) {
        console.error('Error loading documents:', docsError);
        throw docsError;
      }

      console.log('Documents loaded:', dbDocuments?.length || 0);

      const documentsWithBlocks = await Promise.all(
        (dbDocuments || []).map(async (doc: DBDocument) => {
          const { data: blocks } = await supabase
            .from('blocks')
            .select('*')
            .eq('document_id', doc.id)
            .order('block_order', { ascending: true });

          const { data: tags } = await supabase
            .from('tags')
            .select('tag')
            .eq('document_id', doc.id);

          return {
            id: doc.id,
            title: doc.title,
            icon: doc.icon,
            coverImage: doc.cover_image,
            blocks: (blocks || []).map((block: DBBlock) => ({
              id: block.id,
              type: block.type as any,
              content: block.content,
              properties: block.properties,
              order: block.block_order
            })),
            isPublic: doc.is_public,
            isFavorite: doc.is_favorite,
            createdBy: doc.created_by,
            createdAt: doc.created_at,
            lastEditedAt: doc.last_edited_at,
            parentId: doc.parent_id,
            tags: (tags || []).map((t) => t.tag)
          };
        })
      );

      setDocuments(documentsWithBlocks);
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDocument = async (doc: Omit<Document, 'id' | 'createdAt' | 'lastEditedAt'>) => {
    try {
      console.log('Creating document:', doc.title);
      
      const { data: newDoc, error: docError } = await supabase
        .from('documents')
        .insert([{
          title: doc.title,
          icon: doc.icon,
          cover_image: doc.coverImage,
          is_public: doc.isPublic,
          is_favorite: doc.isFavorite || false,
          created_by: doc.createdBy,
          parent_id: doc.parentId
        }])
        .select()
        .single();

      if (docError) {
        console.error('Error creating document:', docError);
        throw docError;
      }

      console.log('Document created successfully:', newDoc.id);

      if (doc.blocks && doc.blocks.length > 0) {
        console.log('Inserting blocks:', doc.blocks.length);
        
        const { error: blocksError } = await supabase
          .from('blocks')
          .insert(
            doc.blocks.map((block, index) => ({
              document_id: newDoc.id,
              type: block.type,
              content: block.content,
              properties: block.properties || {},
              block_order: index
            }))
          );

        if (blocksError) {
          console.error('Error creating blocks:', blocksError);
          throw blocksError;
        }
        
        console.log('Blocks created successfully');
      }

      if (doc.tags && doc.tags.length > 0) {
        console.log('Inserting tags:', doc.tags.length);
        
        const { error: tagsError } = await supabase
          .from('tags')
          .insert(
            doc.tags.map(tag => ({
              document_id: newDoc.id,
              tag
            }))
          );

        if (tagsError) {
          console.error('Error creating tags:', tagsError);
          throw tagsError;
        }
        
        console.log('Tags created successfully');
      }

      await loadDocuments();
      return documents.find(d => d.id === newDoc.id);
    } catch (error) {
      console.error('Error creating document:', error);
      alert('Error al guardar el documento. Verifica la consola para más detalles.');
      throw error;
    }
  };

  const updateDocument = async (id: string, updates: Partial<Document>) => {
    try {
      console.log('Updating document:', id);
      
      const dbUpdates: any = {
        last_edited_at: new Date().toISOString()
      };

      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.icon !== undefined) dbUpdates.icon = updates.icon;
      if (updates.coverImage !== undefined) dbUpdates.cover_image = updates.coverImage;
      if (updates.isPublic !== undefined) dbUpdates.is_public = updates.isPublic;
      if (updates.isFavorite !== undefined) dbUpdates.is_favorite = updates.isFavorite;

      const { error: docError } = await supabase
        .from('documents')
        .update(dbUpdates)
        .eq('id', id);

      if (docError) {
        console.error('Error updating document:', docError);
        throw docError;
      }

      console.log('Document updated successfully');

      if (updates.blocks) {
        console.log('Updating blocks...');
        
        await supabase.from('blocks').delete().eq('document_id', id);

        if (updates.blocks.length > 0) {
          const { error: blocksError } = await supabase
            .from('blocks')
            .insert(
              updates.blocks.map((block, index) => ({
                document_id: id,
                type: block.type,
                content: block.content,
                properties: block.properties || {},
                block_order: index
              }))
            );

          if (blocksError) {
            console.error('Error updating blocks:', blocksError);
            throw blocksError;
          }
          
          console.log('Blocks updated successfully');
        }
      }

      if (updates.tags !== undefined) {
        console.log('Updating tags...');
        
        await supabase.from('tags').delete().eq('document_id', id);

        if (updates.tags.length > 0) {
          const { error: tagsError } = await supabase
            .from('tags')
            .insert(
              updates.tags.map(tag => ({
                document_id: id,
                tag
              }))
            );

          if (tagsError) {
            console.error('Error updating tags:', tagsError);
            throw tagsError;
          }
          
          console.log('Tags updated successfully');
        }
      }

      await loadDocuments();
    } catch (error) {
      console.error('Error updating document:', error);
      alert('Error al actualizar el documento. Verifica la consola para más detalles.');
      throw error;
    }
  };

  const deleteDocument = async (id: string) => {
    try {
      console.log('Deleting document:', id);
      
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting document:', error);
        throw error;
      }

      console.log('Document deleted successfully');
      await loadDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  };

  const getPublicDocuments = () => {
    return documents.filter(doc => doc.isPublic);
  };

  const getUserDocuments = () => {
    if (!userId) return [];
    return documents.filter(doc => doc.createdBy === userId);
  };

  const canEdit = (doc: Document) => {
    if (!userId) return false;
    return doc.isPublic || doc.createdBy === userId;
  };

  return {
    documents,
    loading,
    createDocument,
    updateDocument,
    deleteDocument,
    getPublicDocuments,
    getUserDocuments,
    canEdit,
  };
};
