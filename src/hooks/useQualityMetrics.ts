import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Tipos para os dados de qualidade
export interface QualityMetrics {
  totalContracts: number;
  inconsistencyRate: number;
  criticalContracts: number;
  averageResolutionTime: number;
  totalFinancialExposure: number;
  projectedPenalties: number;
  contractsExpiring30Days: number;
  contractsExpiring60Days: number;
  contractsExpiring90Days: number;
  autoRenewedContracts: number;
  highRiskContracts: number;
  highRiskPercentage: number;
}

export interface InconsistencyByType {
  type: string;
  count: number;
  percentage: number;
}

export interface InconsistencyByArea {
  area: string;
  count: number;
  percentage: number;
}

export interface SupplierRanking {
  supplier: string;
  inconsistencies: number;
  riskScore: number;
  totalValue: number;
}

export interface ContractRisk {
  contractType: string;
  riskLevel: string;
  count: number;
  financialImpact: number;
}

// Hook principal para métricas de qualidade
export const useQualityMetrics = () => {
  return useQuery({
    queryKey: ['quality-metrics'],
    queryFn: async (): Promise<QualityMetrics> => {
      // Buscar todos os contratos
      const { data: contracts, error } = await supabase
        .from('contratos_vivo')
        .select('*');

      if (error) throw error;
      if (!contracts) throw new Error('Nenhum contrato encontrado');

      const totalContracts = contracts.length;
      const today = new Date();
      
      // Calcular contratos com inconsistências (baseado em campos obrigatórios faltantes ou status crítico)
      const contractsWithInconsistencies = contracts.filter(contract => 
        !contract.area_solicitante || 
        !contract.tipo_alerta ||
        contract.risco === 'ALTO' ||
        contract.status === 'CRÍTICO' ||
        contract.tipo_alerta === 'CRÍTICO'
      );

      // Contratos críticos (alto risco financeiro/legal)
      const criticalContracts = contracts.filter(contract => 
        contract.risco === 'ALTO' || 
        contract.tipo_alerta === 'CRÍTICO' ||
        contract.status === 'CRÍTICO'
      ).length;

      // Calcular exposição financeira
      const totalFinancialExposure = contracts
        .filter(contract => contract.risco === 'ALTO')
        .reduce((sum, contract) => sum + (contract.valor_contrato || 0), 0);

      // Projeção de multas (baseado no campo multa)
      const projectedPenalties = contracts
        .reduce((sum, contract) => sum + (contract.multa || 0), 0);

      // Contratos vencendo em diferentes períodos
      const contractsExpiring30Days = contracts.filter(contract => {
        const expiryDate = new Date(contract.data_vencimento);
        const daysDifference = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
        return daysDifference <= 30 && daysDifference > 0;
      }).length;

      const contractsExpiring60Days = contracts.filter(contract => {
        const expiryDate = new Date(contract.data_vencimento);
        const daysDifference = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
        return daysDifference <= 60 && daysDifference > 30;
      }).length;

      const contractsExpiring90Days = contracts.filter(contract => {
        const expiryDate = new Date(contract.data_vencimento);
        const daysDifference = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
        return daysDifference <= 90 && daysDifference > 60;
      }).length;

      // Contratos renovados automaticamente (estimativa baseada em contratos sem revisão recente)
      const autoRenewedContracts = contracts.filter(contract => 
        contract.status === 'RENOVADO' && !contract.data_assinatura
      ).length;

      // Contratos de alto risco
      const highRiskContracts = contracts.filter(contract => 
        contract.risco === 'ALTO'
      ).length;

      return {
        totalContracts,
        inconsistencyRate: (contractsWithInconsistencies.length / totalContracts) * 100,
        criticalContracts,
        averageResolutionTime: 15, // Mock - implementar lógica real baseada em histórico
        totalFinancialExposure,
        projectedPenalties,
        contractsExpiring30Days,
        contractsExpiring60Days,
        contractsExpiring90Days,
        autoRenewedContracts,
        highRiskContracts,
        highRiskPercentage: (highRiskContracts / totalContracts) * 100,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para distribuição de inconsistências por tipo
export const useInconsistencyDistribution = () => {
  return useQuery({
    queryKey: ['inconsistency-distribution'],
    queryFn: async () => {
      const { data: contracts, error } = await supabase
        .from('contratos_vivo')
        .select('*');

      if (error) throw error;
      if (!contracts) return { byType: [], byArea: [] };

      const totalContracts = contracts.length;

      // Distribuição por tipo de inconsistência
      const typeDistribution: { [key: string]: number } = {
        'Prazo': 0,
        'Multa': 0,
        'Valor': 0,
        'Fornecedor': 0,
        'Cláusula Ausente': 0,
      };

      contracts.forEach(contract => {
        // Verificar diferentes tipos de inconsistências
        if (!contract.data_vencimento || new Date(contract.data_vencimento) < new Date()) {
          typeDistribution['Prazo']++;
        }
        if (!contract.multa && contract.risco === 'ALTO') {
          typeDistribution['Multa']++;
        }
        if (!contract.valor_contrato || contract.valor_contrato <= 0) {
          typeDistribution['Valor']++;
        }
        if (!contract.fornecedor) {
          typeDistribution['Fornecedor']++;
        }
        if (!contract.area_solicitante || !contract.tipo_alerta) {
          typeDistribution['Cláusula Ausente']++;
        }
      });

      const byType: InconsistencyByType[] = Object.entries(typeDistribution).map(([type, count]) => ({
        type,
        count,
        percentage: (count / totalContracts) * 100,
      }));

      // Distribuição por área solicitante
      const areaDistribution: { [key: string]: number } = {};
      contracts.forEach(contract => {
        if (contract.area_solicitante && (
          !contract.tipo_alerta || 
          contract.risco === 'ALTO' ||
          contract.status === 'CRÍTICO'
        )) {
          areaDistribution[contract.area_solicitante] = (areaDistribution[contract.area_solicitante] || 0) + 1;
        }
      });

      const byArea: InconsistencyByArea[] = Object.entries(areaDistribution).map(([area, count]) => ({
        area,
        count,
        percentage: (count / totalContracts) * 100,
      }));

      return { byType, byArea };
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para ranking de fornecedores mais problemáticos
export const useSupplierRanking = () => {
  return useQuery({
    queryKey: ['supplier-ranking'],
    queryFn: async (): Promise<SupplierRanking[]> => {
      const { data: contracts, error } = await supabase
        .from('contratos_vivo')
        .select('*');

      if (error) throw error;
      if (!contracts) return [];

      const supplierStats: { [key: string]: { inconsistencies: number; totalValue: number; riskScore: number } } = {};

      contracts.forEach(contract => {
        if (contract.fornecedor) {
          if (!supplierStats[contract.fornecedor]) {
            supplierStats[contract.fornecedor] = { inconsistencies: 0, totalValue: 0, riskScore: 0 };
          }

          // Contar inconsistências
          let inconsistencies = 0;
          if (!contract.tipo_alerta) inconsistencies++;
          if (contract.risco === 'ALTO') inconsistencies += 2;
          if (contract.status === 'CRÍTICO') inconsistencies += 2;
          if (!contract.area_solicitante) inconsistencies++;

          supplierStats[contract.fornecedor].inconsistencies += inconsistencies;
          supplierStats[contract.fornecedor].totalValue += contract.valor_contrato || 0;
          supplierStats[contract.fornecedor].riskScore += inconsistencies * (contract.valor_contrato || 0) / 1000000; // Peso baseado no valor
        }
      });

      return Object.entries(supplierStats)
        .map(([supplier, stats]) => ({
          supplier,
          inconsistencies: stats.inconsistencies,
          riskScore: stats.riskScore,
          totalValue: stats.totalValue,
        }))
        .sort((a, b) => b.riskScore - a.riskScore)
        .slice(0, 10); // Top 10
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Hook para análise de risco por tipo de contrato
export const useContractRiskAnalysis = () => {
  return useQuery({
    queryKey: ['contract-risk-analysis'],
    queryFn: async (): Promise<ContractRisk[]> => {
      const { data: contracts, error } = await supabase
        .from('contratos_vivo')
        .select('*');

      if (error) throw error;
      if (!contracts) return [];

      const riskAnalysis: { [key: string]: { [risk: string]: { count: number; financialImpact: number } } } = {};

      contracts.forEach(contract => {
        const contractType = contract.tipo_contrato || 'Não Definido';
        const riskLevel = contract.risco || 'BAIXO';

        if (!riskAnalysis[contractType]) {
          riskAnalysis[contractType] = {};
        }
        if (!riskAnalysis[contractType][riskLevel]) {
          riskAnalysis[contractType][riskLevel] = { count: 0, financialImpact: 0 };
        }

        riskAnalysis[contractType][riskLevel].count++;
        riskAnalysis[contractType][riskLevel].financialImpact += contract.valor_contrato || 0;
      });

      const result: ContractRisk[] = [];
      Object.entries(riskAnalysis).forEach(([contractType, risks]) => {
        Object.entries(risks).forEach(([riskLevel, data]) => {
          result.push({
            contractType,
            riskLevel,
            count: data.count,
            financialImpact: data.financialImpact,
          });
        });
      });

      return result.sort((a, b) => b.financialImpact - a.financialImpact);
    },
    staleTime: 5 * 60 * 1000,
  });
};