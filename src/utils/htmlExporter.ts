import { SectorCase, MatrixValues } from '../types';
import { calculateMetrics } from './metrics';
import { FUNDAMENTAL_CONCEPTS } from '../data/fundamentals';
import { SECTOR_CASES } from '../data/sectors';

const BASE_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.6;
    color: #1e293b;
    background-color: #f8fafc;
    padding: 24px;
  }
  .container { max-width: 960px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
  header { border-bottom: 2px solid #e2e8f0; padding-bottom: 24px; margin-bottom: 32px; }
  h1 { font-size: 28px; font-weight: 800; color: #0f172a; margin-bottom: 8px; }
  .subtitle { font-size: 16px; color: #64748b; }
  .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; }
  .badge-primary { background-color: #e0e7ff; color: #4338ca; }
  .badge-success { background-color: #dcfce7; color: #15803d; }
  .badge-warning { background-color: #fef3c7; color: #b45309; }
  .badge-danger { background-color: #fee2e2; color: #b91c1c; }
  .badge-info { background-color: #e0f2fe; color: #0369a1; }
  h2 { font-size: 22px; font-weight: 700; color: #1e293b; margin: 32px 0 16px; border-left: 4px solid #4f46e5; padding-left: 12px; }
  h3 { font-size: 18px; font-weight: 600; color: #334155; margin: 20px 0 10px; }
  p { margin-bottom: 14px; font-size: 15px; color: #334155; }
  ul, ol { margin-left: 24px; margin-bottom: 16px; font-size: 15px; color: #334155; }
  li { margin-bottom: 6px; }

  /* Confusion Matrix Table */
  .matrix-wrapper { overflow-x: auto; margin: 24px 0; }
  .matrix-table { width: 100%; border-collapse: separate; border-spacing: 6px; table-layout: fixed; }
  .matrix-th { padding: 12px; font-size: 13px; font-weight: 700; text-align: center; background: #f1f5f9; border-radius: 8px; color: #475569; }
  .cell-tp { background-color: #ecfdf5; border: 2px solid #10b981; border-radius: 10px; padding: 16px; text-align: center; }
  .cell-fp { background-color: #fffbeb; border: 2px solid #f59e0b; border-radius: 10px; padding: 16px; text-align: center; }
  .cell-fn { background-color: #fef2f2; border: 2px solid #ef4444; border-radius: 10px; padding: 16px; text-align: center; }
  .cell-tn { background-color: #eff6ff; border: 2px solid #3b82f6; border-radius: 10px; padding: 16px; text-align: center; }
  .cell-val { font-size: 26px; font-weight: 800; margin: 4px 0; }
  .cell-tp .cell-val { color: #065f46; }
  .cell-fp .cell-val { color: #92400e; }
  .cell-fn .cell-val { color: #991b1b; }
  .cell-tn .cell-val { color: #1e40af; }
  .cell-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
  .cell-tp .cell-title { color: #047857; }
  .cell-fp .cell-title { color: #b45309; }
  .cell-fn .cell-title { color: #b91c1c; }
  .cell-tn .cell-title { color: #2563eb; }
  .cell-desc { font-size: 12px; color: #475569; margin-top: 6px; line-height: 1.4; }

  /* Metrics Grid */
  .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; margin: 24px 0; }
  .metric-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; }
  .metric-label { font-size: 13px; font-weight: 600; color: #64748b; }
  .metric-value { font-size: 24px; font-weight: 800; color: #0f172a; margin: 4px 0; }
  .metric-formula { font-family: monospace; font-size: 11px; background: #e2e8f0; padding: 2px 6px; border-radius: 4px; color: #334155; }
  .metric-desc { font-size: 12px; color: #64748b; margin-top: 6px; }

  /* Callout boxes */
  .callout { background: #f0fdf4; border-left: 4px solid #22c55e; padding: 16px; border-radius: 0 8px 8px 0; margin: 20px 0; }
  .callout-warning { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 0 8px 8px 0; margin: 20px 0; }
  .callout-title { font-weight: 700; font-size: 14px; margin-bottom: 4px; color: #1e293b; }

  footer { margin-top: 48px; pt: 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 13px; color: #94a3b8; }
  @media print {
    body { background: white; padding: 0; }
    .container { box-shadow: none; border: none; padding: 0; }
  }
`;

export function generateSingleTopicHtml(sector: SectorCase, customMatrix?: MatrixValues): string {
  const matrix = customMatrix || sector.defaultMatrix;
  const metrics = calculateMetrics(matrix);
  const now = new Date().toLocaleString('es-ES', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Matriz de Confusión - ${sector.name}</title>
  <style>${BASE_CSS}</style>
</head>
<body>
  <div class="container">
    <header>
      <span class="badge badge-primary">${sector.sectorName}</span>
      <h1>${sector.name}</h1>
      <p class="subtitle">${sector.tagline}</p>
    </header>

    <section>
      <h2>1. Contexto Empresarial y Objetivo</h2>
      <p><strong>Problema de Negocio:</strong> ${sector.businessProblem}</p>
      <p><strong>Objetivo del Modelo:</strong> ${sector.modelObjective}</p>
      <div class="callout">
        <div class="callout-title">Definición de Clases</div>
        <p>• <strong>Clase Positiva (Evento de interés):</strong> ${sector.positiveClass} (${sector.positiveDefinition})</p>
        <p>• <strong>Clase Negativa:</strong> ${sector.negativeClass} (${sector.negativeDefinition})</p>
      </div>
      ${
        sector.disclaimer
          ? `<div class="callout-warning"><div class="callout-title">Aviso Importante</div><p>${sector.disclaimer}</p></div>`
          : ''
      }
    </section>

    <section>
      <h2>2. Matriz de Confusión Observada</h2>
      <p>Total de observaciones auditadas: <strong>${metrics.total.toLocaleString()} casos</strong></p>
      <div class="matrix-wrapper">
        <table class="matrix-table">
          <tr>
            <th class="matrix-th">Realidad \\ Predicción</th>
            <th class="matrix-th">Predicción Positiva: ${sector.positiveClass}</th>
            <th class="matrix-th">Predicción Negativa: ${sector.negativeClass}</th>
          </tr>
          <tr>
            <th class="matrix-th">Real: ${sector.positiveClass}</th>
            <td class="cell-tp">
              <div class="cell-title">Verdadero Positivo (TP)</div>
              <div class="cell-val">${matrix.tp.toLocaleString()}</div>
              <div class="cell-desc">${sector.tpDescription}</div>
              <div style="font-size: 11px; margin-top: 6px; font-style: italic; color: #047857;">Ejemplo: ${sector.tpConcreteExample}</div>
            </td>
            <td class="cell-fn">
              <div class="cell-title">Falso Negativo (FN)</div>
              <div class="cell-val">${matrix.fn.toLocaleString()}</div>
              <div class="cell-desc">${sector.fnDescription}</div>
              <div style="font-size: 11px; margin-top: 6px; font-style: italic; color: #b91c1c;">Ejemplo: ${sector.fnConcreteExample}</div>
            </td>
          </tr>
          <tr>
            <th class="matrix-th">Real: ${sector.negativeClass}</th>
            <td class="cell-fp">
              <div class="cell-title">Falso Positivo (FP)</div>
              <div class="cell-val">${matrix.fp.toLocaleString()}</div>
              <div class="cell-desc">${sector.fpDescription}</div>
              <div style="font-size: 11px; margin-top: 6px; font-style: italic; color: #b45309;">Ejemplo: ${sector.fpConcreteExample}</div>
            </td>
            <td class="cell-tn">
              <div class="cell-title">Verdadero Negativo (TN)</div>
              <div class="cell-val">${matrix.tn.toLocaleString()}</div>
              <div class="cell-desc">${sector.tnDescription}</div>
              <div style="font-size: 11px; margin-top: 6px; font-style: italic; color: #2563eb;">Ejemplo: ${sector.tnConcreteExample}</div>
            </td>
          </tr>
        </table>
      </div>
    </section>

    <section>
      <h2>3. Métricas de Evaluación Calculadas</h2>
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-label">Accuracy (Exactitud)</div>
          <div class="metric-value">${metrics.accuracy.formatted}</div>
          <div class="metric-formula">${metrics.accuracy.formula}</div>
          <div class="metric-desc">${metrics.accuracy.description}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Precision (Precisión)</div>
          <div class="metric-value">${metrics.precision.formatted}</div>
          <div class="metric-formula">${metrics.precision.formula}</div>
          <div class="metric-desc">${metrics.precision.description}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Recall / Sensibilidad</div>
          <div class="metric-value">${metrics.recall.formatted}</div>
          <div class="metric-formula">${metrics.recall.formula}</div>
          <div class="metric-desc">${metrics.recall.description}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Especificidad (TN Rate)</div>
          <div class="metric-value">${metrics.specificity.formatted}</div>
          <div class="metric-formula">${metrics.specificity.formula}</div>
          <div class="metric-desc">${metrics.specificity.description}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">F1-Score</div>
          <div class="metric-value">${metrics.f1Score.formatted}</div>
          <div class="metric-formula">${metrics.f1Score.formula}</div>
          <div class="metric-desc">${metrics.f1Score.description}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Tasa Falsos Positivos (FPR)</div>
          <div class="metric-value">${metrics.fpr.formatted}</div>
          <div class="metric-formula">${metrics.fpr.formula}</div>
          <div class="metric-desc">${metrics.fpr.description}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Tasa Falsos Negativos (FNR)</div>
          <div class="metric-value">${metrics.fnr.formatted}</div>
          <div class="metric-formula">${metrics.fnr.formula}</div>
          <div class="metric-desc">${metrics.fnr.description}</div>
        </div>
      </div>
    </section>

    <section>
      <h2>4. Prioridades y Métricas Críticas para este Negocio</h2>
      <ul>
        ${sector.criticalMetrics
          .map(
            (c) =>
              `<li><strong>${c.metric} (Prioridad ${c.priority}):</strong> ${c.reason}</li>`
          )
          .join('')}
      </ul>
    </section>

    <section>
      <h2>5. Recomendaciones Empresariales</h2>
      <ol>
        ${sector.businessRecommendations.map((r) => `<li>${r}</li>`).join('')}
      </ol>
    </section>

    <footer>
      Documento educativo generado de forma autónoma • Fecha: ${now} • Aplicación Educativa de Matriz de Confusión
    </footer>
  </div>
</body>
</html>`;
}

export function generateFullCourseHtml(): string {
  const now = new Date().toLocaleString('es-ES', {
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const fundamentalsHtml = FUNDAMENTAL_CONCEPTS.map(
    (c) => `
    <article style="margin-bottom: 32px; border-bottom: 1px solid #e2e8f0; padding-bottom: 24px;">
      <h3>${c.title}</h3>
      <p><em>${c.shortSummary}</em></p>
      ${c.content.map((p) => `<p>${p}</p>`).join('')}
      ${
        c.analogyTitle
          ? `<div class="callout"><div class="callout-title">💡 ${c.analogyTitle}</div><p>${c.analogyContent?.replace(/\n/g, '<br>')}</p></div>`
          : ''
      }
      <div style="background: #f1f5f9; padding: 10px 14px; border-radius: 8px; font-weight: 600; font-size: 13px; color: #1e293b;">
        Conclusión Clave: ${c.takeaway}
      </div>
    </article>`
  ).join('');

  const sectorsHtml = SECTOR_CASES.map((sector) => {
    const metrics = calculateMetrics(sector.defaultMatrix);
    return `
    <article style="margin-bottom: 48px; border-bottom: 2px solid #cbd5e1; padding-bottom: 36px;">
      <span class="badge badge-primary">${sector.sectorName}</span>
      <h3>${sector.name}</h3>
      <p class="subtitle" style="margin-bottom: 12px;">${sector.tagline}</p>
      <p><strong>Problema de Negocio:</strong> ${sector.businessProblem}</p>
      <p><strong>Objetivo del Modelo:</strong> ${sector.modelObjective}</p>
      <p>• <strong>Clase Positiva:</strong> ${sector.positiveClass} (${sector.positiveDefinition})</p>
      <p>• <strong>Clase Negativa:</strong> ${sector.negativeClass} (${sector.negativeDefinition})</p>
      
      <div class="matrix-wrapper">
        <table class="matrix-table">
          <tr>
            <th class="matrix-th">Realidad \\ Predicción</th>
            <th class="matrix-th">Predicción Positiva</th>
            <th class="matrix-th">Predicción Negativa</th>
          </tr>
          <tr>
            <th class="matrix-th">Real: ${sector.positiveClass}</th>
            <td class="cell-tp">
              <div class="cell-title">TP: ${sector.defaultMatrix.tp.toLocaleString()}</div>
              <div class="cell-desc">${sector.tpDescription}</div>
            </td>
            <td class="cell-fn">
              <div class="cell-title">FN: ${sector.defaultMatrix.fn.toLocaleString()}</div>
              <div class="cell-desc">${sector.fnDescription}</div>
            </td>
          </tr>
          <tr>
            <th class="matrix-th">Real: ${sector.negativeClass}</th>
            <td class="cell-fp">
              <div class="cell-title">FP: ${sector.defaultMatrix.fp.toLocaleString()}</div>
              <div class="cell-desc">${sector.fpDescription}</div>
            </td>
            <td class="cell-tn">
              <div class="cell-title">TN: ${sector.defaultMatrix.tn.toLocaleString()}</div>
              <div class="cell-desc">${sector.tnDescription}</div>
            </td>
          </tr>
        </table>
      </div>

      <div class="metrics-grid" style="grid-template-columns: repeat(4, 1fr);">
        <div class="metric-card"><div class="metric-label">Accuracy</div><div class="metric-value">${metrics.accuracy.formatted}</div></div>
        <div class="metric-card"><div class="metric-label">Precision</div><div class="metric-value">${metrics.precision.formatted}</div></div>
        <div class="metric-card"><div class="metric-label">Recall</div><div class="metric-value">${metrics.recall.formatted}</div></div>
        <div class="metric-card"><div class="metric-label">F1-Score</div><div class="metric-value">${metrics.f1Score.formatted}</div></div>
      </div>

      <h4>Recomendaciones Estratégicas:</h4>
      <ul>
        ${sector.businessRecommendations.map((r) => `<li>${r}</li>`).join('')}
      </ul>
    </article>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Manual Maestro: Matriz de Confusión y Métricas de Clasificación</title>
  <style>${BASE_CSS}</style>
</head>
<body>
  <div class="container">
    <header>
      <span class="badge badge-success">Manual Maestro Completo</span>
      <h1>Guía Integral de la Matriz de Confusión y Evaluación en Machine Learning</h1>
      <p class="subtitle">Aprende a interpretar modelos de clasificación y traducir métricas técnicas en decisiones empresariales de alto impacto.</p>
    </header>

    <section>
      <h2>Módulo I: Fundamentos Teóricos y Conceptos Esenciales</h2>
      ${fundamentalsHtml}
    </section>

    <section>
      <h2>Módulo II: Formulario Completo de Métricas de Evaluación</h2>
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-label">Accuracy (Exactitud)</div>
          <div class="metric-formula">(TP + TN) / (TP + TN + FP + FN)</div>
          <div class="metric-desc">Fracción total de aciertos globales. Cuidado con datos desbalanceados.</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Precision (Precisión)</div>
          <div class="metric-formula">TP / (TP + FP)</div>
          <div class="metric-desc">Confiabilidad de las alarmas positivas emitidas por el modelo.</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Recall / Sensitivity</div>
          <div class="metric-formula">TP / (TP + FN)</div>
          <div class="metric-desc">Capacidad para no omitir casos positivos reales en la población.</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Specificity (Especificidad)</div>
          <div class="metric-formula">TN / (TN + FP)</div>
          <div class="metric-desc">Capacidad de reconocer y descartar casos negativos reales.</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">F1-Score</div>
          <div class="metric-formula">2 × (Precision × Recall) / (Precision + Recall)</div>
          <div class="metric-desc">Media armónica que balancea precisión y sensibilidad.</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">False Positive Rate (FPR)</div>
          <div class="metric-formula">FP / (FP + TN) = 1 - Especificidad</div>
          <div class="metric-desc">Porcentaje de casos normales acusados erróneamente.</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">False Negative Rate (FNR)</div>
          <div class="metric-formula">FN / (FN + TP) = 1 - Recall</div>
          <div class="metric-desc">Porcentaje de casos positivos no detectados (Error Tipo II).</div>
        </div>
      </div>
    </section>

    <section>
      <h2>Módulo III: Biblioteca de 8 Casos Prácticos por Sector Económico</h2>
      ${sectorsHtml}
    </section>

    <section>
      <h2>Módulo IV: Decálogo para la Toma de Decisiones en Producción</h2>
      <ol style="margin-top: 14px;">
        <li><strong>Nunca confíes en el Accuracy a ciegas:</strong> Revisa siempre la prevalencia de la clase positiva en tus datos.</li>
        <li><strong>Define el costo económico de cada celda:</strong> ¿Cuánto dinero cuesta un FP frente a cuánto cuesta un FN?</li>
        <li><strong>En salud y seguridad crítica:</strong> Maximiza el Recall primero. Un paciente no diagnosticado o una pieza defectuosa montada es inaceptable.</li>
        <li><strong>En acciones costosas o intrusivas:</strong> Maximiza la Precision. No desperdicies recursos valiosos en falsas alarmas.</li>
        <li><strong>El umbral de decisión (Threshold) es móvil:</strong> Cambiar el corte de probabilidad permite calibrar el modelo según los objetivos del trimestre.</li>
      </ol>
    </section>

    <footer>
      Manual Autónomo Descargable • Generado el ${now} • Diseñado para estudio offline y consulta profesional
    </footer>
  </div>
</body>
</html>`;
}

// Download trigger utility
export function downloadHtmlFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
