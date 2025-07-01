# Integración de Datos JSON con Frontend SSC

## 📁 Archivos Creados

1. **`ssc_data.json`** - Datos completos del sistema
2. **`api-simulator.js`** - Simulador de API para desarrollo
3. **`README_INTEGRACION.md`** - Este archivo de instrucciones

## 🚀 Cómo Integrar con tu Frontend

### 1. Ubicación de Archivos

Coloca los archivos en tu proyecto Next.js:

```
frontend/
├── src/
│   ├── app/
│   │   └── components/
│   │       └── Dashboards/    # (tus componentes existentes)
│   └── data/                  # 📁 NUEVA CARPETA
│       ├── ssc_data.json      # 📄 Datos del sistema
│       ├── api-simulator.js   # 📄 Simulador de API
│       └── README_INTEGRACION.md
└── package.json
```

### 2. Uso en tus Componentes

#### En `Home.tsx` - Lista de Contratos

```tsx
import { useState, useEffect } from 'react';
import apiSimulator from '@/data/api-simulator';

export default function Home() {
  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarContratos = async () => {
      try {
        const response = await apiSimulator.contratos.getActivos();
        if (response.success) {
          setContratos(response.data);
        }
      } catch (error) {
        console.error('Error cargando contratos:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarContratos();
  }, []);

  if (loading) return <div>Cargando contratos...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 to-blue-600">
      {/* Tu header existente */}
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-4xl font-bold text-white text-center mb-12">
          ¿Qué contrato deseas realizarle seguimiento?
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contratos.map((contrato) => (
            <div key={contrato.CON_ID} 
                 className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {contrato.CON_IDENTIFICADOR_SIMPLE}
              </h3>
              <p className="text-gray-600 mb-2">{contrato.CON_TIPO_CONTRATO}</p>
              <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                {contrato.CON_OBJETO}
              </p>
              <div className="text-sm text-gray-500 mb-4">
                <p>Contratista: {contrato.CON_CONTRATISTA}</p>
                <p>Valor: {apiSimulator.utilidades.formatearValor(contrato.CON_VALOR_TOTAL)}</p>
              </div>
              <button 
                onClick={() => window.location.href = `/contratos/${contrato.CON_ID}`}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
                Ver Detalles
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

#### En `Contratos.tsx` - Detalles del Contrato

```tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import apiSimulator from '@/data/api-simulator';

export default function Contratos() {
  const router = useRouter();
  const { id } = router.query; // ID del contrato desde la URL
  
  const [contrato, setContrato] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      cargarContrato();
    }
  }, [id]);

  const cargarContrato = async () => {
    try {
      const response = await apiSimulator.contratos.getById(id);
      if (response.success) {
        setContrato(response.data);
      }
    } catch (error) {
      console.error('Error cargando contrato:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando contrato...</div>;
  if (!contrato) return <div>Contrato no encontrado</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 to-blue-600">
      {/* Tu header existente */}
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Información del contrato */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {contrato.CON_IDENTIFICADOR_SIMPLE}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p><strong>Tipo:</strong> {contrato.CON_TIPO_CONTRATO}</p>
              <p><strong>Estado:</strong> {contrato.CON_ESTADO}</p>
              <p><strong>Contratista:</strong> {contrato.CON_CONTRATISTA}</p>
            </div>
            <div>
              <p><strong>Valor Inicial:</strong> {apiSimulator.utilidades.formatearValor(contrato.CON_VALOR_INI)}</p>
              <p><strong>Valor Total:</strong> {apiSimulator.utilidades.formatearValor(contrato.CON_VALOR_TOTAL)}</p>
              <p><strong>Fecha Inicio:</strong> {apiSimulator.utilidades.formatearFecha(contrato.CON_FECHA_INI)}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Objeto del Contrato</h3>
            <p className="text-gray-700">{contrato.CON_OBJETO}</p>
          </div>
        </div>

        {/* Avance del proyecto */}
        {contrato.seguimiento && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Avance del Proyecto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700">Avance Financiero</label>
                <div className="mt-1 bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-green-500 h-4 rounded-full transition-all"
                    style={{ width: `${contrato.seguimiento.SEG_AVANCE_FINANCIERO}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {contrato.seguimiento.SEG_AVANCE_FINANCIERO}%
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Avance Físico</label>
                <div className="mt-1 bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-orange-500 h-4 rounded-full transition-all"
                    style={{ width: `${contrato.seguimiento.SEG_AVANCE_FISICO}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {contrato.seguimiento.SEG_AVANCE_FISICO}%
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tablas de Adiciones y Modificaciones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Adiciones */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Adiciones</h3>
            {contrato.adiciones && contrato.adiciones.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Fecha</th>
                      <th className="px-4 py-2 text-left">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contrato.adiciones.map((adicion) => (
                      <tr key={adicion.ADI_ID} className="border-t">
                        <td className="px-4 py-2">
                          {apiSimulator.utilidades.formatearFecha(adicion.ADI_FECHA)}
                        </td>
                        <td className="px-4 py-2">
                          {apiSimulator.utilidades.formatearValor(adicion.ADI_VALOR_ADICION)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No hay adiciones registradas</p>
            )}
          </div>

          {/* Modificaciones */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Modificaciones</h3>
            {contrato.modificaciones && contrato.modificaciones.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Tipo</th>
                      <th className="px-4 py-2 text-left">Duración</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contrato.modificaciones.map((modificacion) => (
                      <tr key={modificacion.MOD_ID} className="border-t">
                        <td className="px-4 py-2">{modificacion.MOD_TIPO}</td>
                        <td className="px-4 py-2">{modificacion.MOD_DURACION} días</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No hay modificaciones registradas</p>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-wrap gap-4 mt-6">
          <button 
            onClick={() => router.push(`/agregar-adicion?contrato=${contrato.CON_ID}`)}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition-colors">
            Agregar Adición
          </button>
          <button 
            onClick={() => router.push(`/agregar-modificacion?contrato=${contrato.CON_ID}`)}
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition-colors">
            Agregar Modificación
          </button>
          <button 
            onClick={() => router.push(`/seguimiento-general?contrato=${contrato.CON_ID}`)}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">
            Actualizar Seguimiento
          </button>
        </div>
      </div>
    </div>
  );
}
```

#### En `AgregarAdicion.tsx` - Formulario de Adición

```tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import apiSimulator from '@/data/api-simulator';

export default function AgregarAdicion() {
  const router = useRouter();
  const { contrato } = router.query; // ID del contrato desde la URL
  
  const [formData, setFormData] = useState({
    ADI_CON_ID: contrato,
    ADI_VALOR_ADICION: '',
    ADI_FECHA: '',
    ADI_OBSERVACIONES: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiSimulator.adiciones.create({
        ...formData,
        ADI_VALOR_ADICION: parseInt(formData.ADI_VALOR_ADICION)
      });

      if (response.success) {
        alert('Adición agregada exitosamente');
        router.push(`/contratos/${contrato}`);
      } else {
        alert('Error al agregar adición');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 to-blue-600">
      {/* Tu header existente */}
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Agregar Adición
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Fecha de Adición
              </label>
              <input
                type="date"
                name="ADI_FECHA"
                value={formData.ADI_FECHA}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Valor de la Adición
              </label>
              <input
                type="number"
                name="ADI_VALOR_ADICION"
                value={formData.ADI_VALOR_ADICION}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Ej: 100000000"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Observaciones
              </label>
              <textarea
                name="ADI_OBSERVACIONES"
                value={formData.ADI_OBSERVACIONES}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none"
                placeholder="Describe la razón de la adición..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:bg-blue-400">
              {loading ? 'Guardando...' : 'Enviar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
```

## 🔧 Funciones Disponibles en el API Simulator

### Contratos
- `apiSimulator.contratos.getAll()` - Todos los contratos
- `apiSimulator.contratos.getActivos()` - Solo contratos activos
- `apiSimulator.contratos.getById(id)` - Contrato específico con datos relacionados

### Seguimiento
- `apiSimulator.seguimiento.getByContrato(id)` - Seguimientos del contrato
- `apiSimulator.seguimiento.create(data)` - Crear nuevo seguimiento

### Adiciones
- `apiSimulator.adiciones.getByContrato(id)` - Adiciones del contrato
- `apiSimulator.adiciones.create(data)` - Crear nueva adición

### Modificaciones
- `apiSimulator.modificaciones.getByContrato(id)` - Modificaciones del contrato
- `apiSimulator.modificaciones.create(data)` - Crear nueva modificación

### Utilidades
- `apiSimulator.utilidades.formatearValor(valor)` - Formatear moneda
- `apiSimulator.utilidades.formatearFecha(fecha)` - Formatear fecha
- `apiSimulator.utilidades.calcularDiasRestantes(fecha)` - Días restantes

## 📱 Navegación Entre Componentes

### Estructura de URLs Sugerida
- `/home` - Lista de contratos (Home.tsx)
- `/contratos/[id]` - Detalles del contrato (Contratos.tsx)
- `/agregar-adicion?contrato=[id]` - Formulario de adición (AgregarAdicion.tsx)
- `/agregar-modificacion?contrato=[id]` - Formulario de modificación (AgregarModificacion.tsx)
- `/seguimiento-general?contrato=[id]` - Actualizar seguimiento (SeguimientoGeneral.tsx)

## 🎯 Próximos Pasos

1. **Copia los archivos** a tu proyecto
2. **Adapta el código** de ejemplo a tus componentes existentes
3. **Prueba la funcionalidad** navegando entre pantallas
4. **Personaliza** los datos según necesites

## 💡 Ventajas de esta Implementación

- ✅ **No requiere base de datos** para desarrollo
- ✅ **Datos realistas** y relacionados entre sí
- ✅ **Simula latencia** de red real
- ✅ **Fácil de modificar** agregando/quitando datos
- ✅ **Persistencia temporal** durante la sesión
- ✅ **Funciones de utilidad** incluidas

¡Con esto ya puedes probar todo el flujo de tu sistema SSC! 🚀 