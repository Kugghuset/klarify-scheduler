'use strict';

angular
    .module('klarifyApp')
    .controller(
        'endpointsCtrl',
        [
            '$scope',
            '$http',
            'toaster',
            'Auth',
            function ($scope, $http, toaster, Auth) {
                $scope.resource = {};
                $scope.view = 'default';
                $scope.iscollapsed = true;
                /********************************************************************************************/
                /******************************************Initializing**************************************/
                /********************************************************************************************/
                function createTree (data, rootObj) {
                    var children = _.where(data, {parentId: rootObj._id});
                    if (children.length) {
                        rootObj.resources = children;
                        return rootObj
                                .resources
                                .map(function (child) {
                                    createTree(data, child);
                                });
                    } else {
                        return rootObj;
                    }
                }

                $http
                    .get('/api/resources')
                    .then(function (resources) {
                        $scope.resource = _.findWhere(resources.data, {level: 0});
                        $scope.selectResource($scope.resource);
                        createTree(resources.data, $scope.resource);
                    })
                    .catch(function (err) {
                        toaster.pop({
                            type: 'error',
                            title: 'Error',
                            body: err.data,
                            showCloseButton: true
                        });
                    });

                $scope.createItem = function (type) {
                    $scope.view = type;
                    $scope.heading = type === 'resource' ? 'Create child resource' : 'Create child method';
                };

                $scope.cancel = function () {
                    $scope.view = 'default';
                    $scope.selectResource($scope.resource);
                    $scope.resourceModel = {};
                    $scope.methodModel = {};
                };

                /********************************************************************************************/
                /******************************************Resources*****************************************/
                /********************************************************************************************/

                $scope.$watch("resourceModel.name", function (value) {
                    if(value) {
                        $scope.resourceModel.path = value;
                    }
                });

                $scope.$watch("resourceModel.path", function (value) {
                    if(value) {
                        $scope.resourceModel.path = value
                                                        .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '-')
                                                        .replace(/\-{2,}/g, '-');
                    }
                });

                $scope.selectResource = function (resource) {
                    $scope.selectedResource = resource;
                    $scope.heading = resource.absolutePath + " -Methods";
                    $scope.view = 'default';
                    $scope.currentSelection = {
                        type: 'resource',
                        id: resource._id
                    }
                };

                $scope.saveResource = function () {
                    var payload = {
                        name: $scope.resourceModel.name,
                        path: $scope.resourceModel.path,
                        absolutePath: $scope.selectedResource.absolutePath + $scope.resourceModel.path + '/',
                        parentId: $scope.selectedResource._id,
                        level: $scope.selectedResource.level + 1,
                        description: $scope.resourceModel.description,
                        userId: Auth.getCurrentUser()._id
                    };

                    $http
                        .post('/api/resources', payload)
                        .then(function (success) {
                            $scope.selectedResource && $scope.selectedResource.resources ?
                                $scope.selectedResource.resources.push(success.data) :
                                $scope.selectedResource.resources = [success.data];

                            toaster.pop({
                                type: 'success',
                                title: 'Success',
                                body: 'Resource created successfully.',
                                showCloseButton: true
                            });
                            $scope.cancel();
                        })
                        .catch(function (error) {
                            toaster.pop({
                                type: 'error',
                                title: 'Error',
                                body: error.data,
                                showCloseButton: true
                            });
                        });
                };

                $scope.deleteResource = function () {
                    if(confirm("Are you sure?") && $scope.selectedResource._id) {
                        $http
                            .delete("/api/resources", {params: {path: $scope.selectedResource.absolutePath}})
                            .then(function (success) {

                                var rootObj = $scope.resource;
                                $scope.selectedResource
                                    .absolutePath
                                    .split('/')
                                    .filter(function(el) {
                                        return el.length != 0
                                    })
                                    .forEach(function (path) {
                                        if(path !== $scope.selectedResource.path) {
                                            rootObj = _.findWhere(rootObj.resources, {path: path});
                                        } else {
                                            var index = rootObj.resources.indexOf($scope.selectedResource);
                                            rootObj.resources.splice(index, 1);
                                        }
                                    });

                                toaster.pop({
                                    type: 'info',
                                    title: 'Info',
                                    body: 'Resource deleted successfully.',
                                    showCloseButton: true
                                });

                                $scope.cancel();
                            })
                            .catch(function (error) {
                                toaster.pop({
                                    type: 'error',
                                    title: 'Error',
                                    body: error.data,
                                    showCloseButton: true
                                });
                            })
                    }
                };
                /********************************************************************************************/
                /********************************************Method******************************************/
                /********************************************************************************************/
                $scope.methodModel ={};

                $scope.aceOptions = {
                    mode: "javascript",
                    useWrapMode : true,
                    showGutter: true,
                    onLoad: function (editor) {
                        editor.$blockScrolling = Infinity;

                        if(!$scope.methodModel.code) {
                            $scope.methodModel.code = 'function(req, res) {\n\tres.json({success: true, message: "pending to implement."});\n}';
                            $scope.methodModel.url = $scope.selectedResource.absolutePath;
                        }
                    }
                };

                $scope.selectMethod = function (parentId, type) {

                    $scope.currentSelection =  {
                        type: type,
                        id: parentId
                    };

                    $http
                        .get('/api/resources/methods', {params: {parentId: parentId, type: type}})
                        .then(function (success) {
                            $scope.view = 'edit';
                            $scope.methodModel = success.data;
                            $scope.heading = $scope.methodModel.url + " -" + type + "-Method";
                        })
                        .catch(function (error) {
                            toaster.pop({
                                type: 'error',
                                title: 'Error',
                                body: error.data,
                                showCloseButton: true
                            });
                        });
                };

                $scope.saveMethod = function () {
                    var payload = {
                        name: $scope.methodModel.name,
                        type: $scope.methodModel.type,
                        description: $scope.methodModel.description,
                        url: $scope.selectedResource.absolutePath,
                        parentId: $scope.selectedResource._id,
                        userId: Auth.getCurrentUser()._id,
                        code: $scope.methodModel.code,
                        disabled: false
                    };

                    $http
                        .post('/api/resources/methods', payload)
                        .then(function (success) {
                                $scope.selectedResource.methods.push(success.data.type);

                            toaster.pop({
                                type: 'success',
                                title: 'Success',
                                body: 'Method created successfully.',
                                showCloseButton: true
                            });
                            //$scope.cancel();
                        })
                        .catch(function (error) {
                            toaster.pop({
                                type: 'error',
                                title: 'Error',
                                body: error.data,
                                showCloseButton: true
                            });
                        });
                };

                $scope.updateMethod = function () {
                    $http
                        .put('/api/resources/methods', $scope.methodModel)
                        .then(function (success) {
                            toaster.pop({
                                type: 'success',
                                title: 'Success',
                                body: 'Method updated successfully.',
                                showCloseButton: true
                            });
                            //$scope.cancel();
                        })
                        .catch(function (error) {
                            toaster.pop({
                                type: 'error',
                                title: 'Error',
                                body: error.data,
                                showCloseButton: true
                            });
                        });
                };

                function deleteMethod(resource, id, type) {
                    resource
                        .resources
                        .map(function (item) {
                            if(item._id === id) {
                                return item.methods.splice(item.methods.indexOf(type), 1);
                            }else if(item.resources && item.resources.length) {
                                return deleteMethod(item, id, type);
                            } else {
                                return resource;
                            }
                        })
                }

                $scope.deleteMethod = function () {
                    if(confirm("Are you sure?")) {
                        $http
                            .delete("/api/resources/methods", {params: {parentId: $scope.currentSelection.id, type: $scope.currentSelection.type}})
                            .then(function () {
                                if ($scope.resource._id === $scope.currentSelection.id) {
                                    var index = $scope.resource.methods.indexOf($scope.currentSelection.type);
                                    $scope.resource.methods.splice(index, 1);
                                } else {
                                    deleteMethod($scope.resource, $scope.currentSelection.id, $scope.currentSelection.type);
                                }

                                toaster.pop({
                                    type: 'info',
                                    title: 'Info',
                                    body: "Method deleted successfully",
                                    showCloseButton: true
                                });
                                $scope.cancel();
                            })
                            .catch(function (error) {
                                toaster.pop({
                                    type: 'error',
                                    title: 'Error',
                                    body: error.data,
                                    showCloseButton: true
                                });
                            });
                    }
                };

                //$http
                //    .get('/endpoint/test/test2/?hjhj')
                //    .then(function (data) {
                //        console.info(data);
                //    })
                //    .catch(function (error) {
                //        console.error(error);
                //    })
            }
        ]);
