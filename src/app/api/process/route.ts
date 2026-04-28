import { NextRequest, NextResponse } from 'next/server';
import { extractData } from '@/lib/extraction'; // Cambiamos a extractData
import ExcelJS from 'exceljs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];

    if (files.length === 0) {
      return NextResponse.json({ error: "No se subieron archivos" }, { status: 400 });
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Datos Extraídos');
    
    worksheet.columns = [
      { header: 'Archivo', key: 'name', width: 30 },
      { header: 'RFC', key: 'rfc', width: 20 },
      { header: 'Oficio', key: 'oficio', width: 20 },
      { header: 'Fecha', key: 'fecha', width: 20 },
    ];

    for (const file of files) {
  const buffer = await file.arrayBuffer();
  const data = await extractData(file); // Usamos la nueva función
  
  worksheet.addRow({
    name: file.name,
    ...data
  });
}

    // Generar archivo en memoria
    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer as never, {
      headers: {
        'Content-Disposition': 'attachment; filename="reporte_datos.xlsx"',
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });
  } catch (error) {
    console.error("Error procesando archivos:", error);
    return NextResponse.json({ error: "Error interno al procesar" }, { status: 500 });
  }
}