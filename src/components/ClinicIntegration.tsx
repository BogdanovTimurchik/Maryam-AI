/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Terminal, Shield, Cpu, HelpCircle, Check, Copy, Settings, HardDrive, CheckCircle } from 'lucide-react';
import { Language } from '../types';

interface ClinicIntegrationProps {
  language: Language;
}

export default function ClinicIntegration({ language }: ClinicIntegrationProps) {
  const [copiedTextId, setCopiedTextId] = useState<string | null>(null);
  const [testIp, setTestIp] = useState('192.168.1.104');
  const [testAe, setTestAe] = useState('MARYAM_PACS_GATE');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'failed' | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTextId(id);
    setTimeout(() => setCopiedTextId(null), 2500);
  };

  const testConnection = () => {
    setIsTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setIsTesting(false);
      setTestResult('success');
    }, 1800);
  };

  const dcmRouterConfig = `{
  "routing": [
    {
      "source_ae": "*",
      "destination_ae": "MARYAM_PACS_GATE",
      "host": "maryam-med.uz",
      "port": 11112,
      "transfer_syntax": "1.2.840.10008.1.2.4.70",
      "compress": true,
      "forward_hl7_report": true
    }
  ]
}`;

  return (
    <div className="space-y-6">
      
      {/* Informative Intro banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-8 space-y-2">
          <h3 className="font-bold text-slate-900 text-lg flex items-center space-x-2">
            <Cpu size={20} className="text-emerald-600" />
            <span>
              {language === 'uz' ? 'PACS va HL7 Avtomatlashtirilgan Integratsiyasi' : 'Интеграция с локальными сетями PACS'}
            </span>
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed font-sans font-medium">
            {language === 'uz'
              ? "Maryam AI sizning shifoxonangizdagi har qanday PACS (Picture Archiving and Communication System) tizimi, KT/MRT apparati hamda elektron tibbiy kartalar (HL7 / EMR) bilan to'liq DICOM routers orqali bog'lana oladi. Tahlillar shifokor jalb etilmasdan avtomatik amalga oshadi."
              : "Maryam AI бесшовно встраивается в ИТ-инфраструктуру клиник Узбекистана через защищенные соединения DICOM C-STORE. Поступающие снимки с томографов автоматически анализируются искусственным интеллектом, возвращая отчет прямо в медицинскую карту пациента."}
          </p>
        </div>

        <div className="md:col-span-4 flex justify-end">
          <div className="bg-white border border-slate-200 p-4 rounded-xl text-center space-y-1.5 w-full md:max-w-[240px] shadow-sm">
            <Settings size={28} className="text-emerald-600 mx-auto animate-spin" />
            <div className="text-xs font-mono text-slate-500 font-bold">PACS ROUTER PROT:</div>
            <div className="text-emerald-700 font-extrabold font-mono text-sm">DICOM C-STORE</div>
          </div>
        </div>
      </div>

      {/* Grid of interactive setup testing & code display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 1. Technical specification guide (7-cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
            <h4 className="font-bold text-slate-900 text-sm mb-4 border-b border-slate-100 pb-2">
              {language === 'uz' ? 'Serverga ulanish sozlamalari (AETs)' : 'Конфигурация DICOM Нод'}
            </h4>
            
            <div className="space-y-4 text-xs font-sans">
              <p className="text-slate-600 leading-relaxed text-sm font-medium">
                {language === 'uz'
                  ? "TTA, RShTYoIM kabi o'tish kanallari quyidagi doimiy parametrlarni o'z PACS boshqaruviga sozlashi lozim:"
                  : "Для автоматической отправки снимков со стандартных DICOM-серверов в клинике, настройте отправку на следующие параметры (AET Node):"}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg">
                  <span className="text-slate-400 block text-[10px] font-bold">AE TITLE (SENDER):</span>
                  <span className="text-slate-800 block text-xs font-extrabold mt-1">ANY_HOSPITAL_SCP</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg">
                  <span className="text-slate-400 block text-[10px] font-bold">AE TITLE (RECEIVE / MARYAM):</span>
                  <span className="text-slate-805 block text-xs font-extrabold mt-1">{testAe}</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg">
                  <span className="text-slate-400 block text-[10px] font-bold">HOST / SECURE COMPLEMENT:</span>
                  <span className="text-emerald-700 block text-xs font-bold mt-1">maryam-med.uz</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg">
                  <span className="text-slate-400 block text-[10px] font-bold">PORT (NATIVE DICOM):</span>
                  <span className="text-slate-800 block text-xs font-bold mt-1">11112</span>
                </div>
              </div>

              {/* Encryption Notice */}
              <div className="p-3.5 bg-indigo-50 border border-indigo-105 rounded-xl flex items-start space-x-3 text-slate-700 font-medium">
                <Shield className="text-indigo-600 shrink-0 mt-0.5" size={16} />
                <div className="space-y-1">
                  <span className="font-bold text-[11px] font-mono uppercase text-indigo-700 block">
                    {language === 'uz' ? 'Qatʻiy shifrlanish (TLS 1.3)' : 'Сквозное шифрование и конфиденциальность'}
                  </span>
                  <p className="text-[11px] leading-relaxed">
                    {language === 'uz'
                      ? "PACS orqali uzatiladigan bemor shaxsiy ma'lumotlari mahalliy routerda o'chiriladi (anonymized) va serverga faqat tahlil kodi hamda anatomik piksellar yetkaziladi."
                      : "Перед передачей на анализ все снимки деперсонализируются (анонимизируются) локально на шлюзе клиники согласно стандартам защиты персональных данных."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Code Configuration Box (dcm4chee or orthanc config samples) */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex justify-between items-center">
              <span className="font-mono text-xs text-slate-700 flex items-center space-x-2 font-bold">
                <Terminal size={14} className="text-emerald-600" />
                <span>pacs_router_routing.json</span>
              </span>
              <button
                id="btn-copy-config"
                onClick={() => copyToClipboard(dcmRouterConfig, 'pacs')}
                className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition cursor-pointer"
                title="Copy script config"
              >
                {copiedTextId === 'pacs' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-[11px] font-mono text-slate-700 bg-slate-50/50 leading-relaxed font-semibold leading-5 text-slate-800">
              <code>{dcmRouterConfig}</code>
            </pre>
          </div>

        </div>

        {/* 2. Live Interactive connection simulator (5-cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
            <h4 className="font-mono text-xs uppercase tracking-wider text-slate-500 font-bold mb-3 flex items-center space-x-1.5 border-b border-slate-100 pb-2">
              <HardDrive size={14} className="text-indigo-600" />
              <span>
                {language === 'uz' ? 'PACS Ulanishini tekshirish' : 'Тест локального DICOM шлюза'}
              </span>
            </h4>

            <p className="text-xs text-slate-500 mb-4 leading-relaxed font-semibold">
              {language === 'uz'
                ? "Shifoxonangizning ichki PACS IP manzili va ulanish parametrlarini kiriting hamda Maryam AI neyroxabiga integratsiyani simulyatsiya qiling."
                : "Протестируйте DICOM-подключение по эхо-запросу (C-ECHO/C-STORE) с ИИ-хабом Maryam AI."}
            </p>

            <div className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1 font-bold">LOCAL hospital PACS IP:</label>
                <input
                  id="test-ip-input"
                  type="text"
                  value={testIp}
                  onChange={(e) => setTestIp(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500/30 focus:ring-1 focus:ring-indigo-550/20 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1 font-bold">LOCAL PACS AET:</label>
                <input
                  id="test-ae-input"
                  type="text"
                  value={testAe}
                  onChange={(e) => setTestAe(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500/30 focus:ring-1 focus:ring-indigo-550/20 font-mono"
                />
              </div>

              <button
                id="btn-run-pacs-test"
                onClick={testConnection}
                disabled={isTesting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold font-mono py-2.5 rounded-lg transition flex items-center justify-center space-x-2 cursor-pointer shadow-xs"
              >
                {isTesting ? (
                  <>
                    <Terminal size={14} className="animate-pulse text-white" />
                    <span>C-ECHO PINGING...</span>
                  </>
                ) : (
                  <span>SEND C-ECHO DICOM PING</span>
                )}
              </button>

              {testResult === 'success' && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg space-y-1 text-xs">
                  <div className="flex items-center space-x-1.5 text-emerald-700 font-bold font-mono">
                    <CheckCircle size={14} />
                    <span>DICOM C-ECHO PING SUCCESSFUL</span>
                  </div>
                  <p className="text-[11px] text-emerald-900 leading-relaxed font-sans font-medium">
                    {language === 'uz'
                      ? "Integratsiya ulandi! Mahalliy PACS to'liq 'maryam-med.uz' nodiga DICOM xavfsiz kanali orqali ulangan."
                      : "Локальный PACS успешно установил рукопожатие с Maryam AI. Интегрированное DICOM-облако готово к обработке клинических снимков в реальном времени."}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick FAQ and Support details */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 text-xs font-sans text-slate-500 font-medium leading-relaxed">
            <span className="font-bold text-slate-800 block mb-1">
              {language === 'uz' ? "Texnik yordam bo'limi" : "Техническая поддержка Maryam AI"}
            </span>
            <p className="mb-2">
              {language === 'uz'
                ? "O'zbekistondagi klinika yoki shifoxona administratorlariga tizimni joylashtirishda Maryam AI muhandislar komandasi beg'araz yordam ko'rsatadi."
                : "По вопросам пилотного развертывания PACS шлюзов в ведомственных медицинских учреждениях Узбекистана обращайтесь на:"}
            </p>
            <span className="font-mono text-emerald-650 block font-bold text-sm">pacs-support@maryam-med.uz</span>
          </div>

        </div>

      </div>

    </div>
  );
}
