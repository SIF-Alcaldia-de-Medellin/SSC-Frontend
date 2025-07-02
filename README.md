# SSC Frontend

Proyecto frontend para la Secretaría de Seguridad Ciudadana (SSC) construido con Next.js, Tailwind CSS y Font Awesome.

## 🚀 Tecnologías

- **Next.js 15** - Framework React para aplicaciones web
- **Tailwind CSS** - Framework CSS utility-first
- **Font Awesome** - Biblioteca de iconos vectoriales
- **TypeScript** - Tipado estático para JavaScript
- **React 19** - Biblioteca para interfaces de usuario

## 📦 Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd ssc-frontend

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

## 🎨 Tailwind CSS

Este proyecto utiliza Tailwind CSS para el estilado. Las clases de utilidad están disponibles en todos los componentes.

### Ejemplos de uso:

```jsx
// Botón con estilos de Tailwind
<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Click me
</button>

// Card con sombra y hover
<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
  Contenido de la card
</div>

// Grid responsive
<div className="grid md:grid-cols-3 gap-8">
  <div>Columna 1</div>
  <div>Columna 2</div>
  <div>Columna 3</div>
</div>
```

## 🔤 Font Awesome

Font Awesome está configurado con iconos de las siguientes librerías:
- **Solid Icons** (`@fortawesome/free-solid-svg-icons`)
- **Regular Icons** (`@fortawesome/free-regular-svg-icons`)
- **Brand Icons** (`@fortawesome/free-brands-svg-icons`)

### Ejemplos de uso:

```jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';

// Icono sólido
<FontAwesomeIcon icon={faHome} className="text-2xl text-blue-600" />

// Icono regular
<FontAwesomeIcon icon={faHeart} className="text-red-500" />

// Icono de marca
<FontAwesomeIcon icon={faFacebook} className="text-blue-600" />
```

### Iconos disponibles:

#### Solid Icons
- `faHome` - Casa
- `faUser` - Usuario
- `faCog` - Configuración
- `faSearch` - Búsqueda
- `faBars` - Menú hamburguesa
- `faTimes` - Cerrar
- `faArrowRight` - Flecha derecha
- `faArrowLeft` - Flecha izquierda
- `faCheck` - Verificar
- `faExclamationTriangle` - Advertencia
- `faInfoCircle` - Información
- `faEnvelope` - Correo
- `faPhone` - Teléfono
- `faMapMarkerAlt` - Ubicación

#### Regular Icons
- `faHeart` - Corazón
- `faStar` - Estrella
- `faBookmark` - Marcador
- `faCalendarAlt` - Calendario
- `faClock` - Reloj

#### Brand Icons
- `faFacebook` - Facebook
- `faTwitter` - Twitter
- `faInstagram` - Instagram
- `faLinkedin` - LinkedIn
- `faYoutube` - YouTube

## 📁 Estructura del proyecto

```
ssc-frontend/
├── src/
│   ├── app/
│   │   ├── globals.css          # Estilos globales con Tailwind
│   │   ├── layout.tsx           # Layout principal
│   │   └── page.tsx             # Página principal
│   └── lib/
│       └── fontawesome.ts       # Configuración de Font Awesome
├── tailwind.config.js           # Configuración de Tailwind CSS
├── postcss.config.js            # Configuración de PostCSS
└── package.json
```

## 🛠️ Scripts disponibles

```bash
# Desarrollo
npm run dev

# Construcción para producción
npm run build

# Iniciar servidor de producción
npm run start

# Linting
npm run lint
```

## 🎯 Próximos pasos

1. Configurar rutas adicionales en Next.js
2. Implementar componentes reutilizables
3. Agregar autenticación
4. Integrar con APIs backend
5. Implementar testing con Jest/React Testing Library

## 📝 Notas

- El proyecto está configurado con TypeScript para mejor desarrollo
- Tailwind CSS está optimizado para producción (solo incluye clases utilizadas)
- Font Awesome está configurado para tree-shaking (solo incluye iconos utilizados)
- El proyecto utiliza Next.js 15 con App Router

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.
