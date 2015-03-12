moduloControlador.controller('LoginCtrl', function($scope, $rootScope, $ionicLoading, $ionicPopup, $state, $http, $filter, $ionicHistory, Mama, Internet, GA) {

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
                $scope.mostrarAyuda("Inicio de sesión","Ingresa tu cédula");
                return;
            }

            //Cantidad de caracteres
            if(String($rootScope.datos.cedula).length < 6 || String($rootScope.datos.cedula).length > 10){
                $scope.mostrarAyuda("Inicio de sesión","Ingresa entre 6 y 10 dígitos");
                return;
            }

            //Caracteres especiales
            if(String($rootScope.datos.cedula).indexOf(".") >= 0 || String($rootScope.datos.cedula).indexOf(",") >= 0){
                $scope.mostrarAyuda("Inicio de sesión","Ingresa sólo números");
                return;
            }

            if(Internet.get()){

                $scope.loading =  $ionicLoading.show({
                    template: 'Iniciando sesión' // <br /><br /> <img style="max-width:50px; max-height:50px;" src="img/loading.gif">'
                });

            	resultado = Mama.autenticar($scope.datosInicio.cedula, $rootScope, $http, function(success, data){

                    $ionicLoading.hide();

                    //Error en la autenticación?
                    if(data && data.razonRechazo){

                        if(data.razonRechazo == "El usuario no se encuentra registrado en Antares."){
                            $scope.mostrarAyuda("Inicio de sesión","Lo sentimos no existe información para esta cédula. Comunícate con la Línea de Atención");
                        }else{
                            $scope.mostrarAyuda("Inicio de sesión",data.razonRechazo);
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
                                    
                                    //Mama.getAgotadosPedido($rootScope.pedido.numeroPedido, $rootScope, $http, function (success, data){
                                    //if(success){
                                      //$ionicLoading.hide();
                                    //  $rootScope.agotados = data;
                                    //}else{
                                      //$ionicLoading.hide();
                                    //$scope.mostrarAyuda("Mi Pedido","En este momento no podemos acceder a tu información");
                                   //}
                                //});
                                    

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

                            var irABienvenida = !(localStorage && localStorage.nombre);

                            //Almacenar la cédula si hay almacenamiento local
                            if(localStorage ){
                                
                                localStorage.cedula = $scope.datosInicio.cedula;
                                localStorage.nombre = $rootScope.datos.nombre;
                                localStorage.segmento = $rootScope.datos.segmento;
                                
                            }
                            
                            $scope.datosInicio = {cedula: '' };

                            $ionicHistory.nextViewOptions({
                             disableBack: true
                            });
   
                            //Si se notifica inmediatamente no son alcanzados todos los controladores                         
                            setTimeout( function(){
                               //Notificar que el usuario se ha logueado
                               $rootScope.$broadcast('loggedin');
                            }, 1500);
                            
                            if(irABienvenida){
                               $state.go('app.bienvenida');
                            }else{
                               $state.go('app.menu.tabs.home');
                            }

                        }else{

                            if(data.tiposUsuarios && data.tiposUsuarios.length > 0 && (data.tiposUsuarios[0] == "2")){
                                $scope.mostrarAyuda("Inicio de sesión","Hola Mamá, te invitamos a montar tu primer pedido para disfurtar de esta Aplicación, para este cuentas con un cupo de " + $filter('currency')(data.cupo, '$', 0));
                            }else{
                                if(data.tiposUsuarios){
                                    $scope.mostrarAyuda("Inicio de sesión","Tu rol no es válido para nuestra Aplicación");
                                }else{
                                    $scope.mostrarAyuda("Inicio de sesión","En este momento no podemos consultar tu información");
                                }
                            }

                        }


                    }

            	});
            	
            }else{
                $scope.mostrarAyuda("Inicio de sesión","Por favor verifica tu conexión a internet");
            }
        }
    });