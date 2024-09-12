/// <reference types= 'cypress'/>

import { Before ,Given, When, Then } from "cypress-cucumber-preprocessor/steps";

describe('Validar atualização de imagem de produto', () => {
    let token = 0;
    let userId = 0;
    let email = "romeu@gmail.com";
    let loginPassword = "12345qQ";
    let loginUser = "romeu";
    let source = "local";
    let color = "black";
    let name = "H2310"
    let quantityPerEachCategory = -1;
    let productId = 12;
    let productImageId = 0;
    let amountImages = 0;

    Before(() => {
        cy.request({
            method: 'POST',
            url: `https://www.advantageonlineshopping.com/accountservice/accountrest/api/v1/login`,
            headers: {
                accept: "*/*",
                'Content-Type': "application/json",
            },
            body: {
                email: email,
                loginPassword: loginPassword,
                loginUser: loginUser,
            },
        }).then((response) => {
            expect(response.status).to.be.equal(200);
            expect(response.body.statusMessage.reason).to.be.include("Login Successful");
            token = response.body.statusMessage.token;
            userId = response.body.statusMessage.userId;
            cy.log("userId: ", userId)
            cy.log("token", token)
        });

    });

    Given('que o produto esteja cadastrado na base', () => {
        cy.request({
            method: 'GET',
            url: `https://www.advantageonlineshopping.com/catalog/api/v1/products/search?name=${name}&quantityPerEachCategory=${quantityPerEachCategory}`,
            headers: {
                accept: "*/*",
            },
        }).then((response) => {
            expect(response.status).to.equal(200);
            response.body.forEach(body => {
                body.products.forEach(products => {
                    if (products.productId === 12) {
                        expect(products.productId).to.be.equal(12);
                        productId = products.productId;
                        cy.log("productId", productId)
                    }
                });
            });
        });

        cy.request({
            method: 'GET',
            url: `https://www.advantageonlineshopping.com/catalog/api/v1/products/${productId}`,
            headers: {
                accept: "*/*",
            },
        }).then((response) => {
            amountImages = response.body.images.length;
            cy.log("amountImages", amountImages)        
        });
    });

    When('incluir uma imagem', () => {
        const imagePath = 'headphoneback.jpg';
        cy.fixture(imagePath, 'binary')
        .then(Cypress.Blob.binaryStringToBlob)
        .then(fileContent => {
            const formData = new FormData();
            formData.append('file', fileContent, 'headphoneback.jpg')
            cy.request({
                method: "POST",
                url: `https://www.advantageonlineshopping.com/catalog/api/v1/product/image/${userId}/${source}/${color}?product_id=${productId}`,
                headers: {
                    accept: '*/*',
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
                encoding: 'binary',
            }).as('responseImage');
        }); 
    });

    Then('a resposta deve ter o status 200', () => {
        cy.get('@responseImage').then((response) => {
            expect(response.status).to.be.equal(200);
            const decoder = new TextDecoder('utf-8');
            const responseText = decoder.decode(response.body);
            const responseData = JSON.parse(responseText);
            productImageId = responseData.imageId;
        });
    });

    Then('deve encontrar a nova imagem que foi incluida', () => {
        cy.request({
            method: 'GET',
            url: `https://www.advantageonlineshopping.com/catalog/api/v1/products/${productId}`,
            headers: {
                accept: "*/*",
            },
        }).then((response) => {
            expect(response.body.images.length).to.be.equal(amountImages + 1);
            const imagesArray = response.body.images;
            const expectedImage = `${color}##${productImageId}`;
            expect(imagesArray).to.include(expectedImage);
        });
    });
});