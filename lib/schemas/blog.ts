import { z } from 'zod'

export const PostSchema = z.object({
  titulo: z.string().min(5, 'El título debe tener al menos 5 caracteres.'),
  slug: z
    .string()
    .min(3, 'El slug debe tener al menos 3 caracteres.')
    .regex(/^[a-z0-9-]+$/, 'El slug solo puede contener letras minúsculas, números y guiones (-)'),
  contenido: z.string().min(10, 'El contenido debe tener al menos 10 caracteres.'),
  extracto: z.string().max(250, 'El extracto no puede superar los 250 caracteres.').optional().nullable(),
  imagen_cabecera: z.string().url('La imagen de cabecera debe ser una URL válida.').or(z.string().length(0)).optional().nullable(),
  publicado: z.boolean().default(false),
  meta_title: z.string().max(70, 'El título SEO no debe superar los 70 caracteres.').optional().nullable(),
  meta_description: z.string().max(160, 'La descripción SEO no debe superar los 160 caracteres.').optional().nullable(),
})

export type PostInput = z.infer<typeof PostSchema>
