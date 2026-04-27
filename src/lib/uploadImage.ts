import { supabase } from "./supabase";

export async function uploadImage(file: File) {
  const filePath = `products/${Date.now()}-${file.name}`;

  // Upload to Supabase Storage
  const { error } = await supabase.storage
    .from("product-images")
    .upload(filePath, file);

  if (error) {
    console.error("Upload error:", error);
    return null;
  }

  // Get public URL
  const { data } = supabase.storage
    .from("product-images")
    .getPublicUrl(filePath);

  return {
    image_url: data.publicUrl,
    storage_path: filePath
  };
}
