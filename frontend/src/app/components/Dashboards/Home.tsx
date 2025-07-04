"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Work_Sans } from 'next/font/google';
import logoMedellin from '@/assets/Logo-Medellin-new.png';
import { contratosApi, usuariosApi } from '@/lib/api';

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

// Interfaces
interface Usuario {
  USU_CEDULA: number;
  USU_EMAIL: string;
  USU_ROL: string;
  USU_NOMBRE: string;
  USU_CREATED_AT: string;
  USU_UPDATED_AT: string;
}

interface Contrato {
  CON_ID: number;
  CON_USU_CEDULA: number;
  CON_NRO_CONTRATO: number;
  CON_ANO_SUSCRIPCION: number;
  CON_PROGRAMA: string;
  CON_TIPO_CONTRATO: string;
  CON_OBJETO: string;
  CON_IDENTIFICADOR_SIMPLE: string;
  CON_SUPERVISOR_TECNICO: string;
  CON_ESTADO: string;
  CON_CONTRATISTA: string;
  CON_VALOR_TOTAL: number;
  CON_FECHA_INI: string;
  CON_FECHA_TER_ACT: string;
}

interface CreateContratoForm {
  usuarioCedula: string;
  numeroContrato: string;
  anoSuscripcion: number;
  programa: string;
  tipoContrato: string;
  objeto: string;
  identificadorSimple: string;
  suplentes: string;
  apoyo: string;
  estado: string;
  contratista: string;
  numeroProceso: string;
  fechaInicio: string;
  fechaTerminacionInicial: string;
  fechaTerminacionActual: string;
  valorInicial: number;
  valorTotal: number;
}

interface SupervisorOption {
  cedula: string;
  nombre: string;
  email: string;
}

export default function HomePage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [supervisores, setSupervisores] = useState<SupervisorOption[]>([]);
  const [loadingSupervisores, setLoadingSupervisores] = useState(false);
  const [creatingContrato, setCreatingContrato] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState<CreateContratoForm>({
    usuarioCedula: '',
    numeroContrato: '',
    anoSuscripcion: new Date().getFullYear(),
    programa: '',
    tipoContrato: 'Obra Pública',
    objeto: '',
    identificadorSimple: '',
    suplentes: '',
    apoyo: 'Equipo técnico de la Secretaría de Infraestructura',
    estado: 'activo', // Valor correcto del enum
    contratista: '',
    numeroProceso: '',
    fechaInicio: '',
    fechaTerminacionInicial: '',
    fechaTerminacionActual: '',
    valorInicial: 0,
    valorTotal: 0
  });

  // Cargar datos iniciales desde la API real
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/');
      return;
    }

    try {
      const userInfo = JSON.parse(userData);
      setUsuario(userInfo);
      
      // Cargar contratos desde la API real
      const loadContratos = async () => {
        try {
          setLoading(true);
          const contratosData = await contratosApi.getContratos();
          
          // Mapear los datos del backend al formato del frontend
          const contratosFormateados = contratosData.map((contratoData: unknown) => {
            const c = contratoData as Record<string, unknown>;
            return ({
              CON_ID: Number(c.id),
              CON_USU_CEDULA: Number(c.usuarioCedula) || 0,
              CON_NRO_CONTRATO: Number(c.numeroContrato),
              CON_ANO_SUSCRIPCION: Number(c.anoSuscripcion) || new Date().getFullYear(),
              CON_PROGRAMA: String(c.programa),
              CON_TIPO_CONTRATO: String(c.tipoContrato),
              CON_OBJETO: String(c.objeto),
              CON_IDENTIFICADOR_SIMPLE: `#${c.numeroContrato}`,
              CON_SUPERVISOR_TECNICO: String(c.supervisorTecnico) || "No asignado",
              CON_ESTADO: String(c.estado),
              CON_CONTRATISTA: String(c.contratista),
              CON_VALOR_TOTAL: Number(c.valorTotal),
              CON_FECHA_INI: String(c.fechaInicio),
              CON_FECHA_TER_ACT: String(c.fechaTerminacionActual)
            });
          });

          // Filtrar solo contratos activos
          const contratosActivos = contratosFormateados.filter((c: Contrato) => 
            c.CON_ESTADO && c.CON_ESTADO.toUpperCase() === 'ACTIVO'
          );
          
          setContratos(contratosActivos);
        } catch (error) {
          console.error('Error cargando contratos desde la base de datos:', error);
          setContratos([]); // No mostrar datos falsos si falla
        } finally {
          setLoading(false);
        }
      };

      loadContratos();
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      router.push('/');
    }
  }, [router]);

  // Cargar supervisores cuando se abre el modal
  const loadSupervisores = async () => {
    setLoadingSupervisores(true);
    try {
      // Obtener supervisores reales desde los contratos existentes en la base de datos
      const usuarios = await usuariosApi.getUsuarios();
      
      // Mapear usuarios a formato del dropdown
      const supervisoresReales = usuarios.map((usuario: any) => ({
        cedula: usuario.cedula,
        nombre: usuario.nombre || usuario.email?.split('@')[0] || `Usuario ${usuario.cedula}`,
        email: usuario.email
      }));
      
      setSupervisores(supervisoresReales);
    } catch (error) {
      console.error('Error cargando supervisores reales de la base de datos:', error);
      setSupervisores([]);
    } finally {
      setLoadingSupervisores(false);
    }
  };

  // Handlers
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/');
  };

  const handleContratoClick = (contratoId: number) => {
    router.push(`/contratos?id=${contratoId}`);
  };

  const handleCreateContrato = () => {
    setShowCreateModal(true);
    loadSupervisores();
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setFormData({
      usuarioCedula: '',
      numeroContrato: '',
      anoSuscripcion: new Date().getFullYear(),
      programa: '',
      tipoContrato: 'Obra Pública',
      objeto: '',
      identificadorSimple: '',
      suplentes: '',
      apoyo: 'Equipo técnico de la Secretaría de Infraestructura',
      estado: 'activo',
      contratista: '',
      numeroProceso: '',
      fechaInicio: '',
      fechaTerminacionInicial: '',
      fechaTerminacionActual: '',
      valorInicial: 0,
      valorTotal: 0
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingContrato(true);

    try {
      // Validar que los valores numéricos no sean 0
      if (formData.valorInicial <= 0 || formData.valorTotal <= 0) {
        alert('Los valores inicial y total deben ser mayores a 0');
        return;
      }

      // Validar que valor total sea mayor o igual al inicial
      if (formData.valorTotal < formData.valorInicial) {
        alert('El valor total debe ser mayor o igual al valor inicial');
        return;
      }

      // Validar fechas
      const fechaInicio = new Date(formData.fechaInicio);
      const fechaTerminacionInicial = new Date(formData.fechaTerminacionInicial);
      const fechaTerminacionActual = new Date(formData.fechaTerminacionActual);

      if (fechaTerminacionInicial <= fechaInicio) {
        alert('La fecha de terminación inicial debe ser posterior a la fecha de inicio');
        return;
      }

      if (fechaTerminacionActual < fechaInicio) {
        alert('La fecha de terminación actual debe ser posterior a la fecha de inicio');
        return;
      }

      // Preparar datos con formato correcto
      const contratoData = {
        usuarioCedula: formData.usuarioCedula,
        numeroContrato: formData.numeroContrato,
        anoSuscripcion: formData.anoSuscripcion,
        programa: formData.programa,
        tipoContrato: formData.tipoContrato,
        objeto: formData.objeto,
        identificadorSimple: formData.identificadorSimple,
        suplentes: formData.suplentes || undefined, // No enviar string vacío
        apoyo: formData.apoyo || undefined, // No enviar string vacío
        estado: formData.estado, // Ya está en formato correcto 'activo'
        contratista: formData.contratista,
        numeroProceso: formData.numeroProceso,
        // Convertir fechas al formato ISO correcto
        fechaInicio: formData.fechaInicio,
        fechaTerminacionInicial: formData.fechaTerminacionInicial,
        fechaTerminacionActual: formData.fechaTerminacionActual,
        valorInicial: Number(formData.valorInicial),
        valorTotal: Number(formData.valorTotal)
      };

      console.log('Enviando datos del contrato:', contratoData);
      
      await contratosApi.createContrato(contratoData);
      
      // Mostrar mensaje de éxito
      alert('¡Contrato creado exitosamente!');
      
      // Cerrar modal y recargar contratos
      handleCloseModal();
      window.location.reload(); // Recarga la página para mostrar el nuevo contrato
      
    } catch (error: any) {
      console.error('Error creando contrato:', error);
      
      // Mostrar error más específico
      let errorMessage = 'Error al crear el contrato. ';
      if (error.message) {
        errorMessage += error.message;
      } else if (error.statusCode === 400) {
        errorMessage += 'Datos inválidos. Verifica todos los campos.';
      } else if (error.statusCode === 404) {
        errorMessage += 'El supervisor seleccionado no existe.';
      } else if (error.statusCode === 409) {
        errorMessage += 'Ya existe un contrato con ese número.';
      } else {
        errorMessage += 'Por favor, verifica todos los campos.';
      }
      
      alert(errorMessage);
    } finally {
      setCreatingContrato(false);
    }
  };

  const formatearValor = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(valor);
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Determinar si el usuario es administrador
  const esAdministrador = usuario?.USU_ROL?.toLowerCase() === 'admin';

  if (!usuario) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-500 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-500 relative overflow-hidden">
      {/* Fondo con patrón */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="flex flex-col space-y-4 transform -rotate-0 translate-x-[-5%] translate-y-[0%] scale-[2]">
          {Array.from({ length: 12 }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex space-x-8 whitespace-nowrap">
              {Array.from({ length: 8 }).map((_, colIndex) => (
                <span key={colIndex} className="text-blue-900 text-5xl font-black select-none tracking-[-0.1em] font-sans">
                  {rowIndex % 2 === 0 ? 'MEDELLIN' : 'TE QUIERE'}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <header className="bg-blue-900 px-6 py-4 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-900 rounded-lg p-2 shadow-lg">
              <Image
                src={logoMedellin}
                alt="Alcaldía de Medellín"
                width={96}
                height={120}
                className="w-24 h-30 object-contain"
              />
            </div>
            
            <div className="w-px h-20 bg-white opacity-50"></div>
            
            <div className="text-white">
              <h1 
                className={`${workSans.className} text-white`}
                style={{
                  fontWeight: 800,
                  fontSize: '95.37px',
                  lineHeight: '100%',
                  letterSpacing: '0%'
                }}
              >
                SIF
              </h1>
            </div>
          </div>

          <div className="flex flex-col items-end space-y-2">
            <div className="text-white text-right">
              <p className="text-base font-medium">{usuario.USU_NOMBRE}</p>
              <p className="text-sm text-blue-200 capitalize">{usuario.USU_ROL}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-full flex items-center space-x-2 transition-colors duration-200 text-sm"
            >
              <span>Cerrar Sesión</span>
              <span className="text-base">⊗</span>
            </button>
          </div>
        </div>
      </header>

      <main className="px-8 py-8 relative z-10">
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-8">
            <h2 
              className={`${workSans.className} text-gray-800 align-middle`}
              style={{
                fontWeight: 700,
                fontSize: '48.83px',
                lineHeight: '100%',
                letterSpacing: '0%',
                textAlign: 'center',
                verticalAlign: 'middle'
              }}
            >
              ¿Que <span className="text-blue-600">contrato</span> deseas realizarle seguimiento?
            </h2>
            
            {/* Botón crear contrato solo para administradores */}
            {esAdministrador && (
              <button
                onClick={handleCreateContrato}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 shadow-lg"
              >
                <span className="text-xl">+</span>
                <span>Crear Nuevo Contrato</span>
              </button>
            )}
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px] items-center justify-center">
              <div className="col-span-full text-center text-gray-500 text-lg">
                <div className="bg-gray-100 rounded-lg p-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-xl font-medium">Cargando contratos...</p>
                </div>
              </div>
            </div>
          ) : contratos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contratos.map((contrato, index) => (
                <div 
                  key={contrato.CON_ID}
                  onClick={() => handleContratoClick(contrato.CON_ID)}
                  className={`${index % 2 === 0 ? 'bg-orange-500' : 'bg-green-500'} text-white rounded-lg p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer group h-96 flex flex-col justify-between`}
                >
                  <div className="flex-grow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {contrato.CON_TIPO_CONTRATO}
                      </div>
                      <div className="text-white bg-green-600 px-2 py-1 rounded text-xs font-medium">
                        {contrato.CON_ESTADO}
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gray-100 transition-colors">
                      Contrato {contrato.CON_IDENTIFICADOR_SIMPLE}
                    </h3>
                    
                    <p className="text-white text-sm mb-3 opacity-90 line-clamp-2 h-10 overflow-hidden">
                      {contrato.CON_OBJETO}
                    </p>

                    <div className="space-y-2 text-sm text-white">
                      <div className="flex justify-between">
                        <span className="text-white opacity-80">Contratista:</span>
                        <span className="font-medium text-right text-xs max-w-[60%] truncate">
                          {contrato.CON_CONTRATISTA}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white opacity-80">Valor:</span>
                        <span className="font-bold text-white">
                          {formatearValor(contrato.CON_VALOR_TOTAL)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white opacity-80">Programa:</span>
                        <span className="font-medium text-right text-xs max-w-[60%] truncate">
                          {contrato.CON_PROGRAMA}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white opacity-80">Inicio:</span>
                        <span className="font-medium">
                          {formatearFecha(contrato.CON_FECHA_INI)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white border-opacity-30">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-full font-medium transition-colors">
                      Seleccionar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[400px] items-center justify-center">
              <div className="col-span-full text-center text-gray-500 text-lg">
                <div className="bg-gray-100 rounded-lg p-12">
                  <div className="mb-4">
                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-xl font-medium mb-2">No hay contratos activos</p>
                  <p className="text-gray-400">No se encontraron contratos activos para mostrar</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal para crear contrato */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
              <div className="flex justify-between items-center">
                <div>
                  <h2 
                    className={`${workSans.className}`}
                    style={{
                      fontWeight: 700,
                      fontSize: '28px',
                      lineHeight: '100%',
                      letterSpacing: '0%'
                    }}
                  >
                    Nuevo Contrato
                  </h2>
                  <p className="text-blue-100 mt-2">Complete todos los datos para crear el contrato en el sistema</p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-blue-100 hover:text-white text-2xl font-bold p-2 hover:bg-blue-800 rounded-lg transition-all"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-8">
              {/* Información principal */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Columna 1 - Información básica */}
                <div className="space-y-6">
                  <h3 className={`${workSans.className} text-xl font-semibold text-gray-800 mb-6`}>
                    Información Básica
                  </h3>
                  
                  {/* Supervisor */}
                  <div>
                    <label className={`${workSans.className} block text-gray-700 mb-3 font-medium`}>
                      <span className="text-red-500">*</span> Supervisor Asignado
                    </label>
                    <select
                      value={formData.usuarioCedula}
                      onChange={(e) => setFormData({...formData, usuarioCedula: e.target.value})}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                      <option value="">Seleccionar supervisor...</option>
                      {supervisores.map((supervisor) => (
                        <option key={supervisor.cedula} value={supervisor.cedula}>
                          {supervisor.nombre} - {supervisor.email}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Número de contrato */}
                  <div>
                    <label className={`${workSans.className} block text-gray-700 mb-3 font-medium`}>
                      <span className="text-red-500">*</span> Número de Contrato
                    </label>
                    <input
                      type="text"
                      value={formData.numeroContrato}
                      onChange={(e) => setFormData({...formData, numeroContrato: e.target.value})}
                      placeholder="4600000001"
                      pattern="[0-9]{10}"
                      maxLength={10}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                    <p className="text-gray-500 text-sm mt-2">Debe tener exactamente 10 dígitos</p>
                  </div>

                  {/* Año de suscripción */}
                  <div>
                    <label className={`${workSans.className} block text-gray-700 mb-3 font-medium`}>
                      <span className="text-red-500">*</span> Año de Suscripción
                    </label>
                    <input
                      type="number"
                      value={formData.anoSuscripcion}
                      onChange={(e) => setFormData({...formData, anoSuscripcion: parseInt(e.target.value)})}
                      min="2000"
                      max="2030"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                  </div>

                  {/* Tipo de contrato */}
                  <div>
                    <label className={`${workSans.className} block text-gray-700 mb-3 font-medium`}>
                      <span className="text-red-500">*</span> Tipo de Contrato
                    </label>
                    <select
                      value={formData.tipoContrato}
                      onChange={(e) => setFormData({...formData, tipoContrato: e.target.value})}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                      <option value="Obra Pública">Obra Pública</option>
                      <option value="Prestación de Servicios">Prestación de Servicios</option>
                      <option value="Suministro">Suministro</option>
                      <option value="Consultoría">Consultoría</option>
                    </select>
                  </div>
                </div>

                {/* Columna 2 - Detalles del contrato */}
                <div className="space-y-6">
                  <h3 className={`${workSans.className} text-xl font-semibold text-gray-800 mb-6`}>
                    Detalles del Contrato
                  </h3>

                  {/* Programa */}
                  <div>
                    <label className={`${workSans.className} block text-gray-700 mb-3 font-medium`}>
                      <span className="text-red-500">*</span> Programa
                    </label>
                    <input
                      type="text"
                      value={formData.programa}
                      onChange={(e) => setFormData({...formData, programa: e.target.value})}
                      placeholder="Programa de Infraestructura Vial"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                  </div>

                  {/* Identificador simple */}
                  <div>
                    <label className={`${workSans.className} block text-gray-700 mb-3 font-medium`}>
                      <span className="text-red-500">*</span> Identificador Simple
                    </label>
                    <input
                      type="text"
                      value={formData.identificadorSimple}
                      onChange={(e) => setFormData({...formData, identificadorSimple: e.target.value})}
                      placeholder="INF-VIA-2024-001"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                  </div>

                  {/* Contratista */}
                  <div>
                    <label className={`${workSans.className} block text-gray-700 mb-3 font-medium`}>
                      <span className="text-red-500">*</span> Contratista
                    </label>
                    <input
                      type="text"
                      value={formData.contratista}
                      onChange={(e) => setFormData({...formData, contratista: e.target.value})}
                      placeholder="Constructora Medellín S.A.S."
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                  </div>

                  {/* Número de proceso */}
                  <div>
                    <label className={`${workSans.className} block text-gray-700 mb-3 font-medium`}>
                      <span className="text-red-500">*</span> Número de Proceso
                    </label>
                    <input
                      type="text"
                      value={formData.numeroProceso}
                      onChange={(e) => setFormData({...formData, numeroProceso: e.target.value})}
                      placeholder="LP-001-2024"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                  </div>
                </div>

                {/* Columna 3 - Fechas y valores */}
                <div className="space-y-6">
                  <h3 className={`${workSans.className} text-xl font-semibold text-gray-800 mb-6`}>
                    Fechas y Presupuesto
                  </h3>

                  {/* Estado */}
                  <div>
                    <label className={`${workSans.className} block text-gray-700 mb-3 font-medium`}>
                      <span className="text-red-500">*</span> Estado
                    </label>
                    <select
                      value={formData.estado}
                      onChange={(e) => setFormData({...formData, estado: e.target.value})}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    >
                      <option value="activo">Activo</option>
                      <option value="suspendido">Suspendido</option>
                      <option value="terminado">Terminado</option>
                      <option value="liquidado">Liquidado</option>
                    </select>
                  </div>

                  {/* Fecha de inicio */}
                  <div>
                    <label className={`${workSans.className} block text-gray-700 mb-3 font-medium`}>
                      <span className="text-red-500">*</span> Fecha de Inicio
                    </label>
                    <input
                      type="date"
                      value={formData.fechaInicio}
                      onChange={(e) => setFormData({...formData, fechaInicio: e.target.value})}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                  </div>

                  {/* Fecha terminación inicial */}
                  <div>
                    <label className={`${workSans.className} block text-gray-700 mb-3 font-medium`}>
                      <span className="text-red-500">*</span> Fecha Terminación Inicial
                    </label>
                    <input
                      type="date"
                      value={formData.fechaTerminacionInicial}
                      onChange={(e) => setFormData({...formData, fechaTerminacionInicial: e.target.value})}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                  </div>

                  {/* Fecha terminación actual */}
                  <div>
                    <label className={`${workSans.className} block text-gray-700 mb-3 font-medium`}>
                      <span className="text-red-500">*</span> Fecha Terminación Actual
                    </label>
                    <input
                      type="date"
                      value={formData.fechaTerminacionActual}
                      onChange={(e) => setFormData({...formData, fechaTerminacionActual: e.target.value})}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Objeto del contrato */}
              <div className="mt-8">
                <label className={`${workSans.className} block text-gray-700 mb-3 font-medium`}>
                  <span className="text-red-500">*</span> Objeto del Contrato
                </label>
                <textarea
                  value={formData.objeto}
                  onChange={(e) => setFormData({...formData, objeto: e.target.value})}
                  placeholder="Construcción de vía en el barrio San Javier, incluye pavimentación, obras de drenaje y señalización"
                  rows={3}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>

              {/* Valores financieros */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <label className={`${workSans.className} block text-green-800 mb-3 text-center font-medium`}>
                    <span className="text-red-500">*</span> Valor Inicial
                  </label>
                  <input
                    type="number"
                    value={formData.valorInicial}
                    onChange={(e) => setFormData({...formData, valorInicial: parseInt(e.target.value) || 0})}
                    min="1"
                    placeholder="1000000000"
                    required
                    className="w-full px-4 py-3 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-center text-xl font-bold text-green-800"
                  />
                  <p className="text-green-600 text-sm text-center mt-2">Valor inicial del contrato en COP</p>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <label className={`${workSans.className} block text-orange-800 mb-3 text-center font-medium`}>
                    <span className="text-red-500">*</span> Valor Total
                  </label>
                  <input
                    type="number"
                    value={formData.valorTotal}
                    onChange={(e) => setFormData({...formData, valorTotal: parseInt(e.target.value) || 0})}
                    min="1"
                    placeholder="1200000000"
                    required
                    className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-center text-xl font-bold text-orange-800"
                  />
                  <p className="text-orange-600 text-sm text-center mt-2">Incluye adiciones y modificaciones</p>
                </div>
              </div>

              {/* Campos opcionales */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`${workSans.className} block text-gray-700 mb-3 font-medium`}>
                    Suplentes (Opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.suplentes}
                    onChange={(e) => setFormData({...formData, suplentes: e.target.value})}
                    placeholder="María González - Supervisora Suplente"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>

                <div>
                  <label className={`${workSans.className} block text-gray-700 mb-3 font-medium`}>
                    Personal de Apoyo (Opcional)
                  </label>
                  <input
                    type="text"
                    value={formData.apoyo}
                    onChange={(e) => setFormData({...formData, apoyo: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>
              </div>

              {/* Resumen del contrato */}
              <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6">
                <h3 className={`${workSans.className} text-lg font-semibold text-gray-800 mb-4`}>
                  Resumen del Contrato
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-500 font-medium">Número</p>
                    <p className="text-gray-800 font-semibold mt-1">
                      {formData.numeroContrato || 'Sin definir'}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-500 font-medium">Contratista</p>
                    <p className="text-gray-800 font-semibold mt-1 truncate">
                      {formData.contratista || 'Sin definir'}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-500 font-medium">Valor Inicial</p>
                    <p className="text-gray-800 font-semibold mt-1">
                      ${formData.valorInicial ? formData.valorInicial.toLocaleString('es-CO') : '0'}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-sm text-gray-500 font-medium">Valor Total</p>
                    <p className="text-gray-800 font-semibold mt-1">
                      ${formData.valorTotal ? formData.valorTotal.toLocaleString('es-CO') : '0'}
                    </p>
                  </div>
                </div>
                <div className="mt-4 bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-sm text-gray-500 font-medium">Objeto del Contrato</p>
                  <p className="text-gray-800 mt-1">
                    {formData.objeto || 'Sin definir'}
                  </p>
                </div>
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creatingContrato}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center space-x-2 font-medium shadow-lg"
                >
                  {creatingContrato ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creando Contrato...</span>
                    </>
                  ) : (
                    <span>Crear Contrato</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}