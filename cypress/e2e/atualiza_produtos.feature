# cypress/e2e/api.feature

Feature: Atualiza produtos

  Scenario: Validar atualização de imagem de produto
    Given que o produto esteja cadastrado na base
    When incluir uma imagem
    Then a resposta deve ter o status 200
    And deve encontrar a nova imagem que foi incluida
