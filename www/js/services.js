angular.module('novaventa.services', [])

    .factory('Mama', function() {

        return {
            getPuntos: function(cedula, http, fx) {
                http.get("http://www.mocky.io/v2/54d91ad61fad9a7e0b0fb3e5").
                    success(function(data, status, headers, config) {
                        fx(true, data);
                    }).
                    error(function(data, status, headers, config) {
                        fx(false, {});
                    });
            },
            autenticar: function(cedula, rootScope, http, fx) {
            	http.get(rootScope.configuracion.ip_servidores +  "/AntaresWebServices/interfaceAntares/validacionAntares/" + cedula +"/1").
                    success(function(data, status, headers, config) {
                       fx(true, data);
                    }).
                    error(function(data, status, headers, config) {
                        fx(false, {});
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
