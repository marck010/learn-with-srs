var app = angular.module('App', []);

app.controller('AppController', function($scope, $http) {
    var service_host = "http://172.18.0.1:8000";

    var Crud = function(dictionary) {

        var _self = this;

        _self.dictionary = dictionary;

        _self.new = {
            translate: {},
            translates: []
        };

        _self.alter = {
            translate: {},
            translates: []
        };

        _self.insert = function() {

            var object = {
                obj: {
                    word: _self.new.word,
                    translates: _self.new.translates
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
                _self.new.word = "";
                _self.new.translates = [];
                _self.dictionary.updateData();
            }).catch(function(data) {
                alert(data)
            })
        };

        _self.update = function(word, grid) {

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
                _self.alter.translates = [];
                word.edit = false;
                grid.search();
            }).catch(function(data) {
                alert(data.data);
            })
        };

        _self.edit = function(word) {
            word.edit = !word.edit;
            if (word.edit) {
                word.hide = false;
            }

            word.translates.forEach(function(item) {
                item.edit = false;
            });
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

        _self.search = function() {

            if (_self.query.word) {
                filter.filter["$or"] = [
                    { word: { $regex: ".*" + _self.query.word + ".*", '$options': 'i' } },
                    { "translates.translate": { $regex: ".*" + _self.query.word + ".*", '$options': 'i' } },
                    { "translates.complement": { $regex: ".*" + _self.query.word + ".*", '$options': 'i' } }
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
                    _self.totalPages = Math.round(_self.totalItems / _self.itemsPerPages);
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
        _self.grid = {};
        _self.grid.wordsLearneds = new Grid(paginationLeaners, true);
        _self.grid.wordsToLearn = new Grid(paginationToLearn, false);
        _self.updateData = function() {

            _self.grid.wordsLearneds.search();
            _self.grid.wordsToLearn.search();
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