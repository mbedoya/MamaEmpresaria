angular.module('novaventa.services', [])

    .factory('Mama', function() {

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
            getPuntos: function() {
                return puntos;
            },
            autenticar: function(cedula, rootScope, http, fx) {
            	http.get(rootScope.configuracion.ip_servidores +  "/AntaresWebServices/interfaceAntares/validacionAntares/" + cedula +"/1").
							success(function(data, status, headers, config) {
								console.log("success");
								fx(data);
							}).
							error(function(data, status, headers, config) {
								console.log("error");
								fx({});
							});
            
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
