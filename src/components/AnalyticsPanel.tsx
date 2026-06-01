/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Building2, Activity, ShieldCheck, Clock, Check, AlertTriangle, 
  MapPin, Radio, HeartPulse, Eye, Download, Info
} from 'lucide-react';
import { UzbekistanRegionData, Language } from '../types';
import { UZBEKISTAN_REGIONS_DATA } from '../data/regions';

interface AnalyticsPanelProps {
  language: Language;
}

// Simulated active scan streams representing dynamic integrations across Uzbekistan regions
interface TelemetryLog {
  id: string;
  timeAgo: string;
  clinicName: string;
  type: 'CT' | 'MRI' | 'XRAY';
  result: string;
  status: 'critical' | 'warning' | 'normal';
}

export default function AnalyticsPanel({ language }: AnalyticsPanelProps) {
  const [selectedRegionId, setSelectedRegionId] = useState<string>('tashkent');
  const [liveTelemetry, setLiveTelemetry] = useState<TelemetryLog[]>([
    {
      id: "log_1",
      timeAgo: "Hozirgina",
      clinicName: "RShTYoIM Samarqand Filiali",
      type: "CT",
      result: "Miya ichi gemorragiyasi aniqlandi",
      status: "critical"
    },
    {
      id: "log_2",
      timeAgo: "2 daqiqa avval",
      clinicName: "Taniqli Shox Med ko'p tarmoqli klinikasi",
      type: "XRAY",
      result: "Chap o'pka pnevmoniyasi tavsifi",
      status: "warning"
    },
    {
      id: "log_3",
      timeAgo: "7 daqiqa avval",
      clinicName: "TTA Klinikasi",
      type: "MRI",
      result: "Bel umurtqa L4-L5 grij tasnifi",
      status: "warning"
    },
    {
      id: "log_4",
      timeAgo: "12 daqiqa avval",
      clinicName: "Tashkent City Hospital #1",
      type: "XRAY",
      result: "Sog'lom ko'krak qafasi a'zolari",
      status: "normal"
    }
  ]);

  // Periodic Telemetry Log update simulator
  useEffect(() => {
    const interval = setInterval(() => {
      // Rotate telemetry logs
      setLiveTelemetry(prev => {
        const types: Array<'CT' | 'MRI' | 'XRAY'> = ['CT', 'MRI', 'XRAY'];
        const clinicsUz = [
          "Buxoro Viloyat Shoshilinch Yordam Markazi",
          "RShTYoIM Toshkent Bosh Ofisi",
          "Samarqand Viloyat Markaziy Kasalxonasi",
          "Farg'ona Kardiologiya Dispanseri"
        ];
        const clinicsRu = [
          "Бухарский Областной Экстренный Мед Центр",
          "Главный Офис РНЦЭМП Ташкент",
          "Самаркандская Клиническая Больница",
          "Ферганский Кардиологический Диспансер"
        ];
        const resultsUz = [
          "KT sohasida o'tkir patologiya aniqlanmadi (Norma)",
          "O'pka o'choqli infiltratsiyasi o'ng bo'lak",
          "L3-L4 darajali disk protruziyasi",
          "Kalla suyagi suyagi butunligi buzilishi"
        ];
        const resultsRu = [
          "Нарушений КТ-картины головного мозга не обнаружено",
          "Очаговая бронхогенная инфильтрация сегментов легкого",
          "Протрузия межпозвонкового диска уровня L3-L4",
          "Подозрение на компрессионное уменьшение высоты сочленения"
        ];
        const statuses: Array<'critical' | 'warning' | 'normal'> = ['normal', 'warning', 'warning', 'critical'];

        const randomIndex = Math.floor(Math.random() * clinicsUz.length);
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        const newLog: TelemetryLog = {
          id: Math.random().toString(),
          timeAgo: "Hozirgina",
          clinicName: language === 'uz' ? clinicsUz[randomIndex] : clinicsRu[randomIndex],
          type: randomType,
          result: language === 'uz' ? resultsUz[randomIndex] : resultsRu[randomIndex],
          status: statuses[randomIndex]
        };

        // Keep 4 elements max and change others text from "Hozirgina" to "X daqiqa avval"
        const updated = prev.slice(0, 3).map(log => {
          if (log.timeAgo === "Hozirgina") return { ...log, timeAgo: "1 daqiqa avval" };
          const min = parseInt(log.timeAgo);
          if (!isNaN(min)) return { ...log, timeAgo: `${min + 1} daqiqa avval` };
          return log;
        });

        return [newLog, ...updated];
      });
    }, 15000); // add new every 15 secs

    return () => clearInterval(interval);
  }, [language]);

  const activeRegion = UZBEKISTAN_REGIONS_DATA.find(r => r.id === selectedRegionId) || UZBEKISTAN_REGIONS_DATA[0];

  // Aggregate stats
  const totalClinics = UZBEKISTAN_REGIONS_DATA.reduce((acc, curr) => acc + curr.hospitalsCount, 0);
  const totalScansToday = UZBEKISTAN_REGIONS_DATA.reduce((acc, curr) => acc + curr.activeScansToday, 0);
  const avgAccuracy = (UZBEKISTAN_REGIONS_DATA.reduce((acc, curr) => acc + curr.aiAccuracy, 0) / UZBEKISTAN_REGIONS_DATA.length).toFixed(1);

  return (
    <div className="space-y-6">
      
      {/* 2x2 or 1x4 Highlight cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200 shadow-sm p-4 rounded-xl flex items-center space-x-3.5">
          <div className="h-10 w-10 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-2xs">
            <Building2 size={18} />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">
              {language === 'uz' ? 'Klinikalar' : language === 'en' ? 'Integrated Stations' : 'Интегрировано'}
            </div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{totalClinics}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm p-4 rounded-xl flex items-center space-x-3.5">
          <div className="h-10 w-10 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-600 shadow-2xs">
            <Radio size={18} />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">
              {language === 'uz' ? 'Bugun Tahlil' : language === 'en' ? 'Checks Today' : 'Анализов сегодня'}
            </div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{totalScansToday}</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm p-4 rounded-xl flex items-center space-x-3.5">
          <div className="h-10 w-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
            <ShieldCheck size={18} />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">
              {language === 'uz' ? 'Aniq indeks' : language === 'en' ? 'Accuracy Rating' : 'Точность ИИ'}
            </div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">{avgAccuracy}%</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm p-4 rounded-xl flex items-center space-x-3.5">
          <div className="h-10 w-10 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 shadow-2xs">
            <Clock size={18} />
          </div>
          <div>
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">
              {language === 'uz' ? 'Tejamkorlik' : language === 'en' ? 'Time Saving' : 'Экономия времени'}
            </div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">~72%</div>
          </div>
        </div>

      </div>

      {/* Main split region matrix */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left selector col */}
        <div className="md:col-span-4 space-y-3">
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4">
            <h4 className="font-mono text-xs uppercase tracking-wider text-slate-500 font-bold mb-3 flex items-center space-x-1.5 border-b border-slate-100 pb-2">
              <MapPin size={13} className="text-emerald-500" />
              <span>{language === 'uz' ? "Klinikalar Geografiyasi" : "География клиник"}</span>
            </h4>
            
            <div className="space-y-1.55">
              {UZBEKISTAN_REGIONS_DATA.map((reg) => (
                <button
                  id={`reg-btn-${reg.id}`}
                  key={reg.id}
                  onClick={() => setSelectedRegionId(reg.id)}
                  className={`w-full text-left p-3 rounded-lg border text-xs transition duration-150 flex items-center justify-between cursor-pointer ${
                    reg.id === selectedRegionId
                      ? 'bg-emerald-50 border-emerald-500/20 text-emerald-800 font-bold shadow-xs'
                      : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-bold">{reg.name[language]}</span>
                    <span className="text-[10px] text-slate-500 font-mono font-medium">
                      {reg.hospitalsCount} {language === 'uz' ? 'tibbiy filiallar' : 'клиник'}
                    </span>
                  </div>
                  <span className="text-xs bg-slate-50 border border-slate-250 font-semibold px-2.5 py-1 rounded font-mono text-emerald-700 shadow-2xs">
                    {reg.activeScansToday} scans
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Informer Box */}
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start space-x-3 shadow-2xs">
            <Info size={16} className="text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-800 space-y-1 leading-relaxed">
              <span className="font-bold block uppercase tracking-wide text-[10px] font-mono text-emerald-700">Maryam-PACS hl7 routing</span>
              <p className="font-medium">
                {language === 'uz' 
                  ? "Barcha davlat va xususiy klinika PACS tarmoqlari standard DICOM protokoli asosida to'g'ridan-to'g'ri bulutli tahlil tizimimizga ulanadi."
                  : "Все DICOM-изображения защищены туннелями шифрования и хэшируются локально перед отправкой."}
              </p>
            </div>
          </div>
        </div>

        {/* Right Details stats catalog */}
        <div className="md:col-span-8 space-y-6">
          
          {/* Selected Region Detailed Table Cards */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {activeRegion.name[language]}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {language === 'uz' ? `Markaz: ${activeRegion.center[language]}` : `Административный центр: ${activeRegion.center[language]}`}
                </p>
              </div>

              <div className="text-right font-mono text-xs text-slate-500">
                <div className="font-semibold">AI ACCURACY: <span className="font-bold text-emerald-600">{activeRegion.aiAccuracy}%</span></div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-mono text-[10px]">
                    <th className="py-2.5 font-bold">{language === 'uz' ? 'Klinika va filiallar' : 'Наименование учреждения'}</th>
                    <th className="py-2.5 text-center font-bold">PACS STATUS</th>
                    <th className="py-2.5 text-right font-bold">{language === 'uz' ? "Oylik tahlillar" : 'Снимок/мес'}</th>
                    <th className="py-2.5 text-right font-bold">{language === 'uz' ? 'Faollik' : 'Активность'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {activeRegion.stats.map((hospital) => (
                    <tr id={`row-${hospital.id}`} key={hospital.id} className="hover:bg-slate-50/50">
                      <td className="py-3 font-semibold pr-3 text-slate-900">{hospital.name[language]}</td>
                      <td className="py-3 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider font-semibold border ${
                          hospital.integratedPACS 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                            : 'bg-amber-50 text-amber-705 border-amber-100'
                        }`}>
                          {hospital.integratedPACS ? 'Active PACS' : 'HL7 Manual'}
                        </span>
                      </td>
                      <td className="py-3 text-right font-mono font-bold text-slate-805">{hospital.monthlyScans.toLocaleString()}</td>
                      <td className="py-3 text-right text-slate-500 font-mono text-[11px] font-medium">
                        <span className="flex items-center justify-end">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1.5 inline-block animate-pulse"></span>
                          {hospital.lastActive}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dynamic real-time PACS feed streams */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <h4 className="font-mono text-xs text-slate-500 font-bold uppercase tracking-wider">
                  {language === 'uz' ? 'Jonli PACS ulanish oqimi' : 'Прямой поток DICOM интеграций'}
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400 font-semibold">Live Telemetry</span>
            </div>

            <div className="space-y-3">
              {liveTelemetry.map((log) => (
                <div 
                  id={log.id}
                  key={log.id} 
                  className="bg-slate-50 hover:bg-slate-100/80 transition border border-slate-100 p-3 h-auto rounded-lg flex items-center justify-between gap-3 text-xs shadow-2xs"
                >
                  <div className="flex items-center space-x-3 truncate max-w-[75%]">
                    <span className={`px-2 py-1 rounded text-[10px] font-mono font-bold border shrink-0 ${
                      log.type === "CT" ? "bg-cyan-50 border-cyan-100 text-cyan-700" : log.type === "MRI" ? "bg-indigo-50 border-indigo-100 text-indigo-700" : "bg-amber-50 border-amber-100 text-amber-700"
                    }`}>
                      {log.type}
                    </span>
                    <div className="truncate">
                      <span className="font-bold text-slate-900 block truncate">{log.clinicName}</span>
                      <span className="text-[11px] text-slate-500 font-medium">{log.result}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 font-mono font-semibold block mb-1">{log.timeAgo}</span>
                    <span className={`h-2 w-2 rounded-full inline-block ${
                      log.status === "critical" ? "bg-red-500 animate-pulse" : log.status === "warning" ? "bg-amber-500" : "bg-emerald-500"
                    }`}></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
