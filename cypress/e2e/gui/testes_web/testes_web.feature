# cypress/e2e/testes_web.feature

Feature: Consulta e inclusão de produto no carrinho

Scenario: Validar consulta de produto
Given que estou na página inicial do site
When eu clico no como de pesquisa de produto
And informo a palavra chave do produto
And clico em pesquisar
Then retorna a lista deprodutos que possui a palavra chave

Scenario: Validar inclusão de produto no carrinho
Given que estou na página do produto
And iformo a quantidade do produto 
When clicar no botão de enviar para o carrinho
And e clico no botão do carrinho
Then o produto foi adicionado ao carrinho com sucesso

Scenario: Validar que produtos do carrinho sejam carregado na página de pagamento
Given que estou na página do carrinho
When quando confirmo a compra do produto
Then vejo produto na pagina de pagamento
