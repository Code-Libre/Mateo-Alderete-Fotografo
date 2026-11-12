/* =========================================================
   GALERIAS.JS - Datos de cada tema y armado de galeria.html
   Índice: 1 Temas | 2 Armado de la página
   ========================================================= */

/* ---------- 1. TEMAS ---------- */
// "cantidad" es cuántas fotos hay en img/galerias/<tema>/ (01.jpg, 02.jpg, ...)
const GALERIAS = {
  casamientos: {
    titulo: "Casamientos",
    texto: "Ceremonias, brindis y todos los detalles que pasan rápido.",
    cantidad: 6
  },
  quinceanos: {
    titulo: "Quinceaños",
    texto: "Una noche que se espera todo el año, contada desde adentro.",
    cantidad: 6
  },
  musica: {
    titulo: "Eventos musicales",
    texto: "Recitales y presentaciones en vivo, con la energía de la sala.",
    cantidad: 6
  },
  comida: {
    titulo: "Eventos de comida",
    texto: "Platos, cocinas y mesas compartidas, fotografiados con hambre.",
    cantidad: 6
  },
  corporativos: {
    titulo: "Eventos corporativos",
    texto: "Lanzamientos, charlas y encuentros de equipo, con naturalidad.",
    cantidad: 6
  },
  cumpleanos: {
    titulo: "Cumpleaños",
    texto: "Risas, velitas y los momentos que nadie planeó.",
    cantidad: 6
  },
  familias: {
    titulo: "Retratos y familias",
    texto: "Sesiones tranquilas, sin poses forzadas.",
    cantidad: 6
  }
};


/* ---------- 2. ARMADO DE LA PÁGINA ---------- */
(function () {
  const lista = Object.keys(GALERIAS);
  const clave = new URLSearchParams(location.search).get("tema");
  const tema = GALERIAS[clave];

  // Si el enlace no corresponde a ningún tema, vuelve al portafolio
  if (!tema) {
    location.replace("index.html#portafolio");
    return;
  }

  document.title = tema.titulo + " | Mateo Alderete";
  document.getElementById("galeria-titulo").textContent = tema.titulo;
  document.getElementById("galeria-texto").textContent = tema.texto;

  const cuadricula = document.getElementById("galeria-cuadricula");

  for (let i = 1; i <= tema.cantidad; i++) {
    const numero = String(i).padStart(2, "0");
    const foto = document.createElement("figure");
    const img = document.createElement("img");

    foto.className = "foto marco";
    img.src = "img/galerias/" + clave + "/" + numero + ".jpg";
    img.alt = tema.titulo + ", foto " + i;
    img.loading = "lazy";

    foto.append(img);
    cuadricula.append(foto);
  }

  // Enlace a la galería que sigue en la lista
  const proxima = lista[(lista.indexOf(clave) + 1) % lista.length];
  const siguiente = document.getElementById("galeria-siguiente");

  siguiente.href = "galeria.html?tema=" + proxima;
  siguiente.textContent = "Siguiente galería: " + GALERIAS[proxima].titulo;
})();