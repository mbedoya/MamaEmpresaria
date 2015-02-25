angular.module('novaventa.controllers', [])

    .controller('AppCtrl', function($scope, $state, $rootScope, $ionicHistory) {

        $scope.cerrarSesion = function() {
            console.log("cerrando sesión");

            if(localStorage && localStorage.cedula){
                localStorage.removeItem("cedula");
            }
            $ionicHistory.clearHistory();
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
            $state.go('app.login');
        };

    })
    
    .controller('TabsCtrl', function($scope, $state, $ionicActionSheet) {


        $scope.mostrarOpcionesMas = function() {
           // Show the action sheet
      var hojaOpciones = $ionicActionSheet.show({
     buttons: [
       { text: 'Club de Privilegios' },
       { text: 'Información general' },
       { text: 'Contacto' }
     ],
     cancelText: 'Cancelar',
     cancel: function() {
          // add cancel code..
        },
     buttonClicked: function(index) {
     
       if(index == 0){
          $state.go('app.menu.tabs.mas.club.piedrapreciosa');
       }else{
          if(index == 1){
            $state.go('app.menu.tabs.mas.informacion.fechas');
          }else{
             $state.go('app.menu.tabs.mas.contacto');
          }
       }
       
     }
   });
        };

    })

	.controller('InicializacionCtrl', function($scope, $rootScope, $ionicPopup, $ionicLoading, $ionicHistory, $http, $state, Internet, Mama, GA) {

        $scope.mostrarMensajeError = false;

     setTimeout(function(){
       if(window.plugins && window.plugins.gaPlugin){
        	$rootScope.gaPlugin = window.plugins.gaPlugin;
    	    $rootScope.gaPlugin.init(function(){
              }, function(){
              }, "UA-59821648-1", 10);
             }  
     }, 2000);

	   //Registro en Analytics      
       GA.trackPage($rootScope.gaPlugin, "App Iniciada");  

      $scope.mostrarAyuda = function(titulo, mensaje) {
           var alertPopup = $ionicPopup.alert({
             title: titulo,
             template: mensaje
           });
         };

        $scope.inicializar = function(){
			
            $rootScope.datos = {};
            $rootScope.puntos = {};
            $rootScope.configuracion = { ip_servidores: 'http://200.47.173.66:9081' };

            //Almacenar la cédula si hay almacenamiento local
            if(localStorage && localStorage.cedula){

                $rootScope.datos = { cedula: localStorage.cedula }

                if(Internet.get()){

                    $scope.loading =  $ionicLoading.show({
                        template: 'Iniciando sesión'
                    });

                    resultado = Mama.autenticar($rootScope.datos.cedula, $rootScope, $http, function(success, data){

                        $ionicLoading.hide();

                        //Error en la autenticación?
                        if(data && data.razonRechazo){

                            if(data.razonRechazo == "El usuario no se encuentra registrado en Antares."){
                                alert("Lo sentimos no existe información para la cédula ingresada. Comunícate con tu Mamá Líder o la línea de atención", "");
                            }else{
                                alert(data.razonRechazo);
                            }
                        }else{

                            //Tipo de usuario recibido?
                            if(data.tiposUsuarios && data.tiposUsuarios.length > 0 && (data.tiposUsuarios[0] == "1" || data.tiposUsuarios[0] == "3")){

                                //Establecer los datos de resumen de la Mamá
                                $rootScope.datos.nombre = data.nombreCompleto;
                                $rootScope.datos.segmento = data.clasificacionValor;
                                $rootScope.datos.cupo = data.cupo;
                                $rootScope.datos.saldo = data.saldoBalance;
                                $rootScope.datos.valorFlexibilizacion = data.valorFlexibilizacion;
                                $rootScope.zona = data.listaZonas[0];

                                $rootScope.campana = {numero: '-', fechaMontajePedido:'-'};

                                $http.get($rootScope.configuracion.ip_servidores + "/AntaresWebServices/interfaceAntares/getRecordatoriosAntares/" + data.listaZonas[0]).
                                    success(function(data, status, headers, config) {
                                        $rootScope.campana = {numero: data.listaRecordatorios[0].campagna, fechaMontajePedido:data.listaRecordatorios[0].fecha};
                                        $rootScope.fechas = data.listaRecordatorios;
                                    }).
                                    error(function(data, status, headers, config) {
                                        console.log("Error consultando los datos de campaña");
                                    });

								$ionicHistory.nextViewOptions({
                                 disableBack: true
                                });
                                $state.go('app.menu.tabs.home');

                            }else{

                                if(data.tiposUsuarios){
                                    $scope.mostrarAyuda("Inicio de sesión","Tu rol no es válido para nuestra Aplicación");
                                }else{
                                    $scope.mostrarMensajeError = true;
                                    $scope.mostrarAyuda("Inicio de sesión","En este momento no podemos consultar tu información");
                                }

                            }


                        }

                    });

                }else{
                    $scope.mostrarMensajeError = true;
                    $scope.mostrarAyuda("Inicio de sesión","Por favor verifica tu conexión a internet")
                }

            }else{

                console.log("hay almacenamiento local");
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                $state.go('app.login');

            }
        }

        $scope.inicializar();


    })

    .controller('LoginCtrl', function($scope, $rootScope, $ionicLoading, $ionicPopup, $state, $http, $ionicHistory, Mama, Internet, GA) {

       //Registro en Analytics      
       GA.trackPage($rootScope.gaPlugin, "Inicio de sesión");
       
       $scope.mostrarAyuda = function(titulo, mensaje) {
           var alertPopup = $ionicPopup.alert({
             title: titulo,
             template: mensaje
           });
         };

    	$scope.datosInicio = {cedula: '' };
    
    	//Autenticar a la Mamá Empresaria
        $scope.capturarCedula = function() {

            $rootScope.datos = { cedula: $scope.datosInicio.cedula }
            
            //Cédula vacía
            if(!$rootScope.datos.cedula){
                $scope.mostrarAyuda("Inicio de sesión","Debes ingresar la cédula");
                return;
            }

            //Cantidad de caracteres
            if(String($rootScope.datos.cedula).length < 6 || String($rootScope.datos.cedula).length > 10){
                $scope.mostrarAyuda("Inicio de sesión","Debes ingresar entre 6 y 10 dígitos");
                return;
            }

            //Caracteres especiales
            if(String($rootScope.datos.cedula).indexOf(".") >= 0 || String($rootScope.datos.cedula).indexOf(",") >= 0){
                $scope.mostrarAyuda("Inicio de sesión","Debes ingresar sólo dígitos");
                return;
            }

            if(Internet.get()){

                $scope.loading =  $ionicLoading.show({
                    template: 'Iniciando sesión'
                });

            	resultado = Mama.autenticar($scope.datosInicio.cedula, $rootScope, $http, function(success, data){

                    $ionicLoading.hide();

                    //Error en la autenticación?
                    if(data && data.razonRechazo){

                        if(data.razonRechazo == "El usuario no se encuentra registrado en Antares."){
                            alert("Lo sentimos no existe información para la cédula ingresada. Comunícate con tu Mamá Líder o la línea de atención", "");
                        }else{
                            alert(data.razonRechazo);
                        }
                    }else{

                        //Tipo de usuario recibido?
                        if(data.tiposUsuarios && data.tiposUsuarios.length > 0 && (data.tiposUsuarios[0] == "1" || data.tiposUsuarios[0] == "3")){

                            //Establecer los datos de resumen de la Mamá
                            $rootScope.datos.nombre = data.nombreCompleto;
                            $rootScope.datos.segmento = data.clasificacionValor;
                            $rootScope.datos.cupo = data.cupo;
                            $rootScope.datos.saldo = data.saldoBalance;
                            $rootScope.datos.valorFlexibilizacion = data.valorFlexibilizacion;
                            $rootScope.zona = data.listaZonas[0];

                            $rootScope.campana = {numero: '-', fechaMontajePedido:'-'};

                            $http.get($rootScope.configuracion.ip_servidores + "/AntaresWebServices/interfaceAntares/getRecordatoriosAntares/" + data.listaZonas[0]).
                                success(function(data, status, headers, config) {
                                    $rootScope.campana = {numero: data.listaRecordatorios[0].campagna, fechaMontajePedido:data.listaRecordatorios[0].fecha};
                                    $rootScope.fechas = data.listaRecordatorios;
                                }).
                                error(function(data, status, headers, config) {
                                    console.log("Error consultando los datos de campaña");
                                });
                                
                                
                            Mama.getTrazabilidadPedido($rootScope.datos.cedula, $rootScope, $http, function (success, data){
                                if(success){
                                    $rootScope.pedido = data;
                                    console.log("Pedido");
                                    console.log($rootScope.pedido);

                                }else{
                                    //$ionicLoading.hide();
                                    //alert("En este momento no podemos acceder a tu información");
                                }
                            });

                            Mama.getPuntos($rootScope.datos.cedula, $rootScope, $http, function (success, data){
                                if(success){
                                    $rootScope.puntos = data;

                                }else{
                                    //alert("En este momento no podemos acceder a tu información");
                                }
                            });

                            //Almacenar la cédula si hay almacenamiento local
                            if(localStorage){
                                localStorage.cedula = $scope.datosInicio.cedula;
                            }

                            $scope.datosInicio = {cedula: '' };

                            $ionicHistory.nextViewOptions({
                             disableBack: true
                            });
                            $state.go('app.menu.tabs.home');

                        }else{

                            if(data.tiposUsuarios){
                                $scope.mostrarAyuda("Inicio de sesión","Tu rol no es válido para nuestra Aplicación");
                            }else{
                                $scope.mostrarAyuda("Inicio de sesión","En este momento no podemos consultar tu información");
                            }
                        }


                    }

            	});
            	
            }else{
                $scope.mostrarAyuda("Inicio de sesión","Por favor verifica tu conexión a internet");
            }
        }
    })

    .controller('HomeCtrl', function($scope, $rootScope, $state, $ionicPopup, GA) {

        //Registro en Analytics      
       GA.trackPage($rootScope.gaPlugin, "Home");
       
         $scope.mostrarAyuda = function(titulo, mensaje) {
           var alertPopup = $ionicPopup.alert({
             title: titulo,
             template: mensaje
           });
         };

        $scope.mostrarCupo = function(){
            return Number($rootScope.datos.cupo) > 0;
        }

        $scope.etiquetaSaldo = function(){

            var etiqueta = "Saldo a pagar";

            if($rootScope.datos && $rootScope.datos.saldo){

                if(Number($rootScope.datos.saldo) < 0) {
                    etiqueta = "Saldo a favor";
                }else{
                    etiqueta = "Debes pagar " + $scope.saldo() + " de la Campaña XXX";
                }
            }

            return etiqueta;
        }

        $scope.mostrarSaldoFavor = function(){
            return ($rootScope.datos && $rootScope.datos.saldo && Number($rootScope.datos.saldo) < 0);
        }

        $scope.mostrarSaldoPagar = function(){
            return !$scope.mostrarSaldoFavor();
        }

        $scope.nombre = function(){
             var nombrePascal = $rootScope.datos.nombre.split(' ');
             for	(index = 0; index < nombrePascal.length; index++) {  
               nombrePascal[index] = nombrePascal[index].substring(0,1).toUpperCase() + nombrePascal[index].substring(1, nombrePascal[index].length).toLowerCase();
             }
            
            return nombrePascal.join(' ');
        }

        $scope.segmento = function(){
            return $rootScope.datos.segmento;
        }

        $scope.saldo = function(){
            return Math.abs(Number($rootScope.datos.saldo)) ;
        }

        $scope.cupo = function(){
            return $rootScope.datos.cupo;
        }

        $scope.numeroCampana = function(){
            return $rootScope.campana.numero;
        }

        $scope.fechaMontajePedidoCampana = function(){
            return $rootScope.campana.fechaMontajePedido;
        }
        
        $scope.flexibilizacion = function(){
           return $rootScope.datos.valorFlexibilizacion;
        }
        
        $scope.flexibilizacionPago = function(){
           //La flexibilización es mayor que el valor a Pagar?
           if(Number($rootScope.datos.valorFlexibilizacion)>Number($rootScope.datos.saldo)){
              return 0;
           }else{
              return Number($rootScope.datos.saldo)-Number($rootScope.datos.valorFlexibilizacion);
           }
        }
        
        $scope.flexibilizacionDeuda = function(){
           //La flexibilización es mayor que el valor a Pagar?
           if(Number($rootScope.datos.valorFlexibilizacion)>Number($rootScope.datos.saldo)){
              return Number($rootScope.datos.saldo);
           }else{
              return Number($rootScope.datos.valorFlexibilizacion);
           }
        }
        
        $scope.diasParaPago = function(){
           if($rootScope.campana && $rootScope.campana.fechaMontajePedido){
               var t2 = new Date($rootScope.campana.fechaMontajePedido).getTime();
               var t1 = new Date().getTime();

               return parseInt((t2-t1)/(24*3600*1000));    
           }else{
              return -1;
           }
        }
        
        $scope.mostrarAyudaSaldoPagar = function(){
           $scope.mostrarAyuda('Pagos','El pago que dejas de hacer es debido al beneficio que tienes llamado "Flexibilización", los $' + $scope.flexibilizacionDeuda() + ' que quedas debiendo, los debes cancelar antes de tu próximo pedido.');
        }

    })

    .controller('MisPuntosCtrl', function($scope, $rootScope, $state, $ionicLoading, $ionicPopup, $http, Mama, Internet, GA) {

         //Registro en Analytics      
       GA.trackPage($rootScope.gaPlugin, "Mis Puntos");
       
       $scope.mostrarAyuda = function(titulo, mensaje) {
           var alertPopup = $ionicPopup.alert({
             title: titulo,
             template: mensaje
           });
         };

        if(Internet.get()){
        
           $scope.loading =  $ionicLoading.show({
                    template: 'Estamos consultando tus puntos'
                });
          
            Mama.getPuntos($rootScope.datos.cedula, $rootScope, $http, function (success, data){
                if(success){
					$ionicLoading.hide();
                    $rootScope.puntos = data;

                }else{
                    $ionicLoading.hide();
                    $scope.mostrarAyuda("Mis Puntos","En este momento no podemos acceder a tu información");
                }
            });
        }else{
            $scope.mostrarAyuda("Mis Puntos","Por favor verifica tu conexión a internet");
        }

        $scope.campanaVencimientoPuntos = function(){
            return String($rootScope.puntos.agnoCampagnaVencimiento).substring(4,2) + " de " + String($rootScope.puntos.agnoCampagnaVencimiento).substring(0,4);
        }

        $scope.puntosDisponibles = function(){
            return $rootScope.puntos.puntosDisponibles;
        }

        $scope.puntosPorPerder = function(){
            return $rootScope.puntos.puntosPorPerder;
        }

        $scope.puntosAVencer = function(){
            return $rootScope.puntos.puntosAVencer;
        }

        $scope.puntosRedimidos = function(){
            return $rootScope.puntos.puntosRedimidos;
        }
        
        $scope.fechaMontajePedidoCampana = function(){
            return $rootScope.campana.fechaMontajePedido;
        }

        $scope.mostrarPuntosRedimidos = function(){
            return $rootScope.puntos.puntosRedimidos && Number($rootScope.puntos.puntosRedimidos) > 0;
        }

        $scope.mostrarPuntosAVencer = function(){
            return $rootScope.puntos.puntosAVencer && Number($rootScope.puntos.puntosAVencer) > 0;
        }

        $scope.mostrarPuntosPorPerder = function(){
            return $rootScope.puntos.puntosPorPerder && Number($rootScope.puntos.puntosPorPerder) > 0;
        }

    })
    
    .controller('MiPedidoCtrl', function($scope, $rootScope, $state, $ionicLoading, $http, $ionicPopup, Mama, Internet, GA) {

        //Registro en Analytics
        GA.trackPage($rootScope.gaPlugin, "Mi Pedido");

        $scope.mostrarAyuda = function(titulo, mensaje) {
            var alertPopup = $ionicPopup.alert({
                title: titulo,
                template: mensaje
                });
            };

        if(Internet.get()){

            $scope.loading =  $ionicLoading.show({
                template: 'Estamos consultando el estado de tu pedido'
            });

            Mama.getTrazabilidadPedido($rootScope.datos.cedula, $rootScope, $http, function (success, data){
                if(success){
                    $ionicLoading.hide();
                    $rootScope.pedido = data;

                    console.log("Pedido");
                    console.log($rootScope.pedido);

                }else{
                    $ionicLoading.hide();
                    $scope.mostrarAyuda("Mi Pedido","En este momento no podemos acceder a tu información");
                }
            });
        }else{
            $scope.mostrarAyuda("Mi Pedido","Por favor verifica tu conexión a internet");
        }
       
       $scope.verAyudaNovedad = function(){
         $scope.mostrarAyuda('Novedades', 'Debes cancelar $50.000 antes del 24 de febrero para que tu pedido sea enviado');
       }

        $scope.pedido = function(){
            return $rootScope.pedido;
        }
        
        $scope.estadoEncontrado = function(estado){
           var encontrado = false;
           
           if($rootScope.pedido && $rootScope.pedido.historiaEstados){
             for (i = 0; i < $rootScope.pedido.historiaEstados.length; i++) { 
              if($scope.cambiarNombreEstado($rootScope.pedido.historiaEstados[i].estado) == estado){
                 encontrado = true;
                 break;
              }
             }
           }
           
           return encontrado;
        }
        
        $scope.buscarEstado = function(estado){
           var miestado = null;
           
           if($rootScope.pedido && $rootScope.pedido.historiaEstados){
             for (i = 0; i < $rootScope.pedido.historiaEstados.length; i++) { 
              if($scope.cambiarNombreEstado($rootScope.pedido.historiaEstados[i].estado) == estado){
                 miestado = $rootScope.pedido.historiaEstados[i];
                 break;
              }
             }
           }
           
           return miestado;
        }

        $scope.cambiarNombreEstado = function(nombre){

            if(nombre.toLowerCase() == "ingresado"){
                return "Recibido";
            }else{
                if(nombre.toLowerCase() == "en línea"){
                    return "En proceso de empaque";
                }else{

                    if(nombre.toLowerCase() == "cargue"){
                        return "Entregado al transportador";
                    }else{
                        return nombre;
                    }
                }
            }
        }

        $scope.fechaCorreteo = function(){
            fecha = null;
            for (i = 0; i < $rootScope.fechas.length; i++){
                if($rootScope.fechas[i].actividad.toLowerCase() == 'fecha correteo'){
                     fecha = $rootScope.fechas[i].fecha;
                     break;
                }
            }
            return fecha;
        }

        $scope.mostrarNovedad = function(novedad){
            console.log(novedad);
            var mostrar = false;
            if(novedad.toLowerCase().indexOf('morosa')>=0 ||
                novedad.toLowerCase().indexOf('tope')>=0){
                mostrar = true;
            }
            return mostrar;
        }

        $scope.padStr = function(i) {
           return (i < 10) ? "0" + i : "" + i;
        }
        
        $scope.hoyEsCorreteo = function(){
        
           var temp = new Date();
           var dateStr = $scope.padStr(temp.getFullYear()) + "-" +
                  $scope.padStr(1 + temp.getMonth()) + "-" +
                  $scope.padStr(temp.getDate());
           
           correteo = false;
            for (i = 0; i < $rootScope.fechas.length; i++){
                if($rootScope.fechas[i].fecha == dateStr){
                     correteo = true;
                     break;
                }
            }
            return correteo;
        }
    })

    .controller('PuntosPagoCtrl', function($scope, $rootScope, $ionicLoading, $state, $http, $ionicPopup, PuntosPago, Internet, GA) {

         //Registro en Analytics      
       GA.trackPage($rootScope.gaPlugin, "Puntos de Pago");
       
       $scope.mostrarAyuda = function(titulo, mensaje) {
            var alertPopup = $ionicPopup.alert({
                title: titulo,
                template: mensaje
                });
            };

		//Establecer la posición por defecto para el Mapa si no se ha iniciado el GPS
		$rootScope.posicion = { latitud: 6.222611, longitud: -75.57935};

        $scope.mostrarError = true;
        
        $scope.puntos = function(){
        	return $rootScope.puntosPago;
        }

            // onSuccess Callback
        // This method accepts a Position object, which contains the
        // current GPS coordinates
        //
        $scope.onSuccess = function(position) {

                $ionicLoading.hide();

                  $rootScope.posicion = { latitud: position.coords.latitude, longitud: position.coords.longitude};

                  if(Internet.get()){

                   $scope.loading =  $ionicLoading.show({
                            template: 'Estamos buscando los puntos cercanos a ti'
                        });

                    PuntosPago.get(position.coords.latitude, position.coords.longitude, $http, function(success, data){
                    if(success){
                        $ionicLoading.hide();
                        //$scope.puntos = data.puntosDePago;
                        $rootScope.puntosPago = data.puntosDePago;

                    }else{
                         $ionicLoading.hide();
                         $scope.mostrarAyuda("Puntos de Pago","En este momento no podemos acceder a la información de puntos de pago");
                    }

                });

                }else{
                    $scope.mostrarAyuda("Puntos de Pago","Por favor verifica tu conexión a internet");
                }


        };

        // onError Callback receives a PositionError object
        //
      $scope.onError =function(error) {

           $ionicLoading.hide();

            console.log('code: '    + error.code    + '\n' +
                  'message: ' + error.message + '\n');

          $rootScope.errorPosicion = true;

          $state.go("app.menu.tabs.puntospago.puntospagomapa");

        }

        if(navigator && navigator.geolocation){
           $scope.loading =  $ionicLoading.show({
                                template: 'Estamos detectando tu ubicación'
                            });

           navigator.geolocation.getCurrentPosition($scope.onSuccess, $scope.onError, { maximumAge: 3000, timeout: 8000, enableHighAccuracy: true });
        }else{
            $scope.mostrarAyuda("Puntos de Pago","Lo sentimos, no es posible detectar tu ubicación, veras los puntos cercanos a tu zona");
            $state.go("app.menu.tabs.puntospago.puntospagomapa");
        }


    })

    .controller('PuntosPagoMapaCtrl', function($scope, $rootScope, $state, $http, $ionicLoading, PuntosPago, Internet, GA) {

         //Registro en Analytics      
       GA.trackPage($rootScope.gaPlugin, "Puntos de Pago - Mapa");
       
       $scope.mostrarAyuda = function(titulo, mensaje) {
            var alertPopup = $ionicPopup.alert({
                title: titulo,
                template: mensaje
                });
            };

        $scope.intentosGps = 0;


        $scope.inicializar = function(){

            console.log($rootScope.posicion);

            var myLatlng = new google.maps.LatLng($rootScope.posicion.latitud, $rootScope.posicion.longitud);

            var mapOptions = {
                center: myLatlng,
                zoom: 14,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("map"),
                mapOptions);

            var marker = new google.maps.Marker({
                position: myLatlng,
                icon: {
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    scale: 4
                },
                map: map,
                title: 'Novaventa'
            });

            $.each ($rootScope.puntosPago, function(i, val){

                var nombrePunto = val.nombre;
                var direccion = val.direccion;
                var horario = val.horario;

                var marcador = new google.maps.Marker({
                    position: new google.maps.LatLng(val.latitud, val.longitud),
                    map: map,
                    title:  nombrePunto
                });

                var infowindow = new google.maps.InfoWindow({
                    content: '<div style="height:60px">' + nombrePunto + '<br />' + direccion + '<br />' + horario + '</div>'
                });

                google.maps.event.addListener(marcador, 'click', function() {
                    infowindow.open(map,marcador);
                });
            });

            $scope.map = map;
        }

        $scope.onSuccess = function(position) {
        
        	$ionicLoading.hide();
        	clearInterval($scope.interval);

            $rootScope.posicion = { latitud: position.coords.latitude, longitud: position.coords.longitude};

            if(Internet.get()){

                $scope.loading =  $ionicLoading.show({
                    template: 'Estamos buscando los puntos cercanos a ti'
                });

                PuntosPago.get(position.coords.latitude, position.coords.longitude, $http, function(success, data){
                    if(success){
                        $ionicLoading.hide();
                        $rootScope.puntosPago = data.puntosDePago;

                        $scope.inicializar();

                    }else{
                        $ionicLoading.hide();
                        $scope.mostrarAyuda("Puntos de Pago","En este momento no podemos acceder a la información de puntos de pago");
                    }

                });

            }else{
                $scope.mostrarAyuda("Puntos de Pago","Por favor verifica tu conexión a internet");
            }


        };

        // onError Callback receives a PositionError object
        //
        $scope.onError =function(error) {

            console.log('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');

            $scope.intentosGps = $scope.intentosGps + 1;

        }

        if($rootScope.errorPosicion){
            $scope.mostrarAyuda("Puntos de Pago","Lo sentimos, no podemos encontrar tu ubicación, si dispones de GPS debes prenderlo para mejorar tu experiencia");

            $scope.loading =  $ionicLoading.show({
                template: 'Esperando activación de GPS'
            });

            $scope.interval = setInterval(function(){

                if($scope.intentosGps < 4){
                    console.log("intentando leer gps nuevamente");
                    navigator.geolocation.getCurrentPosition($scope.onSuccess, $scope.onError, { maximumAge: 3000, timeout: 8000, enableHighAccuracy: true });
                }else{
                    $ionicLoading.hide();
                    clearInterval($scope.interval);
                    
                    //Mostrar Puntos Acorde a la Zona de la Mamá
                    $scope.loading =  $ionicLoading.show({
                    template: 'Estamos buscando los puntos cercanos tu zona'
                });

                PuntosPago.get(6.222611, -75.57935, $http, function(success, data){
                    if(success){
                        $ionicLoading.hide();
                        $rootScope.puntosPago = data.puntosDePago;

                        $scope.inicializar();

                    }else{
                        $ionicLoading.hide();
                        $scope.mostrarAyuda("Puntos de Pago","En este momento no podemos acceder a la información de puntos de pago");
                    }

                });
                }

            }, 4000);
        }else{
            $scope.inicializar();
        }

    })
    
    .controller('InformacionFechasCtrl', function($scope, $rootScope, $state, $ionicPopup, $http, Mama) {
    
       $scope.mostrarAyuda = function(titulo, mensaje) {
            var alertPopup = $ionicPopup.alert({
                title: titulo,
                template: mensaje
                });
            };
    
       $scope.detalleFecha = null;
    
       $scope.semanas = null;
       
       //El calendario inicia en el mes actual
       $scope.fechaCalendario = new Date();
       
       $scope.fechaSeleccionada = $scope.fechaCalendario;
       
       //Fechas de la campana que se está visualizando
       $scope.fechas = $rootScope.fechas;
       
       $scope.campana = $rootScope.campana.numero;
    
       $scope.padStr = function(i) {
           return (i < 10) ? "0" + i : "" + i;
       }
       
       $scope.fechaVisibleCalendario = function(){
          return $scope.fechaCalendario;
       }
       
       $scope.disminuirMes = function(){
       
          //Establecer la fecha al día 1 del mes actual
          var cadenaFecha = $scope.fechaCalendario.getFullYear() + "-" +
                  $scope.padStr(1 + $scope.fechaCalendario.getMonth()) + "-" + '01'; 
       
          //Devolverse 1 mes
          $scope.fechaCalendario = new Date(cadenaFecha);
          $scope.fechaCalendario.setDate($scope.fechaCalendario.getDate() - 2);
          
          //Establecer la fecha al día 1 del mes siguiente
          //La fecha se está retornando 1 día al hacer el new Date()
          //, no se sabe la razón, por esto se pone 02
          cadenaFecha = $scope.fechaCalendario.getFullYear() + "-" +
                  $scope.padStr(1 + $scope.fechaCalendario.getMonth()) + "-" + '02';
          
          $scope.fechaCalendario = new Date(cadenaFecha);
          
          //Aumentar la campana
          $scope.campana = $scope.campana - 1;
          
          Mama.getRecordatorios($scope.fechaCalendario.getFullYear(), $scope.campana, $rootScope.zona, $rootScope, $http, function (success, data){
                if(success){
                    $scope.fechas = data.listaRecordatorios;
                    
                    console.log($scope.fechas);
                    
                    //Generar el calendario nuevamente
                    $scope.semanasCalendario();
                    
                }else{
                   $scope.mostrarAyuda("Fechas","No es posible consultar la información para la campaña " + $scope.campana);
                }
         });
       }
       
       $scope.aumentarMes = function(){
       
          //Establecer la fecha al día 1 del mes actual
          var cadenaFecha = $scope.fechaCalendario.getFullYear() + "-" +
                  $scope.padStr(1 + $scope.fechaCalendario.getMonth()) + "-" + '01'; 
       
          //Moverse 1 mes
          $scope.fechaCalendario = new Date(cadenaFecha);
          $scope.fechaCalendario.setDate($scope.fechaCalendario.getDate() + 32);
          
          //Establecer la fecha al día 1 del mes siguiente
          //La fecha se está retornando 1 día al hacer el new Date()
          //, no se sabe la razón, por esto se pone 02
          cadenaFecha = $scope.fechaCalendario.getFullYear() + "-" +
                  $scope.padStr(1 + $scope.fechaCalendario.getMonth()) + "-" + '02';
          
          $scope.fechaCalendario = new Date(cadenaFecha);
          
          //Aumentar la campana
          $scope.campana = $scope.campana + 1;
          
          Mama.getRecordatorios($scope.fechaCalendario.getFullYear(), $scope.campana, $rootScope.zona, $rootScope, $http, function (success, data){
                if(success){
                    $scope.fechas = data.listaRecordatorios;
                    
                    console.log($scope.fechas);
                    
                    //Generar el calendario nuevamente
                    $scope.semanasCalendario();
                    
                }else{
                   $scope.mostrarAyuda("Fechas","No es posible consultar la información para la campaña " + $scope.campana);
                }
         });
       }
       
       $scope.numeroCampana = function(){
            return $scope.campana;
       }
       
       $scope.fechaEsCampanaVisible = function(fecha){
            encontrado = false;
            
            var fechaCalendario = new Date(fecha);
            
            for (i = 0; i < $scope.fechas.length; i++){
            
                var fechaMinimaCampana = new Date(fecha);
                fechaMinimaCampana.setDate(new Date($scope.fechas[i].fecha).getDate() - 21); 
            
                if($scope.fechas[i].actividad.toLowerCase() == 'fecha correteo' && 
                  fechaCalendario <= new Date($scope.fechas[i].fecha) &&
                  fechaCalendario >= fechaMinimaCampana){
                     encontrado = true;
                     break;
                }
            }
            return encontrado;
       }
       
       $scope.fechaEsCorreteo = function(fecha){
            encontrado = false;
            for (i = 0; i < $scope.fechas.length; i++){
                if($scope.fechas[i].actividad.toLowerCase() == 'fecha correteo' && 
                  $scope.fechas[i].fecha == fecha ){
                     encontrado = true;
                     break;
                }
            }
            return encontrado;
       }
       
       $scope.fechaEsEncuentro = function(fecha){
            encontrado = false;
            for (i = 0; i < $scope.fechas.length; i++){
                if($scope.fechas[i].actividad.toLowerCase() == 'encuentro' && 
                  $scope.fechas[i].fecha == fecha ){
                     encontrado = true;
                     break;
                }
            }
            return encontrado;
       }
       
       $scope.fechaEsRepartoPedido = function(fecha){
            encontrado = false;
            for (i = 0; i < $scope.fechas.length; i++){
                if($scope.fechas[i].actividad.toLowerCase() == 'reparto de pedido 1' && 
                  $scope.fechas[i].fecha == fecha ){
                     encontrado = true;
                     break;
                }
            }
            return encontrado;
       }
       
       $scope.seleccionarFecha = function(fecha){
       
           var listaEventos = new Array();
           
           for (i = 0; i < $scope.fechas.length; i++){
                if($scope.fechas[i].fecha == fecha){
                   listaEventos.push($scope.fechas[i]);
                }
            }
            
            $scope.fechaSeleccionada = new Date(fecha);
            //Esto se hace por bug en manejo de fechas
            $scope.fechaSeleccionada.setDate($scope.fechaSeleccionada.getDate() + 1);
            
            $scope.detalleFecha = listaEventos;
       }
         
       $scope.semanasCalendario = function(){
          
          var fechaActual = $scope.fechaCalendario;
          
          var dateStr = $scope.padStr(fechaActual.getFullYear()) + "-" +
                  $scope.padStr(1 + fechaActual.getMonth()) + "-" +
                  $scope.padStr('01');
          
          var primerDiaMes = new Date(dateStr).getDay();
          var inicioMes = new Date(dateStr);
          
          console.log(inicioMes);
          
          //Objeto con todas las semanas
          var semanas = new Array();
          
          var finMes = false;
          var diaMes = 0;
          var indiceDias = 0;
          var mesActual = fechaActual.getMonth();
          var reiniciarDia = true;
          
          console.log('Mes actual:' + mesActual);
          
          while(!finMes){
            
            console.log(indiceDias);
            
             //Objeto con cada semana
             var semana = new Array();
             //Si no hay registros entonces adicionar a la primera semana los registros necesarios del mes anterior
             
             if(semanas.length == 0){
                for(j=primerDiaMes; j>0; j--){
                    var fechaAnterior = new Date();
                    fechaAnterior.setDate(inicioMes.getDate()-j);
                    semana.push({ "dia": fechaAnterior.getDate(), 
                    "fechaCompleta":  $scope.padStr(fechaAnterior.getFullYear()) + "-" +
                                      $scope.padStr(1 + fechaAnterior.getMonth()) + "-" +
                                      $scope.padStr(fechaAnterior.getDate())
                    });
                 }
                 for(i=0; i<7-primerDiaMes; i++){
              
                  var nuevaFecha = new Date();
                  nuevaFecha.setTime( inicioMes.getTime() + indiceDias * 86400000 );

                  if(nuevaFecha.getMonth() != mesActual && reiniciarDia){
                     diaMes = 0;
                     reiniciarDia = false;
                  }
                  semana.push({ "dia": diaMes + 1, 
                    "fechaCompleta":  $scope.padStr(nuevaFecha.getFullYear()) + "-" +
                                      $scope.padStr(1 + nuevaFecha.getMonth()) + "-" +
                                      $scope.padStr(nuevaFecha.getDate()) 
                                      });
                  indiceDias++;
                  diaMes++;
              }
              }else{
                 for(i=0; i<7; i++){
              
                  var nuevaFecha = new Date();
                  nuevaFecha.setTime( inicioMes.getTime() + indiceDias * 86400000 );
                  
                  if(nuevaFecha.getMonth() != mesActual && reiniciarDia){
                     diaMes = 0;
                     finMes = true;
                     reiniciarDia = false;
                  }
                  semana.push({ "dia": diaMes + 1, 
                    "fechaCompleta":  $scope.padStr(nuevaFecha.getFullYear()) + "-" +
                                      $scope.padStr(1 + nuevaFecha.getMonth()) + "-" +
                                      $scope.padStr(nuevaFecha.getDate())  
                            });
                  indiceDias++;
                  diaMes++;
                 }
              }
              
              //al terminar la semana verificar nuevamente si el inicio de la semana entrante no corresponde a 
              //otro mes
              console.log('Indice dias:' + indiceDias);
              console.log('Inicio de mes:' + inicioMes);
              console.log('Calculo nueva fecha:' + inicioMes.getDate() + indiceDias);
               var nuevaFecha = new Date();
                  nuevaFecha.setTime( inicioMes.getTime() + indiceDias * 86400000 );
                  
                  console.log('Nueva fecha:' + nuevaFecha.getMonth());
                  console.log(nuevaFecha);
                  
                  if(nuevaFecha.getMonth() != mesActual){
                     finMes = true;
                  }
              
              semanas.push(semana);    
          }
          
          $scope.semanas = semanas;
          
          console.log($scope.semanas);
       }
       
       $scope.semanasCalendario();
       
       //Seleccionar la fecha actual
       $scope.seleccionarFecha($scope.padStr($scope.fechaCalendario.getFullYear()) + "-" +
                  $scope.padStr(1 + $scope.fechaCalendario.getMonth()) + "-" +
                  $scope.fechaCalendario.getDate());

    })
    
    .controller('ContactoCtrl', function($scope, $rootScope) {
    
         $scope.nombre = function(){
             var nombre = $rootScope.datos.nombre.split(' ');
             return nombre[0].substring(0,1).toUpperCase() + nombre[0].substring(1,nombre[0].length).toLowerCase();
         }

    })

;