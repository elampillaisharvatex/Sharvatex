import { supabase } from '../lib/supabase';

export type Category = {
  id: string;
  name: string;
};

export type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  storage_path: string;
};

export type Product = {
  id: string;
  name: string;
  price: string;
  description: string | null;
  fabric: string | null;
  category_id: string;
  categories?: { name: string };
  image_url?: string;
  created_at?: string;
  is_active?: boolean;
  product_images?: ProductImage[];
  badge?: string;
  emoji?: string;
};

/** Get all categories */
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("id", { ascending: true });
    
  if (error) throw error;
  return data || [];
}

/** Add a category */
export async function addCategory(name: string): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .insert([{ name }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Delete a category */
export async function deleteCategory(id: string): Promise<boolean> {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);
    
  if (error) {
    console.error("Delete category failed:", error);
    return false;
  }
  return true;
}

export type SiteSettings = {
  id: string;
  whatsapp_number: string | null;
  created_at: string;
};

/** Get all active products (newest first) */
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories (name),
      product_images (*)
    `)
    .eq("is_active", true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return (data || []).map((p: any) => ({
    ...p,
    image_url: p.product_images?.[0]?.image_url || p.image_url || undefined
  }));
}

/** Add a product */
export async function addProductData(
  data: Omit<Product, 'id' | 'created_at' | 'image_url' | 'product_images' | 'categories'>
): Promise<Product> {
  const insertData = { ...data, is_active: true };
  const { data: product, error } = await supabase
    .from("products")
    .insert(insertData)
    .select()
    .single();

  if (error) throw error;
  return product;
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error("Failed to load site settings:", error);
    return null;
  }
  return data;
}

export async function updateSiteSettings(whatsapp_number: string): Promise<boolean> {
  // First get the existing setting ID
  const existing = await getSiteSettings();

  if (existing?.id) {
    // Update existing row
    const { error } = await supabase
      .from("site_settings")
      .update({ whatsapp_number })
      .eq("id", existing.id);
      
    if (error) {
      console.error(error);
      return false;
    }
  } else {
    // Create new row
    const { error } = await supabase
      .from("site_settings")
      .insert([{ whatsapp_number }]);
      
    if (error) {
      console.error(error);
      return false;
    }
  }
  return true;
}

/** Delete a product safely (soft delete) */
export async function deleteProduct(id: string): Promise<boolean> {
  const { error } = await supabase
    .from("products")
    .update({ is_active: false })
    .eq("id", id);
    
  if (error) {
    console.error("Delete failed:", error);
    return false;
  }
  return true;
}
