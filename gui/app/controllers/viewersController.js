"use strict";

(function() {

    angular
        .module("firebotApp")
        .controller("viewersController", function($scope, viewersService, currencyService, utilityService) {
            //This handles the Viewers tab

            $scope.showUserDetailsModal = (userId) => {
                let closeFunc = () => {
                    viewersService.updateViewers();
                };
                utilityService.showModal({
                    component: "viewerDetailsModal",
                    backdrop: true,
                    resolveObj: {
                        userId: () => userId
                    },
                    closeCallback: closeFunc,
                    dismissCallback: closeFunc
                });
            };

            $scope.viewerRowClicked = (data) => {
                $scope.showUserDetailsModal(data._id);
            };

            $scope.showViewerSearchModal = () => {
                utilityService.openViewerSearchModal(
                    {
                        label: "Viewer Search",
                        saveText: "Select"
                    },
                    (user) => {
                        $scope.showUserDetailsModal(user.id);
                    });
            };

            $scope.vs = viewersService;

            // Update table rows when first visiting the page.
            if (viewersService.isViewerDbOn()) {
                viewersService.updateViewers();
            }

            $scope.viewerSearch = "";

            $scope.headers = [
                {
                    headerStyles: {
                        'width': '50px'
                    },
                    sortable: false,
                    cellTemplate: `<img ng-src="https://mixer.com/api/v1/users/{{data._id}}/avatar?w=50&h=50" style="width: 25px;height: 25px;border-radius: 25px;"/>`,
                    cellController: () => {}
                },
                {
                    name: "USERNAME",
                    icon: "fa-user",
                    dataField: "username",
                    headerStyles: {
                        'min-width': '125px'
                    },
                    sortable: true,
                    cellTemplate: `{{data.username}}`,
                    cellController: () => {}
                },
                {
                    name: "JOIN DATE",
                    icon: "fa-sign-in",
                    dataField: "joinDate",
                    sortable: true,
                    cellTemplate: `{{data.joinDate | prettyDate}}`,
                    cellController: () => {}
                },
                {
                    name: "LAST SEEN",
                    icon: "fa-eye",
                    dataField: "lastSeen",
                    sortable: true,
                    cellTemplate: `{{data.lastSeen | prettyDate}}`,
                    cellController: () => {}
                },
                {
                    name: "VIEW TIME (hours)",
                    icon: "fa-tv",
                    dataField: "minutesInChannel",
                    sortable: true,
                    cellTemplate: `{{getViewTimeDisplay(data.minutesInChannel)}}`,
                    cellController: ($scope) => {
                        $scope.getViewTimeDisplay = (minutesInChannel) => {
                            return minutesInChannel < 60 ? 'Less than an hour' : Math.round(minutesInChannel / 60);
                        };
                    }
                },
                {
                    name: "MIXPLAY INTERACTIONS",
                    icon: "fa-gamepad",
                    dataField: "mixplayInteractions",
                    sortable: true,
                    cellTemplate: `{{data.mixplayInteractions}}`,
                    cellController: () => {}
                }
            ];

            $scope.currencies = currencyService.getCurrencies();

            for (let currency of $scope.currencies) {
                $scope.headers.push({
                    name: currency.name.toUpperCase(),
                    icon: "fa-money-bill",
                    dataField: "currency." + currency.id,
                    sortable: true,
                    cellTemplate: `{{data.currency['${currency.id}']}}`,
                    cellController: () => {}
                });
            }

            $scope.headers.push({
                headerStyles: {
                    'width': '15px'
                },
                cellStyles: {
                    'width': '15px'
                },
                sortable: false,
                cellTemplate: `<i class="fal fa-chevron-right"></i>`,
                cellController: () => {}
            });
        });
}());
