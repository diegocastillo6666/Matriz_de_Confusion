import { SectorCase } from '../types';

export const SECTOR_CASES: SectorCase[] = [
  {
    id: 'banca',
    name: 'Banca y Servicios Financieros',
    sectorName: 'Fintech & Banca',
    icon: 'Landmark',
    tagline: 'Detección en tiempo real de transacciones fraudulentas con tarjetas de crédito',
    businessProblem:
      'Un banco procesa más de 100,000 transacciones diarias con tarjeta de crédito. Los fraudes financieros representan pérdidas directas millonarias por contracargos y dañan la reputación de la entidad, pero bloquear transacciones legítimas de clientes VIP genera fricción y frustración.',
    modelObjective:
      'Clasificar cada transacción entrante como legítima o sospechosa de fraude antes de autorizar el cobro en la pasarela de pagos.',
    positiveClass: 'Transacción Fraudulenta (Fraude)',
    negativeClass: 'Transacción Legítima (Normal)',
    positiveDefinition: 'La transacción fue realizada por un atacante o mediante credenciales robadas.',
    negativeDefinition: 'La transacción fue realizada legítimamente por el titular de la tarjeta.',
    defaultMatrix: {
      tp: 380, // Fraudes detectados
      fp: 120, // Legítimas bloqueadas por error
      fn: 20,  // Fraudes no detectados que pasaron
      tn: 9480 // Legítimas aprobadas correctamente
    }, // Total: 10,000 transacciones auditadas
    tpDescription:
      'Transacción fraudulenta que el modelo detectó y bloqueó a tiempo. Se evitó una pérdida patrimonial directa.',
    fpDescription:
      'Transacción legítima que el modelo bloqueó por sospecha infundada. El cliente legítimo ve rechazada su compra (fricción en el punto de venta).',
    fnDescription:
      'Transacción fraudulenta que el modelo aprobó como legítima. El banco asume la pérdida económica y el contracargo.',
    tnDescription:
      'Transacción legítima aprobada sin contratiempos. Experiencia de compra fluida y segura.',
    tpConcreteExample:
      'Un intento de compra de 1,200 USD en electrodomésticos desde una IP en otro continente es bloqueado de inmediato.',
    fpConcreteExample:
      'Un cliente habitual que viaja por vacaciones intenta pagar un hotel en el extranjero y su tarjeta es rechazada injustamente.',
    fnConcreteExample:
      'Un delincuente clona una tarjeta y realiza un micro-gasto no detectado de 85 USD en una gasolinera.',
    tnConcreteExample:
      'La compra quincenal del supermercado habitual de 150 USD pasa sin ninguna interrupción.',
    criticalMetrics: [
      {
        metric: 'Recall (Sensibilidad)',
        priority: 'Crítica',
        reason:
          'Un Falso Negativo cuesta miles de dólares en pérdidas directas. Un Recall alto garantiza que casi ningún fraude escape sin supervisión.',
      },
      {
        metric: 'Precision (Precisión)',
        priority: 'Alta',
        reason:
          'Si la precisión es muy baja, el equipo de soporte se satura atendiendo quejas de clientes legítimos molestos por bloqueos erróneos.',
      },
    ],
    businessRecommendations: [
      'Establecer un sistema de dos niveles: cuando la probabilidad de fraude esté entre 0.4 y 0.75, no bloquear de inmediato, sino enviar un código OTP por SMS/WhatsApp para reducir el impacto de los FP.',
      'Aceptar una tasa moderada de FP (hasta 1.5% del volumen total) siempre que el Recall se mantenga por encima del 95%.',
      'Integrar variables de geolocalización y patrones habituales de compra para mitigar los FP en temporadas vacacionales.',
    ],
    quiz: {
      question:
        'En este escenario bancario, ¿cuál de los siguientes errores representa el costo económico y reputacional más severo?',
      options: [
        'Un Falso Positivo (bloquear una compra legítima de supermercado)',
        'Un Falso Negativo (aprobar una transacción fraudulenta de 3,000 USD)',
        'Un Verdadero Negativo (aprobar una compra habitual)',
        'Un Verdadero Positivo (bloquear al estafador)',
      ],
      correctIndex: 1,
      explanation:
        '¡Correcto! En detección de fraude bancario, el Falso Negativo (FN) genera una pérdida económica directa irrecuperable por contracargo y penalizaciones regulatorias. Por eso se busca maximizar el Recall.',
    },
  },
  {
    id: 'salud',
    name: 'Sector Salud y Medicina Preventiva',
    sectorName: 'Salud & Diagnóstico',
    icon: 'Stethoscope',
    tagline: 'Tamizaje preliminar para detección temprana de patologías de alto riesgo',
    businessProblem:
      'Un hospital implementa un algoritmo de visión artificial para analizar mamografías y radiografías con el fin de priorizar pacientes para biopsia confirmatoria de neoplasias malignas.',
    modelObjective:
      'Detectar anomalías tisulares sospechosas de malignidad para remitir de urgencia al especialista oncólogo.',
    positiveClass: 'Paciente con Presencia de Patología / Cáncer',
    negativeClass: 'Paciente Sano / Sin Hallazgos Malignos',
    positiveDefinition: 'El tejido presenta lesiones malignas que requieren intervención médica inmediata.',
    negativeDefinition: 'El tejido es completamente benigno o normal.',
    defaultMatrix: {
      tp: 92,  // Pacientes enfermos detectados
      fp: 48,  // Pacientes sanos con falsa alarma remitidos a biopsia
      fn: 8,   // Pacientes enfermos que el modelo clasificó como sanos (¡Peligro!)
      tn: 852  // Pacientes sanos clasificados como sanos
    }, // Total: 1,000 estudios analizados
    tpDescription:
      'Paciente con tumor detectado a tiempo. Comienza tratamiento precoz, multiplicando su tasa de supervivencia.',
    fpDescription:
      'Paciente sano con biopsia o prueba invasiva innecesaria. Causa ansiedad psicológica temporal y gasto asistencial.',
    fnDescription:
      'Paciente enfermo diagnosticado erróneamente como sano. El tumor avanza sin tratamiento, poniendo en riesgo vital su pronóstico.',
    tnDescription:
      'Paciente sano diagnosticado correctamente como sano. Tranquilidad y confirmación del buen estado de salud.',
    tpConcreteExample:
      'Nódulo de 6 mm no palpable detectado en etapa 1; extirpación exitosa con pronóstico curativo superior al 95%.',
    fpConcreteExample:
      'Un quiste benigno con sombra densa genera sospecha en el algoritmo; tras una ecografía complementaria se descarta malignidad.',
    fnConcreteExample:
      'Un carcinoma lobulillar difuso pasa inadvertido como tejido denso normal; se detecta un año más tarde en estadio avanzado.',
    tnConcreteExample:
      'Estudio sin hallazgos patológicos; paciente recibe informe rutinario de control anual.',
    disclaimer:
      'Aviso importante: Este modelo es exclusivamente pedagógico y demostrativo. En ningún caso sustituye el diagnóstico clínico, criterio o validación de un profesional médico colegiado.',
    criticalMetrics: [
      {
        metric: 'Recall / Sensibilidad',
        priority: 'Crítica',
        reason:
          'En oncología y salud crítica, un Falso Negativo puede costar una vida humana. El Recall debe rozar el 98-99%.',
      },
      {
        metric: 'FNR (Tasa de Falsos Negativos)',
        priority: 'Crítica',
        reason:
          'Debe mantenerse en el mínimo absoluto posible mediante protocolos de doble lectura humana.',
      },
    ],
    businessRecommendations: [
      'Calibrar el umbral de decisión hacia la sensibilidad extrema: es preferible asumir más falsos positivos que dejar escapar un solo paciente enfermo.',
      'Todo caso clasificado como negativo en pacientes con antecedentes familiares debe contar con segunda opinión médica obligatoria.',
      'Diseñar protocolos de comunicación empáticos para pacientes clasificados como positivos provisionales antes de la biopsia confirmatoria.',
    ],
    quiz: {
      question:
        'Si un hospital busca evitar a toda costa que un paciente con una enfermedad letal sea enviado a casa sin tratamiento, ¿qué métrica debe maximizar?',
      options: [
        'Precision (Precisión)',
        'Recall / Sensibilidad',
        'Especificidad',
        'Tasa de Falsos Positivos (FPR)',
      ],
      correctIndex: 1,
      explanation:
        '¡Exacto! El Recall (Sensibilidad) mide el porcentaje de enfermos reales que el modelo logra detectar. Al maximizar el Recall, se minimizan los Falsos Negativos (FN), que en medicina son los más peligrosos.',
    },
  },
  {
    id: 'telecom',
    name: 'Telecomunicaciones y Conectividad',
    sectorName: 'Telco & Suscripciones',
    icon: 'Radio',
    tagline: 'Predicción de abandono y fuga de clientes (Churn Rate)',
    businessProblem:
      'Una compañía de telecomunicaciones sufre una tasa de cancelación del 2.5% mensual. Captar un cliente nuevo cuesta 5 veces más que retener a uno existente. La empresa dispone de un presupuesto limitado para ofrecer descuentos del 30% a clientes en riesgo de abandono.',
    modelObjective:
      'Identificar con 30 días de anticipación qué abonados planean portarse a otra compañía de la competencia.',
    positiveClass: 'Cliente que Abandonará el Servicio (Churner)',
    negativeClass: 'Cliente que Permanecerá Activo (Leal)',
    positiveDefinition: 'El abonado solicitará la baja o portabilidad dentro de los próximos 30 días.',
    negativeDefinition: 'El abonado renovará su plan o continuará su consumo normal.',
    defaultMatrix: {
      tp: 310, // Clientes en riesgo retenidos con campaña
      fp: 140, // Clientes fieles que recibieron descuento innecesario
      fn: 90,  // Clientes que se fugaron sin que nos enteráramos
      tn: 4460 // Clientes fieles que no fueron molestados
    }, // Total: 5,000 abonados
    tpDescription:
      'Cliente insatisfecho detectado a tiempo. El equipo de retención le ofrece una mejora y decide quedarse.',
    fpDescription:
      'Cliente satisfecho que no pensaba irse pero recibe un descuento agresivo, erosionando el margen de ganancia de la compañía.',
    fnDescription:
      'Cliente que se va a la competencia sin que la empresa actúe. Se pierde su Valor de Vida del Cliente (LTV).',
    tnDescription:
      'Cliente satisfecho que continúa pagando su tarifa normal sin costo adicional para la compañía.',
    tpConcreteExample:
      'Un usuario que sufrió 3 caídas de internet en el mes es detectado y contactado proactivamente con un upgrade de fibra gratis por 3 meses.',
    fpConcreteExample:
      'Un cliente fiel desde hace 8 años recibe una llamada ofreciéndole 25% de descuento sin que jamás hubiera pensado en cambiar de operadora.',
    fnConcreteExample:
      'Un abonado corporativo silencioso se da de baja repentinamente al terminar su contrato sin alertas previas.',
    tnConcreteExample:
      'Un usuario conforme paga su factura mensual sin requerir ninguna acción comercial.',
    criticalMetrics: [
      {
        metric: 'Precision (Precisión)',
        priority: 'Alta',
        reason:
          'Si la campaña de retención incluye regalos costosos o rebajas de tarifa, un FP reduce los ingresos netos innecesariamente.',
      },
      {
        metric: 'F1-Score',
        priority: 'Alta',
        reason:
          'Se busca el punto de equilibrio óptimo entre el costo del incentivo (evitar FP) y el valor de retener al cliente (evitar FN).',
      },
    ],
    businessRecommendations: [
      'Segmentar las acciones de retención según el valor del cliente: para clientes de alto consumo (alto ARPU), priorizar Recall; para planes prepago de bajo valor, priorizar Precision.',
      'Ofrecer incentivos no monetarios (como gigas extra o suscripción a streaming) en lugar de rebajas en la cuota fija para amortiguar el costo de los Falsos Positivos.',
    ],
    quiz: {
      question:
        'Si el incentivo de retención es un descuento del 40% en la factura durante un año, ¿qué consecuencia tiene un Falso Positivo?',
      options: [
        'El cliente se va a la competencia de inmediato.',
        'La empresa pierde dinero innecesariamente al rebajarle la tarifa a alguien que no planeaba irse.',
        'El modelo mejora su tasa de verdaderos negativos.',
        'El cliente cancela su línea telefónica.',
      ],
      correctIndex: 1,
      explanation:
        '¡Correcto! Un Falso Positivo significa que el modelo etiquetó como "en riesgo de abandono" a un cliente fiel. Al regalarle un descuento del 40%, la empresa canibaliza sus propios ingresos sin necesidad.',
    },
  },
  {
    id: 'retail',
    name: 'Comercio Electrónico y Retail',
    sectorName: 'E-Commerce & Retail',
    icon: 'ShoppingCart',
    tagline: 'Predicción de propensión de compra para envío de cupones de alta conversión',
    businessProblem:
      'Una tienda online de moda quiere enviar un cupón de 20 USD a usuarios que visitan el sitio. Si se envía a quien compraría de todos modos o a quien jamás comprará, se desperdicia presupuesto de marketing.',
    modelObjective:
      'Predecir qué usuarios realizarán una compra superior a 100 USD si reciben una oferta personalizada.',
    positiveClass: 'Usuario que Comprará con la Oferta',
    negativeClass: 'Usuario que No Comprará',
    positiveDefinition: 'El visitante finalizará el checkout en las siguientes 48 horas al recibir el incentivo.',
    negativeDefinition: 'El visitante abandonará la web sin comprar a pesar del estímulo.',
    defaultMatrix: {
      tp: 620, // Compradores activados exitosamente
      fp: 280, // Usuarios que recibieron cupón pero no compraron nada
      fn: 150, // Clientes potenciales que no recibieron cupón y se fueron a otra tienda
      tn: 6950 // Visitantes casuales no impactados
    }, // Total: 8,000 visitantes
    tpDescription:
      'Usuario motivado por el cupón que completa la compra. Retorno positivo sobre la inversión publicitaria (ROAS).',
    fpDescription:
      'Usuario que recibió el cupón pero no compró. Costo marginal de envío y posible saturación de su correo electrónico.',
    fnDescription:
      'Usuario indeciso que con un pequeño incentivo habría comprado, pero no lo recibió y abandonó el carrito.',
    tnDescription:
      'Usuario solo navegando que no tenía intención de compra y al que no se saturó con publicidad innecesaria.',
    tpConcreteExample:
      'Un usuario que vio 4 veces unos zapatos añade la talla al carrito y compra al recibir 15% de descuento en el checkout.',
    fpConcreteExample:
      'Un usuario que hizo clic por error en un banner recibe 3 correos con promociones pero nunca abre la app.',
    fnConcreteExample:
      'Un comprador buscando regalo para el día de la madre duda entre dos vestidos y se marcha a Amazon al no ver cupón disponible.',
    tnConcreteExample:
      'Un bot o visitante rebotando en 3 segundos no genera gasto alguno en la plataforma de e-mail marketing.',
    criticalMetrics: [
      {
        metric: 'Precision',
        priority: 'Alta',
        reason:
          'Cuando el costo de contactar o el costo del cupón es alto, cada FP quema presupuesto sin generar ventas.',
      },
      {
        metric: 'Lift y F1-Score',
        priority: 'Media',
        reason:
          'Garantiza que la campaña sea rentable respecto a no usar ningún modelo predictivo.',
      },
    ],
    businessRecommendations: [
      'Implementar pruebas A/B para contrastar la tasa de conversión orgánica versus la incentivada.',
      'Ajustar la agresividad del cupón: si la predicción es muy alta (probabilidad > 0.85), ofrecer un descuento menor (5%) porque el usuario ya tiene alta intención.',
    ],
    quiz: {
      question:
        '¿Por qué enviar cupones masivamente a toda la base de datos (sin modelo predictivo) suele ser una mala estrategia de retail?',
      options: [
        'Porque disminuye la velocidad de la base de datos.',
        'Porque canibaliza márgenes en clientes que comprarían sin descuento y satura de spam a los demás.',
        'Porque reduce el número de visitas orgánicas a Google.',
        'Porque aumenta el número de Verdaderos Positivos sin control.',
      ],
      correctIndex: 1,
      explanation:
        '¡Así es! Enviar ofertas indiscriminadamente genera enormes pérdidas de margen comercial (Falsos Positivos económicos) y fatiga a los usuarios con spam irrelevante.',
    },
  },
  {
    id: 'manufactura',
    name: 'Manufactura y Calidad Industrial',
    sectorName: 'Industria 4.0 & QA',
    icon: 'Cpu',
    tagline: 'Inspección óptica automatizada en línea de ensamblaje automotriz',
    businessProblem:
      'Una planta automotriz produce 15,000 componentes de freno al día. Liberar una pieza defectuosa a los vehículos en circulación puede ocasionar accidentes fatales, juicios millonarios y llamadas a revisión global (recalls). Sin embargo, descartar piezas buenas genera sobrecostos de retrabajo manual.',
    modelObjective:
      'Detectar microfisuras y defectos estructurales en los componentes mediante cámaras de alta resolución en la cinta transportadora.',
    positiveClass: 'Pieza Defectuosa / No Conforme',
    negativeClass: 'Pieza Conforme / En Buen Estado',
    positiveDefinition: 'El componente presenta fisuras, rebabas o defectos de fundición.',
    negativeDefinition: 'El componente cumple rigurosamente con las tolerancias de ingeniería.',
    defaultMatrix: {
      tp: 245, // Defectuosas detectadas y separadas
      fp: 35,  // Piezas buenas enviadas por precaución a inspección manual
      fn: 5,   // Piezas defectuosas que pasaron el filtro (¡Riesgo crítico!)
      tn: 7715 // Piezas buenas aprobadas directamente
    }, // Total: 8,000 piezas inspeccionadas
    tpDescription:
      'Pieza defectuosa retirada de la línea. Se evita que llegue a la cadena de montaje final.',
    fpDescription:
      'Pieza perfecta que el sensor marcó como defectuosa. Debe ser revisada manualmente por un inspector humano (costo operativo).',
    fnDescription:
      'Pieza rota o fisurada que pasa al montaje. Puede fallar en carretera con consecuencias catastróficas.',
    tnDescription:
      'Pieza correcta que avanza sin demoras al proceso de ensamblaje.',
    tpConcreteExample:
      'Una microfisura de 0.2 mm en el disco de freno es detectada por el láser y la pieza es desviada al contenedor de rechazo.',
    fpConcreteExample:
      'Una mancha de lubricante superficial en la superficie es confundida con una grieta; el operario la limpia y la devuelve a la línea.',
    fnConcreteExample:
      'Una burbuja de aire interna no visible en la superficie no es detectada y se monta en un vehículo nuevo.',
    tnConcreteExample:
      'El disco torneado dentro de las micras de tolerancia pasa a la etapa de empaque.',
    criticalMetrics: [
      {
        metric: 'Recall / Sensibilidad',
        priority: 'Crítica',
        reason:
          'En seguridad industrial, el costo de un Falso Negativo (accidente de tránsito, demanda masiva) es infinitamente superior al costo de una inspección manual extra.',
      },
      {
        metric: 'FNR (Tasa de Falsos Negativos)',
        priority: 'Crítica',
        reason:
          'Debe medirse en partes por millón (PPM) o mantenerse por debajo del 0.1%.',
      },
    ],
    businessRecommendations: [
      'Establecer un umbral ultra-estricto: si el modelo duda, enviar siempre a inspección secundaria manual.',
      'Auditar periódicamente las piezas clasificadas como TN mediante ensayos destructivos aleatorios en laboratorio para comprobar que la tasa de FN no se degrade.',
    ],
    quiz: {
      question:
        'Si una fábrica de aviación debe elegir entre un modelo con 99.8% Recall / 85% Precision versus otro con 91% Recall / 99% Precision, ¿cuál debe elegir?',
      options: [
        'El segundo, porque tiene mayor precisión.',
        'El primero, porque en seguridad crítica no se pueden tolerar piezas defectuosas volando (maximizar Recall).',
        'Cualquiera de los dos, tienen el mismo Accuracy.',
        'Ninguno, se deben descartar todos los modelos de Machine Learning.',
      ],
      correctIndex: 1,
      explanation:
        '¡Excelente! En piezas críticas (aeronáutica, medicina, automotriz), el costo de un Falso Negativo es una catástrofe de seguridad. Se prefiere inspeccionar manualmente algunas piezas de más (asumir menores precisiones) a cambio de no dejar escapar ninguna pieza rota.',
    },
  },
  {
    id: 'rrhh',
    name: 'Recursos Humanos y Gestión de Talento',
    sectorName: 'People Analytics & RRHH',
    icon: 'Users',
    tagline: 'Detección temprana de riesgo de fuga de talento clave con enfoque ético',
    businessProblem:
      'Una empresa tecnológica sufre fuga de ingenieros senior hacia empresas competidoras. Reclutar y formar a un reemplazo toma 6 meses y cuesta hasta 1.5 veces el salario anual. Sin embargo, usar algoritmos en RRHH exige estricta privacidad, consentimiento y evitar sesgos o decisiones disciplinarias automáticas.',
    modelObjective:
      'Identificar colaboradores clave con alta probabilidad de desvinculación voluntaria para ofrecer planes de carrera, mentoría y revisión salarial.',
    positiveClass: 'Colaborador con Riesgo de Fuga Voluntaria',
    negativeClass: 'Colaborador Satisfecho / Retenido',
    positiveDefinition: 'El empleado presentará su renuncia en los próximos 90 días.',
    negativeDefinition: 'El empleado continuará en su puesto de manera estable.',
    defaultMatrix: {
      tp: 65,  // Empleados en riesgo detectados y apoyados con plan de desarrollo
      fp: 40,  // Empleados sin intención de irse que recibieron ofertas de fidelización
      fn: 25,  // Renuncias sorpresa de profesionales clave
      tn: 870  // Empleados comprometidos que continúan su trabajo regular
    }, // Total: 1,000 colaboradores
    tpDescription:
      'Profesional en riesgo de desmotivación detectado. Se activa una conversación de feedback y plan de crecimiento.',
    fpDescription:
      'Profesional cómodo y comprometido clasificado erróneamente en riesgo. Puede provocar sospechas si no se gestiona con tacto y privacidad.',
    fnDescription:
      'Talento clave que renuncia repentinamente sin que los líderes tuvieran indicio alguno. Fuga de conocimiento crítico.',
    tnDescription:
      'Colaborador motivado que sigue desarrollándose en la empresa de forma habitual.',
    tpConcreteExample:
      'Un desarrollador senior que no ha tenido aumentos en 2 años y hace horas extra es detectado; Recursos Humanos ajusta su banda salarial antes de que acepte otra oferta.',
    fpConcreteExample:
      'Una analista que solicitó días de vacaciones concentrados es etiquetada como en riesgo de fuga cuando solo iba a visitar a su familia.',
    fnConcreteExample:
      'Un líder de equipo reservado que siempre cumple sus métricas renuncia sin previo aviso al recibir una oferta en el extranjero.',
    tnConcreteExample:
      'Un miembro de equipo que trabaja en un proyecto retador con buen clima laboral y estabilidad.',
    disclaimer:
      'Aviso ético: Las predicciones de People Analytics jamás deben usarse para despedir, marginar o discriminar a colaboradores. Deben servir únicamente como apoyo para mejorar las condiciones laborales y la escucha activa.',
    criticalMetrics: [
      {
        metric: 'Precision y Privacidad',
        priority: 'Alta',
        reason:
          'Señalar a un colaborador como "desleal" o "con un pie afuera" puede generar sesgos en los jefes de equipo si los datos se filtran.',
      },
      {
        metric: 'F1-Score Equilibrado',
        priority: 'Media',
        reason:
          'Mantener un balance entre retener a quienes están insatisfechos sin malgastar presupuesto de retención en perfiles estables.',
      },
    ],
    businessRecommendations: [
      'Prohibir que los directos responsables tengan acceso a la etiqueta cruda del algoritmo; el área de personas debe gestionar los apoyos de forma constructiva.',
      'Enfocar las acciones en beneficios colectivos y políticas de conciliación más que en retenciones forzadas individuales.',
      'Auditar el modelo para evitar que penalice a personas por factores protegidos (género, edad, maternidad).',
    ],
    quiz: {
      question:
        '¿Cuál es el principal riesgo ético de actuar sobre un Falso Positivo en un modelo de People Analytics si no hay privacidad?',
      options: [
        'Que el servidor de la empresa se apague.',
        'Que el jefe del empleado empiece a tratarlo con desconfianza o lo excluya de proyectos estratégicos creyendo falsamente que va a renunciar.',
        'Que la exactitud matemática del modelo suba al 100%.',
        'Que el empleado pida un aumento de salario de inmediato.',
      ],
      correctIndex: 1,
      explanation:
        '¡Correcto! Este es el mayor riesgo ético: la "profecía autocumplida". Si un manager cree que un empleado se va a marchar, podría dejar de invertir en él o aislarlo, provocando que finalmente termine renunciando.',
    },
  },
  {
    id: 'marketing',
    name: 'Marketing Digital y Publicidad Programática',
    sectorName: 'AdTech & Crecimiento',
    icon: 'TrendingUp',
    tagline: 'Optimización de pujas para campañas de conversión y remarketing inteligente',
    businessProblem:
      'Una agencia de medios gestiona campañas en Google Ads y Meta con presupuesto de 50,000 USD mensuales. Pujar por usuarios que nunca comprarán quema el presupuesto diario en horas, pero excluir a compradores potenciales reduce las ventas totales de la marca.',
    modelObjective:
      'Predecir qué usuarios con cookies activas tienen una probabilidad superior al 70% de suscribirse o comprar durante una campaña de remarketing.',
    positiveClass: 'Usuario que Convertirá / Comprará',
    negativeClass: 'Usuario que Rebotará / No Convertirá',
    positiveDefinition: 'El usuario completará el formulario o la compra tras ver la impresión del anuncio.',
    negativeDefinition: 'El usuario ignorará o cerrará el anuncio sin generar valor comercial.',
    defaultMatrix: {
      tp: 840, // Conversiones conseguidas a costo por adquisición (CPA) eficiente
      fp: 360, // Clics pagados en usuarios que no convirtieron (gasto de pauta)
      fn: 210, // Oportunidades de conversión desaprovechadas (no se pujó)
      tn: 10590 // Usuarios no compradores excluidos de la puja (ahorro de presupuesto)
    }, // Total: 12,000 impresiones evaluadas
    tpDescription:
      'Impresión publicitaria comprada en subasta que derivó en una compra confirmada. Retorno positivo (ROAS).',
    fpDescription:
      'Impresión comprada a costo alto que terminó en rebote o carrito abandonado. Gasto publicitario no recuperado.',
    fnDescription:
      'Usuario interesado al que no se le mostró el anuncio por timidez del modelo. Venta perdida frente a la competencia.',
    tnDescription:
      'Usuario irrelevante que no fue impactado. Ahorro sustancial del presupuesto de medios.',
    tpConcreteExample:
      'Un usuario que leyó 3 reseñas del producto ve un banner con oferta de 24 horas y compra.',
    fpConcreteExample:
      'Un usuario hace clic por error en un anuncio móvil en un videojuego y cierra la página de inmediato (clic fantasma pagado).',
    fnConcreteExample:
      'Un comprador decidido busca en su móvil en su pausa de café pero el modelo no puja y acaba comprando a un competidor en el buscador.',
    tnConcreteExample:
      'El modelo evita mostrar anuncios de pañales a un perfil de estudiante universitario sin hijos.',
    criticalMetrics: [
      {
        metric: 'Precision (Precisión)',
        priority: 'Alta',
        reason:
          'Impacta directamente en el CPA (Costo por Adquisición). A mayor precisión, menor desperdicio de clics inútiles.',
      },
      {
        metric: 'F1-Score y ROAS',
        priority: 'Media',
        reason:
          'Permite encontrar el punto donde el volumen de ventas y la rentabilidad por clic son óptimos.',
      },
    ],
    businessRecommendations: [
      'Ajustar la puja de forma dinámica: si la probabilidad estimada es 90%, pujar el doble; si es 60%, pujar un valor bajo.',
      'Configurar audiencias negativas para descartar usuarios con alta probabilidad de rebote (TN forzados).',
    ],
    quiz: {
      question:
        'Si un anunciante tiene un presupuesto muy pequeño y necesita asegurarse de que cada dólar invertido genere una venta real, ¿qué métrica debe priorizar?',
      options: [
        'Recall (impactar a todo el que se mueva)',
        'Precision (asegurar que a quien impacte, realmente convierta)',
        'Tasa de Falsos Negativos',
        'Volumen bruto de impresiones',
      ],
      correctIndex: 1,
      explanation:
        '¡Muy bien! Con presupuesto limitado, el objetivo es evitar a toda costa los Falsos Positivos (pagar por clics de personas que no comprarán). Una alta Precision garantiza que los impactos se concentren en los clientes de altísima conversión.',
    },
  },
  {
    id: 'seguros',
    name: 'Sector Seguros y Gestión de Siniestros',
    sectorName: 'InsurTech & Siniestros',
    icon: 'ShieldAlert',
    tagline: 'Detección de reclamaciones de siniestros potencialmente infladas o fraudulentas',
    businessProblem:
      'Una compañía de seguros de automóviles recibe miles de partes de accidentes al mes. Las bandas de fraude organizado y los siniestros simulados representan hasta el 10% del total de indemnizaciones pagadas. Sin embargo, acusar o demorar la indemnización a un asegurado honesto destruye la satisfacción del cliente.',
    modelObjective:
      'Marcar reclamaciones sospechosas para peritaje forense e investigación detallada antes de autorizar el desembolso.',
    positiveClass: 'Reclamación Fraudulenta o Inflada',
    negativeClass: 'Reclamación Legítima y Verídica',
    positiveDefinition: 'El siniestro fue simulado, provocado premeditadamente o los daños fueron abultados.',
    negativeDefinition: 'El accidente ocurrió en las condiciones descritas y el asegurado tiene derecho a indemnización.',
    defaultMatrix: {
      tp: 195, // Fraudes detectados y remitidos a auditoría legal
      fp: 85,  // Reclamos legítimos demorados por sospecha injustificada
      fn: 25,  // Fraudes no detectados que la aseguradora pagó indebidamente
      tn: 3695 // Reclamos limpios liquidados de forma ágil y automática
    }, // Total: 4,000 siniestros
    tpDescription:
      'Fraude detenido antes de emitir el cheque de pago. Ahorro millonario y desarticulación de redes ilícitas.',
    fpDescription:
      'Asegurado honesto cuyo expediente es enviado a investigación. Sufre demoras, desconfianza y posibles quejas regulatorias.',
    fnDescription:
      'Reclamación falsa liquidada sin peritaje. Pérdida económica neta para la aseguradora que encarece las primas de todos los asegurados.',
    tnDescription:
      'Siniestro legítimo aprobado en menos de 24 horas. Cliente satisfecho y fidelizado.',
    tpConcreteExample:
      'Un parte de accidente presentado con un taller fantasma y fotografías reutilizadas de internet es detectado por la IA.',
    fpConcreteExample:
      'Un conductor sufre un accidente legítimo de madrugada en una zona poco transitada y el sistema lo marca como sospechoso por el horario atípico.',
    fnConcreteExample:
      'Un conductor exagera una lesión cervical leve convirtiéndola en una incapacidad prolongada con ayuda de un médico cómplice no detectado.',
    tnConcreteExample:
      'Un golpe de aparcamiento con atestado policial claro y fotos claras es liquidado en el taller de inmediato.',
    criticalMetrics: [
      {
        metric: 'Recall',
        priority: 'Alta',
        reason:
          'El fraude en seguros cuesta miles de millones al año. Detectar la mayoría de casos es crucial para la solvencia de la empresa.',
      },
      {
        metric: 'Precision y Experiencia de Cliente',
        priority: 'Alta',
        reason:
          'Un asegurado honesto tratado como un delincuente cambiará de aseguradora y pondrá reclamaciones ante el regulador financiero.',
      },
    ],
    businessRecommendations: [
      'Establecer canales de investigación discretos y amables: solicitar documentación adicional como parte de un "proceso aleatorio de calidad" para no ofender al asegurado.',
      'Automatizar la aprobación instantánea (Fast-Track) para siniestros con riesgo predictivo menor a 0.05, reduciendo costos periciales.',
    ],
    quiz: {
      question:
        'Si una aseguradora quiere acelerar los pagos en 24 horas para el 90% de sus clientes honestos, ¿qué celda de la matriz debe asegurar que se procese sin demoras?',
      options: [
        'Los Falsos Positivos',
        'Los Falsos Negativos',
        'Los Verdaderos Negativos (TN)',
        'Los Verdaderos Positivos (TP)',
      ],
      correctIndex: 2,
      explanation:
        '¡Correcto! Los Verdaderos Negativos son los clientes honestos que reportan un accidente real. Procesar sus casos de inmediato crea una ventaja competitiva enorme de satisfacción.',
    },
  },
];
