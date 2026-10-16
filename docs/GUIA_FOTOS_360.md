# Guía para sacar las fotos 360° de producto

Objetivo: que el visor de cada ficha de producto pueda girarse de verdad, con
**fotos reales**. No se generan cuadros con IA: si el 360 se arma inventando
imágenes, se nota y queda mal.

Mientras no haya fotos 360, el visor funciona igual con las fotos del catálogo
(y permite girar entre ellas cuando hay 3 o más). Así que esto no bloquea nada:
es una mejora que se activa sola cuando las fotos existen.

---

## 1. Equipo

- **Base giratoria** (turntable). Si no hay, sirve una base con marcas cada 15°
  y se gira el producto a mano.
- **Trípode** para la cámara o el celular. La cámara **no se mueve** en toda la
  serie.
- **Fondo** blanco o gris claro, liso, sin arrugas.
- **Luz fija**: dos fuentes o un softbox. Importante: la luz **no** debe
  rotar con el producto, porque si no el brillo gira y el giro se ve sucio.

## 2. Protocolo de captura

| Punto | Valor |
|---|---|
| Cuadros mínimos | **24** (uno cada 15°) |
| Ideal | **36** (uno cada 10°) |
| Encuadre | El producto siempre centrado, mismo zoom |
| Distancia | Fija |
| Exposición / balance de blancos | **Bloqueados** (modo manual) |
| Orientación | Vertical u horizontal, pero **igual** en toda la serie |
| Formato | JPG o PNG (el script los convierte a JPG) |

Pasos:

1. Limpiar el producto (pelusa y marcas se ven muchísimo en 360).
2. Posicionar y **no tocarlo más** entre cuadros: se gira la base, no el producto.
3. Disparar 1 foto, girar la base 15° (o 10°), disparar otra, y así hasta cerrar
   la vuelta.
4. Evitar que aparezcan manos, patas del trípode o el borde de la mesa.
5. Revisar que la última foto empalme bien con la primera.

**Errores que arruinan el giro:** mover la cámara, cambiar la luz, cambiar la
altura del producto, que el producto quede descentrado, o girar el producto a
mano sobre la mesa (se va moviendo).

## 3. Preparar los archivos

Poner las fotos crudas en una carpeta, sin importar el nombre:

```
Muestra/360/C1400CS/   (las 24–36 fotos tal como salen de la cámara)
```

Y correr, desde la raíz del proyecto:

```powershell
node scripts/preparar-360.js caja-conexion-compacta-c1400cs "C:\ruta\a\Muestra\360\C1400CS"
```

- `<slug>` es el de la URL del producto: `/productos/<slug>`.
- El script **ordena por nombre** (1, 2, 10 y no 1, 10, 2), respeta la
  orientación EXIF, redimensiona a 1200 px de lado, comprime y guarda como
  `public/productos/360/<slug>/01.jpg … NN.jpg`.
- Después **regenera** `src/data/panoramas.ts`, que es el archivo que lee el
  visor. Con eso, esa ficha pasa a modo 360 real **sin tocar código**.

Opciones:

```powershell
node scripts/preparar-360.js <slug> "<carpeta>" --max=1600 --quality=88
```

Si `sharp` no está instalado: `npm i -D sharp`.

## 4. Qué pasa en el visor

El componente `ProductPhotoViewer` elige solo, según el material real:

| Modo | Cuándo | Qué se ve |
|---|---|---|
| `turntable` | hay 12 cuadros o más en `panoramas.ts` | 360 real: se arrastra para girar y hay play/pausa |
| `spin` | el producto tiene 3 fotos o más | se arrastra entre las vistas reales disponibles |
| `gallery` | 1 o 2 fotos | foto grande + miniaturas + zoom |

En todos los modos: clic sobre la foto para ampliar (el zoom se ancla al punto
donde se hizo clic), botón de pantalla completa, flechas del teclado y `Esc`.

## 5. Pendientes

- Confirmar con producción **qué productos son prioritarios** para el 360
  (sugerencia: las cajas de conexión, que son las más vendidas).
- Las fotos las tiene que sacar el cliente: PRODELEC no puede generar fotos
  reales de sus productos.
