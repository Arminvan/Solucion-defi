'use client';
import { useState } from 'react';

export default function Home() {
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  const handleProcess = async () => {
    if (!files || files.length === 0) return alert("Selecciona archivos primero");
    
    setLoading(true);
    const formData = new FormData();
    Array.from(files).forEach(f => formData.append('files', f));

    try {
      const response = await fetch('/api/process', { method: 'POST', body: formData });
      if (!response.ok) throw new Error("Error al procesar");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "reporte_datos.xlsx";
      a.click();
    } catch (error) {
      alert("Hubo un error al procesar los archivos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-10 bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-xl font-bold mb-4">Cosmetics Control Pro</h1>
        <input 
          type="file" multiple accept=".docx,.pdf"
          onChange={(e) => setFiles(e.target.files)}
          className="mb-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-500 file:text-white"
        />
        <button 
          onClick={handleProcess}
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? "Procesando..." : "Generar Excel"}
        </button>
      </div>
    </main>
  );
}