import { jsPDF } from "jspdf";

const texto = (value) => String(value ?? "-");
const fecha = (value) => (value ? new Date(value).toLocaleString("es-CO") : "-");

export function generarReporteVisitas({ visitas, titulo, filtros = [] }) {
  const documento = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const margen = 12;
  const anchoPagina = documento.internal.pageSize.getWidth();
  const altoPagina = documento.internal.pageSize.getHeight();
  const columnas = [
    { titulo: "Visitante / documento", ancho: 48 },
    { titulo: "Tipo", ancho: 32 },
    { titulo: "Apartamento", ancho: 42 },
    { titulo: "Ingreso", ancho: 45 },
    { titulo: "Salida", ancho: 45 },
    { titulo: "Estado", ancho: 42 },
  ];
  const anchoTabla = columnas.reduce((total, columna) => total + columna.ancho, 0);
  let y = 40;

  const encabezado = () => {
    documento.setFontSize(17);
    documento.setTextColor(22, 36, 63);
    documento.text(titulo, margen, 16);
    documento.setFontSize(9);
    documento.setTextColor(100, 116, 139);
    documento.text(`Generado: ${new Date().toLocaleString("es-CO")}`, margen, 23);
    documento.text(`Registros: ${visitas.length}`, anchoPagina - margen, 23, { align: "right" });

    documento.setFillColor(22, 36, 63);
    documento.rect(margen, 29, anchoTabla, 8, "F");
    documento.setFontSize(8);
    documento.setTextColor(255, 255, 255);
    let x = margen;
    columnas.forEach((columna) => {
      documento.text(columna.titulo, x + 2, 34);
      x += columna.ancho;
    });
    y = 45;
  };

  encabezado();

  if (filtros.length) {
    documento.setFontSize(8);
    documento.setTextColor(71, 84, 103);
    documento.text(`Filtros: ${filtros.join(" | ")}`, margen, 27);
  }

  visitas.forEach((visita, indice) => {
    if (y > altoPagina - 18) {
      documento.addPage();
      encabezado();
    }

    if (indice % 2 === 0) {
      documento.setFillColor(248, 250, 252);
      documento.rect(margen, y - 5, anchoTabla, 10, "F");
    }

    const valores = [
      `${texto(visita.nombreVisitante)}\n${texto(visita.documentoVisitante)}`,
      texto(visita.tipoVisita?.nombre),
      `${texto(visita.apartamento?.torre?.nombreTorre)} - ${texto(visita.apartamento?.numeroApartamento)}`,
      fecha(visita.fechaIngreso),
      fecha(visita.fechaSalida),
      texto(visita.estadoVisita?.nombre),
    ];

    documento.setFontSize(8);
    documento.setTextColor(51, 65, 85);
    let x = margen;
    valores.forEach((valor, posicion) => {
      documento.text(documento.splitTextToSize(valor, columnas[posicion].ancho - 4), x + 2, y);
      x += columnas[posicion].ancho;
    });
    y += 10;
  });

  if (!visitas.length) {
    documento.setFontSize(10);
    documento.setTextColor(100, 116, 139);
    documento.text("No hay visitas que coincidan con los filtros seleccionados.", margen, y);
  }

  documento.save("reporte-visitas.pdf");
}
