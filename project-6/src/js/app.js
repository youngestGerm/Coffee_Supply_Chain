// Remember this is inside the HTML file, this is included in scripts.

App = {
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    sku: 0,
    upc: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",
    originFarmerID: "0x0000000000000000000000000000000000000000",
    originFarmName: null,
    originFarmInformation: null,
    originFarmLatitude: null,
    originFarmLongitude: null,
    productNotes: null,
    productPrice: 0,
    distributorID: "0x0000000000000000000000000000000000000000",
    retailerID: "0x0000000000000000000000000000000000000000",
    consumerID: "0x0000000000000000000000000000000000000000",

    init: async function () {
        App.readForm();
        /// Setup access to blockchain
        // These returns will be printed onto the console in chrome
        return await App.initWeb3();
    },

    readForm: function () {
        // $("#sku").val() returns the html value inside the box #sku
        App.sku = $("#sku").val();
        console.log($("#sku").val(), "first", $("#originFarmerID").val())
        App.upc = $("#upc").val();
        App.ownerID = $("#ownerID").val();
        App.originFarmerID = "0x4fda79a2dd6d80f88985dd96a0ef561038354843";
        App.originFarmName = $("#originFarmName").val();
        App.originFarmInformation = $("#originFarmInformation").val();
        App.originFarmLatitude = $("#originFarmLatitude").val();
        App.originFarmLongitude = $("#originFarmLongitude").val();
        App.productNotes = $("#productNotes").val();
        App.productPrice = $("#productPrice").val();
        App.distributorID = "0xd5f8a8039db3ad99fdcd4ed71525bbba9c8786de";
        App.retailerID = "0xde66e80456345ce5b8ed8c9b1a6f633050da1d6a";
        App.consumerID = "0x6686b305385adba14e74692d426010ae339a9c4c";
        
        
        console.log(
            App.sku,
            App.upc,
            App.ownerID, 
            App.originFarmerID, 
            App.originFarmName, 
            App.originFarmInformation, 
            App.originFarmLatitude, 
            App.originFarmLongitude, 
            App.productNotes, 
            App.productPrice, 
            App.distributorID, 
            App.retailerID, 
            App.consumerID,
            "readform console log"
        );
    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        
        // window.ethereum is almost equivalent to window.web3.currentProvider
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:9545');
        }

        App.getMetaskAccountID();

        return App.initSupplyChain();
    },

    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }
            console.log(res[0])
            switch(res[0]) {
                case "0x4fda79a2dd6d80f88985dd96a0ef561038354843" : console.log("Farmer"); break;
                
                case "0xd5f8a8039db3ad99fdcd4ed71525bbba9c8786de" : console.log("Distributor"); break;
                
                case "0x6686b305385adba14e74692d426010ae339a9c4c" : console.log("Consumer"); break;
                case "0xde66e80456345ce5b8ed8c9b1a6f633050da1d6a" : console.log("Retailer"); break;
            }
            App.metamaskAccountID = res[0];

        })
    },

    initSupplyChain: function () {
        /// Source the truffle compiled smart contracts
        var jsonSupplyChain='build/contracts/SupplyChain.json';
        
        /// JSONfy the smart contracts
        $.getJSON(jsonSupplyChain, function(data) {
            console.log('data',data, App.web3Provider, "web3Provider");
            var SupplyChainArtifact = data;
            
            App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
            App.contracts.SupplyChain.setProvider(App.web3Provider);
            

            App.fetchItemBufferOne();
            App.fetchItemBufferTwo();
            App.fetchEvents();

        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function(event) {
        event.preventDefault();

        App.getMetaskAccountID();
        // console.log($(event.target).data('id'), 137);
        // $(event.target) returns the data-id of the button
        var processId = parseInt($(event.target).data('id'));

        switch(processId) {
            case 1:
                console.log('harvesting');
                return await App.harvestItem(event);
                break;
            case 2:
                console.log('processing');
                return await App.processItem(event);
                break;
            case 3:
                console.log('packing');
                return await App.packItem(event);
                break;
            case 4:
                console.log('selling');
                return await App.sellItem(event);
                break;
            case 5:
                console.log('buying');
                return await App.buyItem(event);
                break;
            case 6:
                console.log('shipping');
                return await App.shipItem(event);
                break;
            case 7:
                console.log('receiving');
                return await App.receiveItem(event);
                break;
            case 8:
                console.log('purchasing');
                return await App.purchaseItem(event);
                break;
            case 9:
                console.log('fetch1');
                return await App.fetchItemBufferOne(event);
                break;
            case 10:
                console.log('fetch2');
                return await App.fetchItemBufferTwo(event);
                break;
            }
    },

    harvestItem: async function(event) {

        web3 = new Web3(App.web3Provider);
        web3.version.getNetwork(function(err,res){console.log(res)});
        event.preventDefault();

        const instance = await App.contracts.SupplyChain.deployed()
        const isFarmerResult = await instance.isFarmer(App.metamaskAccountID)
        console.log(`current address is registered as a FarmerResult ${isFarmerResult}`)
                
        if(!isFarmerResult) {
            const result = await instance.addFarmer(App.metamaskAccountID);
            console.log(result, "farmer result")

        }

        const harvestResult = await instance.harvestItem(
            App.upc, 
            App.metamaskAccountID, 
            App.originFarmName, 
            App.originFarmInformation, 
            App.originFarmLatitude, 
            App.originFarmLongitude, 
            App.productNotes
        );
        $("#ftc-item").text(harvestResult);
    },

    processItem: async function (event) {
        event.preventDefault();

        const instance = await App.contracts.SupplyChain.deployed();
        const processResult = await instance.processItem(App.upc, {from: App.metamaskAccountID});
        $("#ftc-item").text(processResult);
    },
    
    packItem: async function (event) {
        event.preventDefault();

        const instance = await App.contracts.SupplyChain.deployed();
        const packResult = await instance.packItem(App.upc, {from: App.metamaskAccountID});
        $("#ftc-item").text(packResult);
    },

    sellItem: async function (event) {
        event.preventDefault();

        const instance = await App.contracts.SupplyChain.deployed();
        const productPrice = web3.toWei($("#productPrice").val(), "ether");
        const sellResult = await instance.sellItem(App.upc, productPrice, {from: App.metamaskAccountID});
        $("#ftc-item").text(sellResult);
    },

    buyItem: async function (event) {
        event.preventDefault();

        const walletValue = web3.toWei($("#productPrice").val(), "ether");
        const instance = await App.contracts.SupplyChain.deployed();
        const isDistributor = await instance.isDistributor(App.metamaskAccountID);
        console.log(`current address is registered as a Distributor ${isDistributor}`)

        const buyResult = await instance.buyItem(App.upc, {from: App.metamaskAccountID, value: walletValue});
        if (!isDistributor) {
            await instance.addDistributor(App.metamaskAccountID);
        }
        $("#ftc-item").text(buyResult);
    },
    //  TO-DO : This does not work, make sure to test this in test JS file
    shipItem: async function (event) {
        event.preventDefault();

        const instance = await App.contracts.SupplyChain.deployed();
        const shipResult = await instance.shipItem(App.upc, {from: App.metamaskAccountID});
        $("#ftc-item").text(shipResult);
        
    },

    receiveItem: async function (event) {
        event.preventDefault();

        const instance = await App.contracts.SupplyChain.deployed();
        const isRetailer = await instance.isRetailer(App.metamaskAccountID);
        console.log(`current address is registered as a Retailer ${isRetailer}`)
        if(!isRetailer) {
            await instance.addRetailer(App.metamaskAccountID);
        }
        const receiveResult = await instance.receiveItem(App.upc, {from: App.metamaskAccountID});
        $("#ftc-item").text(receiveResult);
    },

    purchaseItem: async function (event) {
        event.preventDefault();

        const instance = await App.contracts.SupplyChain.deployed();
        const isConsumer = await instance.isConsumer(App.metamaskAccountID);
        console.log(`current address is registered as a consumer ${isConsumer}`)
        if(!isConsumer) {
            const result = await instance.addConsumer(App.metamaskAccountID)
        }
        const purchaseResult = await instance.purchaseItem(App.upc, {from: App.metamaskAccountID});
        $("#ftc-item").text(purchaseResult);
    },

    fetchItemBufferOne: function () {
    ///   event.preventDefault();
    
        App.upc = $('#upc').val();

        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferOne(App.upc);
        }).then(function(result) {
          $("#ftc-item").text(result);
        //   console.log('fetchItemBufferOne', result);
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchItemBufferTwo: function () {
    ///    event.preventDefault();
    
                        
        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferTwo.call(App.upc);
        }).then(function(result) {
          $("#ftc-item").text(result);
        //   console.log('fetchItemBufferTwo', result);
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchEvents: function () {
        if (typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function") {
            App.contracts.SupplyChain.currentProvider.sendAsync = function () {
                return App.contracts.SupplyChain.currentProvider.send.apply(
                App.contracts.SupplyChain.currentProvider,
                    arguments
              );
            };
        }

        App.contracts.SupplyChain.deployed().then(function(instance) {
        var events = instance.allEvents(function(err, log){
          if (!err)
            $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
        });
        }).catch(function(err) {
          console.log(err.message);
        });
        
    }
};

// $() is equivalent to jQuery()
// Remember that window is the browser object that contains all global JS objects, functions, and variables.
// Note the BOM (Browser Object Model)
$( function() {
    $(window).load(function() {
        console.log("Page has loaded with this script!!")
        App.init();
    });
});

 

