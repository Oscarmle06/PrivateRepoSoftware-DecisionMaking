console.log("hola desde el fondo de la pagina")

  function traduce() {
    parrafo = document.getElementsByClassName("menu_items")[0];
    parrafo.innerHTML = ":3";
  }

  function cambiarFondo() {
    const color1 = "rgb(255, 253, 245)"; 
    const color2 = "rgb(56, 52, 40)";  
    const mainContainer = document.querySelector('main');     
    
    if (document.body.style.backgroundColor === color1) {
        document.body.style.backgroundColor = color2;
        mainContainer.style.color = color1
    } else {
        document.body.style.backgroundColor = color1;
        mainContainer.style.color = color2

    }
}
    function modoGATO() {
        const imgmanzana = "Apple_Cat.jpg"

        // Aplicamos la imagen
    document.body.style.backgroundImage = `url('${imgmanzana}')`;
    
    // OPCIONAL: Ajustes para que la imagen se vea bien (no se repita y cubra todo)
    document.body.style.backgroundSize = "cover";       // Cubre todo el ancho/alto
    document.body.style.backgroundPosition = "center"; // Centra la imagen
    document.body.style.backgroundAttachment = "fixed"; // La imagen se queda quieta al hacer scroll
}
    