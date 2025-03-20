import { useNavigate } from "react-router-dom";
import { Calendar, Users, Mail, ChevronRight } from "lucide-react";
import Button from "./button"; // Importação do Button

import PropTypes from 'prop-types'; // Importe o PropTypes

// Componente Card
const Card = ({ children, className = '' }) => (
  <div className={`rounded-lg shadow-lg bg-white ${className}`}>
    {children}
  </div>
);

Card.propTypes = {
  children: PropTypes.node.isRequired,  // Valida que 'children' pode ser qualquer conteúdo renderizável
  className: PropTypes.string,  // Valida que 'className' é uma string
};

// Componente CardHeader
const CardHeader = ({ children, className = '' }) => (
  <div className={`p-4 bg-gray-100 rounded-t-lg ${className}`}>
    {children}
  </div>
);

CardHeader.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

// Componente CardContent
const CardContent = ({ children }) => (
  <div className="p-4">
    {children}
  </div>
);

CardContent.propTypes = {
  children: PropTypes.node.isRequired,
};

// Componente CardDescription
const CardDescription = ({ children }) => (
  <p className="text-sm text-gray-600">{children}</p>
);

CardDescription.propTypes = {
  children: PropTypes.node.isRequired,
};

// Componente CardFooter
const CardFooter = ({ children }) => (
  <div className="p-4">
    {children}
  </div>
);

CardFooter.propTypes = {
  children: PropTypes.node.isRequired,
};

// Componente CardTitle
const CardTitle = ({ children }) => (
  <h3 className="text-xl font-semibold">{children}</h3>
);

CardTitle.propTypes = {
  children: PropTypes.node.isRequired,
};

function Index() {
  const navigate = useNavigate();

  const navigateToAdminRegistration = () => {
    navigate("/cadastroAdm");
  };

  const stats = [
    { title: "Total de Eventos", value: "3", icon: <Calendar className="h-5 w-5 text-indigo-600" />, color: "bg-indigo-100", textColor: "text-indigo-600" },
    { title: "Convidados", value: "42", icon: <Users className="h-5 w-5 text-teal-600" />, color: "bg-teal-100", textColor: "text-teal-600" },
    { title: "Confirmações", value: "28", icon: <Mail className="h-5 w-5 text-amber-600" />, color: "bg-amber-100", textColor: "text-amber-600" }
  ];

  const modules = [
    { title: "Gerenciar Eventos", description: "Crie e gerencie seus eventos, defina datas e locais.", icon: <Calendar className="h-6 w-6" />, action: navigateToAdminRegistration, color: "bg-gradient-to-br from-indigo-500 to-indigo-600" },
    { title: "Lista de Convidados", description: "Adicione e gerencie seus convidados e acompanhantes.", icon: <Users className="h-6 w-6" />, action: navigateToAdminRegistration, color: "bg-gradient-to-br from-teal-500 to-teal-600" },
    { title: "Confirmações", description: "Acompanhe as confirmações e envie lembretes.", icon: <Mail className="h-6 w-6" />, action: navigateToAdminRegistration, color: "bg-gradient-to-br from-amber-500 to-amber-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-r from-indigo-100 via-teal-50 to-amber-50 opacity-70"></div>
        <div className="relative pt-20 pb-16 sm:pb-24 px-6 sm:px-8 lg:px-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight mb-6">Sistema de Gerenciamento de Eventos</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">Organize seus eventos com facilidade.</p>
          <Button onClick={navigateToAdminRegistration} size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Começar Agora <ChevronRight className="h-5 w-5 ml-1" />
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 -mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {stats.map((stat, index) => (
            <Card key={index} className="border-gray-100 shadow-sm hover:shadow-md">
              <CardHeader className={`${stat.color} text-white rounded-t-lg flex justify-between items-center`}>
                {stat.icon}
                <CardTitle>{stat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{stat.value}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Módulos do Sistema</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {modules.map((module, index) => (
            <Card key={index} className="border-gray-100 shadow-sm hover:shadow-md">
              <CardHeader className={`${module.color} text-white rounded-t-lg flex justify-between items-center`}>
                <CardTitle>{module.title}</CardTitle>
                {module.icon}
              </CardHeader>
              <CardContent>
                <CardDescription>{module.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button onClick={module.action} className="w-full justify-between" variant="outline">
                  Acessar <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Index;

