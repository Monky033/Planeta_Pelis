let pagina = 1;
let terminoBusqueda = "";
const btnAnterior = document.getElementById("btnAnterior");
const btnSiguiente = document.getElementById("btnSiguiente");
const btnBuscar = document.getElementById("btnBuscar");

// Desplazamiento de pagina
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

// buscador
btnBuscar.addEventListener("click", () => {
  pagina = 1;
  terminoBusqueda = document.getElementById("inputBusqueda").value;
  buscarPeliculas();
});

//Peliculas
const cargarPeliculas = async (nombre = "") => {
  try {
    let url = "";
    if (terminoBusqueda.trim() === "") {
      // Si el input esta vacio carga películas populares
      url = `https://api.themoviedb.org/3/movie/popular?api_key=192e0b9821564f26f52949758ea3c473&language=es-MX&page=${pagina}`;
    } else {
      // Si input contiene un nombre, realizar la búsqueda por nombre
      url = `https://api.themoviedb.org/3/search/movie?api_key=192e0b9821564f26f52949758ea3c473&language=es-MX&page=${pagina}&query=${nombre}`;
    }

    const respuesta = await fetch(url);

    console.log(respuesta);

    if (respuesta.status === 200) {
      const datos = await respuesta.json();

      let peliculas = "";
      datos.results.forEach((pelicula) => {
        peliculas += `
          <div class="pelicula">
            <img class="poster" src="https://image.tmdb.org/t/p/w500/${pelicula.poster_path}">
            <h3 class="titulo">${pelicula.title}</h3>
          </div>
        `;
      });

      document.getElementById("contenedor").innerHTML = peliculas;
    } else if (respuesta.status === 401) {
      console.log("Error en key");
    } else if (respuesta.status === 404) {
      console.log("La película que buscas no existe");
    } else {
      console.log("Ocurrió un error, estamos trabajando para solucionarlo");
    }
  } catch (error) {
    console.log(error);
  }
};

const buscarPeliculas = () => {
  const nombre = document.getElementById("inputBusqueda").value;
  cargarPeliculas(nombre);
};

cargarPeliculas();
