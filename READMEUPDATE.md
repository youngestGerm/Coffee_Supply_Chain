# Coffee Supply Chain Blockchain

## Project Goal 

By using Ethereum Blockchain, we can verify the various processes that coffee goes through to reach the final consumer. During this process, if we as the consumer are not satisfied with the production of the coffee we do not need to buy it.

## Running Frontend
Run these in new terminal windows both in the directory folder project 6.
```
$ truffle develop 
$ npm run dev
$ truffle console --network rinkeby // This is to run the blockchain (backend) on the rinkeby network.
```

## Running Tests
Run this in a terminal window with directory project-6.
```
$ truffle compile
$ truffle migrate --reset
$ truffle test
```

## Concepts

> What is the difference between webpack-dev-server and lite-server?

The main purpose of Webpack is to bundle JS files for usage in browser. Some benefits are its optimal load times and its efficiency in reducing modules that are in the project. Lite-server is more beneficial for SPAs (single page applications) which may contain many routes. Use it if the website is extremely simplistic or has BrowserSync, allowing for custom middleware.

> What is BrowserSync?

Makes testing faster by synchronising file changes and interactions across multiple devices. Once it detects an action it performs a page reload.

![BrowserSync Example](https://miro.medium.com/max/1626/1*0fO_9XRhUB_kscnnbBVUcA.gif)

> What is jQuery?

A JS library designed to simplify HTML input and output objects. Reference it with the HTML `<script>` tag. ```<head>   <script src="jquery-3.4.1.min.js"></script>  </head>```

[Download Link](https://jquery.com/download/)

## Errors

> ALERT: Transaction Error. Exception thrown in contract code. 

The above error was thrown in the metamask notification display. Remember in the contract you had a modifier that only allowed certain addresses to do certain things. For example, only the farmer's address could harvest, process, etc. 

## Other Information

### File Usage
- _bs-config.json_ is used as a part of lite-server customization.

### Documentation
- [BrowserSync Documentation](https://browsersync.io/docs/options#option-browser)

- [Lite-Server Documentation](https://www.npmjs.com/package/lite-server)

### TO-DO

1. Hook up the HTML inputs, "Distributor ID" , "Retailer ID", etc with the contracts so that the modifiers work. 
2. When the contract is created from one address (the harvestor), allow him to put in his farmer ID. Do not allow him to input the distributor ID, etc. 
3. Make sure that the Distributor should not be able to do what the retailer is able to do.

### Packages:
- truffle@5.0.21
- web3@1.0.0-beta.37
- ganache-cli
- lite-server
