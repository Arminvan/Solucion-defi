import mammoth from 'mammoth';

/**
 * Motor de extracción de datos dinámico.
 * Esta función recibe el archivo y un arreglo de reglas configurables.
 */
export async function extractData(file: File, reglas: { nombre: string; regex: string }[]) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split('.').pop()?.toLowerCase();
  let text = "";

  try {
    // 1. Extracción de texto según formato
    if (ext === 'docx') {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else if (ext === 'pdf') {
      // Importación dinámica para evitar errores de módulos ESM/CommonJS
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pdf = (await import('pdf-parse')) as any;
      const data = await (pdf.default || pdf)(buffer);
      text = data.text;
    } else if (ext === 'xlsx') {
      text = "Archivo Excel detectado: requiere lógica de celdas específica.";
    }

    // 2. Procesamiento dinámico de datos mediante RegEx
    const resultados: Record<string, string> = {};
    
    reglas.forEach((regla) => {
      const patron = new RegExp(regla.regex, 'i');
      const coincidencia = text.match(patron);
      // Extrae el grupo capturado si existe, si no, la coincidencia completa
      resultados[regla.nombre] = coincidencia ? (coincidencia[1] || coincidencia[0]) : "No encontrado";
    });

    return resultados;

  } catch (error) {
    console.error("Error crítico en la extracción:", error);
    return { error: "No se pudo procesar el archivo" };
  }
}
