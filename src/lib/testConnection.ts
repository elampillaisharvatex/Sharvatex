import { supabase } from "./supabase";

export async function testConnection() {
  console.log("Testing Supabase connection...");
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .limit(1);

  if (error) {
    console.error("SUPABASE CONNECTION ERROR:", error);
  } else {
    console.log("SUPABASE CONNECTION SUCCESS:", data);
  }
}
