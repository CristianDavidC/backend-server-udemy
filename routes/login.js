var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

// SEED
var SEED = require('../config/config').SEED;

var app = express();

// Traer datos de BD
// Importar modelo (esquema)

var Usuario = require('../models/usuario'); 

app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {
        
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err  
            })
        }

        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: { message: 'Credenciales incorrectas' }  
            })
        }

        if ( !bcrypt.compareSync( body.password, usuarioBD.password )) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: { message: 'Credenciales incorrectas' }  
            })
        }

        // Crear un TOKEN
        usuarioBD.password = '';
        var token = jwt.sign({ usuarioBD }, SEED, { expiresIn: 14440 }); //4 horas

        res.status(200).json({
            ok: true,
            mensaje: 'Login correcto',
            usuario: usuarioBD,
            id: usuarioBD.id,
            token: token
        });
    });
});

module.exports = app;