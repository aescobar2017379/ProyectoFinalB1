const { response, request } = require('express');

const Carrito = require('../models/carrito-de-compra');

const getCarrito = async (req = request, res = response) => {
    //condiciones del get
    const query = { estado: true };
  
    const listaCarrito = await Promise.all([
      Carrito.countDocuments(query),
      Carrito.find(query).populate("usuario", "nombre")
    ]);
  
    res.json({
      msg: "get Api - Controlador Carrito",
      listaCarritos
    });
};


const postCarrito = async (req = request, res = response) => {
    const carrito = req.body.carrito.toUpperCase();
    
    const carritoDB = await Carrito.findOne({ carrito });
  
    if (carritoDB) {
      return res.status(400).json({
        msg: `El carrito ${carritoDB.carrito}, ya existe.`,
      });
    }
  
    const data = {
      carrito,
      usuario: req.usuario._id
    };
  
    const carritos = new Carrito(data);  

    await carritos.save(); 
    res.status(201).json(carritos);
};

const putCarrito = async (req = request, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...resto } = req.body;

  resto.carrito = resto.carrito.toUpperCase();
  resto.usuario = req.usuario._id;

  const carritoEditado = await Carrito.findByIdAndUpdate(id, resto, { new: true });

  res.status(201).json(carritoEditado);
};

const deleteCarrito = async(req = request, res = response) => {
  const { id } = req.params
  const carritoEliminado = await Carrito.findByIdAndUpdate(id, { estado: false }, {new: true})

  res.json({
      msg: 'get Api - Controlador Categoria (DELETE)',
      carritoEliminado
  })
}

module.exports = {
    getCarrito,
    postCarrito,
    putCarrito,
    deleteCarrito
}