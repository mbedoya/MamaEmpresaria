// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('novaventa', ['ionic', 'novaventa.controllers', 'novaventa.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
    .config(['$ionicConfigProvider', function($ionicConfigProvider) {

        $ionicConfigProvider.tabs.position('bottom'); //other values: top

    }])

    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/app.html"
            })

            .state('app.inicializacion', {
                url: "/inicializacion",
                views: {
                    'app-view': {
                        templateUrl: "templates/inicializacion.html",
                        controller: 'InicializacionCtrl'
                    }
                }
            })

            .state('app.login', {
                url: "/login",
                views: {
                    'app-view': {
                        templateUrl: "templates/login.html",
                        controller: 'LoginCtrl'
                    }
                }
            })

            .state('app.menu', {
                url: "/menu",
                abstract: true,
                views: {
                    'app-view': {
                        templateUrl: "templates/menu.html"
                    }
                }
            })

            .state('app.menu.tabs', {
                url: "/tabs",
                abstract: true,
                views: {
                    'menu-content': {
                        templateUrl: "templates/tabs.html"
                    }
                }
            })

            .state('app.menu.tabs.home', {
                url: "/home",
                views: {
                    'home-content': {
                        templateUrl: "templates/home.html"
                    }
                }
            })

            .state('app.menu.tabs.mipedido', {
                url: "/mipedido",
                views: {
                    'pedido-content': {
                        templateUrl: "templates/mipedido.html"
                    }
                }
            })

            .state('app.menu.tabs.mispuntos', {
                url: "/mispuntos",
                views: {
                    'puntos-content': {
                        templateUrl: "templates/mispuntos.html",
                        controller: 'MisPuntosCtrl'
                    }
                }
            })

            .state('app.menu.tabs.mispremiosredimidos', {
                url: "/mispremiosredimidos",
                views: {
                    'puntos-content': {
                        templateUrl: "templates/mispremiosredimidos.html",
                        controller: 'MisPuntosCtrl'
                    }
                }
            })

            .state('app.menu.tabs.puntospago', {
                url: "/puntospago",
                abstract: true,
                views: {
                    'puntospago-content': {
                        templateUrl: "templates/tabspuntosdepago.html",
                        controller: 'PuntosPagoCtrl'
                    }
                }
            })

            .state('app.menu.tabs.puntospago.puntospagolistado', {
                url: "/puntospagolistado",
                views: {
                    'puntospago-listado-content': {
                        templateUrl: "templates/puntosdepago.html",
                        controller: 'PuntosPagoCtrl'
                    }
                }
            })

            .state('app.menu.tabs.puntospago.puntospagomapa', {
                url: "/puntospagomapa",
                views: {
                    'puntospago-mapa-content': {
                        templateUrl: "templates/puntosdepagomapa.html",
                        controller: 'PuntosPagoMapaCtrl'
                    }
                }
            })
        ;

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/inicializacion');
    });