/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ScanPreset } from '../types';

export const MEDICAL_PRESETS: ScanPreset[] = [
  {
    id: 'chest_pnevmonia',
    title: {
      uz: "O'pka rentgenogrammasi (Pnevmoniya)",
      ru: "Рентген ОГК (Пневмония)",
      en: "Chest X-Ray (Pneumonia)"
    },
    subtitle: {
      uz: "Chap o'pka segmentar pnevmoniyasi, Toshkent shahar 1-son klinik shifoxonasi",
      ru: "Сегментарная пневмония левого легкого, Ташкентская ГКБ №1",
      en: "Segmental pneumonia of the left lung, Tashkent City Hospital #1"
    },
    type: 'xray',
    sampleFileLabel: 'Chest_XRay_Pneumonia_L_049.dcm',
    defaultReport: {
      uz: {
        findings: "To'g'ri proyeksiyadagi ko'krak qafasi rentgenogrammasida chap o'pkaning S6 va S10 segmentlarida o'rtacha zichlikdagi, noaniq chegarali o'choqli infiltratsiya aniqlandi. Chap gumbaz qovurg'a-diafragma burchagi biroz tekislangan. O'pka ildizlari strukturaviy, chap tomonda biroz kengaygan va bo'shashgan. Yurak soyasi chegaralari normal chegaralarda.",
        clinicalConclusion: "Chap o'pka pastki bo'lagi pnevmoniyasi (S6, S10 segmentariyalari).",
        recommendations: "Terapevt/pulmonolog ko'rigi, 10-12 kundan keyin rentgenologik nazorat va С-reaktiv oqsil dinamikasini kuzatish tavsiya qilinadi.",
        classification: "Пневмония / Аномалия инфильтрации"
      },
      ru: {
        findings: "На рентгенограмме органов грудной клетки в прямой проекции слева в проекции S6 и S10 сегментов определяется участок очагово-фокусной инфильтрации легочной ткани средней интенсивности с нечеткими неровными контурами. Левый реберно-диафрагмальный синус умеренно сглажен. Корни легких структурны, левый корень несколько расширен, реактивен. Границы тени средостения и сердце — без особенностей.",
        clinicalConclusion: "Рентген-признаки левосторонней нижнедолевой сегментарной пневмонии (S6, S10).",
        recommendations: "Консультация терапевта/пульмонолога, клинико-лабораторное сопоставление (СРБ, ОАК), контрольная рентгенография в динамике через 10-12 дней.",
        classification: "Пневмония / Аномалия инфильтрации"
      },
      en: {
        findings: "Chest radiograph in PA view shows focal segmentary infiltration of middle density with indistinct margins within segment S6 and S10 of the left lung. Left costophrenic angle is slightly blunted. Pulmonary hila are structured, the left hilum is slightly dilated and prominent. Cardiomediastinal shadow is normal within normal limits.",
        clinicalConclusion: "Radiographic features consistent with left lower lobe segmental pneumonia (S6, S10).",
        recommendations: "Pulmonology/GP clinical correlation. Lab correlation (CRP, CBC) and follow-up chest radiograph in 10-12 days.",
        classification: "Pneumonia / Infiltration Anomaly"
      }
    },
    anomalies: [
      {
        id: 'anom_pnev_1',
        label: {
          uz: "Infiltratsiya o'chog'i (Chap bo'lak)",
          ru: "Очаг инфильтрации (Левая доля)",
          en: "Infiltration Focus (Left Lobe)"
        },
        x: 62,
        y: 55,
        r: 32,
        severity: 'warning',
        description: {
          uz: "Chap o'pka pastki bo'lagida o'choqli alveolar to'ldirilish va havo bronxogrammasi beligilari borligi.",
          ru: "Наличие очаговой альвеолярной консолидации легочной ткани в нижних отделах слева с симптомами воздушной бронхографии.",
          en: "Presence of focal alveolar consolidation of lung tissue in left lower zones, displaying air bronchograms."
        }
      },
      {
        id: 'anom_pnev_2',
        label: {
          uz: "Pleva reaksiyasi",
          ru: "Плевральная реакция",
          en: "Pleural Reaction"
        },
        x: 75,
        y: 72,
        r: 18,
        severity: 'normal',
        description: {
          uz: "Chap qovurg'a-diafragma sinusining reaktiv silliqlashishi (kichik ekssudat belgilari).",
          ru: "Реактивное сглаживание плеврального синуса слева (признаки минимального выпота).",
          en: "Reactive blunting of the left costophrenic sulcus (suggests minimal effusion or pleural thickening)."
        }
      }
    ]
  },
  {
    id: 'brain_hemorrhage',
    title: {
      uz: "Bosh miya kompyuter tomografiyasi (Qon quyilishi)",
      ru: "КТ головного мозга (Кровоизлияние)",
      en: "Brain CT Scan (Intracerebral Hemorrhage)"
    },
    subtitle: {
      uz: "O'ng yarimsharda gemorragik insult, Respublika Shoshilinch Tibbiy Yordam Ilmiy Markazi (RShTYoIM)",
      ru: "Геморрагический инсульт правого полушария, РНЦЭМП Ташкент",
      en: "Hemorrhagic stroke of right hemisphere, Republican Research Centre of Emergency Medicine"
    },
    type: 'ct',
    sampleFileLabel: 'Brain_CT_Spontaneous_ICH_012.dcm',
    defaultReport: {
      uz: {
        findings: "Bosh miya KT tekshiruvida o'ng miya yarim sharining lateral bo'limlarida (bazal yadrolari sohasida) o'lchamlari taxminan 42x28x35 mm bo'lgan Giperdens (zichligi +76...+82 HU) jarohatlanish aniqlandi. Ushbu jarohat atrofida aniq ifodalangan perifokal shish zonasi bor (zichligi pasaygan, +23 HU). O'ng yon qorincha sezilarli darajada siqilgan. Bosh miya o'rta tuzilmalari chapga qarab 6 mm surilgan.",
        clinicalConclusion: "O'ng bazal yadrolar sohasida o'tkir miya ichi qon quyilishi (gematoma), atrofida yaqqol shish va o'rta tuzilmalarning chap tomonga dislokatsiyasi.",
        recommendations: "Shoshilinch neyroxirurg konsultatsiyasi, qon bosimining qat'iy nazorati, reanimatsiya bo'limida intensiv davolash.",
        classification: "Геморрагический инсульт / Критическое состояние"
      },
      ru: {
        findings: "При КТ-исследовании головного мозга в латеральных отделах правого полушария (в проекции базальных ядер) визуализируется объемное гиперденсивное образование неправильно-округлой формы с градиентом плотности +76...+82 HU, размерами 42x28x35 мм. Вокруг очага определяется выраженная зона перифокального отека пониженной плотности (+23 HU). Правый боковой желудочек деформирован и сдавлен. Срединные структуры смещены влево на 6 мм.",
        clinicalConclusion: "Острое внутримозговое кровоизлияние (гематома) в области правых базальных подкорковых ядер с латеральным дислокационным синдромом.",
        recommendations: "Экстренная консультация нейрохирурга, строгий контроль гемодинамики, госпитализация в отделение реанимации и интенсивной терапии.",
        classification: "Геморрагический инсульт / Критическое состояние"
      },
      en: {
        findings: "CT examination of the brain reveals an acute, hyperdense (density +76 to +82 HU) focal hemorrhage measuring 42x28x35 mm in the right basal ganglia and internal capsule region. Marked zone of hypodense perifocal edema (+23 HU) is present. The right lateral ventricle is significantly compressed. Midline structures are deviated to the left by 6 mm.",
        clinicalConclusion: "Acute spontaneous intracerebral hemorrhage (hematoma) of the right basal ganglia with associated mass effect and lateral subfalcine herniation (6 mm midline shift).",
        recommendations: "Emergency neurosurgical consultation, strict arterial pressure control, immediate admission to ICU.",
        classification: "Hemorrhagic Stroke / Spontaneous ICH"
      }
    },
    anomalies: [
      {
        id: 'anom_hem_1',
        label: {
          uz: "Intrakranial gematoma",
          ru: "Внутричерепная гематома",
          en: "Intracranial Hematoma"
        },
        x: 42,
        y: 44,
        r: 28,
        severity: 'critical',
        description: {
          uz: "O'ng bazal yadrolardagi giperdens o'choq (qon quyilishi), zichligi +80 HU atrofida.",
          ru: "Область скопления свежей крови в паренхиме мозга высокой плотности (+80 HU) в правых подкорковых ядрах.",
          en: "High-density (+80 HU) hyperattenuating area of acute blood collection within the right basal ganglia."
        }
      },
      {
        id: 'anom_hem_2',
        label: {
          uz: "Perifokal shish",
          ru: "Перифокальный отек",
          en: "Perifocal Edema"
        },
        x: 40,
        y: 54,
        r: 38,
        severity: 'warning',
        description: {
          uz: "Gematoma atrofidagi gipodens zona, miya to'qimalarining ikkilamchi shikastlanishini ko'rsatadi.",
          ru: "Гиподенсивный ободок отека вокруг гематомы, вызывающий дополнительный масс-эффект.",
          en: "Hypodense rim of edema surrounding the hematoma, amplifying the mass effect and intracranial pressure."
        }
      }
    ]
  },
  {
    id: 'spine_mri_hernia',
    title: {
      uz: "Umarqa umurtqalarining MRTsi (Suyuq grij)",
      ru: "МРТ поясничного отдела (Грыжа диска)",
      en: "Lumbar Spine MRI (Disc Herniation)"
    },
    subtitle: {
      uz: "L4-L5 diskining dural qopgacha yetgan griji, Toshkent Tibbiyot Akademiyasi (TTA) klinikasi",
      ru: "Грыжа межпозвонкового диска L4-L5, клиника Ташкентской Медицинской Академии",
      en: "Intervertebral herniation of the L4-L5 disc, Tashkent Medical Academy (TMA) Clinic"
    },
    type: 'mri',
    sampleFileLabel: 'Spine_MRI_L4_L5_Herniation_202.dcm',
    defaultReport: {
      uz: {
        findings: "Bel-dumg'aza umurtqa qismining MRT skanerlashida L4-L5 darajasida pulpalar yadrosining orqa-markaziy surilishi (grij) aniqlandi. Uning o'lchami 7.2 mm bo'lib, dural qopni deformatsiya qilmoqda, dural qop diametri 8 mm gacha toraygan (Spinal stenoz). Ikkala lateral L5 nerv ildizchalari siqilgan, chap tomonda kuchliroq. L5-S1 darajasida 3 mm o'lchamdagi protruziya bor. Umurtqa jismlarining balandligi saqlangan, Modic I osteoxondroz o'zgarishlari bor.",
        clinicalConclusion: "L4-L5 darajasidagi umurtqalararo diskning orqa paramedian chap tomonlama griji, orqa miya kanali nisbiy stenozi bilan. Osteoxondroz va spondiloartroz.",
        recommendations: "Nevrolog va neyroxirurg bilan maslahatlashish, fizioterapiya, zarurat bo'lganda og'riqsizlantirish.",
        classification: "Грыжа диска / Патология позвоночника"
      },
      ru: {
        findings: "При МРТ-исследовании пояснично-крестцового отдела позвоночника на уровне L4-L5 определяется выраженное заднее центральное и парамедианное левостороннее выпячивание вещества диска (грыжа) размером до 7.2 мм с компрессией переднего контура дурального мешка и сужением позвоночного канала до 8.0 мм (относительный стеноз). Имеется компрессия левого нервного корешка L5. На уровне L5-S1 визуализируется диффузная протрузия диска до 3.0 мм.",
        clinicalConclusion: "Грыжа диска L4-L5 с сужением позвоночного канала и компрессией левого корешка L5. Остеохондроз пояснично-крестцового отдела.",
        recommendations: "Консультация невролога или лечащего вертебролога, ограничение осевых нагрузок, физиотерапия, НПВС при выраженном болевом синдроме.",
        classification: "Грыжа диска / Патология позвоночника"
      },
      en: {
        findings: "Lumbar spine MRI reveals a significant posterior-left paramedian disc herniation at the L4-L5 level protruding by 7.2 mm. It deforms the anterior margin of the dural sac, narrowing the spinal canal AP diameter to 8.0 mm (relative spinal canal stenosis). Standard compression of the descending left L5 nerve root is noted. Diffuse disc protrusion of 3.0 mm is also observed at the L5-S1 level.",
        clinicalConclusion: "Lumbar herniated disc at L4-L5 with spinal canal encroachment and compression of the left L5 nerve root. Osteochondrosis of the lumbar spine.",
        recommendations: "Neurology/Spine specialist orthopedics evaluation, avoidance of axial spinal loads, conservative therapy / NSAIDs guided by symptoms.",
        classification: "Disc Herniation / Spine Pathology"
      }
    },
    anomalies: [
      {
        id: 'anom_mri_1',
        label: {
          uz: "L4-L5 disk griji",
          ru: "Грыжа диска L4-L5",
          en: "L4-L5 Herniated Disc"
        },
        x: 48,
        y: 52,
        r: 15,
        severity: 'critical',
        description: {
          uz: "Orqa tomonga dural kanalga sizib kirgan va orqa miya ildizchasini ezayotgan 7.2 mm yadro bo'lagi.",
          ru: "Фрагмент диска, выступающий в просвет позвоночного канала на 7.2 мм с компрессией дурального пространства.",
          en: "Herniated nuclear material extending 7.2 mm posteriorly into the spinal canal causing dural impingement."
        }
      },
      {
        id: 'anom_mri_2',
        label: {
          uz: "Nerv ildizi siqilishi",
          ru: "Компрессия корешка",
          en: "Nerve Root Compression"
        },
        x: 54,
        y: 55,
        r: 12,
        severity: 'warning',
        description: {
          uz: "L5 chap ildizcha kanali toraygan va mikrotravmalangan.",
          ru: "Сдавление и отек левого нервного корешка L5 в латеральном кармане.",
          en: "Impingement of the left L5 nerve root in the lateral recess with accompanying localized neuro-inflammation."
        }
      }
    ]
  },
  {
    id: 'normal_chest_xray',
    title: {
      uz: "Sog'lom o'pka rentgenogrammasi",
      ru: "Норма ОГК (Рентгенограмма без патологии)",
      en: "Normal Chest X-Ray"
    },
    subtitle: {
      uz: "O'pka va yurak patologiyasiz rentgenogrammasi, Respublika Shifokorlar Malakasini Oshirish Instituti (RShMAOI)",
      ru: "Рентген ОГК без патологических изменений, Клиника ИПОПК Ташкент",
      en: "Chest radiograph without visible pathological signs, Tashkent Medical Academy"
    },
    type: 'xray',
    sampleFileLabel: 'Chest_XRay_Clear_Healthy_002.dcm',
    defaultReport: {
      uz: {
        findings: "Ko'krak qafasining to'g'ri proyeksiyadagi rentgenogrammasida ikkala tomondan o'pka maydonlari o'pka chizmasi o'zgarmagan holatda toza va tinch. Infiltrativ yoki o'choqli patologiyalar aniqlanmadi. O'pka ildizlari strukturaviy, kengaymagan. Diafragma gumbazlari silliq va aniq ko'rinadi. Sinuslar bo'sh, suyuqlik yo'q. Yurak soyasi chegaralari va ko'ks oralig'i a'zolari yoshga guruhiga xos normada.",
        clinicalConclusion: "Ko'krak qafasi a'zolarida o'pka va yurak patologiyalari aniqlanmadi (Norma).",
        recommendations: "Profilaktik yillik ftorografik monitoring tavsiya etiladi.",
        classification: "НОРМА / Без патологии"
      },
      ru: {
        findings: "На представленной рентгенограмме органов грудной клетки в прямой проекции легочные поля с обеих сторон без видимых очаговых и инфильтративных теней. Легочный рисунок сохранен, не деформирован, прослеживается до самых консервативных периферических отделов. Корни легких не уплотнены, структурные. Синусы свободные, жидкости в плевральной полости нет. Средостение по центру. Сердечно-сосудистая тень обычных размеров.",
        clinicalConclusion: "Патологических изменений в органах грудной клетки не выявлено (Норма).",
        recommendations: "Рекомендован стандартный ежегодный профилактический скрининг.",
        classification: "НОРМА / Без патологии"
      },
      en: {
        findings: "Standard frontal chest view shows clear lung fields bilaterally. There are no focal consolidations, nodules, or interstitial infiltrations. Pulmonary bronchovascular markings are normal. High-definition diaphragmatic contour is crisp. Costophrenic recesses are sharp and free of fluid. Hila are symmetric and well-defined. The heart is normal in size and shape.",
        clinicalConclusion: "Normal chest radiograph (No active cardiopulmonary disease detected).",
        recommendations: "Standard annual screening based on baseline patient criteria.",
        classification: "NORMAL / Healthy Scan"
      }
    },
    anomalies: []
  }
];
