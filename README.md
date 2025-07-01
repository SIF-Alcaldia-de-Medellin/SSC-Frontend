# SSC - Sistema de Seguimiento de Contratos

Sistema web para la gestión y seguimiento de contratos de la Alcaldía de Medellín, desarrollado con Next.js y TypeScript.

## 🚀 Características Principales

- **Gestión de Usuarios**: Login con roles (admin, supervisor, jefe)
- **Contratos**: Visualización detallada de contratos con información completa
- **Seguimiento General**: Formularios para actualizar avance financiero y físico
- **Seguimiento por Actividades**: Flujo detallado por CUOs y actividades específicas
- **Adiciones y Modificaciones**: Gestión de cambios contractuales
- **Dashboard Interactivo**: Visualización de estadísticas y métricas

## 📁 Estructura del Proyecto

```
SSC/
├── frontend/                 # Aplicación Next.js
│   ├── src/app/
│   │   ├── components/
│   │   │   └── Dashboards/   # Componentes principales
│   │   ├── home/            # Página principal
│   │   ├── contratos/       # Gestión de contratos
│   │   ├── seguimiento-general/     # Seguimiento general
│   │   ├── seguimiento-actividades/ # Seguimiento por actividades
│   │   ├── agregar-adicion/        # Formulario adiciones
│   │   └── agregar-modificacion/   # Formulario modificaciones
│   └── package.json
├── data/
│   ├── ssc_data.json        # Base de datos JSON
│   └── api-simulator.js     # Simulador de API
└── db_ssc_schema.sql        # Esquema de base de datos
```

## 🛠️ Instalación

### Prerrequisitos
- Node.js (v18 o superior)
- npm o yarn

### Pasos

1. **Clonar el repositorio**
```bash
git clone <url-repositorio>
cd SSC
```

2. **Instalar dependencias**
```bash
cd frontend
npm install
```

3. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

4. **Acceder a la aplicación**
```
http://localhost:3000
```

## 🔐 Usuarios de Prueba

| Usuario | Email | Contraseña | Rol |
|---------|-------|------------|-----|
| María González | admin@medellin.gov.co | admin123 | admin |
| Carlos Ramírez | supervisor@medellin.gov.co | super123 | supervisor |
| Ana Martínez | jefe@medellin.gov.co | jefe123 | jefe |

## 📊 Funcionalidades

### 🏠 Dashboard Principal
- Resumen de contratos asignados
- Estadísticas generales
- Acceso rápido a funcionalidades

### 📋 Gestión de Contratos
- **Información detallada**: Objeto, contratista, valores, fechas
- **Seguimiento financiero**: Avance y costos ejecutados
- **Historial**: Adiciones y modificaciones

### 📈 Seguimiento General
- Actualización de avance financiero
- Actualización de avance físico  
- Observaciones del contrato

### 🎯 Seguimiento por Actividades
**Flujo completo en 3 pasos:**

1. **Frentes de Obra (CUOs)**
   - Selección de Centro Urbano de Obra
   - Información geográfica y descriptiva

2. **Actividades**
   - Lista de actividades por CUO
   - Meta física y valor proyectado
   - Unidades de medida

3. **Seguimiento de Avance**
   - Datos automáticos desde BD (costos, avance físico)
   - Formulario de descripción y proyecciones
   - Validación y guardado

### ➕ Adiciones y Modificaciones
- **Adiciones**: Incrementos de valor contractual
- **Modificaciones**: Cambios de plazo, valor o alcance
- **Histórico**: Registro completo de cambios

## 🎨 Tecnologías

- **Frontend**: Next.js 14, React 18, TypeScript
- **Estilos**: Tailwind CSS
- **Icons**: Heroicons
- **Estado**: React Hooks (useState, useEffect)
- **Routing**: Next.js App Router
- **Datos**: JSON simulado (ssc_data.json)

## 🗄️ Estructura de Datos

### Entidades Principales
- **Usuarios**: Información y roles
- **Contratos**: Datos contractuales completos
- **CUOs**: Centros Urbanos de Obra
- **Actividades**: Tareas específicas por CUO
- **Seguimiento**: Avances y observaciones
- **Adiciones**: Incrementos contractuales
- **Modificaciones**: Cambios al contrato

### Relaciones
```
Usuario → Contratos → CUOs → Actividades → Seguimientos
           ↓
    Adiciones + Modificaciones
```

## 🚀 Comandos de Desarrollo

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar producción
npm start

# Linting
npm run lint

# Formato de código
npm run format
```

## 📱 Responsive Design

El sistema está optimizado para:
- **Desktop**: Experiencia completa
- **Tablet**: Navegación adaptada
- **Mobile**: Funcionalidades principales

## 🔒 Seguridad

- Autenticación por localStorage
- Validación de roles por página
- Protección de rutas sensibles
- Sanitización de datos de entrada

## 🎯 Próximas Funcionalidades

- [ ] API real con base de datos
- [ ] Notificaciones en tiempo real
- [ ] Reportes en PDF
- [ ] Dashboard avanzado con gráficos
- [ ] Integración con sistemas externos
- [ ] Módulo de documentos

## 🐛 Resolución de Problemas

### Problemas Comunes

**Error de autenticación**
```bash
# Limpiar localStorage
localStorage.clear()
```

**Problemas de dependencias**
```bash
# Reinstalar node_modules
rm -rf node_modules package-lock.json
npm install
```

**Puerto ocupado**
```bash
# Cambiar puerto
npm run dev -- -p 3001
```

## 👥 Contribuir

1. Fork del proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 📞 Contacto

**Alcaldía de Medellín**  
Secretaría de Ciencia, Tecnología e Innovación

---

*Desarrollado para la gestión eficiente de contratos públicos en Medellín* 🏛️ 