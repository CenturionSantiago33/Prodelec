# Propuesta Técnica — Backend, Base de Datos, Autenticación y Recepción Real de Solicitudes

> **Estado: PROPUESTA. No implementada.** Este documento describe alternativas, requisitos y
> consideraciones para llevar el sitio de un catálogo estático a una plataforma con recepción real
> de solicitudes de cotización y un panel de administración seguro.
>
> No se conectó ningún servicio externo, no se contrató nada, no se usaron credenciales reales y no
> se publicó información. Cualquier avance requiere **autorización explícita**.

---

## 1. Situación actual (verificada)

- **No hay backend:** 0 rutas API, 0 Server Actions, 0 base de datos, 0 autenticación, 0 middleware.
- El catálogo es estático (`src/data/products.ts`).
- Cotización: enlace a **WhatsApp** + **impresión** de proforma en el navegador. Nada se persiste.
- Contacto: abre el **cliente de correo** (`mailto:`). Nada se persiste.
- `/admin`: **demo** con datos en memoria, **sin autenticación**. No debe exponerse públicamente.

### Riesgo documentado
Publicar `/admin` tal cual permite a cualquiera navegar el panel (aunque las operaciones no persisten).
`robots.txt` lo excluye de buscadores, pero **eso no es control de acceso**.

---

## 2. Objetivos funcionales a cubrir

1. **Recepción real de solicitudes de cotización** (persistencia + notificación al área comercial).
2. **Formulario de contacto** con almacenamiento y anti-abuso.
3. **Panel de administración seguro**: gestión de cotizaciones y productos con roles.
4. **Validación en servidor** de todos los datos.
5. **Auditoría** de acciones administrativas.
6. **Backups y recuperación**.

---

## 3. Alternativas de arquitectura

### Opción A — Serverless gestionado (recomendada para empezar)
- **Framework:** el propio Next.js con **Route Handlers** (`app/api/*`) o **Server Actions**.
- **Base de datos:** Postgres gestionado (p. ej. Neon, Supabase, Vercel Postgres) o SQLite/Turso.
- **ORM:** Prisma o Drizzle.
- **Auth:** proveedor gestionado (Auth.js/NextAuth con credenciales propias o proveedor OAuth) o
  Supabase Auth / Clerk.
- **Correo/notificación:** Resend / SendGrid / SMTP del hosting corporativo.
- **Ventajas:** mínima infraestructura, despliegue simple, sin servidores que mantener.
- **Costos típicos (a confirmar):** capa gratuita alcanza para bajo volumen; luego ~USD 0–25/mes
  en BD + ~USD 0–20/mes en email según volumen.

### Opción B — Backend propio / VPS
- API separada (Node/NestJS/Express) + Postgres + auth propia, desplegada en VPS.
- **Ventajas:** control total, integración con ERP propio.
- **Costos:** más operación (parcheo, monitoreo, backups), ~USD 20–80/mes + tiempo de mantenimiento.

### Opción C — Sin backend nuevo (mínimo esfuerzo)
- Formularios que envían a un servicio de formularios (Formspree/Web3Forms) y/o email vía SMTP.
- **Ventajas:** rápido, barato, sin BD.
- **Límites:** sin gestión de cotizaciones, sin panel, sin trazabilidad. Sirve como paso intermedio.
- **No reemplaza** la necesidad de un canal de cotizaciones gestionado a mediano plazo.

### Integración con ERP (si existe)
- Si PRODELEC ya tiene un ERP (Tango, Bejerman, SAP B1, etc.), evaluar **API/exportación** para volcar
  cotizaciones y tomar precios/stock. **Requiere datos del ERP** (proveedor, versión, accesos, si expone API).

> **Decisión pendiente del negocio:** cuál es el **canal definitivo** de cotizaciones
> (CRM, ERP, email estructurado, WhatsApp Business API) y quién las recibe.

---

## 4. Modelo de datos propuesto (mínimo)

```
Category        (id, slug, name, order, ...)
Product         (id, slug, code, name, categoryId, description, specs JSON, images JSON,
                 diameter, sizeInfo, homologado, technicalSheet, isActive, timestamps)
ProductModel    (id, productId, code, name, dimensions, material, ...)
QuoteRequest    (id, publicRef, createdAt, status, channel, customerId?, notes,
                 totalItems, ipHash, userAgent)
QuoteItem       (id, quoteId, productId, productCode/nameSnapshot, quantity, note)
Attachment      (id, quoteId, filename, storedPath, mimeType, size)   // opcional
Customer        (id, name, company, email, phone, cuit?, address, createdAt)  // opcional
User            (id, email, name, role, passwordHash/Algo, isActive, lastLoginAt)
AuditLog        (id, userId, action, entity, entityId, before JSON, after JSON, createdAt, ip)
```

**Notas:**
- Guardar **snapshot** del nombre/código del producto en `QuoteItem` (por si el producto cambia).
- `publicRef` legible para el cliente (ej. `COT-2026-0001`), distinto del id interno.
- Subida de adjuntos (planos) debe validar tipo/tamaño y almacenarse fuera del webroot o en object storage.

---

## 5. Autenticación y autorización

- **No implementar auth "de fachada"** (ocultar botones o chequear variables en el navegador).
- Sesiones con cookies `HttpOnly`, `Secure`, `SameSite`. Contraseñas con hash fuerte (argon2/bcrypt).
- **Roles** mínimos: `admin`, `comercial` (ver/gestionar cotizaciones), `editor` (contenido/productos),
  `solo-lectura`.
- **Protección de rutas** en el servidor (middleware + verificación en cada Route Handler/Server Action).
- Rate limiting y captcha (Turnstile/hCaptcha) en endpoints públicos.

---

## 6. Validación, anti-abuso y secretos

- Validar **siempre en el servidor** con esquema (zod) — nunca confiar en el cliente.
- Rate limiting por IP + honeypot/captcha en formularios.
- Limitar tamaño/frecuencia de envíos; deduplicar por IP+hash.
- Secretos solo en variables de entorno del servidor (nunca en el bundle cliente).
- CORS restringido, headers de seguridad (CSP, HSTS, X-Frame-Options).

---

## 7. Backups y recuperación

- Backups automáticos de la BD (diarios + retención definida) y **prueba de restauración** periódica.
- Assets (imágenes/PDF) respaldados aparte (object storage con versionado).
- Definir **RPO/RTO** objetivo con el negocio.

---

## 8. Auditoría y gestión de usuarios

- Registrar creación/modificación/borrado de cotizaciones y productos en `AuditLog`.
- Alta/baja de usuarios por un `admin`; principio de menor privilegio.
- Revisión periódica de accesos y logs.

---

## 9. Roadmap sugerido por etapas

1. **Etapa 1 (bajo riesgo):** canal de cotizaciones mínimo (email estructurado + persistencia simple),
   validación server-side y anti-spam. Sin panel.
2. **Etapa 2:** panel de administración autenticado para ver/gestionar cotizaciones (roles básicos, auditoría).
3. **Etapa 3:** gestión de productos en BD (migrar `products.ts` a BD) + imágenes + PDFs.
4. **Etapa 4:** integración con ERP/CRM y notificaciones automatizadas.

> Antes de cada etapa: definir infraestructura, proveedores, costos y responsables.
> **Nada de esto se implementa sin autorización explícita del negocio.**

---

## 10. Decisiones que necesita el negocio

- Canal definitivo de cotizaciones y responsable de responderlas.
- ¿Existe ERP? ¿Cuál, versión y expone API?
- ¿Se guardarán datos de clientes (personales)? Implica política de privacidad y protección de datos.
- Presupuesto de infraestructura mensual y hosting actual.
- Política de acceso al panel (quiénes, desde dónde, con qué roles).
