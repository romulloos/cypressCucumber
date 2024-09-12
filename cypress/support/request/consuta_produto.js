class ConsultProduct {

    methodGetConsultProduct(name, quantityPerEachCategory){
        cy.request({
            method: 'GET',
            url: `/catalog/api/v1/products/search?name=${name}&quantityPerEachCategory=${quantityPerEachCategory}`,
            headers: {
                accept: "*/*",
            },
        }).as("methodGetConsultProduct");
    }
}

export default ConsultProduct();