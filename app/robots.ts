import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/login/",
        "/registro/",
        "/dashboard/",
        "/gestor/",
      ],
    },
    sitemap: "https://bpbabogados.com.ar/sitemap.xml",
  };
}
