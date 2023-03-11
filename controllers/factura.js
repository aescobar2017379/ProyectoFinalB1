const { request, response } = require('express');
const Categoria = require('../models/categoria');
const Carrito = require('../models/carrito-de-compra');

const getFactura = async (req = request, res = response) => {

     //condiciones del get
     const query = { estado: true };

     const listaFactura = await Promise.all([
         Factura.countDocuments(query),
         Factura.find(query).populate('cliente', 'nombre').pupulate('admin', 'correo').populate('carrito', 'carrito').populate('productos')
     ]);
 
     res.json({
         msg: 'get Api - Controlador Factura',
        listaFactura
     });
 
}


const getFacturaPorID = async (req = request, res = response) => {

   const { id } = req.params;
   const facturaById = await Factura.findById( id ).populate('cliente', 'nombre').pupulate('admin', 'correo').populate('carrito', 'carrito').populate('productos')

   res.status(201).json( categoriaById );

}


const postFactura = async (req = request, res = response) => {
    //toUpperCase para todo a Mayusculas
    const nombre = req.body.nombre.toUpperCase();

    const facturaDB = await Factura.findOne({ nombre: body.nombre });

    //validacion para verificar si ya existe dicha categoria para que no lo agregue
    if (categoriaDB) {
        return res.status(400).json({
            msg: `La Factura ${FacturaDB.nombre}, ya existe`
        });
    }

    // Generar la data a guardar
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        admin: req.usuario._id
    }

    const Factura = await Factura(data);
    //Guardar en DB
    await factura.save();

    res.status(201).json(Factura);

}


const putProducto = async (req = request, res = response) => {
    const { id } = req.params;

    const { estado, usuario, ...restoData } = req.body;

    if (restoData.nombre) {
        restoData.nombre = restoData.nombre.toUpperCase();
        restoData.usuario = req.usuario._id;
    }

    const productoActualizado = await Producto.findByIdAndUpdate(id, restoData, ({ new: true }));

    res.status(201).json({
        msg: 'controller producto',
        productoActualizado
    });
}

const deleteProducto = async (req = request, res = response) => {
    
    const {id} = req.params;
    const productoEliminado = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true});
    
    res.json({
        msg: "Eliminar",
        productoEliminado
    });
}




module.exports = {
    getFacturas,
    getFacturaPorID,
    postFactura,
    putProducto,
    deleteProducto
}
