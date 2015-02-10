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

	.controller('InicializacionCtrl', function($scope, $rootScope, $ionicLoading, $http, $state, Internet, Mama) {

        $scope.inicializar = function(){

            $rootScope.datos = {};
            $rootScope.puntos = {};
            $rootScope.configuracion = { ip_servidores: 'http://200.47.173.66:9081' };

            //Almacenar la cédula si hay almacenamiento local
            if(localStorage && localStorage.cedula){

                console.log("Cedula almacenada " + localStorage.cedula);

                $rootScope.datos = { cedula: localStorage.cedula }

                if(Internet.get()){

                    $scope.loading =  $ionicLoading.show({
                        template: 'Iniciando sesión...'
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

                                $rootScope.campana = {numero: '-', fechaMontajePedido:'-'};

                                $http.get($rootScope.configuracion.ip_servidores + "/AntaresWebServices/interfaceAntares/getRecordatoriosAntares/" + data.listaZonas[0]).
                                    success(function(data, status, headers, config) {
                                        $rootScope.campana = {numero: data.listaRecordatorios[0].campagna, fechaMontajePedido:data.listaRecordatorios[0].fecha};
                                    }).
                                    error(function(data, status, headers, config) {
                                        console.log("Error consultando los datos de campaña");
                                    });

                                $state.go('app.menu.tabs.home');

                            }else{

                                if(data.tiposUsuarios){
                                    alert("Tu rol no es válido para nuestra Aplicación");
                                }else{
                                    alert("En este momento no podemos consultar tu información");
                                }

                            }


                        }

                    });

                }else{
                    alert("Por favor verifica tu conexión a internet")
                }

            }else{

                console.log("hay almacenamiento local");
                $state.go('app.login');

            }
        }

        $scope.inicializar();


    })

    .controller('LoginCtrl', function($scope, $rootScope, $ionicLoading, $state, $http, Mama, Internet) {
    
    	$scope.datosInicio = {cedula: '' };
    
    	//Autenticar a la Mamá Empresaria
        $scope.capturarCedula = function() {

            $rootScope.datos = { cedula: $scope.datosInicio.cedula }

            if(Internet.get()){

                $scope.loading =  $ionicLoading.show({
                    template: 'Iniciando sesión...'
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

                            $rootScope.campana = {numero: '-', fechaMontajePedido:'-'};

                            $http.get($rootScope.configuracion.ip_servidores + "/AntaresWebServices/interfaceAntares/getRecordatoriosAntares/" + data.listaZonas[0]).
                                success(function(data, status, headers, config) {
                                    $rootScope.campana = {numero: data.listaRecordatorios[0].campagna, fechaMontajePedido:data.listaRecordatorios[0].fecha};
                                }).
                                error(function(data, status, headers, config) {
                                    console.log("Error consultando los datos de campaña");
                                });

                            //Almacenar la cédula si hay almacenamiento local
                            if(localStorage){
                                localStorage.cedula = $scope.datosInicio.cedula;
                            }

                            $scope.datosInicio = {cedula: '' };

                            $state.go('app.menu.tabs.home');

                        }else{

                            if(data.tiposUsuarios){
                                alert("Tu rol no es válido para nuestra Aplicación");
                            }else{
                                alert("En este momento no podemos consultar tu información");
                            }
                        }


                    }

            	});
            	
            }else{
                alert("Por favor verifica tu conexión a internet");
            }
        }
    })

    .controller('HomeCtrl', function($scope, $rootScope, $state) {

        $scope.mostrarCupo = function(){
            return Number($rootScope.datos.cupo) > 0;
        }

        $scope.etiquetaSaldo = function(){

            var etiqueta = "Saldo a pagar";

            if($rootScope.datos && $rootScope.datos.saldo){

                if(Number($rootScope.datos.saldo) < 0) {
                    etiqueta = "Saldo a favor";
                }else{
                    etiqueta = "Saldo a pagar";
                }
            }

            return etiqueta;
        }

        $scope.nombre = function(){
            return $rootScope.datos.nombre;
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

    })

    .controller('MisPuntosCtrl', function($scope, $rootScope, $state, $http, Mama, Internet) {

        if(Internet.get()){
            Mama.getPuntos($rootScope.datos.cedula, $http, function (success, data){
                if(success){

                    $rootScope.puntos = data;

                }else{
                    alert("En este momento no podemos acceder a tu información");
                }
            });
        }else{
            alert("Por favor verifica tu conexión a internet");
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
            return $rootScope.puntos.puntosAVerncer;
        }

        $scope.puntosRedimidos = function(){
            return $rootScope.puntos.puntosRedimidos;
        }

        $scope.mostrarPuntosRedimidos = function(){
            return Number($rootScope.puntos.puntosRedimidos) > 0;
        }

        $scope.mostrarPuntosAVencer = function(){
            return Number($rootScope.puntos.puntosAVerncer) > 0;
        }

        $scope.mostrarPuntosPorPerder = function(){
            return Number($rootScope.puntos.puntosPorPerder) > 0;
        }

        $scope.fechaMontajePedidoCampana = function(){
            return $rootScope.campana.fechaMontajePedido;
        }

    })

    .controller('PuntosPagoCtrl', function($scope, $rootScope, $state, $http, PuntosPago) {

        PuntosPago.get("", "", $http, function(success, data){
            if(success){

                $scope.puntos = data.puntosDePago;
                $rootScope.puntosPago = data.puntosDePago;

            }else{
                alert("En este momento no podemos acceder a la información de puntos de pago");
            }

        });

    })

    .controller('PuntosPagoMapaCtrl', function($scope, $rootScope, $state, PuntosPago) {

        console.log('Puntos pago mapa - initialize');

        var myLatlng = new google.maps.LatLng(6.222611,-75.57935);

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

        for (i = 0; i < $rootScope.puntosPago.length; i++) {

            var latlngPunto = new google.maps.LatLng($rootScope.puntosPago[i].latitud, $rootScope.puntosPago[i].longitud);

            var nombre = $rootScope.puntosPago[i].nombre;

            var markerPunto = new google.maps.Marker({
                position: latlngPunto,
                map: map,
                title:  nombre
            });

            var infowindow = new google.maps.InfoWindow({
                content: '<div style="height:25px">' + nombre + '</div>'
            });

            google.maps.event.addListener(markerPunto, 'click', function() {
                infowindow.open(map,markerPunto);
            });
        }

        $scope.map = map;

    })

;