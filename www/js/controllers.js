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

    .controller('PuntosPagoMapaCtrl', function($scope, $state, PuntosPago) {

        console.log('Puntos pago mapa - initialize');

        var myLatlng = new google.maps.LatLng(6.222611,-75.57935);

        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);

        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title: 'Novaventa'
        });

        //Marker + infowindow + angularjs compiled ng-click
        //var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
        //var compiled = $compile(contentString)($scope);

        /*
        var infowindow = new google.maps.InfoWindow({
            content: contentString;
        });



        google.maps.event.addListener(marker, 'click', function() {
            infowindow.open(map,marker);
        });
        */

        console.log(map);

        $scope.map = map;

        function initialize() {


        }
        google.maps.event.addDomListener(window, 'load', initialize);

    })
;