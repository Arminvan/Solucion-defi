import { NextResponse } from 'next/server';
import { extractData } from '@/lib/extraction';

// Definimos las reglas que nuestra aplicación buscará en los archivos
const REGLAS_EXTRACCION = [
  { nombre: "rfc", regex: "[A-ZÑ&]{3,4}\\d{6}[A-Z0-9]{3}" },
  { nombre: "oficio", regex: "Oficio\\s*n[úu]m[eé]ro\\s*:?\\s*([\\w/-]+)" }
];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No se recibieron archivos" }, { status: 400 });
    }

    // Procesamos todos los archivos enviados
    const resultados = [];
    for (const file of files) {
      // Llamamos a nuestro motor de extracción pasando el archivo y las reglas
      const data = await extractData(file, REGLAS_EXTRACCION);
      resultados.push({
        archivo: file.name,
        ...data
      });
    }

    // Aquí retornarías los resultados. 
    // Si quieres que el usuario descargue un Excel, 
    // podrías devolver los datos como JSON y que el frontend genere el Excel.
    return NextResponse.json({ registros: resultados });

  } catch (error) {
    console.error("Error en el procesamiento:", error);
    return NextResponse.json({ error: "Error al procesar los archivos" }, { status: 500 });
  }
}
