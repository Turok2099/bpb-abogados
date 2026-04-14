---
name: supabase_legal_backend
description: Skill para gestionar de forma altamente segura el backend en Supabase enfocado a despachos de abogados (RLS estricto, Zod, Autenticación).
---

# Skill Description

Proveer e implementar una capa profunda de persistencia de datos (en PostgreSQL de Supabase) para la gestión segura de consultas, captación de leads y procesos de autenticación de clientes jurídicos. Previene la filtración de material legal altamente confidencial apoyándose en normativas defensivas robustas a nivel de servidor y base de datos.

# Instructions

Cada vez que el entorno demande integraciones de persistencia o reciba requerimientos vinculados con bases de datos o envío de formularios de contacto, debes:

1.  **Implantar Políticas de Nivel de Fila (RLS)**: En todas las tablas de PostgreSQL (especialmente entidades como `consultas`, `clientes`, etc.), habilita e implementa RLS de manera ultra-restrictiva por defecto para aislar la visibilidad de los datos por usuario.
2.  **Arquitectura Singleton**: Configura e instancia `supabase-js` empleando siempre el patrón de diseño Singleton para centralizar y eficientizar las llamadas al SDK desde el entorno de Next.js.
3.  **Prohibición de API Routes Antiguas**: Implementa toda la mutación directa en bases de datos (envío de formularios, guardado de leads y perfiles) encapsulando la lógica imperativamente a través de **Server Actions** nativos.
4.  **Disparadores de Leads (Triggers / Webhooks)**: Implementa notificaciones asíncronas automáticas (ya sea mediante disparadores / DB Triggers o Edge Functions integradas a Slack/Email) que avisen al bufete instantáneamente al insertarse un nuevo registro de prospección legal (lead).

# Best Practices

- **Seguridad Infranqueable de Llaves Reales (Key Safety)**: Es categoricamente **intolerable** bajo las políticas del proyecto exponer la `service_role_key` de Supabase en archivos expuestos al cliente. Verifica rigurosamente que las llaves públicas compartan el prefijo `NEXT_PUBLIC_` pero manteniendo aislada a toda costa la llave maestra.
- **Micro-validación con Zod**: Antes siquiera de intentar efectuar un flujo `INSERT` a las tablas, debes parsear, validar y sanitizar estrictamente toda la estructura del objeto ingresado usando la librería de validación estática **Zod**. Si falla el bloque de control en Zod, el script debe ejecutar escape prematuro denegando la transición de red para asegurar integridad relacional.
