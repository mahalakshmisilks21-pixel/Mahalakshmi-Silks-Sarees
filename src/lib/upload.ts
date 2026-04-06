/**
 * Upload an image file via the server-side API route.
 * This bypasses Supabase Storage RLS by using the service role key server-side.
 */
export async function uploadProductImage(file: File): Promise<{ publicUrl: string } | { error: string }> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.error || "Upload failed" };
    }

    return { publicUrl: data.publicUrl };
  } catch (err) {
    console.error("Upload error:", err);
    return { error: "Network error during upload" };
  }
}
