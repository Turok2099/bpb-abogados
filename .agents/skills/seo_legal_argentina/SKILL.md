---
name: seo_legal_argentina
description: Skill para maximizar el posicionamiento técnico (SEO) orgánico en Google.com.ar para términos jurídicos locales usando Next.js.
---

# Skill Description

Implementar estrategias proactivas para maximizar el posicionamiento en Google.com.ar focalizándose en el sector jurídico argentino. Esta habilidad garantiza que al desarrollar rutas y páginas en el proyecto, se incluyan automáticamente bases técnicas necesarias de optimización SEO y Schema semántico.

# Instructions

Activa estas reglas sistemáticamente siempre que trabajes con el enrutamiento o el contenido estático de las páginas de servicios:

1.  **Metadatos Dinámicos**: Implementa siempre la generación y exportación de metadatos mediante la API estándar de Next.js (`export const metadata`). Define descripciones de alta retención.
2.  **Inyección de Schema.org**: Añade de manera obligatoria la estructura `Schema.org` de tipo `LegalService` (mediante JSON-LD dentro del componente) en cada una de las landing pages que ofrezcan un servicio jurídico detallado.
3.  **Keyword Strategy Localizada**: Usa un léxico estrictamente localizado al mercado y argot legal de Argentina. Emplea términos intencionales como "sucesiones", "despidos", "accidentes de tránsito", y "divorcios en CABA/GBA". 
4.  **Optimización de Slugs**: Genera y recomienda `slugs` (rutas) claramente indexables y legibles. Ejemplos obligatorios: `/abogados-sucesiones-buenos-aires` en vez de cadenas genéricas o identificadores no semánticos.
5.  **Garantía de Indexabilidad**: Asegúrate proactivamente de que se hayan generado o implementado las rutas nativas para exponer el `robots.txt` y `sitemap.xml` correctamente desde el App Router.

# Best Practices

- **Antipenalizaciones SEO**: Evita terminantemente el *'keyword stuffing'* (sobre-optimización agresiva). El lenguaje que utilices o recomiendes en los componentes debe sonar extremadamente profesional, coherente y diseñado para consumo humano real antes que para los bots.
- Mimetiza el nivel retórico, formal y resolutivo de un profesional de la abogacía matriculado en Argentina (por ejemplo, en el CPACF).
