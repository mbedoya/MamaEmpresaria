angular.module('novaventa.services', [])

    .factory('Puntos', function() {

        var puntos = {
            "productosRedimidos": [   {
                "cantidad": 1,
                "premioRedimido": "DUCALES TENTACIÓN X 156G COMBO PREMIO 2",
                "puntosRedimidos": 170
            },
            {
                "cantidad": 2,
                "premioRedimido": "TELEVISOR",
                "puntosRedimidos": 36000
            }],
            "puntosDisponibles": 460,
            "puntosPorPerder": 525,
            "puntosRedimidos": 170,
            "puntosAVerncer": 229,
            "agnoCampagnaVencimiento": 201417
        };

        return {
            get: function() {
                return puntos;
            }
        }
    })

    .factory('PuntosPago', function() {

        var puntos = [
            {
                "nombre": "Panadería Pepe",
                "direccion": "Calle 10",
                "distancia": 2.3
            },
            {
                "nombre": "Bancolombia Unicentro",
                "direccion": "Carrera 66B",
                "distancia": 3
            }];

        return {
            get: function() {
                return puntos;
            }
        }
    })

    .factory('Internet', function() {

        var connection = navigator.connection;

        return {
            get: function() {
                //return connection && connection.type.toLowerCase() != "none";
                return true;
            }
        }
    })
;
