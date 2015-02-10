angular.module('novaventa.services', [])

    .factory('Mama', function() {

        return {
            getPuntos: function(cedula, http, fx) {
                //http.get("http://www.mocky.io/v2/54d91ad61fad9a7e0b0fb3e5"). - con todo
                //http.get("http://www.mocky.io/v2/54da75db267da3630cb0f39f"). - sin puntos redimidos
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

        return {
            get: function(latitud, longitud, http, fx) {
                http.get("http://www.mocky.io/v2/54da1eff267da3fc05b0f358").
                    success(function(data, status, headers, config) {
                        console.log(data);
                        fx(true, data);
                    }).
                    error(function(data, status, headers, config) {
                        fx(false, {});
                    });
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
