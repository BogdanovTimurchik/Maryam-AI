/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UzbekistanRegionData } from '../types';

export const UZBEKISTAN_REGIONS_DATA: UzbekistanRegionData[] = [
  {
    id: 'tashkent',
    name: {
      uz: "Toshkent shahri",
      ru: "г. Ташкент",
      en: "Tashkent City"
    },
    center: { uz: "Toshkent", ru: "Ташкент", en: "Tashkent" },
    hospitalsCount: 28,
    activeScansToday: 412,
    aiAccuracy: 99.2,
    stats: [
      {
        id: 'rhtyim',
        name: {
          uz: "Respublika Shoshilinch Tibbiy Yordam Ilmiy Markazi",
          ru: "Республиканский Центр Экстренной Мед Помощи (РНЦЭМП)",
          en: "Republican Research Centre of Emergency Medicine"
        },
        city: { uz: "Toshkent", ru: "Ташкент", en: "Tashkent" },
        integratedPACS: true,
        monthlyScans: 4890,
        lastActive: "Ayni damda faol"
      },
      {
        id: 'tta_clinic',
        name: {
          uz: "Toshkent Tibbiyot Akademiyasi Ko'p Tarmoqli Klinikasi",
          ru: "Многопрофильная клиника Ташкентской Мед Академии",
          en: "Multidisciplinary Clinic of Tashkent Medical Academy"
        },
        city: { uz: "Toshkent", ru: "Ташкент", en: "Tashkent" },
        integratedPACS: true,
        monthlyScans: 3540,
        lastActive: "3 daqiqa avval"
      },
      {
        id: 'shox_med',
        name: {
          uz: "Shox Med Center Xususiy Klinikasi",
          ru: "Частная клиника Shox Med Center",
          en: "Shox Med Center Private Clinic"
        },
        city: { uz: "Toshkent", ru: "Ташкент", en: "Tashkent" },
        integratedPACS: true,
        monthlyScans: 2100,
        lastActive: "12 daqiqa avval"
      }
    ]
  },
  {
    id: 'samarkand',
    name: {
      uz: "Samarqand viloyati",
      ru: "Самаркандская область",
      en: "Samarkand Region"
    },
    center: { uz: "Samarqand", ru: "Самарканд", en: "Samarkand" },
    hospitalsCount: 16,
    activeScansToday: 238,
    aiAccuracy: 98.6,
    stats: [
      {
        id: 'sam_reg_hosp',
        name: {
          uz: "Samarqand Viloyat Ko'p Tarmoqli Tibbiyot Markazi",
          ru: "Самаркандский Областной Многопрофильный Мед Центр",
          en: "Samarkand Regional Multidisciplinary Medical Center"
        },
        city: { uz: "Samarqand", ru: "Самарканд", en: "Samarkand" },
        integratedPACS: true,
        monthlyScans: 2800,
        lastActive: "1 daqiqa avval"
      },
      {
        id: 'sam_emergency',
        name: {
          uz: "RShTYoIM Samarqand Filiali",
          ru: "Самаркандский филиал РНЦЭМП",
          en: "Samarkand Branch of RRCEM"
        },
        city: { uz: "Samarqand", ru: "Самарканд", en: "Samarkand" },
        integratedPACS: true,
        monthlyScans: 1980,
        lastActive: "Ayni damda faol"
      }
    ]
  },
  {
    id: 'fergana',
    name: {
      uz: "Farg'ona viloyati",
      ru: "Ферганская область",
      en: "Fergana Region"
    },
    center: { uz: "Farg'ona", ru: "Фергана", en: "Fergana" },
    hospitalsCount: 19,
    activeScansToday: 184,
    aiAccuracy: 98.4,
    stats: [
      {
        id: 'ferg_cardio',
        name: {
          uz: "Davlatingiz Kardiologiya Dispanseri Farg'ona Filiali",
          ru: "Ферганский филиал Республиканского кардиоцентра",
          en: "Fergana Branch of Republican Cardiological Center"
        },
        city: { uz: "Farg'ona", ru: "Фергана", en: "Fergana" },
        integratedPACS: false,
        monthlyScans: 1200,
        lastActive: "1 soat avval"
      }
    ]
  },
  {
    id: 'bukhara',
    name: {
      uz: "Buxoro viloyati",
      ru: "Бухарская область",
      en: "Bukhara Region"
    },
    center: { uz: "Buxoro", ru: "Бухара", en: "Bukhara" },
    hospitalsCount: 12,
    activeScansToday: 147,
    aiAccuracy: 98.9,
    stats: [
      {
        id: 'bux_hosp',
        name: {
          uz: "Buxoro Viloyat Shoshilinch Tibbiy Yordam Markazi",
          ru: "Бухарский Областной Центр Экстренной Мед Помощи",
          en: "Bukhara Regional Emergency Medical Center"
        },
        city: { uz: "Buxoro", ru: "Бухара", en: "Bukhara" },
        integratedPACS: true,
        monthlyScans: 1620,
        lastActive: "8 daqiqa avval"
      }
    ]
  }
];
