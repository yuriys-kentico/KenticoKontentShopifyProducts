# Kentico Kontent Shopify Products

Sample custom element that uses the [Shopify Storefront API](https://shopify.dev/docs/storefront-api) to list Shopify products in a Shopify store.

![KontentShopifyProducts](https://user-images.githubusercontent.com/34716163/96767488-9a5baf00-13aa-11eb-8f72-51b75a65feda.gif)

## Prerequisites

1. Register a private app within Shopify. You can follow the instructions in the [Kentico Kontent documentation](https://docs.kontent.ai/tutorials/develop-apps/integrate/shopify-e-commerce#a-step-1-register-a-private-app-within-shopify).

## Setup

1. Deploy the custom element code in `Client/` to a secure public host.
   - See the [Deploying](#Deploying) section for a really quick option.
1. Follow the instructions in the [Kentico Kontent documentation](https://docs.kontent.ai/tutorials/develop-apps/integrate/integrating-your-own-content-editing-features#a-3--displaying-a-custom-element-in-kentico-kontent) to add the element to a content model.
   - The `Hosted code URL` is where you deployed to in step 1.
   - The `Parameters {JSON}` is a JSON object containing element parameters. See the [JSON parameters](#json-parameters) section for details.

## Deploying

Netlify has made this easy. If you click the deploy button below, it will guide you through the process of deploying to Netlify and leave you with a copy of the repository in your GitHub account as well.

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/yuriys-kentico/KenticoKontentShopifyProducts)

## JSON Parameters

`storefrontAccessToken` is a `string` defining the [Shopify Storefront access token](https://shopify.dev/docs/storefront-api/getting-started#private-app).
`graphqlEndpoint` is a `string` defining the Shopify [Storefront API GraphQL endpoint](https://shopify.dev/docs/storefront-api/getting-started#accessing-the-storefront-api-graphql-endpoint).

Example JSON parameters object:

```json
{
  "storefrontAccessToken": "0cebd512fc55891b6af0c392c529df87",
  "graphqlEndpoint": "https://sample-store.myshopify.com/api/2020-10/graphql"
}
```
