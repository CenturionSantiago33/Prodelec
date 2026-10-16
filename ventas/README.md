# Kit para salir a vender sitios web — Ezpeleta y alrededores

Tres piezas para arrancar esta semana: una **demo reutilizable**, una **planilla de prospección**
y un **guion de venta con precios**.

```
ventas/
├─ PITCH.md              Guion de 60 segundos, objeciones, precios, seguimiento
├─ prospeccion.csv       Planilla para registrar locales (abre en Excel o Google Sheets)
└─ demo/
   ├─ plantilla.html     El diseño (no hace falta tocarlo)
   ├─ generar.js         Convierte un .json en una web lista para mostrar
   ├─ negocios/          Un archivo .json por comercio (acá editás)
   └─ salida/            Las webs generadas (.html) — abrí salida/index.html
```

> ⚠️ **El kit es tuyo y es genérico.** No tiene relación con el sitio de PRODELEC
> ni usa sus datos, clientes ni precios. Es una herramienta personal de trabajo.

---

## 1. Personalizar una demo (≈10 minutos)

**Paso 1.** Copiá un ejemplo y renombralo:

```powershell
Copy-Item ventas\demo\negocios\demo-rotiseria.json ventas\demo\negocios\mi-negocio.json
```

**Paso 2.** Abrí `mi-negocio.json` y cambiá los datos. Lo mínimo:

| Campo | Ejemplo |
|---|---|
| `nombre` | `Rotisería Doña Rosa` |
| `rubro` | `Rotisería y comidas caseras` |
| `ciudad` | `Ezpeleta` |
| `direccion` | `Av. San Martín 1234` |
| `telefono` / `whatsapp` | `011 4256-7890` / `1156789012` *(solo números)* |
| `color` / `colorOscuro` | `#c2410c` / `#7c2d12` |
| `tagline` | `Comida casera lista para llevar` |
| `descripcion` | Una o dos frases de qué hace el comercio |
| `servicios` | 3 tarjetas: `titulo`, `texto`, `icono` |
| `galeria` | Hasta 4-6 fotos (ver abajo) |
| `horarios` | Una línea por rango |

**Paso 3.** Generá la web:

```powershell
node ventas\demo\generar.js
```

Se crea `ventas/demo/salida/mi-negocio-ezpeleta.html`. **Abrila con doble clic.**

### Íconos disponibles para `servicios`

`reloj` · `camion` · `estrella` · `escudo` · `corazon` · `cafe` · `pesas` · `tijera`
· `llave` · `pata` · `carrito` · `pin` · `telefono` · `bolsa` · `check`

### Fotos

1. Guardá las fotos en `ventas/demo/salida/` (o cualquier carpeta junto al HTML).
2. En el `.json`, poné la ruta relativa:

```json
"galeria": [
  { "foto": "foto-1.jpg", "alt": "Plato del día" },
  { "foto": "foto-2.jpg", "alt": "Empanadas" }
]
```

Si dejás `"foto": ""`, se muestra un recuadro con un ícono de cámara como marcador.
**No inventes fotos ni reseñas**: si el comercio no te dio material, dejá el marcador
y pedíselo en la visita.

---

## 2. Mostrar la demo

- **En el celular sin internet:** pasá el `.html` con las fotos por WhatsApp o cable,
  y abrilo con el navegador. Funciona sin conexión (no usa fuentes ni scripts externos).
- **Online (recomendado):** subí la carpeta a **Netlify Drop** (`app.netlify.com/drop`)
  o a **Vercel**, y te queda un link para mandar por WhatsApp.

> El mapa de Google **sí** necesita internet. El resto de la página no.

---

## 3. Publicar el sitio del cliente

Cuando el comercio dice que sí:

1. Generá el `.html` definitivo con los datos y fotos reales.
2. Subilo a un hosting (Netlify, Vercel, o el hosting del dominio).
3. Registrá el dominio (`.com.ar` se registra en NIC.ar a nombre del cliente).
4. Verificá que el WhatsApp y el teléfono funcionen desde un celular real.
5. Cargá el local en **Google Business Profile** con la dirección y los horarios.
   *(Esto es lo que hace que aparezca en el mapa, muchas veces más importante que la web.)*

---

## 4. Planilla de prospección

`prospeccion.csv` se abre en Excel o en Google Sheets. Tiene 3 filas de **EJEMPLO**
(borralas antes de empezar). Columnas:

`nombre` · `rubro` · `barrio` · `direccion` · `telefono` · `whatsapp` · `tiene_web`
· `instagram` · `google_maps` · `estado` · `prioridad` · `proximo_paso` · `fecha_contacto` · `notas`

**Estados sugeridos:** `Sin contactar` → `Visitado` → `Interesado` → `Presupuestado`
→ `Cerrado` (o `Rechazado` / `Volver más adelante`).

**Rubros que suelen necesitar web y son fáciles de encarar en el barrio:**
rotiserías, dietéticas, peluquerías, barberías, gimnasios, veterinarias, ferreterías,
kioscos, panaderías, talleres, estudios contables, consultorios, cerrajerías, florerías,
escuelas de idiomas, lavaderos, pinturerías.

**Cómo llenarla sin perder tiempo:** abrí Google Maps, buscá *"[rubro] Ezpeleta"*
y anotá los que **no tienen sitio web** (solo Instagram, o solo un pin sin datos).
Con 30 cargados ya tenés para dos semanas de visitas.

---

## 5. Antes de la primera salida

- [ ] Leí `PITCH.md` completo
- [ ] Generé al menos **3 demos** de rubros distintos
- [ ] Las probé **en el celular** (y sin internet)
- [ ] Cargué 10-15 locales en `prospeccion.csv`
- [ ] Decidí **mis precios** y los escribí (no improvisar en la puerta)
- [ ] Me puse un objetivo: **5 visitas por día de salida**

---

## 6. Reglas de honestidad (importante)

- **No inventes** reseñas, testimonios, clientes ni premios en las demos.
- **No copies** fotos ni textos de otros comercios. Usá las fotos que te dé el cliente.
- **No prometas** posiciones en Google ni "primera página garantizada". Nadie puede garantizarlo.
- **No pidas** el dominio a nombre tuyo: el dominio es del cliente.
- Aclará **qué incluye** y **qué no** el abono mensual, por escrito.
