/// <reference types= 'cypress'/>

import { Given, When, Then } from "cypress-cucumber-preprocessor/steps";


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

    before(() => {

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
                    }
                });
            });

        });
    });

    When('incluir uma imagem', () => {
        const imagePath = 'headphoneback.jpg';
        cy.fixture(imagePath, 'binary').then((fileContent) => {
            const formData = new FormData();
            const blob = Cypress.Blob.binaryStringToBlob(fileContent, 'image/jpeg');
            formData.append('file', blob, imagePath);

            cy.request({
                method: "POST",
                url: `https://www.advantageonlineshopping.com/catalog/api/v1/product/image/${userId}/${source}/${color}?product_id=${productId}`,
                headers: {
                    token: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
                form: false,
                json: false,
            }).then((response) => {
                expect(response.status).to.be.equal(200);
                expect(response.body.success).to.be.true
            })
        });

        cy.request({
            method: 'GET',
            url: `https://www.advantageonlineshopping.com/catalog/api/v1/products/${productId}`,
            headers: {
                accept: "*/*",
            },
        }).as('responseImage')
    });

    Then('a resposta deve ter o status 200', () => {
        cy.get('@responseImage').then((response) => {
            expect(response.status).to.be.equal(200);
        });
    });

    Then('deve encontrar a nova imagem que foi incluida', () => {
        cy.get('@responseImage').then((response) => {
            const imageslist = response.body.images;
            expect(imageslist).to.contains("custom_image_local_362e7f36-6879-4ba2-970d-f86cfa8d0bd9");
        });
    });
});