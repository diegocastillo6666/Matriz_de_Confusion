import React, { useState } from 'react';
import {
  X,
  Download,
  FileCode,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Layers,
  Info,
} from 'lucide-react';
import { SectorCase, MatrixValues } from '../types';
import { generateSingleTopicHtml, generateFullCourseHtml, downloadHtmlFile } from '../utils/htmlExporter';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSector: SectorCase;
  currentMatrix: MatrixValues;
  onExportSuccess?: (xpReward: number) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  activeSector,
  currentMatrix,
  onExportSuccess,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExportCurrent = () => {
    const html = generateSingleTopicHtml(activeSector, currentMatrix);
    const sanitizedName = activeSector.id.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const filename = `matriz_confusion_${sanitizedName}.html`;
    downloadHtmlFile(html, filename);

    setDownloadSuccess(`Se ha descargado "${filename}" con éxito.`);
    if (onExportSuccess) onExportSuccess(25);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const handleExportFullCourse = () => {
    const html = generateFullCourseHtml();
    const filename = `manual_maestro_matriz_confusion_ml.html`;
    downloadHtmlFile(html, filename);

    setDownloadSuccess(`Se ha descargado el curso completo en "${filename}".`);
    if (onExportSuccess) onExportSuccess(50);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Exportar Explicación a HTML</h3>
              <p className="text-xs text-slate-500">
                Documentos autónomos y legibles en cualquier navegador sin conexión
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notification Toast */}
        {downloadSuccess && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3 text-xs text-blue-900">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p>
              El archivo descargado incluye todo el código HTML y estilos CSS embebidos. Puedes abrirlo
              haciendo doble clic desde tu ordenador, enviarlo por correo o imprimirlo en PDF sin necesidad de
              conexión a internet ni acceso a Google AI Studio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Opción 1: Exportar explicación actual */}
            <div className="border-2 border-slate-200 hover:border-indigo-500 rounded-xl p-5 flex flex-col justify-between transition hover:shadow-md bg-white group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition">
                    <FileCode className="w-5 h-5" />
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md uppercase">
                    Caso Activo
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-base mb-1">
                  1. Exportar Explicación Actual
                </h4>
                <p className="text-xs text-slate-500 mb-3">
                  Exporta el caso seleccionado: <strong>{activeSector.name}</strong> con su matriz de confusión
                  actual, las 7 métricas calculadas y las recomendaciones empresariales.
                </p>
                <div className="text-[11px] text-slate-600 space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div>• Sector: <strong>{activeSector.sectorName}</strong></div>
                  <div>• Total observaciones: <strong>{(currentMatrix.tp + currentMatrix.fp + currentMatrix.fn + currentMatrix.tn).toLocaleString()}</strong></div>
                  <div>• Archivo: <code className="text-indigo-600">matriz_confusion_{activeSector.id}.html</code></div>
                </div>
              </div>

              <button
                onClick={handleExportCurrent}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 rounded-lg transition"
              >
                <Download className="w-4 h-4" />
                Descargar Caso Actual
              </button>
            </div>

            {/* Opción 2: Exportar curso completo */}
            <div className="border-2 border-indigo-200 hover:border-indigo-600 rounded-xl p-5 flex flex-col justify-between transition hover:shadow-md bg-gradient-to-b from-indigo-50/50 to-white group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="p-2 bg-indigo-600 text-white rounded-lg shadow-xs">
                    <BookOpen className="w-5 h-5" />
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-md uppercase">
                    Curso Completo
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-base mb-1">
                  2. Exportar Curso y Manual Maestro
                </h4>
                <p className="text-xs text-slate-500 mb-3">
                  Documento integral que incluye los fundamentos teóricos, fórmulas matemáticas, los 8 sectores
                  económicos completos y el decálogo de decisiones en producción.
                </p>
                <div className="text-[11px] text-slate-600 space-y-1 bg-indigo-50/70 p-2.5 rounded-lg border border-indigo-100">
                  <div>• Incluye los <strong>8 sectores económicos</strong></div>
                  <div>• Formulario con las <strong>7 fórmulas matemáticas</strong></div>
                  <div>• Archivo: <code className="text-indigo-700">manual_maestro_matriz_confusion_ml.html</code></div>
                </div>
              </div>

              <button
                onClick={handleExportFullCourse}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-2.5 rounded-lg shadow-sm shadow-indigo-300 transition"
              >
                <Sparkles className="w-4 h-4" />
                Descargar Curso Completo
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
