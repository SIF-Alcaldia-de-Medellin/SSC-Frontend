"use client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faCog, faSearch, faCheck, faExclamationTriangle, faChartLine, faFileContract, faUsers } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-pattern">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-dark-blue-500 rounded-full flex items-center justify-center">
                <img 
                  src="https://cdnwordpresstest-f0ekdgevcngegudb.z01.azurefd.net/es/wp-content/uploads/2022/04/cropped-favicon-1-1-270x270.png"
                  alt="Logo SSC"
                  className="h-6 w-6"
                />
              </div>
              <div>
                <h1 className="heading-5 font-bold text-color-dark-blue">SSC</h1>
                <p className="small text-gray-600">Sistema de Seguimiento de Contratos</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="nav-link nav-link-active">
                <FontAwesomeIcon icon={faHome} className="mr-2" />
                Dashboard
              </a>
              <a href="#" className="nav-link">
                <FontAwesomeIcon icon={faFileContract} className="mr-2" />
                Contratos
              </a>
              <a href="#" className="nav-link">
                <FontAwesomeIcon icon={faUsers} className="mr-2" />
                Usuarios
              </a>
              <a href="#" className="nav-link">
                <FontAwesomeIcon icon={faCog} className="mr-2" />
                Configuración
              </a>
            </nav>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <FontAwesomeIcon icon={faSearch} />
              </button>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faUser} className="text-white text-sm" />
                </div>
                <span className="text-sm font-medium text-gray-700">Usuario</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="heading-2 text-color-dark-blue mb-2">
            ¡Bienvenido al Sistema de Seguimiento de Contratos!
          </h2>
          <p className="paragraph text-gray-600">
            Gestiona y monitorea todos los contratos de la Secretaría de Infraestructura
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <FontAwesomeIcon icon={faFileContract} className="text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Contratos Activos</p>
                <p className="heading-4 font-bold text-gray-900">1,234</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <FontAwesomeIcon icon={faCheck} className="text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completados</p>
                <p className="heading-4 font-bold text-gray-900">856</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendientes</p>
                <p className="heading-4 font-bold text-gray-900">378</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <FontAwesomeIcon icon={faChartLine} className="text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Valor Total</p>
                <p className="heading-4 font-bold text-gray-900">$2.5B</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Contracts */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="heading-4 font-semibold text-gray-900">Contratos Recientes</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { id: 'CTR-001', title: 'Construcción Vía Principal', status: 'Activo', value: '$150M', date: '2024-01-15' },
                { id: 'CTR-002', title: 'Mantenimiento Alumbrado', status: 'Pendiente', value: '$45M', date: '2024-01-10' },
                { id: 'CTR-003', title: 'Reparación Puentes', status: 'Completado', value: '$89M', date: '2024-01-05' },
              ].map((contract) => (
                <div key={contract.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{contract.title}</h4>
                    <p className="text-sm text-gray-600">ID: {contract.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{contract.value}</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      contract.status === 'Activo' ? 'bg-green-100 text-green-800' :
                      contract.status === 'Pendiente' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {contract.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <FontAwesomeIcon icon={faHeart} className="text-red-500" />
              <span>Secretaría de Infraestructura - Alcaldía de Medellín</span>
            </div>
            <div className="text-sm text-gray-400">
              © 2024 SSC. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </footer>
      </div>
    </ProtectedRoute>
  );
} 