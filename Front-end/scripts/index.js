var app = angular.module('App', ['textAngular']);

function wysiwygeditor($scope) {

};

app.controller('AppController', function($scope, $http) {
    var service_host = "http://172.18.0.1:8000";

    var Crud = function(dictionary) {

        var _self = this;

        _self.dictionary = dictionary;

        _self.lesson = {
            translate: {},
            translates: []
        };

        _self.new = {
            translate: {},
            translates: []
        };

        _self.alter = {
            translate: {},
            translates: []
        };

        _self.atualizarInserir = function() {
            if (!!_self.lesson._id) {
                _self.update(_self.lesson);
            } else {
                _self.insert();
            }
        }

        _self.insert = function() {

            var object = {
                obj: {
                    word: _self.lesson.word,
                    description: _self.lesson.description,
                    translates: _self.lesson.translates
                }
            }

            if (!object.obj.word || !object.obj.description) {
                alert("Dados invalidos.");
                return;
            }

            $http({
                method: 'POST',
                url: service_host + '/word/insert',
                data: object
            }).then(function(data) {
                _self.lesson._id = "";
                _self.lesson.word = "";
                _self.lesson.description = "";
                _self.dictionary.updateData();
            }).catch(function(data) {
                alert(data)
            })
        };

        _self.update = function(lesson) {

            if (!lesson.description || !lesson.word) {
                alert("Dados inválidos.")
                return;
            }

            var object = {
                obj: {
                    _id: lesson._id,
                    word: lesson.word,
                    description: lesson.description,
                    translates: lesson.translates
                }
            }

            $http({
                method: 'PUT',
                url: service_host + '/word/update',
                data: object
            }).then(function(data) {
                _self.lesson._id = "";
                _self.lesson.word = "";
                _self.lesson.description = "";
                _self.dictionary.updateData();
            }).catch(function(data) {
                alert(data.data);
            })
        };

        _self.edit = function(word) {
            _self.lesson._id = word._id;
            _self.lesson.word = word.word;
            _self.lesson.description = word.description;
        };

        _self.delete = function(_id, grid) {
            var ok = confirm("Deseja mesmo deletar esse registro?");
            if (!ok) {
                return;
            }
            $http({
                method: 'DELETE',
                url: service_host + '/word/delete',
                params: { _id: _id }
            }).then(function(data) {
                grid.search();
            }).catch(function(data) {
                alert(data.data)
            })
        };

        _self.add = function(word) {
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
        };

        _self.setLearned = function(word) {

            var object = {
                obj: {
                    _id: word._id,
                    word: word.word,
                    learned: true,
                    translates: word.translates
                }
            }

            $http({
                method: 'PUT',
                url: service_host + '/word/update',
                data: object
            }).then(function(data) {
                _self.alter.translates = [];
                word.edit = false;
                _self.dictionary.updateData();
            }).catch(function(data) {
                alert(data.data);
            })
        };

        _self.setToLearn = function(word) {

            var object = {
                obj: {
                    _id: word._id,
                    word: word.word,
                    learned: false,
                    translates: word.translates
                }
            }

            $http({
                method: 'PUT',
                url: service_host + '/word/update',
                data: object
            }).then(function(data) {
                _self.alter.translates = [];
                word.edit = false;
                _self.dictionary.updateData();
            }).catch(function(data) {
                alert(data.data);
            })
        };

    };

    var Grid = function(pagination, learned) {
        var _self = this;

        _self.pagination = pagination;
        _self.list = [];
        _self.listPagined = [];
        _self.query = {
            learned: learned
        };

        var filter = {
            filter: {
                learned: _self.query.learned
            }
        };

        function request() {
            return $http({ method: "GET", url: service_host + '/word/list', params: filter });
        }

        _self.search = function(word) {

            if (word) {
                filter.filter["$or"] = [
                    { word: { $regex: ".*" + word + ".*", '$options': 'i' } },
                    { "translates.translate": { $regex: ".*" + word + ".*", '$options': 'i' } },
                    { "translates.complement": { $regex: ".*" + word + ".*", '$options': 'i' } }
                ]
            } else {
                delete filter.filter["$or"];
            }

            request().then(function(data) {
                _self.list = data.data;
                _self.pagination.page(_self.pagination.atualPage, _self);
                _self.hide();
            });
        }


        _self.hide = function() {
            _self.list.forEach(function(word) {
                word.hide = true;
            })
        };

        _self.show = function() {
            _self.list.forEach(function(word) {
                word.hide = false;
            })
        };
    };

    var Filter = function() {
        var _self = this;
        _self.query = {};

    };

    var Pagination = function() {
        var _self = this;

        _self.pages = [];
        _self.atualPage = 1;
        _self.itemsToTake = 0;
        _self.totalPages = 1;
        _self.totalItems = 0;
        _self.itemsPerPages = 20;

        _self.page = function(page, grid) {

            if (page <= _self.totalPages) {
                _self.atualPage = page;
                _self.totalItems = grid.list.length;

                _self.itemsToTake = (_self.atualPage - 1) * _self.itemsPerPages;

                grid.listPagined = Enumerable.from(grid.list)
                    .skip(_self.itemsToTake)
                    .take(_self.itemsPerPages).toArray();
                if (_self.totalItems <= _self.itemsPerPages) {
                    _self.totalPages = 1;
                } else {
                    _self.totalPages = parseInt(_self.totalItems / _self.itemsPerPages);
                    _self.totalPages = (_self.totalItems % _self.itemsPerPages) > 0 ? _self.totalPages + 1 : _self.totalPages
                }

                _self.pages = [];
                for (var i = 0; i < _self.totalPages; i++) {
                    _self.pages.push(i + 1);
                }
            }
        }

    };

    var Dicrionary = function() {
        var _self = this;

        var paginationToLearn = new Pagination();
        var paginationLeaners = new Pagination();

        _self.crud = new Crud(_self);
        _self.filter = {};

        _self.grid = {
            wordsLearneds: new Grid(paginationLeaners, true),
            wordsToLearn: new Grid(paginationToLearn, false)
        };

        _self.updateData = function() {
            _self.grid.wordsLearneds.search();
            _self.grid.wordsToLearn.search();
        }

        _self.search = function() {
            _self.grid.wordsLearneds.pagination.atualPage = 1;
            _self.grid.wordsLearneds.search(_self.filter.word)
            _self.grid.wordsToLearn.pagination.atualPage = 1;
            _self.grid.wordsToLearn.search(_self.filter.word)
        }

    }

    ! function init() {
        $scope.dictionary = new Dicrionary();

        $scope.dictionary.grid.wordsLearneds.search();
        $scope.dictionary.grid.wordsToLearn.search();

    }();


    $(function() {
        $('[data-toggle="tooltip"]').tooltip()
    })

})