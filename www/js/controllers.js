angular.module('novaventa.controllers', [])

    .controller('LoginCtrl', function($scope, $state, Internet) {
        $scope.capturarCedula = function() {
            if(Internet.get()){
                $state.go('app.menu.tabs.home');
            }else{
                alert("Por favor verificar tu conexión a internet")
            }
        }
    })

    .controller('InicializacionCtrl', function($scope, $state) {
        $state.go('app.login');
    })

    .controller('HomeCtrl', function($scope, $state) {
        console.log('Inicializando Home');
    })

    .controller('MisPuntosCtrl', function($scope, $state, Puntos) {
        $scope.puntos = Puntos.get();
    })

    .controller('PuntosPagoCtrl', function($scope, $state, PuntosPago) {
        $scope.puntos = PuntosPago.get();
    })

;