/* =========================================================
   PRINCIPAL.JS - Mateo Alderete, fotógrafo
   Índice: 1 Menú | 2 Enlace activo | 3 Imágenes que faltan | 4 Año
   5 Formulario WhatsApp | 6 Animaciones y visor
   ========================================================= */

/* ---------- 1. MENÚ EN CELULAR ---------- */
function iniciarMenu() {
  const boton = document.getElementById("boton-menu");
  const menu = document.getElementById("menu");

  function cerrar() {
    menu.classList.remove("abierto");
    boton.setAttribute("aria-expanded", "false");
  }

  boton.addEventListener("click", () => {
    const abierto = menu.classList.toggle("abierto");
    boton.setAttribute("aria-expanded", abierto);
  });

  menu.querySelectorAll("a").forEach((enlace) => enlace.addEventListener("click", cerrar));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrar();
  });
}


/* ---------- 2. ENLACE ACTIVO SEGÚN LA SECCIÓN VISIBLE ---------- */
function iniciarEnlaceActivo() {
  const enlaces = document.querySelectorAll(".menu__enlace");

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (!entrada.isIntersecting) return;

      enlaces.forEach((enlace) => {
        enlace.classList.toggle("activo", enlace.getAttribute("href") === "#" + entrada.target.id);
      });
    });
  }, { rootMargin: "-45% 0px -50% 0px" });

  document.querySelectorAll("main section[id]").forEach((seccion) => observador.observe(seccion));
}


/* ---------- 3. IMÁGENES QUE FALTAN ---------- */
// Si una foto todavía no está en la carpeta img, se muestra un aviso con su ruta
function iniciarImagenesFaltantes() {
  document.querySelectorAll(".marco img").forEach((img) => {
    function marcar() {
      img.parentElement.dataset.ruta = img.getAttribute("src");
      img.parentElement.classList.add("sin-imagen");
    }

    img.addEventListener("error", marcar);

    if (img.complete && img.naturalWidth === 0) marcar();
  });
}


/* ---------- 4. AÑO DEL PIE ---------- */
function iniciarAnio() {
  document.getElementById("anio-actual").textContent = new Date().getFullYear();
}


/* ---------- 5. FORMULARIO DE CONTACTO A WHATSAPP ---------- */
function iniciarFormularioContacto() {
  const formulario = document.getElementById("formulario-contacto");
  if (!formulario) return;

  formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const evento = document.getElementById("evento").value;
    const fecha = document.getElementById("fecha").value;
    const mensaje = document.getElementById("mensaje").value.trim();

    // 📱 Reemplaza por tu número en formato internacional (sin espacios ni signos)
    const telefono = "5491100000000";

    // Mensaje automático formateado
    let texto = `Hola Mateo, mi nombre es *${nombre}*.\n`;
    texto += `Te consulto por disponibilidad para un *${evento}*`;
    if (fecha) texto += ` con fecha estimada: *${fecha}*`;
    texto += `.\n`;
    if (mensaje) texto += `Detalles: ${mensaje}`;

    // Abre WhatsApp Web o la aplicación con el mensaje cargado
    const url = `https://wa.me/${telefono}?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
  });
}


/* Ejecución de funciones base */
iniciarMenu();
iniciarEnlaceActivo();
iniciarImagenesFaltantes();
iniciarAnio();
iniciarFormularioContacto();


/* ---------- 6. ANIMACIONES Y VISOR ---------- */
(function () {
  const sinMovimiento = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const conMouse = matchMedia("(hover: hover) and (pointer: fine)").matches;


  /* ---------- 1. PORTADA AL CARGAR ---------- */
  function animarPortada() {
    const titulo = document.querySelector(".portada__titulo");

    if (sinMovimiento || !titulo) return;

    const palabras = titulo.textContent.trim().split(" ");

    titulo.setAttribute("aria-label", titulo.textContent.trim());
    titulo.textContent = "";

    palabras.forEach((palabra, i) => {
      const caja = document.createElement("span");
      const dentro = document.createElement("span");

      caja.className = "palabra";
      caja.setAttribute("aria-hidden", "true");
      dentro.textContent = palabra;
      dentro.style.setProperty("--i", i);

      caja.append(dentro);
      titulo.append(caja, " ");
    });

    document.querySelectorAll(".portada__texto, .boton-portada").forEach((el, i) => {
      el.classList.add("entra");
      el.style.setProperty("--i", palabras.length + i);
    });
  }


  /* ---------- 2. APARICIÓN AL BAJAR (SCROLL) ---------- */
  function animarAparicion() {
    if (sinMovimiento) return;

    const elementos = [
      ".mosaico__intro", ".foto", ".mosaico__etiqueta",
      ".sobre-mi__editorial", ".sobre-mi__datos",
      ".proceso__frase", ".paso",
      ".contacto__titulo", ".marco--contacto", ".formulario-contacto"
    ];

    const observador = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;

        entrada.target.classList.add("visible");
        observador.unobserve(entrada.target);
      });
    }, { threshold: 0.15 });

    document.querySelectorAll(elementos.join(",")).forEach((el) => {
      const posicion = [...el.parentElement.children].indexOf(el);

      el.style.transitionDelay = Math.min(posicion * 0.08, 0.4) + "s";
      el.classList.add("revelar");
      observador.observe(el);
    });
  }


  /* ---------- 3. BOTONES MAGNÉTICOS ---------- */
  function animarBotones() {
    if (!conMouse || sinMovimiento) return;

    document.querySelectorAll(".boton-portada, .boton-barra, .boton-portafolio").forEach((boton) => {
      boton.addEventListener("mousemove", (e) => {
        const caja = boton.getBoundingClientRect();
        const x = (e.clientX - (caja.left + caja.width / 2)) * 0.15;
        const y = (e.clientY - (caja.top + caja.height / 2)) * 0.25;

        boton.style.setProperty("--mx", Math.max(-10, Math.min(10, x)) + "px");
        boton.style.setProperty("--my", Math.max(-6, Math.min(6, y)) + "px");
      });

      boton.addEventListener("mouseleave", () => {
        boton.style.removeProperty("--mx");
        boton.style.removeProperty("--my");
      });
    });
  }


  /* ---------- 4. VISOR DE FOTOS (LIGHTBOX) ---------- */
  function iniciarVisor() {
    const fotos = [...document.querySelectorAll(".galeria .foto")];

    if (!fotos.length) return;

    const visor = document.createElement("dialog");
    let actual = 0;

    visor.className = "visor";
    visor.setAttribute("aria-label", "Foto ampliada");
    visor.innerHTML = `
      <button class="visor__cerrar" type="button" aria-label="Cerrar">&times;</button>
      <button class="visor__flecha visor__flecha--ant" type="button" aria-label="Foto anterior">&#8249;</button>
      <figure class="visor__figura">
        <img alt="">
        <figcaption></figcaption>
      </figure>
      <button class="visor__flecha visor__flecha--sig" type="button" aria-label="Foto siguiente">&#8250;</button>`;
    document.body.append(visor);

    const imagen = visor.querySelector("img");
    const titulo = visor.querySelector("figcaption");

    imagen.addEventListener("load", () => imagen.classList.add("lista"));

    function mostrar(indice, paso = 1) {
      for (let n = 0; n < fotos.length; n++) {
        actual = (indice + fotos.length) % fotos.length;
        if (!fotos[actual].classList.contains("sin-imagen")) break;
        indice += paso;
      }

      const foto = fotos[actual];
      const origen = foto.querySelector("img");

      imagen.classList.remove("lista");
      imagen.src = origen.currentSrc || origen.src;
      imagen.alt = origen.alt;
      titulo.textContent = origen.alt;

      if (imagen.complete) imagen.classList.add("lista");
    }

    function abrir(indice) {
      if (fotos[indice].classList.contains("sin-imagen")) return;

      mostrar(indice);
      visor.showModal();
      document.body.style.overflow = "hidden";
    }

    fotos.forEach((foto, i) => {
      foto.tabIndex = 0;
      foto.setAttribute("role", "button");
      foto.setAttribute("aria-label", "Ampliar " + foto.querySelector("img").alt);

      foto.addEventListener("click", () => abrir(i));
      foto.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          abrir(i);
        }
      });
    });

    visor.querySelector(".visor__cerrar").addEventListener("click", () => visor.close());
    visor.querySelector(".visor__flecha--ant").addEventListener("click", () => mostrar(actual - 1, -1));
    visor.querySelector(".visor__flecha--sig").addEventListener("click", () => mostrar(actual + 1, 1));

    visor.addEventListener("click", (e) => {
      if (e.target === visor) visor.close();
    });

    visor.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") mostrar(actual - 1, -1);
      if (e.key === "ArrowRight") mostrar(actual + 1, 1);
    });

    visor.addEventListener("close", () => {
      document.body.style.overflow = "";
    });
  }


  animarPortada();
  animarAparicion();
  animarBotones();
  iniciarVisor();
})();