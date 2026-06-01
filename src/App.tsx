/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HeartPulse, BrainCircuit, Activity, BarChart3, Database, 
  Languages, FileText, Download, ShieldAlert, CheckCircle, 
  AlertTriangle, ArrowRight, Printer, Star
} from 'lucide-react';
import DICOMViewer from './components/DICOMViewer';
import AIAssistantChat from './components/AIAssistantChat';
import AnalyticsPanel from './components/AnalyticsPanel';
import ClinicIntegration from './components/ClinicIntegration';
import { Language } from './types';

export default function App() {
  const [language, setLanguage] = useState<Language>('ru'); // default to Russian as standard medical standard in UZ
  const [activeTab, setActiveTab] = useState<'viewer' | 'chat' | 'analytics' | 'integration'>('viewer');
  
  // Storage for the last analyzed diagnostic result
  const [latestReport, setLatestReport] = useState<any | null>(null);
  const [activePresetId, setActivePresetId] = useState<string>('chest_pnevmonia');

  // Multi-lingual Translation map
  const t = {
    title: {
      uz: "Maryam AI",
      ru: "Maryam AI",
      en: "Maryam AI"
    },
    tagline: {
      uz: "Avtomatlashtirilgan tibbiy tahlillar neyrotarmog'i",
      ru: "ИИ-платформа автоматического анализа медицинских снимков",
      en: "Automated Clinical Medical Imaging AI Platform"
    },
    navViewer: {
      uz: "Radiologiya PACS",
      ru: "Рабочая станция PACS",
      en: "Radiology PACS Station"
    },
    navChat: {
      uz: "ИИ maslahat",
      ru: "Консультации ИИ",
      en: "Clinical AI Consult"
    },
    navAnalytics: {
      uz: "Klinikalar va Statistika",
      ru: "Интегрированные клиники",
      en: "Hospital Metrics"
    },
    navIntegration: {
      uz: "PACS Integratsiya",
      ru: "Интеграция PACS",
      en: "PACS Integration Node"
    },
    diagnosesCard: {
      uz: "Tahlil natijalari (Protokol)",
      ru: "Клинический протокол исследования ИИ",
      en: "AI Diagnostic Clinical Report"
    },
    noAnalysisYet: {
      uz: "Skaner tugmasini bosing yoki shablonni tanlab, 'Neyrotarmoq tahlili'ni ishga tushiring.",
      ru: "Снимок не проанализирован. Нажмите кнопку выше для запуска ИИ-анализа.",
      en: "No active analysis. Select a preset scan or upload a file and run the analysis trigger."
    },
    findingsLabel: {
      uz: "Lokal topilmalar tavsifi (Findings):",
      ru: "Протокол описания (Findings):",
      en: "Clinical Findings Protocol:"
    },
    conclusionLabel: {
      uz: "Xulosa (Clinical Conclusion):",
      ru: "Заключение (Clinical Conclusion):",
      en: "Diagnostic Conclusion:"
    },
    recsLabel: {
      uz: "Tavsiyalar (Recommendations):",
      ru: "Рекомендации (Recommendations):",
      en: "Subsequent Staging Recommendations:"
    },
    confidenceLabel: {
      uz: "Neyrotarmoq ishonchlik darajasi:",
      ru: "Коэффициент уверенности ИИ:",
      en: "AI Structural Confidence:"
    },
    statusLabel: {
      uz: "Holat darajasi:",
      ru: "Категория тяжести:",
      en: "Severity index:"
    },
    printBtn: {
      uz: "Protokolni chop etish",
      ru: "Распечатать протокол",
      en: "Print Medical Report"
    },
    disclaimer: {
      uz: "DIQQAT: Ushu tahlil hujjati Maryam AI assistenti yordamida shakllantirilgan. Yakuniy tashxis shifokor mutaxassis tomonidan tasdiqlanishi shart.",
      ru: "ВНИМАНИЕ: Данный протокол лучевой диагностики сформирован нейросетью Maryam AI и носит характер клинического ассистента. Диагноз должен быть верифицирован врачом.",
      en: "NOTICE: This radiological assessment protocol is generated with support of Maryam AI clinical copilot. Final triage decision must be validated by a board-certified physician."
    }
  };

  const handleAnalysisResult = (resultData: any) => {
    if (resultData && resultData.success) {
      setLatestReport(resultData.report);
    } else {
      setLatestReport(null);
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-800">
      
      {/* 1. Main Professional Header Panel */}
      <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-50 px-4 sm:px-6 py-3.5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo Brand Identity with Local context */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('viewer')}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/10">
              <BrainCircuit className="text-white" size={22} strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  {t.title[language]}
                </h1>
                <span className="bg-slate-100 border border-slate-200 font-mono text-[9px] px-2 py-0.5 rounded text-emerald-600 font-bold uppercase tracking-widest leading-none">
                  maryam-med.uz
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-semibold">
                {t.tagline[language]}
              </p>
            </div>
          </div>

          {/* Quick Stats overview or Navigation shortcuts */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            
            {/* Multi-language Selector */}
            <div className="bg-slate-100 border border-slate-200/80 rounded-lg p-1 flex items-center space-x-0.5 shadow-xs">
              <Languages size={14} className="text-slate-500 mx-2" />
              <button 
                id="lang-selector-uz"
                onClick={() => setLanguage('uz')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${language === 'uz' ? 'bg-emerald-500 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                O'zbek
              </button>
              <button
                id="lang-selector-ru" 
                onClick={() => setLanguage('ru')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${language === 'ru' ? 'bg-emerald-500 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Русский
              </button>
              <button 
                id="lang-selector-en"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${language === 'en' ? 'bg-emerald-500 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
              >
                EN
              </button>
            </div>

          </div>

        </div>
      </header>

      {/* 2. Primary Navigation Bar */}
      <nav className="bg-white border-b border-slate-200/60 py-2 px-4 sm:px-6 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-2 text-xs font-mono uppercase tracking-wider">
          <button
            id="tab-pacs-viewer"
            onClick={() => setActiveTab('viewer')}
            className={`px-4 py-2 rounded-lg border transition duration-150 flex items-center space-x-2 cursor-pointer ${
              activeTab === 'viewer'
                ? 'bg-emerald-50 border-emerald-500/20 text-emerald-700 font-bold'
                : 'bg-transparent border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Activity size={14} />
            <span>{t.navViewer[language]}</span>
          </button>

          <button
            id="tab-ai-consult"
            onClick={() => setActiveTab('chat')}
            className={`px-4 py-2 rounded-lg border transition duration-150 flex items-center space-x-2 cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-indigo-50 border-indigo-500/20 text-indigo-700 font-bold'
                : 'bg-transparent border-transparent text-slate-500 hover:text-slate-200 hover:bg-slate-50'
            }`}
          >
            <BrainCircuit size={14} />
            <span>{t.navChat[language]}</span>
          </button>

          <button
            id="tab-region-analytics"
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg border transition duration-150 flex items-center space-x-2 cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-slate-100 border-slate-300 text-slate-800 font-bold'
                : 'bg-transparent border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <BarChart3 size={14} />
            <span>{t.navAnalytics[language]}</span>
          </button>

          <button
            id="tab-PACS-integration"
            onClick={() => setActiveTab('integration')}
            className={`px-4 py-2 rounded-lg border transition duration-150 flex items-center space-x-2 cursor-pointer ${
              activeTab === 'integration'
                ? 'bg-slate-100 border-slate-300 text-slate-800 font-bold'
                : 'bg-transparent border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Database size={14} />
            <span>{t.navIntegration[language]}</span>
          </button>
        </div>
      </nav>

      {/* 3. Primary Workspace Area */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 print:p-0">
        <div className="space-y-6">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}
            >
              {activeTab === 'viewer' && (
                <div id="pacs-viewer-view" className="space-y-6">
                  
                  {/* Embedded Radiology Workspace */}
                  <DICOMViewer 
                    language={language}
                    onAnalysisResult={handleAnalysisResult}
                    activePresetId={activePresetId}
                    onPresetSelect={setActivePresetId}
                  />

                  {/* Generated Clinical Diagnostic Report Output */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 print:bg-white print:text-black print:border-none print:shadow-none shadow-sm relative overflow-hidden">
                    
                    {/* Visual aesthetic corner markings */}
                    <div className="absolute top-0 right-0 h-20 w-20 bg-emerald-500/5 rounded-bl-full rotate-90 border-r border-t border-slate-100 pointer-events-none"></div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4 print:border-black">
                      <div>
                        <h2 className="text-lg font-bold text-slate-950 flex items-center space-x-2 print:text-black">
                          <FileText size={18} className="text-emerald-500" />
                          <span>{t.diagnosesCard[language]}</span>
                        </h2>
                        <p className="text-xs text-slate-500 mt-1 print:text-gray-500">
                          {language === 'uz' ? "Maryam AI diagnostika markazidan rasmiy klinik qaydnoma" : "Официальный ИИ-протокол исследования Maryam AI"}
                        </p>
                      </div>

                      {latestReport && (
                        <button
                          id="btn-print"
                          onClick={handlePrintReport}
                          className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center space-x-2 cursor-pointer transition print:hidden"
                        >
                          <Printer size={14} />
                          <span>{t.printBtn[language]}</span>
                        </button>
                      )}
                    </div>

                    {latestReport ? (
                      <div className="space-y-6 font-sans">
                        
                        {/* Upper clinical header telemetry */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 border border-slate-200 p-4 rounded-xl print:border-black print:bg-gray-100">
                          <div>
                            <span className="text-[10px] font-semibold font-mono uppercase text-slate-500 block">{t.statusLabel[language]}</span>
                            <span className={`inline-flex items-center space-x-1.5 text-xs font-bold font-mono uppercase mt-1 ${
                              latestReport.patientStatus === 'critical' ? 'text-red-600' : latestReport.patientStatus === 'warning' ? 'text-amber-600' : 'text-emerald-600'
                            }`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${
                                latestReport.patientStatus === 'critical' ? 'bg-red-500 animate-pulse' : latestReport.patientStatus === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}></span>
                              <span>{latestReport.patientStatus.toUpperCase()}</span>
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] font-semibold font-mono uppercase text-slate-500 block">{t.confidenceLabel[language]}</span>
                            <span className="text-sm font-bold font-mono text-emerald-600 block mt-1">
                              {latestReport.confidence}% ACCURACY INDEX
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] font-semibold font-mono uppercase text-slate-500 block">PACS DICOM CALIB_ID:</span>
                            <span className="text-xs font-semibold font-mono text-slate-700 block mt-1">
                              MR-NODE-891-{activePresetId.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        {/* Analysis findings block */}
                        <div className="space-y-2.5">
                          <h4 className="font-bold text-slate-900 uppercase tracking-wider font-mono text-xs border-l-2 border-emerald-500 pl-3 print:text-black">
                            {t.findingsLabel[language]}
                          </h4>
                          <p className="text-sm text-slate-700 leading-relaxed font-sans whitespace-pre-wrap pl-3.5 print:text-black">
                            {latestReport.findings}
                          </p>
                        </div>

                        {/* Clinical conclusion block */}
                        <div className="space-y-2.5">
                          <h4 className="font-bold text-slate-900 uppercase tracking-wider font-mono text-xs border-l-2 border-amber-500 pl-3 print:text-black">
                            {t.conclusionLabel[language]}
                          </h4>
                          <div className="bg-amber-50 border border-amber-200/50 px-4 py-3 rounded-lg pl-3 print:border-black print:bg-gray-100">
                            <p className="text-sm text-amber-900 block font-bold leading-relaxed print:text-black">
                              {latestReport.clinicalConclusion}
                            </p>
                          </div>
                        </div>

                        {/* Subsequent recommendations guidelines */}
                        <div className="space-y-2.5">
                          <h4 className="font-bold text-slate-900 uppercase tracking-wider font-mono text-xs border-l-2 border-cyan-500 pl-3 print:text-black">
                            {t.recsLabel[language]}
                          </h4>
                          <p className="text-sm text-slate-700 leading-relaxed font-sans whitespace-pre-wrap pl-3.5 print:text-black">
                            {latestReport.recommendations}
                          </p>
                        </div>

                        {/* Legal Medical Disclaimer */}
                        <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-3.5 text-slate-700 print:bg-gray-100 print:text-black print:border-black">
                          <ShieldAlert className="text-red-500 shrink-0 mt-0.5" size={16} />
                          <p className="text-[11px] leading-relaxed font-sans font-medium text-slate-600 print:text-black">
                            {t.disclaimer[language]}
                          </p>
                        </div>

                      </div>
                    ) : (
                      <div className="py-12 border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center space-y-3 bg-slate-50/50">
                        <Activity className="text-slate-400 animate-pulse" size={32} />
                        <p className="text-sm text-slate-500 font-mono max-w-sm">
                          {t.noAnalysisYet[language]}
                        </p>
                      </div>
                    )}

                  </div>
                </div>
              )}

              {activeTab === 'chat' && (
                <div id="ai-consult-view">
                  <AIAssistantChat language={language} />
                </div>
              )}

              {activeTab === 'analytics' && (
                <div id="hospital-metrics-view">
                  <AnalyticsPanel language={language} />
                </div>
              )}

              {activeTab === 'integration' && (
                <div id="pacs-integration-view">
                  <ClinicIntegration language={language} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>

        </div>
      </main>

      {/* 4. Elegant Footer */}
      <footer className="border-t border-slate-200 bg-white px-4 sm:px-6 py-5 mt-12 text-slate-500 text-xs font-mono print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div>
            <span>© 2026 Maryam AI (maryam-med.uz). {language === 'uz' ? 'Barcha huquqlar himoyalangan.' : 'Все права защищены.'}</span>
          </div>

          <div className="flex space-x-4">
            <span className="text-slate-500 hover:text-slate-600 flex items-center">
              <Star size={12} className="text-emerald-500 mr-1" fill="currentColor" />
              <span>Created for clinics of Uzbekistan</span>
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
