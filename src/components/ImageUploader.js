import { supabase } from '../integrations/supabase/supabase';

const ImageUploader = {
  upload: async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `drone-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file);

    if (uploadError) {
      return { error: uploadError };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    const { error: dbError } = await supabase
      .from('drone_images')
      .insert({ url: publicUrl });

    if (dbError) {
      return { error: dbError };
    }

    return { data: publicUrl };
  }
};

export default ImageUploader;