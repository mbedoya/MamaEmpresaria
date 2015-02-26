angular.module('novaventa.services', [])

    .factory('Mama', function() {

        return {
            getPuntos: function(cedula, rootScope, http, fx) {
            	var urlServicio = rootScope.configuracion.ip_servidores +  "/AntaresWebServices/resumenPuntos/ResumenPuntosEmpresaria/" + cedula;
            	
                    http.get(urlServicio).
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
            
            },
            getTrazabilidadPedido: function(cedula, rootScope, http, fx) {
                var urlServicio = rootScope.configuracion.ip_servidores +  "/AntaresWebServices/pedidos/PedidoCampagna/" + cedula;

                http.get(urlServicio).
                    success(function(data, status, headers, config) {
                        fx(true, data);
                    }).
                    error(function(data, status, headers, config) {
                        fx(false, {});
                    });
            },
            getAgotadosPedido: function(pedido, rootScope, http, fx){
            
               //var urlServicio = rootScope.configuracion.ip_servidores +  "/AntaresWebServices/pedidos/PedidoCampagna/" + cedula;
               var urlServicio = "http://www.mocky.io/v2/54ee3b594e65b0e60a4fb38f";

                http.get(urlServicio).
                    success(function(data, status, headers, config) {
                        fx(true, data);
                    }).
                    error(function(data, status, headers, config) {
                        fx(false, {});
                    });
               
            },
            getRecordatorios: function(ano, campana, zona, rootScope, http, fx){
                var urlServicio = rootScope.configuracion.ip_servidores +  "/AntaresWebServices/interfaceAntares/getRecordatoriosAntares/"+ ano +"/" + campana + "/" + zona;

                http.get(urlServicio).
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

        return {
            get: function() {
                var connection = navigator.connection;
            
                //Se puede establecer el tipo de conexión a Internet?
                if(connection && connection.type){
                   return connection.type.toLowerCase() != "none";
                }else{
                   return true;
                }
            }
        }
    })
    
    .factory('GA', function() {

        return {
            trackPage: function(gaPlugin, page) {
            
               if(gaPlugin){
                  gaPlugin.trackPage(function(){
                    
                   }, function(){
                    
                   }, page);
               }
                
            }
        }
    })
    
    .factory('Utilidades', function() {

        return {
            mostrarMensaje: function(scope, mensaje) {
            
               
                
            }
        }
    })
;
