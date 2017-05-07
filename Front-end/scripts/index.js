var app = angular.module('App', []);

app.controller('AppController', function($scope, $http) {
    var service_host = "http://192.168.0.110:8000";

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

        $http.get(service_host+'/word/list').then(function(data) {

            $scope.dictionary.words = data.data;

        })
    }

    $scope.dictionary.hide = function() {
         $scope.dictionary.words.forEach(function(word){
             word.hide = true;
         }) 
    };
    

    $scope.dictionary.show = function() {
         $scope.dictionary.words.forEach(function(word){
             word.hide = false ;
         }) 
    };
    

    $scope.dictionary.insert = function() {

        var object = {
            obj: {
                word: $scope.dictionary.word,
                translates: $scope.dictionary.newWork.translates
            }
        }

        $http({
            method: 'POST',
            url: service_host+'/word/insert',
            data: object
        }).then(function(data) {
            $scope.dictionary.word = "";
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
            url: service_host+'/word/update',
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
            url: service_host+'/word/delete',
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