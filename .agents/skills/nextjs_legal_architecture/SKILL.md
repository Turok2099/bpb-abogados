---
name: nextjs_legal_architecture
description: Skill para estructurar y optimizar aplicaciones Next.js 15 (App Router) orientadas a servicios profesionales legales.
---

# Skill Description

Implementar una arquitectura de Next.js 15 (App Router) optimizada para sitios web de servicios profesionales legales y despachos de abogados. La arquitectura se enfoca en la velocidad de carga, la estructura modular de las rutas y un manejo de errores centrado en la conversión de clientes potenciales.

# Instructions

Al desarrollar o re-estructurar la aplicación Next.js para este proyecto, debes aplicar de forma incondicional las siguientes arquitecturas:

1.  **Priorizar Server Components**: Usa Server Components por defecto absoluto, especialmente para renderizar el contenido estático crucial de la firma jurídica (vistas de servicios, detalles de áreas de práctica, perfiles de los abogados).
2.  **Organización por Route Groups**: Estructura la aplicación utilizando Route Groups lógicos:
    - `app/(marketing)`: Para todas las vistas públicas, landing pages y descripciones de servicios legales.
    - `app/(auth)`: Para los flujos de inicio de sesión de clientes.
    - `app/(dashboard)`: Para el portal interno de los clientes, si hubiera un seguimiento de casos.
3.  **Parallel Routes para Interfaces Complejas**: Implementa *Parallel Routes* (usando la convención de carpetas `@nombre`) para modularizar y cargar paralelamente secciones críticas dentro de los dashboards de clientes, si estos aplican.
4.  **Manejo de Errores Orientado a la Conversión**: Construye componentes `error.js` (y `not-found.js`) personalizados que, además de capturar las fallas, desplieguen obligatoriamente un *Call To Action* (CTA) directo, como "Llamar ahora" o "Contactar vía WhatsApp" para evitar la fuga de posibles clientes.
5.  **Tipografía Formal y Elegante**: Gestiona las fuentes localmente a través de `next/font`. Aplica una combinación tipográfica seria: usa tipografías *serif* formales para los encabezados/títulos, y *sans-serif* claras para el cuerpo de texto `body`.

# Best Practices

- **Uso Estricto de "use client"**: Evita declarar Client Components a menos que sea indispensable para la interactividad del navegador (como formularios complejos de contacto o filtrado dinámico).
- **Control de Rendimiento SEO**: Prioriza de manera extrema la velocidad de lectura inicial de la pantalla. Optimiza las imágenes globales y el bloqueo de renderizado para asegurar que el LCP (*Largest Contentful Paint*) se mantenga estrictamente por debajo de los `2.5s`.
