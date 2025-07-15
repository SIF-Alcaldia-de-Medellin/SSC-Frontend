# SSC-Frontend

Sistema de Seguimiento de Contratos (SSC)
========================================

Frontend oficial para la Secretaría de Infraestructura Fisica de la Alcaldía de Medellín. Permite la gestión, visualización y seguimiento de contratos, frentes de obra (CUOs), actividades y avances, con autenticación segura y experiencia moderna.

## 🚀 Tecnologías principales

- **Next.js 15** (App Router, standalone)
- **React 19** + **TypeScript**
- **Tailwind CSS 4** (custom theme)
- **Font Awesome** (iconos)
- **Context API** (autenticación y notificaciones)

## 🏗️ Estructura del proyecto

```
src/
├── app/                # Páginas y rutas principales (Next.js App Router)
│   ├── layout.tsx      # Layout global, providers
│   ├── page.tsx        # Home: búsqueda y listado de contratos
│   ├── login/          # Login de usuario
│   ├── update-password/# Cambio de contraseña inicial
│   ├── contratos/      # Detalle, adiciones, modificaciones, seguimiento general
│   ├── cuos/           # Frentes de obra (CUOs) y actividades
│   └── ...
├── components/         # Componentes reutilizables (Header, Card, Notification, etc.)
├── context/            # Contextos globales (Auth, Notifier)
├── hooks/              # Hooks personalizados (useAuth, useContratos, etc.)
├── services/           # Lógica de acceso a API y servicios
├── types/              # Tipos TypeScript para entidades principales
├── utils/              # Utilidades (formato de fechas, moneda, etc.)
├── assets/             # Imágenes y recursos estáticos
└── ...
```

## ⚙️ Instalación y uso

```bash
# Clona el repositorio
git clone <repository-url>
cd ssc-frontend

# Instala dependencias
npm install

# Ejecuta en modo desarrollo
npm run dev

# Compila para producción
npm run build
npm run start
```

## 🔐 Autenticación y seguridad
- Login con correo institucional y contraseña.
- Cambio obligatorio de contraseña en primer acceso.
- Rutas protegidas mediante contextos y guards (`ProtectedRoute`, `AuthGuard`).
- Roles de usuario definidos en el backend.

## 🖥️ Funcionalidades principales
- **Búsqueda y listado de contratos**: Filtra y accede a contratos por número o identificador.
- **Detalle de contrato**: Visualiza información, adiciones, modificaciones y seguimiento general.
- **Frentes de obra (CUOs)**: Acceso a frentes asociados a cada contrato.
- **Actividades**: Seguimiento físico y financiero por actividad.
- **Carga de avances**: Formularios para registrar avances generales y por actividad.
- **Notificaciones**: Mensajes de éxito y error en acciones clave.

## 🗂️ Tipos principales (TypeScript)
- `Contrato`: id, número, objeto, contratista, fechas, valores, supervisor.
- `Cuo`: id, número, comuna, barrio, descripción, cantidad de actividades.
- `Actividad`: id, descripción, meta física, unidades de avance, proyección financiera.
- `SeguimientoGeneral`: avance físico, financiero, observaciones, fechas.
- `SeguimientoActividad`: avance físico, costo, descripción, proyección.
- `Usuario`: cédula, email, rol, nombre, cambio de contraseña.

## 🎨 Estilos y branding
- **Tailwind CSS**: Tema personalizado con paleta institucional.
- **Font Awesome**: Iconografía para acciones y estados.
- **Header**: Branding de la Alcaldía y bienvenida personalizada.

## 🛠️ Scripts útiles

```bash
npm run dev      # Desarrollo
npm run build    # Compilación producción
npm run start    # Servidor producción
npm run lint     # Linter
```

## 📡 Integración API
- El frontend consume una API REST protegida por JWT (`NEXT_PUBLIC_API_URL`).
- Todas las operaciones de datos (contratos, CUOs, actividades, seguimientos) se realizan vía servicios en `src/services/`.

## 📝 Licencia

Este proyecto está licenciado bajo **Apache License 2.0** (no comercial, ver archivo LICENSE).

---

Desarrollado por la Secretaría de Infraestructura Fisica, Alcaldía de Medellín.
