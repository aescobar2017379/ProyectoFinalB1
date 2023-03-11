const { request, response } = require('express');
const Producto = require('../models/producto')


const getProductos = async (req = request, res = response) => {

    const query = { estado: true };

    const listaProducto = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'correo')
            .populate('categoria', 'nombre')
    ]);

    res.json({
        msg: 'get Api - Controlador Usuario',
        listaProducto
    });

}

const getProductosAgotados = async (req = request, res = response) => {

    const query = { disponible: false };

    const listaProductos = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'correo')
            .populate('categoria', 'nombre')
    ]);

    res.json({
        msg: 'Productos agotados',
        listaProductos
    });

}

const getProductosMasvendidos = async (req = request, res = response) => {

    const query = await Producto.find().sort({ventas: -1}).limit(5);

    res.status(201).json({
        msg: "Productos más vendidos",
        query
    })

}

const getProductoPorID = async (req = request, res = response) => {

    const { id } = req.params;
    const productoById = await Producto.findById(id)
        .populate('usuario', 'correo')
        .populate('categoria', 'nombre')


    res.status(201).json(productoById);

}

const postProducto = async (req = request, res = response) => {

    const { estado, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne({ nombre: body.nombre });

    if ( productoDB ) {
        return res.status(400).json({
            msg: `El producto ${ productoDB.nombre }, ya existe en la DB`
        });
    }

    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    const producto = await Producto( data );

    await producto.save();

    res.status(201).json( producto );
   
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
        msg: 'Put Controller Producto',
        productoActualizado
    });
}

const deleteProducto = async (req = request, res = response) => {
    
    const {id} = req.params;
    const productoEliminado = await Producto.findByIdAndUpdate(id, {estado: false}, {new: true});
    
    res.json({
        msg: "DELETE",
        productoEliminado
    });
}




module.exports = {
    getProductos,
    getProductoPorID,
    getProductosAgotados,
    getProductosMasvendidos,
    postProducto,
    putProducto,
    deleteProducto
}
