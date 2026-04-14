---
name: create_agent_skill
description: Habilidad para crear, estructurar y aplicar nuevas habilidades en el sistema Antigravity de forma estandarizada.
---

# Skill Description

Esta habilidad permite generar nuevas capacidades (Skills) para el agente Antigravity, respetando de modo estricto las convenciones preestablecidas del repositorio o perfil del usuario. Actúa como una "meta-habilidad" base para mantener altamente estructurado el conocimiento del agente.

# Instructions

Cuando el usuario solicite explícita o implícitamente "crear una habilidad", "crear un skill", o "añadir un rol" en el sistema, sigue de forma incondicional estos pasos:

1.  **Definir el propósito:** Evalúa exactamente qué buscará resolver la nueva habilidad. Determina un nombre en minúsculas separado por guiones bajos (e.g., `react_refactoring`, `code_review`).
2.  **Crear el árbol de jerarquía:**
    - Establece un nuevo directorio base estricto: `.agents/skills/<nombre_del_skill>/`.
    - Si la habilidad será de alta complejidad metodológica, considera añadir sub-directorios adicionales como `/scripts`, `/examples`, o `/resources`.
3.  **Generar el manifiesto principal (`SKILL.md`):**
    - Dentro del directorio principal, crea estrictamente el archivo `SKILL.md`. Este es el punto de acceso exclusivo del controlador de Antigravity.
4.  **Emplear el "YAML Frontmatter" obligatorio:**
    Todo nuevo skill debe inicializarse forzosamente con estos metadatos inyectados al principio del archivo:
    ```yaml
    ---
    name: <nombre_del_skill>
    description: <Una descripción corta, pero semántica y potente. Se usa en el progressive disclosure para activar la habilidad.>
    ---
    ```
5.  **Estructurar las instrucciones metodológicas en formato Markdown:**
    Divide el cuerpo del archivo en al menos las siguientes secciones esenciales:
    - `# Skill Description`: Contexto avanzado y propósito de la habilidad.
    - `# Instructions`: Instrucciones granulares, imperativas, preferiblemente listadas por pasos.
    - `# Best Practices`: Errores que el agente no debe cometer al usar este rol.

# Best Practices

- Mantén siempre una voz directa y firme; son órdenes y restricciones para un agente IA autónomo.
- Sé particularmente meticuloso con el bloque `description` dentro del frontmatter. Si un skill no se entiende intuitivamente por esa descripción, es menos probable que el orquestador automático lo cargue eficazmente.
- Asegúrate de comprobar siempre el contenido actual del directorio `.agents/skills/` antes de introducir redundancias. Si una tarea es un subconjunto, refactoriza el archivo `SKILL.md` antiguo con la herramienta edit en vez de crear uno nuevo aislado.
