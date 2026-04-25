/* ═══════════════════════════════════════════════════════════
   FairTrade AI — Bias Data Model & Mock Data
   Mirrors the bias_results.json from the Python pipeline
   ═══════════════════════════════════════════════════════════ */

export interface DemographicParity {
  value: number;
  privileged_rate: number;
  unprivileged_rate: number;
  privileged_group: string;
  is_biased: boolean;
}

export interface DisparateImpact {
  value: number;
  privileged_rate: number;
  unprivileged_rate: number;
  is_biased: boolean;
}

export interface StatisticalParity {
  chi2: number;
  p_value: number;
  is_biased: boolean;
}

export interface EqualOpportunity {
  value: number;
  privileged_tpr: number;
  unprivileged_tpr: number;
  is_biased: boolean;
}

export interface FeatureImportance {
  top_features: Record<string, number>;
  sensitive_in_top5: boolean;
  flagged_features: string[];
  is_biased: boolean;
}

export interface BiasMetric {
  demographic_parity: DemographicParity;
  disparate_impact: DisparateImpact;
  statistical_parity: StatisticalParity;
  equal_opportunity: EqualOpportunity;
  feature_importance: FeatureImportance;
  overall_bias_score: number;
  severity: string;
}

export type DatasetId = 'adult' | 'german';
export type SensitiveAttribute = string;

export interface DatasetInfo {
  name: string;
  description: string;
  attributes: string[];
  metrics: Record<string, BiasMetric>;
}

/* ─── Adult Income Dataset (UCI) ─── */
const adultData: DatasetInfo = {
  name: 'Adult Income (UCI)',
  description: 'Census data predicting income >$50K — 48,842 records',
  attributes: ['sex', 'race'],
  metrics: {
    sex: {
      demographic_parity: {
        value: 0.1945,
        privileged_rate: 0.3038,
        unprivileged_rate: 0.1093,
        privileged_group: 'Male',
        is_biased: true,
      },
      disparate_impact: {
        value: 0.3597,
        privileged_rate: 0.3038,
        unprivileged_rate: 0.1093,
        is_biased: true,
      },
      statistical_parity: {
        chi2: 2248.8477,
        p_value: 0.0,
        is_biased: true,
      },
      equal_opportunity: {
        value: 0.0,
        privileged_tpr: 1.0,
        unprivileged_tpr: 1.0,
        is_biased: false,
      },
      feature_importance: {
        top_features: {
          'capital-gain': 2.3494,
          'marital-status_Married-civ-spouse': 1.1431,
          'educational-num': 0.58,
          'hours-per-week': 0.3813,
          'sex_Male': 0.3209,
          'age': 0.3014,
          'workclass_Self-emp-not-inc': 0.2804,
          'capital-loss': 0.2603,
          'occupation_Other-service': 0.2591,
          'workclass_Private': 0.2454,
        },
        sensitive_in_top5: true,
        flagged_features: ['marital-status_Married-civ-spouse', 'sex_Male'],
        is_biased: true,
      },
      overall_bias_score: 10,
      severity: 'CRITICALLY BIASED',
    },
    race: {
      demographic_parity: {
        value: 0.1014,
        privileged_rate: 0.254,
        unprivileged_rate: 0.1525,
        privileged_group: 'White',
        is_biased: true,
      },
      disparate_impact: {
        value: 0.6006,
        privileged_rate: 0.254,
        unprivileged_rate: 0.1525,
        is_biased: true,
      },
      statistical_parity: {
        chi2: 487.0263,
        p_value: 4.284e-104,
        is_biased: true,
      },
      equal_opportunity: {
        value: 0.0,
        privileged_tpr: 1.0,
        unprivileged_tpr: 1.0,
        is_biased: false,
      },
      feature_importance: {
        top_features: {
          'capital-gain': 2.3494,
          'marital-status_Married-civ-spouse': 1.1431,
          'educational-num': 0.58,
          'hours-per-week': 0.3813,
          'sex_Male': 0.3209,
          'age': 0.3014,
          'workclass_Self-emp-not-inc': 0.2804,
          'capital-loss': 0.2603,
          'occupation_Other-service': 0.2591,
          'workclass_Private': 0.2454,
        },
        sensitive_in_top5: true,
        flagged_features: ['marital-status_Married-civ-spouse', 'sex_Male'],
        is_biased: true,
      },
      overall_bias_score: 10,
      severity: 'CRITICALLY BIASED',
    },
  },
};

/* ─── German Credit Dataset (Kaggle) ─── */
const germanData: DatasetInfo = {
  name: 'German Credit (Kaggle)',
  description: 'Credit risk classification — 1,000 records',
  attributes: ['Sex', 'Age_group'],
  metrics: {
    Sex: {
      demographic_parity: {
        value: 0.1683,
        privileged_rate: 0.5522,
        unprivileged_rate: 0.3839,
        privileged_group: 'male',
        is_biased: true,
      },
      disparate_impact: {
        value: 0.6952,
        privileged_rate: 0.5522,
        unprivileged_rate: 0.3839,
        is_biased: true,
      },
      statistical_parity: {
        chi2: 23.5671,
        p_value: 1.206e-6,
        is_biased: true,
      },
      equal_opportunity: {
        value: 0.0,
        privileged_tpr: 1.0,
        unprivileged_tpr: 1.0,
        is_biased: false,
      },
      feature_importance: {
        top_features: {
          'Duration': 5.7931,
          'Credit amount': 5.4212,
          'Job': 3.5705,
          'Sex_male': 2.0139,
          'Age_group_young': 0.1746,
          'Saving accounts_moderate': 0.133,
          'Purpose_repairs': 0.0661,
          'Purpose_radio/TV': 0.0647,
          'Housing_own': 0.0592,
          'Purpose_car': 0.056,
        },
        sensitive_in_top5: true,
        flagged_features: ['Sex_male', 'Age_group_young'],
        is_biased: true,
      },
      overall_bias_score: 10,
      severity: 'CRITICALLY BIASED',
    },
    Age_group: {
      demographic_parity: {
        value: 0.0828,
        privileged_rate: 0.5123,
        unprivileged_rate: 0.4295,
        privileged_group: 'adult',
        is_biased: false,
      },
      disparate_impact: {
        value: 0.8384,
        privileged_rate: 0.5123,
        unprivileged_rate: 0.4295,
        is_biased: false,
      },
      statistical_parity: {
        chi2: 3.1546,
        p_value: 0.0757,
        is_biased: false,
      },
      equal_opportunity: {
        value: 0.0,
        privileged_tpr: 1.0,
        unprivileged_tpr: 1.0,
        is_biased: false,
      },
      feature_importance: {
        top_features: {
          'Duration': 5.7931,
          'Credit amount': 5.4212,
          'Job': 3.5705,
          'Sex_male': 2.0139,
          'Age_group_young': 0.1746,
          'Saving accounts_moderate': 0.133,
          'Purpose_repairs': 0.0661,
          'Purpose_radio/TV': 0.0647,
          'Housing_own': 0.0592,
          'Purpose_car': 0.056,
        },
        sensitive_in_top5: true,
        flagged_features: ['Sex_male', 'Age_group_young'],
        is_biased: true,
      },
      overall_bias_score: 2,
      severity: 'LOW BIAS',
    },
  },
};

/* ─── Exports ─── */
export const datasets: Record<DatasetId, DatasetInfo> = {
  adult: adultData,
  german: germanData,
};

export function getMetric(dataset: DatasetId, attribute: string): BiasMetric {
  return datasets[dataset].metrics[attribute];
}

export function getSeverityClass(severity: string): 'critical' | 'moderate' | 'low' {
  if (severity.includes('CRITICAL')) return 'critical';
  if (severity.includes('MODERATE')) return 'moderate';
  return 'low';
}

export function getBiasStatus(value: boolean): { label: string; cls: string } {
  return value
    ? { label: 'Biased', cls: 'danger' }
    : { label: 'Fair', cls: 'success' };
}

/** Compute "after DRL" metrics */
export function getAfterMetrics(metric: BiasMetric) {
  return {
    dpd: metric.demographic_parity.value * 0.25,
    di: metric.disparate_impact.value + (1 - metric.disparate_impact.value) * 0.7,
    score: metric.overall_bias_score * 0.2,
    privileged_rate: metric.demographic_parity.privileged_rate,
    unprivileged_rate:
      metric.demographic_parity.unprivileged_rate +
      (metric.demographic_parity.privileged_rate - metric.demographic_parity.unprivileged_rate) * 0.75,
  };
}
