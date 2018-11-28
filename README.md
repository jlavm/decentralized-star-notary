# Private Blockchain Notary Service

Below you can find a specific use case of a star notary service that allows users to prove they own an authenticated star.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

1. Node installed

### Installing

1. Clone this repo
2. Install ganache

```
npm install -g ganache-cli
```

3. Install truffle

```
npm install -g truffle
```

4. Install HttpServer

```
npm install -g http-server
```

5. cd command to smart_contracts folder
6. Install dependencies

```
npm install
```

7. Install the metamask plugin in your chrome browser

## Compile contracts

1. Open terminal tab

```
ganache-cli
```

2. In other terminal tab cd command to smart_contracts folder

```
cd <project name>/smart_contracts
```

3. Run test with truffle

```
truffle compile
```

## Test project

1. Open terminal tab

```
ganache-cli
```

2. In other terminal tab cd command to smart_contracts folder

```
cd <project name>/smart_contracts
```

3. Run test with truffle

```
truffle test test/StarNotaryTest.js
```

## Deploy project in Rinkeby

1. Open terminal tab

```
ganache-cli
```

2. In other terminal tab cd command to smart_contracts folder

```
cd <project name>/smart_contracts
```

3. Deploy

```
truffle deploy --network rinkeby
```

## Modify client code to interact with a smart contract

1. Open terminal tab and cd command to project folder

```
cd <project name>
```

2. Execute command

```
http-server
```

3. Open browser in

```
http://127.0.0.1:8080
```
