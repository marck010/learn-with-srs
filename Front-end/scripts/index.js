var app = angular.module('App', []);

app.controller('AppController', function($scope, $http) {
    var service_host = "http://192.168.0.110:8000";

    $scope.dictionary = {};
    $scope.dictionary.registrosPorPaginas = 20;
    $scope.dictionary.paginas = [];
    $scope.dictionary.paginaAtual = 1;
    $scope.dictionary.totalPaginas = 1;
    $scope.dictionary.newWord = {
        translate: {},
        translates: []
    };
    $scope.dictionary.alterWork = {
        translate: {},
        translates: []
    };

    $scope.dictionary.load = function() {
        if ($scope.dictionary.filtro) {
            var filtro = $scope.dictionary.filtro;
            var filter = {
                filter: { $or: [
                    { word: { $regex: ".*" + filtro + ".*" } }, 
                    { "translates.translate": { $regex: ".*" + filtro + ".*" } }, 
                    { "translates.complement": { $regex: ".*" + filtro + ".*" } }] }
            }
        }
        $http({ method: "GET", url: service_host + '/word/list', params: filter }).then(function(data) {
            var wordsPaginadasPaginaAtual = $scope.dictionary.wordsPaginadas;
            $scope.dictionary.words = data.data;
            $scope.dictionary.paginaAtual = 1;
            $scope.dictionary.paginar($scope.dictionary.paginaAtual);
            $scope.dictionary.wordsPaginadas.forEach(function(item) {
                if (wordsPaginadasPaginaAtual && wordsPaginadasPaginaAtual.length) {
                    var word = wordsPaginadasPaginaAtual.filter(function(wordExistente) {
                        return wordExistente._id == item._id;
                    })[0]
                    if (word) {
                        item.hide = word.hide;
                    }
                }
            });
            $scope.dictionary.hide(); 
        })
    }

    $scope.dictionary.paginar = function(pagina) {

        if (pagina <= $scope.dictionary.totalPaginas) {
            $scope.dictionary.paginaAtual = pagina;
            $scope.dictionary.totalRegistros = $scope.dictionary.words.length;
            var registrosAPular = ($scope.dictionary.paginaAtual - 1) * $scope.dictionary.registrosPorPaginas;
            $scope.dictionary.wordsPaginadas = Enumerable.from($scope.dictionary.words)
                .skip(registrosAPular)
                .take($scope.dictionary.registrosPorPaginas).toArray();
            $scope.dictionary.totalPaginas = Math.round($scope.dictionary.totalRegistros / $scope.dictionary.registrosPorPaginas);

            var resto = $scope.dictionary.totalRegistros % $scope.dictionary.registrosPorPaginas;
            if (resto > 0) {
                $scope.dictionary.totalPaginas++;
            }

            $scope.dictionary.paginas = [];
            for (var i = 0; i < $scope.dictionary.totalPaginas; i++) {
                $scope.dictionary.paginas.push(i + 1);
            }
        }
    }

    $scope.dictionary.hide = function() {
        $scope.dictionary.words.forEach(function(word) {
            word.hide = true;
        })
    };


    $scope.dictionary.show = function() {
        $scope.dictionary.words.forEach(function(word) {
            word.hide = false;
        })
    };


    $scope.dictionary.insert = function() {


        var object = {
            obj: {
                word: $scope.dictionary.word,
                translates: $scope.dictionary.newWord.translates
            }
        }

        var translateValid = false;

        if (object.obj.translates.length > 0) {
            translatesValidos = object.obj.translates.filter(function(item) {
                return !!item.translate;
            });

            translateValid = translatesValidos.length > 0;
        }

        if (!object.obj.word || !translateValid) {
            alert("Dados invalidos.");
            return;
        }

        $http({
            method: 'POST',
            url: service_host + '/word/insert',
            data: object
        }).then(function(data) {
            $scope.dictionary.word = "";
            $scope.dictionary.newWord.translates = [];
            $scope.dictionary.load();
        }).catch(function(data) {
            alert(data)
        })
    }

    $scope.dictionary.update = function(word) {

        var object = {
            obj: {
                _id: word._id,
                word: word.word,
                translates: word.translates
            }
        }

        $http({
            method: 'PUT',
            url: service_host + '/word/update',
            data: object
        }).then(function(data) {
            $scope.dictionary.alterWork.translates = [];
            word.edit = true;

            $scope.dictionary.load();
        }).catch(function(data) {
            alert(data.data);
        })
    }
    $scope.dictionary.edit = function(word) {
        word.edit = !word.edit;
        if (word.edit) {
            word.hide = false;
        }

        word.translates.forEach(function(item) {
            item.edit = false;
        });
    };

    $scope.dictionary.delete = function(_id) {
        var ok = confirm("Deseja mesmo deletar esse registro?");
        if (!ok) {
            return;
        }
        $http({
            method: 'DELETE',
            url: service_host + '/word/delete',
            params: { _id: _id }
        }).then(function(data) {
            $scope.dictionary.load();
        }).catch(function(data) {
            alert(data.data)
        })
    }

    $scope.dictionary.add = function(word) {
        if (word.translate.translate) {
            word.translates.push({
                translate: word.translate.translate,
                complement: word.translate.complement
            })

            word.translate.translate = "";
            word.translate.complement = "";
        } else {
            alert("Campo \"Translate\" é obrigatório.")
        }
    }

    $(function() {
        $('[data-toggle="tooltip"]').tooltip()
    })


    $scope.dictionary.load();
})