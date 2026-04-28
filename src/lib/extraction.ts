import mammoth from 'mammoth';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import pdf from 'pdf-parse';

export async function extractData(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split('.').pop()?.toLowerCase();
  let text = "";

  if (ext === 'docx') {
    const result = await mammoth.extractRawText({ buffer });
    text = result.value;
  } else if (ext === 'pdf') {
    const data = await pdf(buffer);
    text = data.text;
  } else if (ext === 'xlsx') {
    // Para Excel, el procesamiento es distinto (extraer celdas), 
    // pero por ahora podemos retornar un mensaje de que requiere lógica específica
    text = "Archivo Excel detectado: requiere lógica de celdas.";
  }

  // Lógica de RegEx aplicada al texto extraído
  return {
    rfc: text.match(/[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}/i)?.[0] || "No encontrado",
    oficio: text.match(/Oficio\s*n[úu]m[eé]ro\s*:?\s*([\w/-]+)/i)?.[1] || "No encontrado",
  };
}