import { supabase } from '../integrations/supabase/supabase';

const DocumentUploader = {
  upload: async (file, type) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${type}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) {
      return { error: uploadError };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    const { error: dbError } = await supabase
      .from('inspection_reports')
      .update({ [`${type}_url`]: publicUrl })
      .order('created_at', { ascending: false })
      .limit(1);

    if (dbError) {
      return { error: dbError };
    }

    return { data: publicUrl };
  }
};

export default DocumentUploader;
