// src/services/cloudinaryService.js

export const subirImagenACloudinary = async (archivoFoto) => {
    // 1. Preparamos el paquete de datos (FormData) con la foto y las variables de entorno
    const data = new FormData();
    data.append("file", archivoFoto);
    data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    data.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

    // 2. Hacemos la petición POST a los servidores de Cloudinary
    const respuesta = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
            method: "POST",
            body: data
        }
    );

    const archivoSubido = await respuesta.json();

    // 3. Verificamos si nos devolvió la URL segura de la imagen
    if (archivoSubido.secure_url) {
        return archivoSubido.secure_url; // Devolvemos el link listo para guardar en Firebase
    } else {
        throw new Error("No se pudo subir la imagen a Cloudinary");
    }
};