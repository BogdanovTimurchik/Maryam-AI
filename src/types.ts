/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'uz' | 'ru' | 'en';

export type Modality = 'xray' | 'ct' | 'mri';

export interface ScanPreset {
  id: string;
  title: {
    uz: string;
    ru: string;
    en: string;
  };
  subtitle: {
    uz: string;
    ru: string;
    en: string;
  };
  type: Modality;
  sampleFileLabel: string;
  defaultReport: {
    uz: {
      findings: string;
      clinicalConclusion: string;
      recommendations: string;
      classification: string;
    };
    ru: {
      findings: string;
      clinicalConclusion: string;
      recommendations: string;
      classification: string;
    };
    en: {
      findings: string;
      clinicalConclusion: string;
      recommendations: string;
      classification: string;
    };
  };
  anomalies: Array<{
    id: string;
    label: { uz: string; ru: string; en: string };
    x: number; // percentage from left
    y: number; // percentage from top
    r: number; // radius
    severity: 'critical' | 'warning' | 'normal';
    description: { uz: string; ru: string; en: string };
  }>;
}

export interface AIAnalysisResponse {
  success: boolean;
  model: string;
  timestamp: string;
  report: {
    findings: string;
    clinicalConclusion: string;
    recommendations: string;
    confidence: number;
    patientStatus: 'critical' | 'warning' | 'normal';
    annotatedRegions: Array<{
      label: string;
      description: string;
      x: number;
      y: number;
      r: number;
      severity: 'critical' | 'warning' | 'normal';
    }>;
  };
}

export interface HospitalStats {
  id: string;
  name: { uz: string; ru: string; en: string };
  city: { uz: string; ru: string; en: string };
  integratedPACS: boolean;
  monthlyScans: number;
  lastActive: string;
}

export interface UzbekistanRegionData {
  id: string;
  name: { uz: string; ru: string; en: string };
  center: { uz: string; ru: string; en: string };
  hospitalsCount: number;
  activeScansToday: number;
  aiAccuracy: number; // e.g. 98.4
  stats: HospitalStats[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface DicomFilterSettings {
  brightness: number; // 0 to 200
  contrast: number;   // 0 to 200
  invert: boolean;
  sharpness: boolean;
  zoom: number;       // 1 to 3
  panX: number;
  panY: number;
}
