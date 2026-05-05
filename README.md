# UrbanStore — Frontend

Frontend del e-commerce **UrbanStore**, construido con Next.js 14, TypeScript y Tailwind CSS.

---

## 🛠 Stack

| Tecnología | Uso |
|---|---|
| [Next.js 14](https://nextjs.org/) | Framework React con App Router |
| TypeScript | Tipado estático |
| Tailwind CSS | Estilos utilitarios |
| Framer Motion | Animaciones e interacciones |
| Lucide React | Íconos |

---

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── components/         # Componentes reutilizables (Navbar, Footer, CartContext)
│   ├── admin/              # Panel de administración (protegido con JWT)
│   ├── checkout/           # Página de checkout con validaciones por paso
│   ├── orden-confirmada/   # Página de confirmación de orden
│   ├── productos/          # Listado y detalle de productos
│   └── page.tsx            # Home
├── lib/
│   └── api.ts              # URL base de la API (API_URL)
└── public/
```

---

## ⚙️ Variables de entorno

Creá un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

> En producción reemplazá con la URL real de tu backend.

---

## 🚀 Instalación y ejecución

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/urbanstore-frontend.git
cd urbanstore-frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editá .env.local con tus valores

# 4. Correr en modo desarrollo
npm run dev
```

La app estará disponible en [http://localhost:3000](http://localhost:3000).

### Scripts disponibles

```bash
npm run dev       # Servidor de desarrollo
npm run build     # Build de producción
npm run start     # Servidor de producción (requiere build previo)
npm run lint      # Linter
```

---

## 🛒 Flujo de checkout

El checkout está dividido en 3 pasos con validaciones en cada uno:

**Paso 1 — Datos personales**
- Nombre completo (mínimo 3 caracteres)
- Email con formato válido

**Paso 2 — Dirección de envío**
- Dirección completa (mínimo 5 caracteres)
- Ciudad y provincia obligatorias
- Código postal opcional (4–8 dígitos numéricos)

**Paso 3 — Método de pago**
- Mercado Pago
- Tarjeta de crédito / débito
- Transferencia bancaria

Los errores se muestran al salir de cada campo (onBlur) y al intentar avanzar de paso.

---

## 🔐 Panel de administración

Accesible en `/admin`. Requiere autenticación con JWT.

- Login con email y contraseña
- El token se almacena en `localStorage` y se envía en cada request al backend como `Authorization: Bearer <token>`
- Las rutas del panel están protegidas — redirigen a `/admin/login` si no hay sesión activa

---

## 🔗 Conexión con el backend

Todas las llamadas a la API pasan por la constante `API_URL` definida en `lib/api.ts`:

```ts
export const API_URL = process.env.NEXT_PUBLIC_API_URL;
```

Endpoints utilizados:

| Método | Endpoint | Descripción | Auth |
|---|---|---|---|
| `GET` | `/api/Products` | Listado de productos | No |
| `GET` | `/api/Products/:id` | Detalle de producto | No |
| `POST` | `/api/Orders` | Crear orden | No |
| `GET` | `/api/Orders/:id` | Obtener orden por ID | No |
| `POST` | `/api/Auth/login` | Login de admin | No |
| `GET` | `/api/Orders` | Listar todas las órdenes | JWT |
| `PATCH` | `/api/Orders/:id/status` | Actualizar estado de orden | JWT |
| `POST` | `/api/Products` | Crear producto | JWT |
| `PUT` | `/api/Products/:id` | Actualizar producto | JWT |
| `DELETE` | `/api/Products/:id` | Eliminar producto | JWT |

---

## 📦 Build de producción

```bash
npm run build
npm run start
```

---

## 📝 Notas

- El carrito se maneja con Context API (`CartContext`) y persiste en `localStorage`.
- El total de la orden **siempre se recalcula en el backend** — el frontend solo lo muestra como referencia visual.
- El envío es gratis para compras iguales o mayores a $50.000.
