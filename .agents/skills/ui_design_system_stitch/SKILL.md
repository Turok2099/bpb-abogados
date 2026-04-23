---
name: ui_design_system_stitch
description: Skill de diseño estricto para mantener una estética sobria, perfecta matemáticamente y preparada para la auditoría de un entorno Stitch.
---

# Skill Description

Implementar y auditar la fundación del "Design System" de la plataforma jurídica. El foco absoluto es transicionar desde un diseño digital estándar hacia un entorno de autoridad legal pura, sosteniéndolo matemáticamente para evitar fisuras al ser auditado automáticamente por Stitch. 

# Instructions

Toda interfaz creada, rediseñada o sugerida deberá suscribirse inamoviblemente a estas reglas de ejecución de estilo:

1.  **Imponer Cromática de Prestigio Legal**: Construye la base del color en la interfaz empleando exclusivamente los tonos oficiales definidos en `../design_tokens.md`. Usa obligatoriamente como cimiento la tonalidad oscura `#20222A`, e implementa brillos cromáticos secundarios usando solo variaciones sutiles del dorado `#C5A46C` y beige `#AD9A87` (para acentos de estatus o superficies secundarias). Ocasionalmente, puedes integrar el verde `#3E5A4E` o marrón rojizo `#553227` para elementos de soporte.
2.  **Modularidad Base 4/8px (Stitch Audit Rule)**: Evita insertar utilidades decimales impredecibles o arbitrarias en tus capas de diseño. Todo espaciado de bloque, márgenes (`margin`) intrínsecos o rellenos (`padding`) debe anclarse estrictamente a una escala de `4px` u `8px` respaldada por Tailwind (p. ej., `p-2`, `m-4`, `gap-8`). Stitch dictaminará como anomalía estética cualquier fallo aritmético externo al sistema.
3.  **Encapsulado Atómico Utilitario**: Absténte de engrosar archivos CSS pesados. Define los elementos maestros en la jerarquía (botones, inputs, campos de validación, y *Cards* informativas) utilizando de forma exclusiva el motor de utilidades atómicas de **Tailwind CSS**.
4.  **Enrutamiento "Pulgar Primero" (Mobile First)**: Acepta que tu tráfico primario será móvil buscando inmediatez o emergencia. Garantiza en cada momento que los bordes de golpe (*Touch Targets* de los inputs y botones) posean al menos el volumen y confort geométrico para un pulgar humano ansioso (altura y ancho operativo igual o mayor a `48px`).

# Best Practices

- **Dicotomía de la Agresividad Gráfica (Tech vs. Orgánico)**: En aras del prestigio en el diseño, la identidad de una firma jurídica exige severidad. No incluyas ni sugieras, bajo pena de vulneración del diseño, sombras flotantes de profundidad exagerada ni entramados de gradientes dinámicos complejos típicos de una 'Tech-Startup'. Usa únicamente bordes y perfiles enaltecedores limpios y sombreados arquitectónicos modestos.
- **Cuantificación de Relación de Aspecto (Aspect Ratio)**: Evita cualquier factor de pérdida de prestigio fotográfico. Sea una fotografía local de un magistrado del buffet, escaleras u hologramas referenciales (balanzas de la justicia), es altamente imperativo sellar todo retrato gráfico mediante valores constantes codificados directamente bloqueando el desbordamiento visual (`aspect-[w/h]`, `aspect-square`, etc.) para satisfacer la evaluación final de Stitch sin errores de *layout shift*.
