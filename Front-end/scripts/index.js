var app = angular.module('App', []);

app.controller('AppController', function($scope, $http) {
    var service_host = "http://192.168.0.110:8000";

    $scope.dictionary = {};
    $scope.dictionary.newWord = {
        translate: {},
        translates: []
    };
    $scope.dictionary.alterWork = {
        translate: {},
        translates: []
    };

    function load() {

        $http.get(service_host + '/word/list').then(function(data) {

            $scope.dictionary.words = data.data;

        })
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
            load();
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

            load();
        }).catch(function(data) {
            alert(data.data);
        })
    }
    $scope.dictionary.edit = function(word) {
        word.edit = !word.edit;
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
            load();
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


    load();
})