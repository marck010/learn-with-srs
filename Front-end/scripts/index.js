var app = angular.module('App', []);

app.controller('AppController', function($scope, $http) {
    $scope.dictionary = {};
    $scope.dictionary.newWork = {
        translate: {},
        translates: []
    };
    $scope.dictionary.alterWork = {
        translate: {},
        translates: []
    };

    function load() {

        $http.get('http://localhost:8000/word/list').then(function(data) {

            $scope.dictionary.words = data.data;

        })
    }

    $scope.dictionary.insert = function() {

        var object = {
            obj: {
                word: $scope.dictionary.word,
                translates: $scope.dictionary.newWork.translates
            }
        }

        $http({
            method: 'POST',
            url: 'http://localhost:8000/word/insert',
            data: object
        }).then(function(data) {
            $scope.dictionary.newWork.translates = [];
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
            url: 'http://localhost:8000/word/update',
            data: object
        }).then(function(data) {
            $scope.dictionary.alterWork.translates = [];
            word.edit = true;

            load();
        }).catch(function(data) {
            alert(data.data);
        })
    }

    $scope.dictionary.delete = function(_id) {

        $http({
            method: 'DELETE',
            url: 'http://localhost:8000/word/delete',
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
        }
    }



    load();
})