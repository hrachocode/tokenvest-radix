# Tokenvest

## Idea
Tokenvest is a invesment deFi platform powered by blockchain, using the **Radix** decentralized network which is a best suit for deFi applications.

With this platform users will have opportunity to invest in products and to create a product/idea to get an investment. 
Products are getting stored in the blockchain, transactions are being made via *RDX* token.

## Application
Application as an MVP consist of 3 pages
1. Home - user details being showsn, including name, connected accounts number and status. 
2. Products - list of created products.
3. Create a Product - create product functionality

## Technology
Architecture consist of 3 main concepts(folders).
1. Smart Contracts - All the Radix smart contracts
2. Frontend - all the UI code, including iteractions with smart contracts
3. [strapi](https://strapi.io) - the headless CMS implementation to sync products in our database.

## How to run

### Requirements
NodeJs version 14

### App
Based on your package manager you need 2 simple commands, in this example we will use yarn
For the first time running project
1. yarn
2. yarn start:prod

for the next times, for development purposes
1. yarn start:dev

### Wallet
1. setup the [radix mobile application[(https://docs-babylon.radixdlt.com/main/getting-started-developers/wallet-and-connector.html)
2. install the [connector extentsion](https://docs-babylon.radixdlt.com/main/getting-started-developers/wallet-and-connector.html#_install_the_connector)
3. (Optional) transfer tokens to your account from radix betanet.
4. connect your accoun in our platform using **connect** button in header
![image](https://user-images.githubusercontent.com/23248910/227128067-6824769e-92c9-4aea-990c-82d5ab1d9097.png)

Specific business logic is described in the video
