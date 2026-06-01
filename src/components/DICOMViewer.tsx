/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  FileText, Upload, RefreshCw, ZoomIn, ZoomOut, Maximize, 
  Eye, EyeOff, LayoutTemplate, Activity, AlertTriangle, 
  CheckCircle, Sliders, Play, RotateCcw, HelpCircle, Download
} from 'lucide-react';
import { ScanPreset, AIAnalysisResponse, DicomFilterSettings, Language } from '../types';
import { MEDICAL_PRESETS } from '../data/presets';

interface DICOMViewerProps {
  language: Language;
  onAnalysisResult: (result: any) => void;
  activePresetId: string;
  onPresetSelect: (id: string) => void;
}

export default function DICOMViewer({ 
  language, 
  onAnalysisResult, 
  activePresetId, 
  onPresetSelect 
}: DICOMViewerProps) {
  
  const [selectedModality, setSelectedModality] = useState<'xray' | 'ct' | 'mri'>('xray');
  const [patientSymptoms, setPatientSymptoms] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Custom file upload states
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  
  // DICOM Viewer Filter States
  const [filters, setFilters] = useState<DicomFilterSettings>({
    brightness: 100,
    contrast: 100,
    invert: false,
    sharpness: false,
    zoom: 1.0,
    panX: 0,
    panY: 0
  });

  const [showMetadata, setShowMetadata] = useState(true);
  const [showAnnotations, setShowAnnotations] = useState(true);
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<string | null>(null);
  const [activeAnalysis, setActiveAnalysis] = useState<any | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Track dragging for pan
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Load preset details
  const activePreset = MEDICAL_PRESETS.find(p => p.id === activePresetId) || MEDICAL_PRESETS[0];

  // Set selected modality based on preset change
  useEffect(() => {
    if (activePreset) {
      setSelectedModality(activePreset.type);
      setUploadedImage(null);
      setUploadedFileName(null);
      setActiveAnalysis(null);
      setSelectedAnomalyId(null);
    }
  }, [activePresetId]);

  // Handle preset selections
  const handlePresetChange = (presetId: string) => {
    onPresetSelect(presetId);
  };

  // Canvas drawing effect: renders medical anatomical schemas dynamically based on preset or uploaded image
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = 512;
    canvas.height = 512;

    // Clear background
    ctx.fillStyle = '#0b0f19';
    ctx.fillRect(0, 0, 512, 512);

    ctx.save();
    
    // Apply Zoom & Pan transform first
    ctx.translate(256 + filters.panX, 256 + filters.panY);
    ctx.scale(filters.zoom, filters.zoom);
    ctx.translate(-256, -256);

    // Apply Filters via standard Canvas manipulation or inline CSS values
    let filterString = `brightness(${filters.brightness}%) contrast(${filters.contrast}%)`;
    if (filters.invert) filterString += ` invert(100%)`;
    if (filters.sharpness) filterString += ` saturate(150%) contrast(120%)`;
    ctx.filter = filterString;

    if (uploadedImage) {
      // Draw User Loaded Medical Scan
      const img = new Image();
      img.src = uploadedImage;
      img.onload = () => {
        // Draw image keeping ratio
        const scale = Math.min(512 / img.width, 512 / img.height) * 0.9;
        const w = img.width * scale;
        const h = img.height * scale;
        const x = (512 - w) / 2;
        const y = (512 - h) / 2;
        ctx.drawImage(img, x, y, w, h);
        drawOverlaysAndDetails(ctx);
      };
    } else {
      // Draw simulated anatomical scan based on state
      drawAnatomyPlaceholder(ctx, activePreset.id);
      drawOverlaysAndDetails(ctx);
    }
  }, [filters, uploadedImage, activePreset, showMetadata, showAnnotations, selectedAnomalyId, activeAnalysis]);

  // Restores standard zoom, panning, brightness filters to clinical defaults
  const resetFilters = () => {
    setFilters({
      brightness: 100,
      contrast: 100,
      invert: false,
      sharpness: false,
      zoom: 1.0,
      panX: 0,
      panY: 0
    });
  };

  // Helper drawing overlays (grid lines, crosshairs, DICOM bounding box)
  const drawOverlaysAndDetails = (ctx: CanvasRenderingContext2D) => {
    ctx.restore(); // restore from transformations for stationary overlays if any

    // Draw static clinical grid and camera targeting corners
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.15)'; // soft emerald
    ctx.lineWidth = 1;
    
    // Grid Lines
    ctx.beginPath();
    for (let i = 64; i < 512; i += 64) {
      ctx.moveTo(i, 0); ctx.lineTo(i, 512);
      ctx.moveTo(0, i); ctx.lineTo(512, i);
    }
    ctx.stroke();

    // Workstation Corners
    ctx.strokeStyle = '#10b981'; // solid emerald tech lines
    ctx.lineWidth = 2;
    // Top Left
    ctx.beginPath(); ctx.moveTo(10, 30); ctx.lineTo(10, 10); ctx.lineTo(30, 10); ctx.stroke();
    // Top Right
    ctx.beginPath(); ctx.moveTo(502, 30); ctx.lineTo(502, 10); ctx.lineTo(482, 10); ctx.stroke();
    // Bottom Left
    ctx.beginPath(); ctx.moveTo(10, 482); ctx.lineTo(10, 502); ctx.lineTo(30, 502); ctx.stroke();
    // Bottom Right
    ctx.beginPath(); ctx.moveTo(502, 482); ctx.lineTo(502, 502); ctx.lineTo(482, 502); ctx.stroke();

    // Scale Ruler (right side indicator)
    ctx.strokeStyle = '#9ca3af';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(495, 100); ctx.lineTo(495, 412);
    for (let y = 100; y <= 412; y += 31.2) {
      ctx.moveTo(490, y); ctx.lineTo(495, y);
    }
    ctx.stroke();
    ctx.fillStyle = '#9ca3af';
    ctx.font = '9px monospace';
    ctx.fillText('10 cm', 465, 110);

    // Crosshair target
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(256, 236); ctx.lineTo(256, 276);
    ctx.moveTo(236, 256); ctx.lineTo(276, 256);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(256, 256, 10, 0, Math.PI * 2);
    ctx.stroke();

    // Render anomalies if annotations toggled ON
    if (showAnnotations) {
      // Use active backend analysis annotations if available, else static preset ones
      const listToDraw = activeAnalysis?.annotatedRegions || activePreset.anomalies;
      
      listToDraw.forEach((anom: any) => {
        // Transform the coordinate based on zoom and pan for correct placement
        const absoluteX = (anom.x / 100) * 512;
        const absoluteY = (anom.y / 100) * 512;
        
        // Calculate transformed coordinates manually
        const tx = (absoluteX - 256) * filters.zoom + 256 + filters.panX;
        const ty = (absoluteY - 256) * filters.zoom + 256 + filters.panY;
        const tr = anom.r * filters.zoom;

        const isSelected = selectedAnomalyId === anom.id || selectedAnomalyId === anom.label;

        // Draw bounding dotted focal circle
        ctx.strokeStyle = anom.severity === 'critical' ? '#ef4444' : anom.severity === 'warning' ? '#f59e0b' : '#3b82f6';
        ctx.lineWidth = isSelected ? 3 : 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(tx, ty, tr, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]); // Reset line dash

        // Draw crosshair corners of boundary
        ctx.strokeStyle = anom.severity === 'critical' ? '#ef4444' : anom.severity === 'warning' ? '#f59e0b' : '#3b82f6';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(tx - tr - 5, ty); ctx.lineTo(tx - tr + 5, ty);
        ctx.moveTo(tx + tr - 5, ty); ctx.lineTo(tx + tr + 5, ty);
        ctx.moveTo(tx, ty - tr - 5); ctx.lineTo(tx, ty - tr + 5);
        ctx.moveTo(tx, ty + tr - 5); ctx.lineTo(tx, ty + tr + 5);
        ctx.stroke();

        // Pin bubble pointer
        ctx.fillStyle = anom.severity === 'critical' ? '#ef4444' : anom.severity === 'warning' ? '#f59e0b' : '#3b82f6';
        ctx.beginPath();
        ctx.arc(tx, ty, 4, 0, Math.PI * 2);
        ctx.fill();

        // Label annotation banner
        ctx.fillStyle = 'rgba(11, 15, 25, 0.85)';
        ctx.strokeStyle = anom.severity === 'critical' ? '#ef4444' : anom.severity === 'warning' ? '#f59e0b' : '#3b82f6';
        ctx.lineWidth = 1;
        
        const labelText = typeof anom.label === 'object' ? anom.label[language] : anom.label;
        ctx.font = 'bold 10px monospace';
        const textWidth = ctx.measureText(labelText).width;
        
        ctx.fillRect(tx - textWidth/2 - 6, ty - tr - 20, textWidth + 12, 16);
        ctx.strokeRect(tx - textWidth/2 - 6, ty - tr - 20, textWidth + 12, 16);
        
        ctx.fillStyle = '#ffffff';
        ctx.fillText(labelText, tx - textWidth/2, ty - tr - 8);
      });
    }

    // Static DICOM Headings Overlay (Corner HUD details)
    if (showMetadata) {
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('MARYAM-PACS v3.51', 15, 25);

      ctx.fillStyle = '#9ca3af';
      ctx.font = '10px monospace';
      
      // Top Left Metadata block
      ctx.fillText(`ID: ${uploadedFileName ? 'USER_SCAN_512' : activePreset.id.toUpperCase()}`, 15, 42);
      ctx.fillText(`ANALYST: AI-COPILOT`, 15, 54);
      ctx.fillText(`DATE: ${new Date().toLocaleDateString()}`, 15, 66);
      ctx.fillText(`REGIMENT: CLINICAL STATION 12`, 15, 78);

      // Top Right Technical Settings
      ctx.fillStyle = '#9ca3af';
      ctx.font = '10px monospace';
      ctx.fillText(`ZOOM: ${filters.zoom.toFixed(1)}x`, 400, 25);
      ctx.fillText(`BRIGHT: ${filters.brightness}%`, 400, 37);
      ctx.fillText(`CONTRAST: ${filters.contrast}%`, 400, 49);
      ctx.fillText(`FILT: ${filters.invert ? 'INVERT' : 'NATIVE'}${filters.sharpness ? '+SHARP' : ''}`, 400, 61);

      // Bottom Left Patient Details
      ctx.fillText(`MODALITY: ${selectedModality.toUpperCase()}`, 15, 465);
      ctx.fillText(`SLICE: 14 / 24`, 15, 477);
      ctx.fillText(`THICKNESS: 1.50mm`, 15, 489);
      
      // Bottom Right Hospital context
      const regionLabel = activePreset.subtitle[language];
      ctx.fillText('Tashkent Regional, UZ', 360, 477);
      ctx.fillText('maryam-med.uz', 415, 489);
    }
  };

  // Canvas Vector Anatomical Drawings inside viewport
  const drawAnatomyPlaceholder = (ctx: CanvasRenderingContext2D, presetId: string) => {
    ctx.save();
    
    // Draw default anatomical templates on coordinate context representing actual radiologic outputs
    if (presetId.includes('chest_pnevmonia') || presetId.includes('normal_chest_xray')) {
      // 1. CHEST X-RAY Draw Outline
      const isPneumonia = presetId.includes('chest_pnevmonia');

      // Draw chest spine column
      ctx.fillStyle = '#374151';
      ctx.fillRect(246, 50, 20, 412);
      ctx.strokeStyle = '#111827';
      ctx.lineWidth = 2;
      for (let spinal = 60; spinal < 450; spinal += 20) {
        ctx.strokeRect(246, spinal, 20, 16);
      }

      // Draw Clavicles (Ключицы)
      ctx.strokeStyle = '#4b5563';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(246, 110);
      ctx.quadraticCurveTo(170, 90, 80, 120);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(266, 110);
      ctx.quadraticCurveTo(342, 90, 432, 120);
      ctx.stroke();

      // Lung Fields (темные прозрачные поля легочные)
      // Left Lung
      ctx.fillStyle = 'rgba(5, 5, 10, 0.9)';
      ctx.strokeStyle = '#4b5563';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(230, 120);
      ctx.bezierCurveTo(200, 70, 70, 110, 90, 360);
      ctx.bezierCurveTo(100, 390, 180, 380, 230, 350);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Right Lung
      ctx.beginPath();
      ctx.moveTo(282, 120);
      ctx.bezierCurveTo(312, 70, 442, 110, 422, 360);
      ctx.bezierCurveTo(412, 390, 332, 380, 282, 350);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Heart Shadow (средостение)
      ctx.fillStyle = '#1f2937';
      ctx.strokeStyle = '#374151';
      ctx.beginPath();
      ctx.moveTo(240, 150);
      ctx.bezierCurveTo(200, 180, 180, 320, 230, 360);
      ctx.lineTo(282, 355);
      ctx.bezierCurveTo(300, 300, 290, 200, 272, 150);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Diaphragm (диафрагма)
      ctx.fillStyle = '#1f2937';
      ctx.beginPath();
      ctx.moveTo(50, 412);
      ctx.quadraticCurveTo(160, 350, 256, 380);
      ctx.quadraticCurveTo(350, 350, 462, 412);
      ctx.lineTo(462, 512);
      ctx.lineTo(50, 512);
      ctx.closePath();
      ctx.fill();

      // Rib cage loops (ребра)
      ctx.strokeStyle = 'rgba(75, 85, 99, 0.45)';
      ctx.lineWidth = 7;
      for (let rY = 140; rY < 350; rY += 32) {
        // Right side ribs shadow
        ctx.beginPath();
        ctx.moveTo(248, rY);
        ctx.quadraticCurveTo(140, rY - 10, 100, rY + 25);
        ctx.stroke();
        // Left side ribs shadow
        ctx.beginPath();
        ctx.moveTo(264, rY);
        ctx.quadraticCurveTo(372, rY - 10, 412, rY + 25);
        ctx.stroke();
      }

      // Draw Pathological Infiltration focus on Left Lower Zone if Pneumonia scan selected
      if (isPneumonia) {
        // Create foggy white pathology gradient representing inflammatory consolidation
        const pGrad = ctx.createRadialGradient(315, 280, 10, 315, 280, 55);
        pGrad.addColorStop(0, 'rgba(230, 240, 255, 0.85)'); // thick density
        pGrad.addColorStop(0.5, 'rgba(210, 220, 240, 0.45)');
        pGrad.addColorStop(1, 'rgba(11, 15, 25, 0)');
        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.arc(315, 280, 65, 0, Math.PI * 2);
        ctx.fill();

        // draw bronchia markings inside focal infiltration
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(290, 240); ctx.lineTo(310, 271); ctx.lineTo(330, 290);
        ctx.moveTo(310, 271); ctx.lineTo(325, 260);
        ctx.stroke();
      }

    } else if (presetId.includes('brain_hemorrhage')) {
      // 2. BRAIN CT - Spontaneous Intracerebral Hemorrhage
      // Draw Circular Skull
      ctx.strokeStyle = '#374151';
      ctx.fillStyle = '#111827';
      ctx.lineWidth = 16;
      ctx.beginPath();
      ctx.arc(256, 256, 170, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Outer Bone density (Bright thin strip representing highly dense calcium skull)
      ctx.strokeStyle = '#d1d5db';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(256, 256, 175, 0, Math.PI * 2);
      ctx.stroke();

      // Inner gray matter lobes contours
      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = 2.5;
      // Draw ventricle loops in centers (glowing butterfly outline, compressed right side)
      ctx.fillStyle = '#030712';
      ctx.beginPath();
      // Left ventricle normal
      ctx.moveTo(246, 212);
      ctx.bezierCurveTo(210, 180, 190, 280, 246, 300);
      ctx.bezierCurveTo(230, 270, 230, 230, 246, 212);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Right ventricle compressed/shrunk by mass effect
      ctx.beginPath();
      ctx.moveTo(266, 222);
      ctx.bezierCurveTo(276, 202, 282, 262, 266, 282);
      ctx.bezierCurveTo(262, 262, 262, 242, 266, 222);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Gyri folds patterns (Мягкие борозды коры)
      ctx.strokeStyle = '#1f2937';
      for (let ang = 0; ang < Math.PI * 2; ang += Math.PI / 4) {
        ctx.beginPath();
        ctx.arc(256 + Math.cos(ang) * 110, 256 + Math.sin(ang) * 110, 30, ang, ang + Math.PI);
        ctx.stroke();
      }

      // Draw Right Hemorrhaging Hyperdensity Blood clot and edema
      // A. Edema (dark gray-blue halo)
      const edemaGrad = ctx.createRadialGradient(215, 235, 10, 215, 235, 45);
      edemaGrad.addColorStop(0, 'rgba(10, 25, 45, 0.85)'); // dark hypoattenuation zone
      edemaGrad.addColorStop(0.7, 'rgba(15, 30, 50, 0.5)');
      edemaGrad.addColorStop(1, 'rgba(17, 24, 39, 0)');
      ctx.fillStyle = edemaGrad;
      ctx.beginPath();
      ctx.arc(215, 235, 55, 0, Math.PI * 2);
      ctx.fill();

      // B. Intracranial hematoma: Bright hyperdense pooling area
      const bloodGrad = ctx.createRadialGradient(215, 225, 5, 215, 225, 25);
      bloodGrad.addColorStop(0, '#f9fafb');      // very white core qon quyilish o'chog'i CT-da
      bloodGrad.addColorStop(0.4, '#e5e7eb');
      bloodGrad.addColorStop(1, '#6b7280');
      ctx.fillStyle = bloodGrad;
      ctx.beginPath();
      // asymmetric organic hematoma outline
      ctx.moveTo(200, 210);
      ctx.quadraticCurveTo(230, 195, 240, 220);
      ctx.quadraticCurveTo(245, 245, 220, 250);
      ctx.quadraticCurveTo(190, 245, 200, 210);
      ctx.closePath();
      ctx.fill();

      // Calcification points (physiological pineal gland in center)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(252, 260, 4, 0, Math.PI * 2);
      ctx.fill();

    } else if (presetId.includes('spine_mri_hernia')) {
      // 3. LUMBAR SPINE MRI Sagaital Vertebrae view
      ctx.lineWidth = 1;
      
      // Draw vertebral core block sequences (тела позвонков)
      // Represent L1, L2, L3, L4, L5 and Sacrum
      const bodiesY = [100, 160, 220, 280, 340, 400];
      const vertNames = ['L1', 'L2', 'L3', 'L4', 'L5', 'S1'];

      // Draw Spinal Cord / Dural Sac behind vertebral bodies
      ctx.fillStyle = '#0b0f19'; // dark fluid
      ctx.strokeStyle = '#d1d5db'; // bright outline
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(290, 60);
      ctx.quadraticCurveTo(285, 240, 298, 320); // standard spinal alignment curve
      // compression notch at L4-L5
      ctx.quadraticCurveTo(286, 325, 290, 345); // herniation pinch point L4-L5
      ctx.quadraticCurveTo(315, 380, 310, 470);
      ctx.lineTo(326, 470);
      ctx.quadraticCurveTo(330, 380, 312, 332);
      ctx.quadraticCurveTo(304, 305, 308, 60);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Soft myelon inside canal (спинной мозг серое вещество)
      ctx.fillStyle = '#4b5563';
      ctx.beginPath();
      ctx.moveTo(298, 60);
      ctx.quadraticCurveTo(294, 240, 303, 315);
      ctx.quadraticCurveTo(295, 335, 316, 440);
      ctx.lineTo(320, 440);
      ctx.quadraticCurveTo(302, 335, 305, 315);
      ctx.quadraticCurveTo(299, 240, 303, 60);
      ctx.closePath();
      ctx.fill();

      // Vertebral Bodies blocks (позвонки серо-белые)
      bodiesY.forEach((vY, idx) => {
        ctx.fillStyle = idx > 4 ? '#374151' : '#4b5563'; // sacrum is dark fused
        ctx.strokeStyle = '#9ca3af';
        ctx.lineWidth = 2;
        ctx.beginPath();
        if (idx === 5) {
          // Sacrum wedge shape
          ctx.moveTo(220, vY);
          ctx.lineTo(285, vY + 10);
          ctx.lineTo(270, vY + 70);
          ctx.lineTo(210, vY + 50);
          ctx.closePath();
        } else {
          // Standard Lumbar lumbar box
          ctx.roundRect(210, vY, 70, 42, 6);
        }
        ctx.fill();
        ctx.stroke();

        // Print vertebral segment labels
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px monospace';
        ctx.fillText(vertNames[idx], 220, vY + 24);

        // Intervertebral Disks (межпозвонковые диски)
        if (idx < 5) {
          const isL4_L5 = idx === 3; // hernia disc
          
          ctx.fillStyle = isL4_L5 ? '#d1d5db' : '#1f2937';
          ctx.strokeStyle = '#6b7280';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          
          if (isL4_L5) {
            // Hernia protrusion: bulging posteriorly L4-L5
            ctx.moveTo(210, vY + 42);
            ctx.lineTo(280, vY + 42);
            // bulge extending to 300px, invading the dural sac!
            ctx.bezierCurveTo(298, vY + 44, 301, vY + 54, 280, vY + 58);
            ctx.lineTo(210, vY + 58);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // highlight nucleus pulposus core herniating
            const bpGrad = ctx.createRadialGradient(282, vY + 50, 1, 282, vY + 50, 10);
            bpGrad.addColorStop(0, '#ef4444'); // hot red active compression zone
            bpGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
            ctx.fillStyle = bpGrad;
            ctx.beginPath();
            ctx.arc(282, vY + 51, 12, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Normal symmetric disc
            ctx.fillRect(212, vY + 42, 66, 16);
            ctx.strokeRect(212, vY + 42, 66, 16);
            
            // central healthy high intensity signal (nucleus pulposus T2 bright band)
            ctx.fillStyle = '#9ca3af';
            ctx.fillRect(225, vY + 48, 40, 4);
          }
        }
      });
    }

    ctx.restore();
  };

  // Triggers server-side AI processing of the loaded frame
  const analyzeScan = async () => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    onAnalysisResult(null); // Clear previous

    try {
      // If client loaded a custom file and we have no API Key we still want it to look beautiful
      const payload: any = {
        language,
        modality: selectedModality,
        patientSymptoms
      };

      if (uploadedImage) {
        payload.image = uploadedImage;
      } else {
        // Submit static preset rendering mock base64/placeholder to trigger server logic
        payload.image = activePreset.sampleFileLabel; 
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Tashqi server bilan ishonchli aloqa yo'q.");
      }

      // Successful analysis result
      setActiveAnalysis(data.report);
      onAnalysisResult(data);

      // If annotated regions present, pre-select the first anomaly to guide focus
      if (data.report.annotatedRegions?.length > 0) {
        setSelectedAnomalyId(data.report.annotatedRegions[0].label);
      }

    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        language === 'uz' 
          ? "Maryam AI serveri bilan aloqa bog'lashda xatolik yuz berdi. Iltimos qaytadan urinib ko'ring."
          : language === 'en'
          ? "Failed to communicate with Maryam AI analysis node. Please confirm server variables and retry."
          : "Ошибка запуска диагностического модуля Maryam AI. Сеть недоступна или превышен лимит."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // File Upload Handlers (Drag and Drop is highly recommended to follow)
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  // Convert uploaded files to base64 images and extract meta label
  const processFile = (file: File) => {
    if (!file.type.match('image.*') && !file.name.endsWith('.dcm') && !file.name.endsWith('.DICOM')) {
      alert(
        language === 'uz'
          ? "Faqatgina rasm formatlari (PNG, JPEG, WEBP) yoki simulyatsiya uchun DICOM formatini yuklang!"
          : "Пожалуйста, выберите корректный медицинский снимок графического формата (PNG, JPEG)!"
      );
      return;
    }

    setUploadedFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImage(result);
      setActiveAnalysis(null);
      setSelectedAnomalyId(null);
    };
    reader.readAsDataURL(file);
  };

  // Clear current uploaded scans to return to preset grids
  const clearUpload = () => {
    setUploadedImage(null);
    setUploadedFileName(null);
    setActiveAnalysis(null);
    setSelectedAnomalyId(null);
  };

  // Interactive mouse click parsing relative to anomalies within PACS viewer window
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Detect click in standard visual coords mapped with transforms
    const listToCheck = activeAnalysis?.annotatedRegions || activePreset.anomalies;
    let clickedAnomaly = null;

    for (const anom of listToCheck) {
      const absoluteX = (anom.x / 100) * 512;
      const absoluteY = (anom.y / 100) * 512;
      
      // Target coordinates mapped via current zoom, pan settings
      const tx = (absoluteX - 256) * filters.zoom + 256 + filters.panX;
      const ty = (absoluteY - 256) * filters.zoom + 256 + filters.panY;
      const tr = anom.r * filters.zoom;

      const distance = Math.sqrt((clickX - tx) ** 2 + (clickY - ty) ** 2);
      
      if (distance <= Math.max(tr, 18)) { // margin tolerance click
        clickedAnomaly = anom;
        break;
      }
    }

    if (clickedAnomaly) {
      setSelectedAnomalyId(clickedAnomaly.id || clickedAnomaly.label);
    } else {
      setSelectedAnomalyId(null);
    }
  };

  // Start panning drag tracking
  const handleMouseDown = (e: React.MouseEvent) => {
    if (filters.zoom > 1.0) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - filters.panX, y: e.clientY - filters.panY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && filters.zoom > 1.0) {
      setFilters(prev => ({
        ...prev,
        panX: e.clientX - panStart.x,
        panY: e.clientY - panStart.y
      }));
    }
  };

  const handleMouseUpOrLeave = () => {
    setIsPanning(false);
  };

  const currentAnomaly = (activeAnalysis?.annotatedRegions || activePreset.anomalies).find(
    (a: any) => selectedAnomalyId === a.id || selectedAnomalyId === a.label
  );

  // Patient profiles correlating to Clinical Presets for high-fidelity clinical simulation (enhances medical look)
  const patientProfiles: Record<string, { name: string; age: number; gender: string; caseId: string; status: string; statusColor: string }> = {
    chest_pnevmonia: {
      name: language === 'uz' ? "Usmanov Bekzod To'lqinovich" : language === 'en' ? "Usmanov Bekzod T." : "Усманов Бекзод Толкунович",
      age: 42,
      gender: language === 'uz' ? "Erkak" : language === 'en' ? "Male" : "Мужской",
      caseId: "PACS-PN-2026-X89",
      status: language === 'uz' ? "O'rtacha og'ir" : language === 'en' ? "Moderate Infiltration" : "Средняя тяжесть",
      statusColor: "text-amber-705 bg-amber-50 border-amber-200/50"
    },
    brain_hemorrhage: {
      name: language === 'uz' ? "Karimova Nargiza Farxodovna" : language === 'en' ? "Karimova Nargiza F." : "Каримова Наргиза Фарходовна",
      age: 61,
      gender: language === 'uz' ? "Ayol" : language === 'en' ? "Female" : "Женский",
      caseId: "PACS-ICH-2026-C01",
      status: language === 'uz' ? "Kritik (Shoshilinch)" : language === 'en' ? "Critical (Emergency)" : "Тяжелое (Реанимация)",
      statusColor: "text-red-700 bg-red-50 border-red-200/50"
    },
    spine_hernia: {
      name: language === 'uz' ? "Ibragimov Sobir Rustamovich" : language === 'en' ? "Ibragimov Sobir R." : "Ибрагимов Собир Рустамович",
      age: 35,
      gender: language === 'uz' ? "Erkak" : language === 'en' ? "Male" : "Мужской",
      caseId: "PACS-LDH-2026-M55",
      status: language === 'uz' ? "Stabil" : language === 'en' ? "Stable" : "Стабильное",
      statusColor: "text-emerald-700 bg-emerald-50 border-emerald-200/50"
    }
  };

  const activePatient = uploadedFileName 
    ? {
        name: uploadedFileName,
        age: language === 'uz' ? "Yangi bemor" : "Новый случай",
        gender: "—",
        caseId: "PACS-TEMP-" + Math.floor(Math.random() * 900 + 100),
        status: language === 'uz' ? "Tahlil qilinmoqda" : "Ожидает анализа",
        statusColor: "text-blue-700 bg-blue-50 border-blue-200/50"
      }
    : patientProfiles[activePresetId] || patientProfiles['chest_pnevmonia'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* 1. Main PACS View Station (8-cols width for focus) */}
      <div className="lg:col-span-8 flex flex-col space-y-4">
        
        {/* Dynamic PACS View Header */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 flex flex-wrap gap-4 items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="font-mono text-xs uppercase tracking-wider text-slate-800 font-bold">
                {language === 'uz' ? 'Rentgenologik tasvirlar stansiyasi' : language === 'en' ? 'PACS Workstation Monitor' : 'Рентгенологическое рабочее место'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              {uploadedFileName ? `${uploadedFileName} (User File)` : activePreset.subtitle[language]}
            </p>
          </div>

          <div className="flex space-x-2">
            <button 
              id="btn-toggle-meta"
              onClick={() => setShowMetadata(!showMetadata)}
              className={`p-2 rounded-lg border font-mono text-xs transition duration-150 flex items-center space-x-1 cursor-pointer ${
                showMetadata 
                  ? 'bg-emerald-50 border-emerald-500/20 text-emerald-700 font-bold' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-800'
              }`}
              title="Toggle HUD Metadata parameters"
            >
              <LayoutTemplate size={14} />
              <span className="hidden sm:inline">HUD</span>
            </button>

            <button 
              id="btn-toggle-ann"
              onClick={() => setShowAnnotations(!showAnnotations)}
              className={`p-2 rounded-lg border font-mono text-xs transition duration-150 flex items-center space-x-1 cursor-pointer ${
                showAnnotations 
                  ? 'bg-amber-50 border-amber-500/25 text-amber-700 font-bold' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-800'
              }`}
              title="Toggle Pathological Annotations Overlay"
            >
              <Eye size={14} />
              <span className="hidden sm:inline">
                {language === 'uz' ? 'Ochogʻ' : language === 'en' ? 'Anomalies' : 'Очаги'}
              </span>
            </button>

            <button 
              id="btn-reset-filters"
              onClick={resetFilters}
              className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-800 transition duration-150 flex items-center space-x-1 cursor-pointer"
              title="Reset Filters to clinical defaults"
            >
              <RotateCcw size={14} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* The Live Interactive Canvas Screen Box - Framed in Silver Medical Bezel shadow */}
        <div className="relative bg-[#0b0f19] border-4 border-slate-200 shadow-lg rounded-2xl overflow-hidden flex flex-col items-center justify-center min-h-[460px] sm:min-h-[512px] group">
          
          <canvas
            id="dicom-canvas"
            ref={canvasRef}
            onClick={handleCanvasClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className={`max-w-full aspect-square border-black shadow-inner shadow-black transition-all ${
              filters.zoom > 1.0 ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
            }`}
          />

          {/* Quick-control Float Filters Overlay */}
          <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md border border-slate-800 px-3 py-2 rounded-xl flex items-center space-x-2 text-xs text-slate-400 transition-all opacity-75 hover:opacity-100">
            <Sliders size={12} className="text-emerald-400" />
            <button onClick={() => setFilters(prev => ({ ...prev, zoom: Math.min(prev.zoom + 0.25, 3) }))} className="p-1 hover:text-white transition cursor-pointer" title="Zoom In"><ZoomIn size={14} /></button>
            <button onClick={() => setFilters(prev => ({ ...prev, zoom: Math.max(prev.zoom - 0.25, 1) }))} className="p-1 hover:text-white transition cursor-pointer" title="Zoom Out"><ZoomOut size={14} /></button>
            <button onClick={() => setFilters(prev => ({ ...prev, invert: !prev.invert }))} className={`p-1 cursor-pointer ${filters.invert ? 'text-emerald-400' : 'hover:text-white'}`} title="Invert Colors">Inv</button>
            <button onClick={() => setFilters(prev => ({ ...prev, sharpness: !prev.sharpness }))} className={`p-1 cursor-pointer ${filters.sharpness ? 'text-emerald-400' : 'hover:text-white'}`} title="Contrast Boost">HE</button>
          </div>

          {/* Indicator if Zoom > 1.0 */}
          {filters.zoom > 1.0 && (
            <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-400 font-mono text-xs px-2.5 py-1 rounded-full border border-emerald-500/30">
              {filters.zoom.toFixed(2)}x Zoom (Pan Active)
            </div>
          )}

          {/* Prompt banner if upload is empty & loading is none */}
          {uploadedImage && (
            <button 
              id="clear-upl-btn"
              onClick={clearUpload}
              className="absolute top-4 left-4 bg-red-100 text-red-700 hover:bg-red-200 border border-red-200 font-mono text-xs px-2.5 py-1.5 rounded-lg transition"
            >
              × {language === 'uz' ? "Skanerdan chiqish" : "Сбросить снимок"}
            </button>
          )}
        </div>

        {/* Diagnostics & Symptom input card */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
          <div className="flex flex-col space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-500 font-bold mb-1.5">
                {language === 'uz' ? 'Shifokor qoʻshimcha izohlari va kasallik belgilari' : language === 'en' ? 'Clinical Notes / Patient Symptoms' : 'Клинический анамнез / Симптомы пациента'}
              </label>
              <textarea
                id="clinical-notes-input"
                rows={2}
                value={patientSymptoms}
                onChange={(e) => setPatientSymptoms(e.target.value)}
                placeholder={
                  language === 'uz'
                    ? "Masalan: Chap bo'lakda tana harorati oshishi, quruq yo'tal, hansirash..."
                    : language === 'en'
                    ? "E.g. Fever for 3 days, acute thoracic discomfort, localized spinal pain radiating to left limb..."
                    : "Например: Сухой кашель, температура 38.5, сильные боли в пояснице, отдающие в левую ногу..."
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/50 resize-none font-sans"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                id="btn-trigger-ai-analysis"
                onClick={analyzeScan}
                disabled={isAnalyzing}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-550 text-white font-bold px-4 py-3 rounded-lg flex items-center justify-center space-x-2 shadow-sm cursor-pointer text-sm disabled:opacity-50 transition duration-200"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="animate-spin text-white" size={16} />
                    <span className="font-mono">
                      {language === 'uz' ? 'MARYAM AI TAXLIL QILMOQDA...' : language === 'en' ? 'MARYAM AI CLASSIFYING...' : 'MARYAM AI АНАЛИЗИРУЕТ...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Play fill="currentColor" size={14} className="text-white" />
                    <span>
                      {language === 'uz' ? 'Maryam AI Neyrotarmogʻi bilan tahlil qilish' : language === 'en' ? 'Run Maryam AI Neural Diagnosis' : 'Запустить ИИ-анализ снимка'}
                    </span>
                  </>
                )}
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start space-x-2">
                <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={15} />
                <p className="text-xs text-red-700">{errorMessage}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Controls & Sidebar annotations (4-cols width) */}
      <div className="lg:col-span-4 flex flex-col space-y-6">
        
        {/* Active Patient EHR Case Profile */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden">
          {/* Medical icon watermark decoration */}
          <div className="absolute top-2 right-2 text-slate-100 font-bold text-4xl select-none pointer-events-none">✚</div>
          
          <h4 className="font-mono text-xs uppercase tracking-wider text-slate-500 font-bold mb-3 flex items-center space-x-1.5 border-b border-slate-100 pb-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
            <span>{language === 'uz' ? "Bemor EMR Kartasi" : language === 'en' ? "EHR Patient Record" : "Электронная карта пациента (EHR)"}</span>
          </h4>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between border-b border-slate-50 pb-1.5">
              <span className="text-slate-500 font-mono tracking-tight">{language === 'uz' ? "Ismi sharifi:" : "ФИО Пациента:"}</span>
              <span className="font-bold text-slate-900 text-right truncate max-w-[70%]">{activePatient.name}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 border-b border-slate-50 pb-1.5">
              <div>
                <span className="text-slate-505 font-mono text-[10px] block">{language === 'uz' ? "Yoshi:" : "Возраст:"}</span>
                <span className="font-bold text-slate-800">{activePatient.age} {language === 'ru' ? 'лет' : 'y/o'}</span>
              </div>
              <div>
                <span className="text-slate-505 font-mono text-[10px] block">{language === 'uz' ? "Jinsi:" : "Пол:"}</span>
                <span className="font-bold text-slate-800">{activePatient.gender}</span>
              </div>
            </div>

            <div className="flex justify-between border-b border-slate-50 pb-1.5">
              <span className="text-slate-500 font-mono">EMR ID:</span>
              <span className="font-mono text-slate-700 font-semibold">{activePatient.caseId}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-mono">{language === 'uz' ? "Klinik status:" : "Клинический статус:"}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${activePatient.statusColor}`}>
                {activePatient.status}
              </span>
            </div>
          </div>
        </div>

        {/* Live Clinical Vitals Monitor - Hospital style glowing dashboard */}
        <div className="bg-slate-900 text-emerald-400 border border-slate-950 rounded-xl p-5 shadow-inner relative overflow-hidden font-mono text-xs select-none">
          {/* Grid lines background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none"></div>
          
          <div className="flex justify-between items-center border-b border-emerald-950 pb-2 mb-3">
            <div className="flex items-center space-x-1.5">
              <Activity size={14} className="text-emerald-500 animate-pulse" />
              <span className="text-[10px] uppercase tracking-wider text-emerald-500 font-bold">PACS Live Telemetry</span>
            </div>
            <span className="text-[9px] bg-emerald-950 text-emerald-400 px-1 rounded border border-emerald-800/40 animate-pulse">74 BPM</span>
          </div>

          <div className="grid grid-cols-2 gap-4 relative z-10">
            <div>
              <span className="text-[9px] text-emerald-600 block">PULSE_RATE</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-xl font-bold tracking-tight">74</span>
                <span className="text-[9px] text-emerald-550">/min</span>
              </div>
            </div>
            <div>
              <span className="text-[9px] text-emerald-600 block">SPO2 (OXYGEN)</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-xl font-bold tracking-tight">98%</span>
                <span className="text-[9px] text-emerald-550">NORMAL</span>
              </div>
            </div>
            <div>
              <span className="text-[9px] text-emerald-600 block">BLOOD_PRESSURE</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-xl font-bold tracking-tight">120/80</span>
                <span className="text-[9px] text-emerald-550">mmHg</span>
              </div>
            </div>
            <div>
              <span className="text-[9px] text-emerald-600 block">TEMP</span>
              <div className="flex items-baseline space-x-1">
                <span className="text-xl font-bold tracking-tight">36.6</span>
                <span className="text-[9px] text-emerald-550">°C</span>
              </div>
            </div>
          </div>

          {/* Glowing Heartbeat Line */}
          <div className="h-8 mt-3 relative overflow-hidden bg-slate-950/60 border border-emerald-950 rounded flex items-center">
            <svg className="w-full h-full stroke-emerald-500 fill-none" viewBox="0 0 100 30" preserveAspectRatio="none">
              <path 
                strokeWidth="1.5"
                d="M 0 15 L 10 15 L 15 15 L 18 5 L 21 25 L 24 15 L 35 15 L 45 15 L 50 15 L 53 5 L 56 25 L 59 15 L 70 15 L 85 15 M 100 15"
                className="animate-[pulse_1.5s_infinite_ease-in-out]"
                style={{ strokeDasharray: "300", strokeDashoffset: "0" }}
              />
            </svg>
          </div>
        </div>

        {/* Switch presets library / Clinical catalogs */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
          <h4 className="font-mono text-xs uppercase tracking-wider text-slate-500 font-bold mb-3 flex items-center space-x-1.5 border-b border-slate-100 pb-2">
            <LayoutTemplate size={14} className="text-emerald-500" />
            <span>{language === 'uz' ? 'Diagnostika Shabloni' : language === 'en' ? 'Preset Scan Modules' : 'Клинические шаблоны'}</span>
          </h4>
          
          <div className="space-y-2.5">
            {MEDICAL_PRESETS.map((preset) => {
              const isActive = preset.id === activePresetId && !uploadedImage;
              return (
                <button
                  id={`preset-selector-${preset.id}`}
                  key={preset.id}
                  onClick={() => handlePresetChange(preset.id)}
                  className={`w-full text-left p-3 rounded-lg border text-xs transition duration-150 flex flex-col space-y-1 cursor-pointer ${
                    isActive
                      ? 'bg-slate-55 border-emerald-500/30 text-slate-900 font-bold shadow-xs'
                      : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold uppercase tracking-tight truncate max-w-[80%]">
                      {preset.title[language]}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] bg-slate-100 border border-slate-200 font-mono text-slate-500 leading-none">
                      {preset.type.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-slate-500 font-medium line-clamp-1">
                    {preset.subtitle[language]}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            <p className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-2">
              {language === 'uz' ? "O'z shaxsiy tasviringizni yuklang" : language === 'en' ? 'Or upload clinic scan' : 'Или загрузите снимок клиники'}
            </p>

            {/* Drag and Drop File Input Area */}
            <div
              id="dropzone"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition duration-150 flex flex-col items-center justify-center space-y-1.5 ${
                isDragOver ? 'bg-emerald-50 border-emerald-400' : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100 hover:border-slate-350'
              }`}
            >
              <Upload size={18} className="text-slate-400 animate-bounce" />
              <div className="text-xs text-slate-700 font-semibold">
                {language === 'uz' ? 'Faylni tanlash' : language === 'en' ? 'Click or drag files' : 'Перетащите снимок'}
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                DICOM / PNG / JPEG (max 20MB)
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*,.dcm,.DICOM"
                onChange={handleFileSelect}
              />
            </div>
          </div>
        </div>

        {/* Active Selected Annotation / Target ROI info */}
        {showAnnotations && (
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5">
            <h4 className="font-mono text-xs uppercase tracking-wider text-slate-500 font-bold mb-3 flex items-center space-x-1.5 border-b border-slate-100 pb-2">
              <Activity size={14} className="text-indigo-400" />
              <span>
                {language === 'uz' ? 'Tanlangan jarohat sohasi' : language === 'en' ? 'Interactive Region of Interest' : 'Интерактивные очаги (ROI)'}
              </span>
            </h4>

            {currentAnomaly ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-bold text-slate-900 text-sm">
                    {typeof currentAnomaly.label === 'object' ? currentAnomaly.label[language] : currentAnomaly.label}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono tracking-wider font-semibold ${
                    currentAnomaly.severity === 'critical' 
                      ? 'bg-red-50 text-red-700 border border-red-100' 
                      : currentAnomaly.severity === 'warning' 
                      ? 'bg-amber-50 text-amber-700 border border-amber-100' 
                      : 'bg-blue-50 text-blue-700 border border-blue-100'
                  }`}>
                    {currentAnomaly.severity.toUpperCase()}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-sans">
                  {typeof currentAnomaly.description === 'object' ? currentAnomaly.description[language] : currentAnomaly.description}
                </p>

                <div className="bg-slate-50 rounded-lg p-2.5 font-mono text-[10px] text-slate-550 space-y-1 border border-slate-150">
                  <div className="flex justify-between">
                    <span>X_COORD:</span>
                    <span className="text-slate-800 font-semibold">{currentAnomaly.x.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Y_COORD:</span>
                    <span className="text-slate-800 font-semibold">{currentAnomaly.y.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>RADIUS_PIXELS:</span>
                    <span className="text-slate-800 font-semibold">{currentAnomaly.r}px_rad</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CLINICAL_ALERT:</span>
                    <span className={currentAnomaly.severity === 'critical' ? 'text-red-600 font-bold' : 'text-slate-600'}>
                      {currentAnomaly.severity === 'critical' ? 'IMMEDIATE CARE' : 'MONITOR GRADIENT'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-slate-400 flex flex-col items-center justify-center space-y-2">
                <HelpCircle size={28} className="text-slate-350" />
                <p className="text-xs font-medium max-w-xs">
                  {language === 'uz' 
                    ? "Skaner sohasidagi tahlil nuqtalarini bosib batafsil ma'lumot oling." 
                    : language === 'en'
                    ? "Click on any highlighted marker within the scan container to load localization metrics."
                    : "Нажмите на подсвеченный очаг на снимке, чтобы загрузить данные анатомической локализации."}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Professional Radiation safety & DICOM information Box */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 text-xs space-y-2 font-mono text-slate-500">
          <div className="flex justify-between border-b border-slate-50 pb-1.5">
            <span className="text-slate-400 font-medium">PACS CALIBRATION:</span>
            <span className="text-emerald-600 font-semibold">99.8% READY</span>
          </div>
          <div className="flex justify-between border-b border-slate-50 pb-1.5">
            <span className="text-slate-400 font-medium">DICOM STANDARDS:</span>
            <span className="text-slate-705">HL7 / SCP SERVICE</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-medium">INTEGRATED HOSPITALS:</span>
            <span className="text-slate-705 font-bold">75 CLINICS</span>
          </div>
        </div>

      </div>
    </div>
  );
}
