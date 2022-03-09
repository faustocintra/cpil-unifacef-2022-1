let source = 
    `read a
    read b
    read c
    result := (a+b)*c
    write result * .5`


// Caracteres em branco
const blanks = [
    ' ',    // Espaço em branco
    '\n',   // Quebra de linha
    '\r',   // Retorno de linha
    '\t'    // Tabulação
]

// Caracteres que não são brancos, mas são separadores de tokens
const boundaries = [
    '+', '-', '*', '/', '(', ')'
]

// separators são a união entre blanks e boundaries
const separators = [...blanks, ...boundaries]

// Tabela de símbolos
let symbols = []

// Lista de erros
let errors = []

let lexeme = ''
let state = 1   // Estado inicial
let line = 1    // Primeira linha
let col = 0     // Primeira coluna

// Coloca uma quebra de linha no final do código-fonte para pegar o último lexema
source += '\n'

// Percurso do código-fonte caractere a caractere
for(let i = 0; i < source.length; i++) {

    // Pega o caractere da posição
    let charPos = source.charAt(i)

    // Se for o caractere \n (quebra de linha), 
    // incrementa a contagem de linhas e reseta
    // a contagem de colunas
    if(charPos === '\n') {
        line++
        col = 0
    }

    // Incrementa a contagem de colunas
    col++

    // Se for um caractere separador, ignora e passa
    // para o próximo
    if(separators.includes(charPos)) {
        //console.log({charPos, line, col, state, lexeme})
        if(state === 10 || state === 11) {  // IDENTIFIER
            symbols.push({lexeme: lexeme, token_name: 'IDENTIFIER', token_value: lexeme})
            lexeme = ''
            state = 1
        }
        else if(state === 12 || state === 13) { // NUMBER
            symbols.push({lexeme: lexeme, token_name: 'NUMBER', token_value: lexeme})
            lexeme = ''
            state = 1
        }

        // Se for um caractere em branco, passa para o caractere seguinte
        if(blanks.includes(charPos)) continue
    } 
            

    // Inclui o novo caractere no lexema
    lexeme += charPos

    // AUTÔMATO FINITO DETERMINÍSTICO

    // Estado 1 (inicial)
    switch(charPos) {
        case '(':   // Estado 2
            symbols.push({lexeme: lexeme, token_name: 'LPAREN', token_value: null})
            lexeme = '' // Reseta o lexema
            break

        case ')':   // Estado 3
            symbols.push({lexeme: lexeme, token_name: 'RPAREN', token_value: null})
            lexeme = '' // Reseta o lexema
            break

        case '+':   // Estado 4
            symbols.push({lexeme: lexeme, token_name: 'PLUS', token_value: null})
            lexeme = '' // Reseta o lexema
            break

        case '-':   // Estado 5
            symbols.push({lexeme: lexeme, token_name: 'MINUS', token_value: null})
            lexeme = '' // Reseta o lexema
            break

        case '*':   // Estado 6
            symbols.push({lexeme: lexeme, token_name: 'TIMES', token_value: null})
            lexeme = '' // Reseta o lexema
            break

        case '/':   // Estado 7
            symbols.push({lexeme: lexeme, token_name: 'DIV', token_value: null})
            lexeme = '' // Reseta o lexema
            break

        case ':':   // Estado 8
            state = 8
            break

        case '=':
            if(state === 8) {
                symbols.push({lexeme: lexeme, token_name: 'ASSIGN', token_value: null})
                state = 1
                lexeme = ''
            }
            else {
                errors.push({message: 'Unexpected symbol', value: charPos, line: line, col: col})
            }
            break

        case '.':
            if(state === 1 || state === 12) state = 13
            else errors.push({message: 'Unexpected symbol', value: charPos, line: line, col: col})
            break

        default:
            // Letras maiúsculas e minúsculas
            if(charPos.match(/[a-zA-Z]/)) {
                if([1, 10, 11].includes(state)) state = 10                
                else errors.push({message: 'Unexpected symbol', value: charPos, line: line, col: col})
            }
            // Dígitos
            else if(charPos.match(/[0-9]/)) {
                // Números
                if([1, 12, 13].includes(state)) state = 12
                // Identificadores
                else if(state === 10) state = 11
                else errors.push({message: 'Unexpected symbol', value: charPos, line: line, col: col})
            }
            else errors.push({message: 'Unexpected symbol', value: charPos, line: line, col: col})
    }

}

console.log(symbols)
console.log(errors)