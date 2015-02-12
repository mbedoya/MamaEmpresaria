angular.module('novaventa.services', [])

    .factory('Mama', function() {

        return {
            getPuntos: function(cedula, http, fx) {
            
            	var urlServicio = "http://www.mocky.io/v2/54d91ad61fad9a7e0b0fb3e5";
            	
            	if(cedula == "43361856")
            	{
            	   urlServicio = "http://www.mocky.io/v2/54dccfa925c3389004d653bf";
            	}else{
            		if(cedula == "42692122")
            	    {
            	      urlServicio = "http://www.mocky.io/v2/54dcd17225c3388a04d653c1";
            	    }else{
            	        if(cedula == "43671595")
            	       {
            	         urlServicio = "http://www.mocky.io/v2/54dcd39625c3389004d653c2";
            	       }else{

                            if(cedula == "43110847")
                            {
                                urlServicio = "http://www.mocky.io/v2/54dcf75f25c3389607d653df";
                            }else{
                                if(cedula == "43544882")
                                {
                                    urlServicio = "http://www.mocky.io/v2/54dcf9bd25c338bd07d653e0";
                                }
                            }
            	       }
            	    }
            	}
            	
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
