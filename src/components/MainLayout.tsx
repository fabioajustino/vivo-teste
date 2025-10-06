import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import SampleSelectionPage from '@/pages/SampleSelectionPage';
import SampleAnalysisPage from '@/pages/SampleAnalysisPage';
import { SampleProvider } from '@/contexts/SampleContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area, LineChart, Line } from 'recharts';
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  Clock,
  FileX,
  Target,
  Users,
  Building,
  Eye,
  RefreshCw
} from 'lucide-react';
import { useQualityMetrics } from '@/hooks/useQualityMetrics';

// Cores do tema Vivo
const VIVO_COLORS = [
  'hsl(280, 100%, 30%)', // Vivo Purple
  'hsl(280, 100%, 50%)', // Vivo Purple Light
  'hsl(280, 100%, 20%)', // Vivo Purple Dark
  'hsl(45, 100%, 50%)',  // Orange
  'hsl(0, 84%, 60%)',    // Red
  'hsl(120, 100%, 25%)', // Green
  'hsl(210, 100%, 50%)', // Blue
  'hsl(280, 100%, 85%)', // Vivo Purple Very Light
];

const QualityDashboardPageInline: React.FC = () => {
  const { data: metrics, isLoading, error } = useQualityMetrics();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 bg-background min-h-full">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-16 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert className="border-destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Erro ao carregar métricas de qualidade. Verifique a conexão com o Supabase.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Dados simulados para demonstração (quando metrics não estiver disponível)
  const mockMetrics = {
    totalContracts: 245,
    inconsistencyRate: 18.5,
    criticalContracts: 12,
    averageResolutionTime: 15,
    totalFinancialExposure: 2500000,
    projectedPenalties: 125000,
    contractsExpiring30Days: 28,
    contractsExpiring60Days: 45,
    contractsExpiring90Days: 32,
    autoRenewedContracts: 8,
    highRiskContracts: 18,
    highRiskPercentage: 7.3,
  };

  const currentMetrics = metrics || mockMetrics;

  // Dados para gráficos
  const inconsistencyData = [
    { name: 'Prazo', count: 15, percentage: 25 },
    { name: 'Multa', count: 8, percentage: 13 },
    { name: 'Valor', count: 12, percentage: 20 },
    { name: 'Fornecedor', count: 10, percentage: 17 },
    { name: 'Cláusula Ausente', count: 15, percentage: 25 },
  ];

  const areaData = [
    { name: 'Engenharia', count: 18, percentage: 30 },
    { name: 'TI', count: 15, percentage: 25 },
    { name: 'Operações', count: 12, percentage: 20 },
    { name: 'Comercial', count: 9, percentage: 15 },
    { name: 'Outros', count: 6, percentage: 10 },
  ];

  const supplierData = [
    { name: 'Fornecedor A', inconsistencies: 8, riskScore: 85 },
    { name: 'Fornecedor B', inconsistencies: 6, riskScore: 72 },
    { name: 'Fornecedor C', inconsistencies: 5, riskScore: 68 },
    { name: 'Fornecedor D', inconsistencies: 4, riskScore: 55 },
  ];

  const deadlineData = [
    { period: '0-30 dias', count: currentMetrics.contractsExpiring30Days, color: VIVO_COLORS[4] },
    { period: '31-60 dias', count: currentMetrics.contractsExpiring60Days, color: VIVO_COLORS[3] },
    { period: '61-90 dias', count: currentMetrics.contractsExpiring90Days, color: VIVO_COLORS[5] },
    { period: '90+ dias', count: 140, color: VIVO_COLORS[0] },
  ];

  const timelineData = [
    { month: 'Jan', expiring30: 15, expiring60: 22, expiring90: 18 },
    { month: 'Fev', expiring30: 18, expiring60: 20, expiring90: 25 },
    { month: 'Mar', expiring30: 22, expiring60: 28, expiring90: 20 },
    { month: 'Abr', expiring30: 20, expiring60: 25, expiring90: 30 },
    { month: 'Mai', expiring30: 25, expiring60: 30, expiring90: 22 },
    { month: 'Jun', expiring30: currentMetrics.contractsExpiring30Days, expiring60: currentMetrics.contractsExpiring60Days, expiring90: currentMetrics.contractsExpiring90Days },
  ];

  return (
    <div className="p-6 space-y-6 bg-background min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Shield className="h-8 w-8 text-vivo-purple" />
            Dashboards de Qualidade
          </h1>
          <p className="text-muted-foreground mt-2">
            Análise de qualidade e compliance dos contratos Vivo
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-vivo-purple text-vivo-purple">
            <Eye className="h-3 w-3 mr-1" />
            Tempo Real
          </Badge>
        </div>
      </div>

      {/* Tabs de navegação */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="distribution" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Distribuição
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Exposição Financeira
          </TabsTrigger>
          <TabsTrigger value="deadlines" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Prazos
          </TabsTrigger>
          <TabsTrigger value="risk" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Risco & Compliance
          </TabsTrigger>
        </TabsList>

        {/* Visão Geral */}
        <TabsContent value="overview" className="space-y-6">
          {/* Header com resumo geral */}
          <Card className="border-vivo-purple/20">
            <CardHeader>
              <CardTitle className="text-vivo-purple flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Visão Geral de Qualidade
              </CardTitle>
              <CardDescription>
                Acompanhe os principais indicadores de qualidade dos {currentMetrics.totalContracts} contratos ativos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-vivo-purple">{currentMetrics.totalContracts}</div>
                  <div className="text-sm text-muted-foreground">Contratos Totais</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatPercentage(100 - currentMetrics.inconsistencyRate)}
                  </div>
                  <div className="text-sm text-muted-foreground">Taxa de Conformidade</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(currentMetrics.totalFinancialExposure + currentMetrics.projectedPenalties)}
                  </div>
                  <div className="text-sm text-muted-foreground">Impacto Financeiro Total</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grid de KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Taxa de Inconsistência
                  </CardTitle>
                  <div className="rounded-full p-2 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{formatPercentage(currentMetrics.inconsistencyRate)}</div>
                    <TrendingUp className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">
                      {currentMetrics.inconsistencyRate > 25 ? 'Acima' : 'Dentro'} da meta de 25%
                    </div>
                    <Progress value={Math.min(currentMetrics.inconsistencyRate, 100)} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Contratos Críticos
                  </CardTitle>
                  <div className="rounded-full p-2 bg-red-50">
                    <Shield className="h-4 w-4 text-red-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">{currentMetrics.criticalContracts}</div>
                    <TrendingUp className="h-4 w-4 text-red-600" />
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">
                      {formatPercentage((currentMetrics.criticalContracts / currentMetrics.totalContracts) * 100)} do total
                    </div>
                    <Progress value={(currentMetrics.criticalContracts / currentMetrics.totalContracts) * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Exposição Financeira
                  </CardTitle>
                  <div className="rounded-full p-2 bg-vivo-purple/5">
                    <DollarSign className="h-4 w-4 text-vivo-purple" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-2xl font-bold">{formatCurrency(currentMetrics.totalFinancialExposure)}</div>
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">Valor total em risco</div>
                    <Progress value={50} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Vencendo (30d)
                  </CardTitle>
                  <div className="rounded-full p-2 bg-orange-50">
                    <Calendar className="h-4 w-4 text-orange-600" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-2xl font-bold">{currentMetrics.contractsExpiring30Days}</div>
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground">
                      {formatPercentage((currentMetrics.contractsExpiring30Days / currentMetrics.totalContracts) * 100)} do total
                    </div>
                    <Progress value={(currentMetrics.contractsExpiring30Days / currentMetrics.totalContracts) * 100} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Distribuição por Inconsistências */}
        <TabsContent value="distribution" className="space-y-6">
          <Card className="border-vivo-purple/20">
            <CardHeader>
              <CardTitle className="text-vivo-purple flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Distribuição de Inconsistências
              </CardTitle>
              <CardDescription>
                Análise detalhada da distribuição de inconsistências por tipo, área e fornecedor
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de barras - Por tipo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Por Tipo de Inconsistência
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={inconsistencyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                    <YAxis stroke="hsl(var(--foreground))" />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(280, 100%, 30%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Gráfico de pizza - Por tipo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  Proporção por Tipo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={inconsistencyData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ percentage }) => `${percentage}%`}
                      outerRadius={80}
                      dataKey="count"
                    >
                      {inconsistencyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={VIVO_COLORS[index % VIVO_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Por área */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  Por Área Solicitante
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={areaData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                    <YAxis stroke="hsl(var(--foreground))" />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(210, 100%, 50%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Ranking de fornecedores */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-red-600" />
                  Top Fornecedores Críticos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={supplierData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
                    <YAxis stroke="hsl(var(--foreground))" />
                    <Tooltip />
                    <Bar dataKey="inconsistencies" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Exposição Financeira */}
        <TabsContent value="financial" className="space-y-6">
          <Card className="border-vivo-purple/20">
            <CardHeader>
              <CardTitle className="text-vivo-purple flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Exposição Financeira
              </CardTitle>
              <CardDescription>
                Análise do impacto financeiro dos riscos e inconsistências contratuais
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-vivo-purple/20 bg-vivo-purple/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-8 w-8 text-vivo-purple" />
                  <div>
                    <div className="text-2xl font-bold text-vivo-purple">
                      {formatCurrency(currentMetrics.totalFinancialExposure)}
                    </div>
                    <div className="text-sm text-muted-foreground">Exposição Total</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <div className="text-2xl font-bold text-red-900">
                      {formatCurrency(currentMetrics.projectedPenalties)}
                    </div>
                    <div className="text-sm text-red-700">Multas Projetadas</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Target className="h-8 w-8 text-orange-600" />
                  <div>
                    <div className="text-2xl font-bold text-orange-900">
                      {formatCurrency(currentMetrics.totalFinancialExposure + currentMetrics.projectedPenalties)}
                    </div>
                    <div className="text-sm text-orange-700">Impacto Total</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold text-blue-900">
                      {((currentMetrics.projectedPenalties / currentMetrics.totalFinancialExposure) * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-blue-700">Taxa de Risco</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Indicadores de Prazo */}
        <TabsContent value="deadlines" className="space-y-6">
          <Card className="border-vivo-purple/20">
            <CardHeader>
              <CardTitle className="text-vivo-purple flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Indicadores de Prazo
              </CardTitle>
              <CardDescription>
                Monitoramento de vencimentos e renovações contratuais
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                    <div>
                      <div className="text-2xl font-bold text-red-900">
                        {currentMetrics.contractsExpiring30Days}
                      </div>
                      <div className="text-sm text-red-700">Vencendo em 30 dias</div>
                    </div>
                  </div>
                  <Badge variant="destructive" className="text-xs">Urgente</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="h-8 w-8 text-orange-600" />
                    <div>
                      <div className="text-2xl font-bold text-orange-900">
                        {currentMetrics.contractsExpiring60Days}
                      </div>
                      <div className="text-sm text-orange-700">Vencendo em 60 dias</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs border-orange-400 text-orange-600">Atenção</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-8 w-8 text-yellow-600" />
                    <div>
                      <div className="text-2xl font-bold text-yellow-900">
                        {currentMetrics.contractsExpiring90Days}
                      </div>
                      <div className="text-sm text-yellow-700">Vencendo em 90 dias</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs border-yellow-400 text-yellow-600">Normal</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="h-8 w-8 text-blue-600" />
                    <div>
                      <div className="text-2xl font-bold text-blue-900">
                        {currentMetrics.autoRenewedContracts}
                      </div>
                      <div className="text-sm text-blue-700">Renovações Automáticas</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs border-blue-400 text-blue-600">Revisão</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Distribuição por período */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Distribuição por Período
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={deadlineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="period" stroke="hsl(var(--foreground))" />
                    <YAxis stroke="hsl(var(--foreground))" />
                    <Tooltip />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {deadlineData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Tendência temporal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Tendência Temporal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--foreground))" />
                    <YAxis stroke="hsl(var(--foreground))" />
                    <Tooltip />
                    <Line type="monotone" dataKey="expiring30" stroke={VIVO_COLORS[4]} strokeWidth={3} name="30 dias" />
                    <Line type="monotone" dataKey="expiring60" stroke={VIVO_COLORS[3]} strokeWidth={3} name="60 dias" />
                    <Line type="monotone" dataKey="expiring90" stroke={VIVO_COLORS[5]} strokeWidth={3} name="90 dias" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Alertas de ação */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentMetrics.contractsExpiring30Days > 0 && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Ação Urgente:</strong> {currentMetrics.contractsExpiring30Days} contratos vencendo em 30 dias. 
                  Iniciar processo de renovação imediatamente.
                </AlertDescription>
              </Alert>
            )}
            
            {currentMetrics.autoRenewedContracts > 5 && (
              <Alert className="border-blue-200 bg-blue-50">
                <Clock className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Revisão Necessária:</strong> {currentMetrics.autoRenewedContracts} contratos renovados automaticamente. 
                  Agendar revisão para validar termos e condições.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </TabsContent>

        {/* Risco & Compliance */}
        <TabsContent value="risk" className="space-y-6">
          <Card className="border-vivo-purple/20">
            <CardHeader>
              <CardTitle className="text-vivo-purple flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Risco & Compliance
              </CardTitle>
              <CardDescription>
                Análise de risco corporativo e conformidade regulatória
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <div className="text-2xl font-bold text-red-900">
                      {currentMetrics.highRiskPercentage.toFixed(1)}%
                    </div>
                    <div className="text-sm text-red-700">Alto Risco</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Target className="h-8 w-8 text-orange-600" />
                  <div>
                    <div className="text-2xl font-bold text-orange-900">
                      {currentMetrics.criticalContracts}
                    </div>
                    <div className="text-sm text-orange-700">Contratos Críticos</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-8 w-8 text-blue-600" />
                  <div>
                    <div className="text-2xl font-bold text-blue-900">
                      {(100 - currentMetrics.inconsistencyRate).toFixed(1)}%
                    </div>
                    <div className="text-sm text-blue-700">Taxa Compliance</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-vivo-purple/20 bg-vivo-purple/5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-vivo-purple" />
                  <div>
                    <div className="text-2xl font-bold text-vivo-purple">82</div>
                    <div className="text-sm text-muted-foreground">Score Geral</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alertas críticos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentMetrics.highRiskPercentage > 5 && (
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Crítico:</strong> Taxa de alto risco em {currentMetrics.highRiskPercentage.toFixed(1)}%. 
                  Implementar revisão emergencial de contratos.
                </AlertDescription>
              </Alert>
            )}
            
            {currentMetrics.criticalContracts > 10 && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  <strong>Urgente:</strong> {currentMetrics.criticalContracts} contratos críticos identificados. 
                  Escalar para comitê de risco.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const MainLayout: React.FC = () => {
  const [activePage, setActivePage] = useState('sample-selection');

  const renderContent = () => {
    switch (activePage) {
      case 'sample-selection':
        return <SampleSelectionPage />;
      case 'sample-analysis':
        return <SampleAnalysisPage />;
      case 'quality-dashboard':
        return <QualityDashboardPageInline />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-muted-foreground mb-2">
                Página não encontrada
              </h2>
              <p className="text-muted-foreground">
                A página solicitada não foi implementada ainda.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <SampleProvider>
      <div className="flex flex-col h-screen bg-background">
        {/* Header Principal */}
        <Header />
        
        {/* Conteúdo com Sidebar */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="flex-shrink-0">
            <Sidebar activePage={activePage} onPageChange={setActivePage} />
          </div>
          
          {/* Área de conteúdo principal */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full overflow-auto">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </SampleProvider>
  );
};

export default MainLayout;
