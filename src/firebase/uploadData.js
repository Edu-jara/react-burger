import { db } from "./config";
import { collection, addDoc } from "firebase/firestore";

const productosAplanados = [
    // HAMBURGUESAS
    { nombre: "Burger Clásica", categoria: "hamburguesas", descripcion: "Medallón de carne, queso cheddar, lechuga y tomate", precio: 5500, stock: 10, imagen: "/images/hamburguesas/hamburguesa1.jpg" },
    { nombre: "Burger Doble Bacon", categoria: "hamburguesas", descripcion: "Doble carne, doble cheddar y panceta crujiente", precio: 7200, stock: 10, imagen: "/images/hamburguesas/hamburguesa2.jpg" },
    { nombre: "Burger Mega Cheddar", categoria: "hamburguesas", descripcion: "Triple carne, lluvia de cheddar fundido y salsa especial", precio: 8500, stock: 10, imagen: "/images/hamburguesas/hamburguesa3.jpg" },
    { nombre: "Burger Completa con Huevo", categoria: "hamburguesas", descripcion: "Carne, jamón, queso, lechuga, tomate y huevo a la plancha", precio: 6900, stock: 10, imagen: "/images/hamburguesas/hamburguesa4.jpg" },
    { nombre: "Burger Monster", categoria: "hamburguesas", descripcion: "Cuádruple carne, cuatro capas de cheddar y aros de cebolla", precio: 9800, stock: 10, imagen: "/images/hamburguesas/hamburguesa5.jpg" },
    { nombre: "Burger BBQ", categoria: "hamburguesas", descripcion: "Carne, cheddar, cebolla crispy y salsa barbacoa ahumada", precio: 7100, stock: 10, imagen: "/images/hamburguesas/hamburguesa6.jpg" },
    { nombre: "Burger Onion", categoria: "hamburguesas", descripcion: "Carne, doble queso provoleta y cebolla caramelizada", precio: 7400, stock: 10, imagen: "/images/hamburguesas/hamburguesa7.jpg" },
    { nombre: "Burger Picante", categoria: "hamburguesas", descripcion: "Carne, queso pepper jack, jalapeños y salsa picante de la casa", precio: 7300, stock: 10, imagen: "/images/hamburguesas/hamburguesa8.jpg" },
    { nombre: "Burger Veggie", categoria: "hamburguesas", descripcion: "Medallón de lentejas y quinoa, palta, rúcula y tomate confitado", precio: 6500, stock: 10, imagen: "/images/hamburguesas/hamburguesa9.jpg" },
    { nombre: "Burger de la Casa (Especial)", categoria: "hamburguesas", descripcion: "Medallón de roast beef, provoleta, morrones asados y chimichurri", precio: 8900, stock: 10, imagen: "/images/hamburguesas/hamburguesa10.jpg" },

    // PIZZAS
    { nombre: "Pizza Muzzarella", categoria: "pizzas", descripcion: "Salsa de tomate casera, muzzarella fundida y orégano", precio: 6800, stock: 15, imagen: "/images/pizzas/pizza1.jpg" },
    { nombre: "Pizza Especial con Jamón", categoria: "pizzas", descripcion: "Muzzarella, jamón cocido, morrones asados y aceitunas", precio: 8100, stock: 15, imagen: "/images/pizzas/pizza2.jpg" },
    { nombre: "Pizza Fugazzeta", categoria: "pizzas", descripcion: "Muzzarella abundante y mucha cebolla dorada al horno", precio: 7500, stock: 15, imagen: "/images/pizzas/pizza3.jpg" },
    { nombre: "Pizza Calabresa", categoria: "pizzas", descripcion: "Salsa de tomate, muzzarella y rodajas de longaniza calabresa", precio: 8600, stock: 15, imagen: "/images/pizzas/pizza4.jpg" },
    { nombre: "Pizza Napolitana", categoria: "pizzas", descripcion: "Muzzarella, rodajas de tomates frescos, ajo y perejil", precio: 7900, stock: 15, imagen: "/images/pizzas/pizza5.jpg" },
    { nombre: "Pizza Roquefort con Nuez", categoria: "pizzas", descripcion: "Muzzarella, queso azul intenso y nueces picadas por encima", precio: 9200, stock: 15, imagen: "/images/pizzas/pizza6.jpg" },
    { nombre: "Pizza Palmitos con Salsa Golf", categoria: "pizzas", descripcion: "Muzzarella, jamón, rodajas de palmitos y salsa golf", precio: 9500, stock: 15, imagen: "/images/pizzas/pizza7.jpg" },
    { nombre: "Pizza Morrones y Panceta", categoria: "pizzas", descripcion: "Muzzarella, tiras de panceta crocante y morrones al horno", precio: 8800, stock: 15, imagen: "/images/pizzas/pizza8.jpg" },
    { nombre: "Pizza Rucula y Jamón Crudo", categoria: "pizzas", descripcion: "Muzzarella, jamón crudo estacionado, rúcula fresca y parmesano", precio: 9900, stock: 15, imagen: "/images/pizzas/pizza9.jpg" },
    { nombre: "Pizza Cuatro Quesos", categoria: "pizzas", descripcion: "Muzzarella, provolone, roquefort y sardo", precio: 9400, stock: 15, imagen: "/images/pizzas/pizza10.jpg" },

    // EMPANADAS
    { nombre: "Empanada de Carne Suave", categoria: "empanadas", descripcion: "Carne cortada a cuchillo, cebolla, verdeo y condimentos suaves", precio: 900, stock: 30, imagen: "/images/empanadas/empanada1.jpg" },
    { nombre: "Empanada de Jamón y Queso", categoria: "empanadas", descripcion: "Mezcla clásica de quesos fundidos y jamón selecto", precio: 900, stock: 30, imagen: "/images/empanadas/empanada2.jpg" },
    { nombre: "Empanada de Carne Picante", categoria: "empanadas", descripcion: "Carne picada con ají molido picante, pimentón y cebolla de verdeo", precio: 950, stock: 30, imagen: "/images/empanadas/empanada3.jpg" },
    { nombre: "Empanada de Pollo", categoria: "empanadas", descripcion: "Pollo desmenuzado salteado con morrones, cebolla y un toque de crema", precio: 900, stock: 30, imagen: "/images/empanadas/empanada4.jpg" },
    { nombre: "Empanada de Verdura y Queso", categoria: "empanadas", descripcion: "Acelga fresca salteada con ajo, salsa blanca y muzzarella", precio: 850, stock: 30, imagen: "/images/empanadas/empanada5.jpg" },
    { nombre: "Empanada Caprese", categoria: "empanadas", descripcion: "Muzzarella, cubitos de tomate fresco y hojas de albahaca", precio: 900, stock: 30, imagen: "/images/empanadas/empanada6.jpg" },
    { nombre: "Empanada de Cebolla y Queso (Fugazzeta)", categoria: "empanadas", descripcion: "Cebolla caramelizada y abundante muzzarella estirada", precio: 880, stock: 30, imagen: "/images/empanadas/empanada7.jpg" },
    { nombre: "Empanada de Roquefort", categoria: "empanadas", descripcion: "Salsa blanca espesa con queso azul derretido", precio: 980, stock: 30, imagen: "/images/empanadas/empanada8.jpg" },
    { nombre: "Empanada de Humita", categoria: "empanadas", descripcion: "Crema de choclo dulce con sofrito de cebolla y morrón", precio: 850, stock: 30, imagen: "/images/empanadas/empanada9.jpg" },
    { nombre: "Empanada de Panceta y Cheddar", categoria: "empanadas", descripcion: "Crocante de panceta ahumada con pasta de queso cheddar", precio: 1000, stock: 30, imagen: "/images/empanadas/empanada10.jpg" }
];

export const cargarTodosLosProductos = async () => {
    // Acá especificamos el nombre de la colección:
    const productosRef = collection(db, "productos nacionales");

    for (const producto of productosAplanados) {
        try {
            await addDoc(productosRef, producto);
        } catch (error) {
            console.error("Error al subir:", error);
        }
    }
    alert("¡Se subieron todos los productos con éxito a 'productos nacionales'!");
};