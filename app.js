document.addEventListener("DOMContentLoaded", function () {
  let pagina = 1;
  let terminoBusqueda = "";
  const btnAnterior = document.getElementById("btnAnterior");
  const btnSiguiente = document.getElementById("btnSiguiente");
  const btnBuscar = document.getElementById("btnBuscar");

  // Desplazamiento de página
  btnSiguiente.addEventListener("click", () => {
    if (pagina < 1000) {
      pagina += 1;
      cargarPeliculas(terminoBusqueda);
    }
  });
 
  btnAnterior.addEventListener("click", () => {
    if (pagina > 1) {
      pagina -= 1;
      cargarPeliculas(terminoBusqueda);
    }
  });

  // Buscador
  btnBuscar.addEventListener("click", () => {
    pagina = 1;
    terminoBusqueda = document.getElementById("inputBusqueda").value;
    buscarPeliculas();
  });

  // Función para cargar las películas
  const cargarPeliculas = async (nombre = "") => {
    try {
      let url = "";
      if (terminoBusqueda.trim() === "") {
        // Si el input está vacío, cargar películas populares
        url = `https://api.themoviedb.org/3/movie/popular?api_key=192e0b9821564f26f52949758ea3c473&language=es-MX&page=${pagina}`;
      } else {
        // Si el input contiene un nombre, realizar la búsqueda por nombre
        url = `https://api.themoviedb.org/3/search/movie?api_key=192e0b9821564f26f52949758ea3c473&language=es-MX&page=${pagina}&query=${nombre}`;
      }
      const respuesta = await fetch(url);

      if (respuesta.status === 200) {
        const datos = await respuesta.json();
        let peliculas = "";
        datos.results.forEach((pelicula) => {
          const peliculaId = pelicula.id; 
          peliculas += `
          <div class="pelicula" id="pelicula-${peliculaId}">
            <img class="poster" src="https://image.tmdb.org/t/p/w500/${pelicula.poster_path}" data-pelicula-id="${peliculaId}">
            <h3 class="titulo">${pelicula.title}</h3>
            <div class="detalles-pelicula">
              <h3>${pelicula.title}</h3>
              <p>${pelicula.overview}</p>
              <p>Rating: ${pelicula.vote_average}</p>
            </div>
          </div>
        `;
        });

        document.getElementById("contenedor").innerHTML = peliculas;

        const imagenesPeliculas = document.querySelectorAll(".poster");

        imagenesPeliculas.forEach((imagen) => {
          imagen.addEventListener("mouseover", async () => {
           
            const peliculaId = imagen.dataset.peliculaId;
   
            const detalles = await obtenerDetallesPelicula(peliculaId);

            mostrarDetallesPelicula(detalles);
          });
          imagen.addEventListener("mouseout", () => {
            ocultarDetallesPelicula();
          });
        });
      } else if (respuesta.status === 401) {
        console.log("Error en clave de API");
      } else if (respuesta.status === 404) {
        console.log("La película que buscas no existe");
      } else {
        console.log("Ocurrió un error, estamos trabajando para solucionarlo");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Función para buscar películas
  const buscarPeliculas = () => {
    const nombre = document.getElementById("inputBusqueda").value;
    cargarPeliculas(nombre);
  };

  
  async function obtenerDetallesPelicula(peliculaId) {
    const url = `https://api.themoviedb.org/3/movie/${peliculaId}?api_key=192e0b9821564f26f52949758ea3c473&language=es-MX`;
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    return datos;
  }


  function mostrarDetallesPelicula(detalles) {
    const detallePelicula = document.getElementById("detallesPelicula");
    if (detallePelicula) {
      detallePelicula.innerHTML = `
        <h3>${detalles.title}</h3>
        <p>${detalles.overview}</p>
        <p>Rating: ${detalles.vote_average}</p>
      `;
      detallePelicula.style.display = "block"; 
    } else {
      console.log(
        "El contenedor de detalles de la película no se encontró en el documento."
      );
    }
  }

 
  function ocultarDetallesPelicula() {
    const detallePelicula = document.getElementById("detallesPelicula");
    if (detallePelicula) {
      detallePelicula.style.display = "none";
    } else {
      console.log(
        "no esta el elemento capo"
      );
    }
  }

  cargarPeliculas();
});
