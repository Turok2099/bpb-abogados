import { MetadataRoute } from "next";
import { createServerClient } from "@supabase/ssr";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://bpbabogados.com.ar";

  // 1. Static pages of the website
  const staticRoutes = [
    "",
    "/contacto",
    "/infraestructura",
    "/test-de-viabilidad",
    "/blog",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // 2. Dynamic blog routes (using a cookie-free client to avoid build-time errors)
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return [];
          },
          setAll() {},
        },
      });

      const { data: posts } = await supabase
        .from("posts")
        .select("slug, fecha_publicacion, created_at")
        .eq("publicado", true)
        .order("fecha_publicacion", { ascending: false });

      if (posts && posts.length > 0) {
        const blogRoutes = posts.map((post) => ({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: post.fecha_publicacion 
            ? new Date(post.fecha_publicacion) 
            : post.created_at 
              ? new Date(post.created_at) 
              : new Date(),
          changeFrequency: "monthly" as const,
          priority: 0.6,
        }));

        return [...staticRoutes, ...blogRoutes];
      }
    }
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }

  return staticRoutes;
}
