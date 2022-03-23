/*

    Este é o parser para a seguinte gramática, vista na parte teórica
    da disciplina (? aqui significa a palavra vazia):

    E -> TE'
    E' -> + E | ?
    T -> FT'
    T' -> * T | ?
    F -> (E) | id

    Uma vez que cada símbolo não terminal será transformado em uma função no
    parser, vamos trocar E' e T' por outros símbolos:

    E -> TY
    Y -> + E | ?
    T -> FZ
    Z -> * T | ?
    F -> (E) | id

*/

// Especificação dos tokens (lembrando que isso deveria ser feito previamente
// por um lexer)
const tokens = {
    PLUS: '+',
    TIMES: '*',
    LPAREN: '(',
    RPAREN: ')',
    ID: 'id'
}

// Esta é a expressão a ser analisada. Como não dispomos de um lexer completo,
// é importante DEIXAR UM ESPAÇO entre cada token
const expression = 'id + id * ( id + id )'

// Nossa entrada é uma "tabela de símbolos" simplificada, gerada a partir
// da expressão separando-se os tokens por espaços
const input = expression.split(' ')

let tokenIdx = -1
let currToken   // Token atual

// Função que retorna o próximo token
function nextToken() {
    tokenIdx++
    currToken = input[tokenIdx]
}

// Função que confere se o token especificado é do tipo esperado
function match(exp) {
    // Se o token da posição estiver OK, passa ao próximo token
    if(currToken === exp) nextToken()

    // Erro, caso o token não seja o esperado
    else console.error(`ERROR: token "${exp}" expected.`)
}

// Funções que representam cada um dos símbolos não terminais
function E() {
    console.log(`-> Rule E, current token: ${currToken}`)
    T()
    Y()
}

function T() {
    console.log(`-> Rule T, current token: ${currToken}`)
    F()
    Z()
}

function Y() {
    console.log(`-> Rule Y, current token: ${currToken}`)
    if(currToken === tokens.PLUS) {
        match(tokens.PLUS)
        E()
    }
}

function Z() {
    console.log(`-> Rule Z, current token: ${currToken}`)
    if(currToken === tokens.TIMES) {
        match(tokens.TIMES)
        T()
    }
}

function F() {
    console.log(`-> Rule F, current token: ${currToken}`)
    switch(currToken) {
        case tokens.LPAREN:
            match(tokens.LPAREN)
            E()
            match(tokens.RPAREN)
            break

        case tokens.ID:
            match(tokens.ID)
            break

        default:
            console.error('ERROR: "(" or "id" expected.')
    }
}

// Função que inicializa o parser
function parse() {

    // Captura o primeiro token
    nextToken()

    // Chama o símbolo inicial
    E()

    // currToken será undefined quando acabarem todos os tokens de input
    if(currToken === undefined) console.log('*** EXPRESSION ACCEPTED ***')
    else console.error('!!! Expression rejected !!!')
}

// Chama a função do parser
parse()