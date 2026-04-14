---
name: stitch_mcp_orchestrator
description: Skill para utilizar las herramientas del servidor MCP Stitch y realizar auditorías automatizadas sobre la calidad del diseño, resoluciones móviles (360px) y arquitectura visual de la UI.
---

# Skill Description

Actúa como el orquestador principal y puente incondicional hacia el servidor del "Model Context Protocol" (MCP) de Stitch en el ecosistema. Su meta radica en vigilar sin descanso que ninguna parte de la interfaz viole el núcleo de diseño, la accesibilidad ni la integridad arquitectónica antes de darse por completada.

# Instructions

Cada vez que diseñes, operes, alteres o modifiques atributos gráficos de un archivo en el Front-End (rutas, pages, layouts, componentes), deberás ejecutar inexcusablemente las siguientes reglas:

1.  **Ciclo de Auditoría Activa por Defecto**: Tan pronto finalices de esbozar la lógica visual del componente Front-End, invoca proactivamente las herramientas de diagnóstico del MCP de Stitch para instruir un *'Design Audit'* completo sobre las propiedades afectadas o la instancia de la pantalla y el componente alterado.
2.  **Reparación Automática y Auto-corrección**: Bajo ninguna circunstancia deberás tolerar reportes erróneos. Si los diagnósticos devueltos por Stitch exponen fracturas formales en los márgenes (*spacing* base 4px/8px descritos en el skill formal de UI), deberás inmediatamente reformular los parámetros en tu código hasta extinguir la inconsistencia antes de notificar al usuario.
3.  **Certificación de Quiebre Sensible (360px Responsive Test)**: Prioriza agresiva y sistemáticamente durante los test que, el componente interactivo o la página entera, absorba de manera fluida y retenga la semántica visual en una dimensión terminal de compresión calculada exactamente en los márgenes de **360px**. (Contexto predominante para el hardware celular estándar empleado en Argentina).
4.  **Emisión de Verificaciones y Marcadores Físicos de Salida**: En el dictamen textual hacia tu usuario y en tus entregables finales debes de adjuntar obligatoriamente el resultado definitivo de la revisión expuesto así:
    `Stitch Validation: PASSED ✅`
    `Stitch Validation: FAILED ❌` (Acompañado en este último caso de las falencias en detalle que requieran intervención superior humana).

# Best Practices

- **Zero-Tolerance para Avisos ARIA (Accesibilidad Crítica)**: En cada test generado en interfaz, debes rastrear con ferocidad los *warnings* proporcionados por Stitch. **NO ESTÁ PERMITIDO** hacer caso omiso a ningún señalamiento técnico referido a ausencias estructurales de *tags* de voz, tales como la absoluta falta de propiedades de `aria-label` en hipervínculos invisibles, links de WhatsApp, iconos vectoriales o Botones Principales de Contacto legal. Instáncialos proactivamente.
