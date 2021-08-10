// materiais utilizados
/* 
File functions(Write and Read)
https://nodejs.dev/learn/writing-files-with-nodejs
https://nodejs.dev/learn/reading-files-with-nodejs
https://stackoverflow.com/questions/10058814/get-data-from-fs-readfile

*/

// *********************  CLASSES  ****************

class Produto {
    constructor(id, name, quantity, price, category) {
        this.id = id
        this.name = name
        this.quantity = quantity
        this.price = price
        this.category = category
    }
}

// **********************************

// ------ Global variables

// file open require
const fs = require("fs")
// vector of objects produto
var produtos = []
// file name
const fileName = "broken-database.json"
//fixed file name
const fixedFileName = "./saida.json"

// -- Exercício 1. Recuperação dos dados originais do banco de dados -- 
/*
Criar uma função para ler o arquivo broken-database.json e criar três
funções para percorrer o banco de dados corrompido e corrigir os três erros
descritos anteriormente, além de uma função para exportar um arquivo .json com a
saída.
Portanto serão 5 funções:
a) Ler o arquivo Json; (openFile)
b) Corrigir nomes; (fixJSON/fixString)
c) Corrigir preços; (fixJSON/fixPrice)
d) Corrigir quantidades; (fixJSON/fixQuantity)
e) Exportar um arquivo JSON com o banco corrigido; (createAndWriteFixedJsonFile)
*/

// Fix JSON Part
// a) open broken database
var jsonFile = openFile(fileName)
if (jsonFile !== null) {
    // b) fix JSON and create objects produto to write repaired file
    fixJSON(jsonFile)
    // e) save new JSON file repaired
    createAndWriteFixedJsonFile(fixedFileName)
}

// ----------------- Fim do exercício 1 ---------------------------

// ------- Exercício 2. Validação do banco de dados corrigido -----

/*
implementar funções para validar a sua recuperação do banco de
dados. Todas essas funções deverão ter como input o seu banco de dados corrigido
na questão 1. As funções de validação são:
a) Uma função que imprime a lista com todos os nomes dos produtos, ordenados
primeiro por categoria em ordem alfabética e ordenados por id em ordem
crescente. Obs: é apenas uma saída, ordenada pelos dois fatores citados acima.

b) Uma função que calcula qual é o valor total do estoque por categoria, ou seja,
a soma do valor de todos os produtos em estoque de cada categoria,
considerando a quantidade de cada produto.
*/

//Open repaired file and execute the functions
// open repaired database
jsonFile = openFile(fixedFileName)
if (jsonFile !== null) {
    // a) sort produtos for category and id
    console.log(jsonFile.sort(order))
    // b) Sum of the products price in the storage, by category
    categorySumPrice(jsonFile)
}


// ----------------- Fim do exercício 2 ---------------------------

// *********************  FUNÇÕES  *************

// 1 a) Open File
function openFile(_file_name) {
    try {
        // console.log('\n**********************************')
        // console.log(`  Arquivo ${_file_name}`)
        // console.log(`  aberto com sucesso`)
        // console.log('**********************************')

        return JSON.parse(fs.readFileSync(_file_name, 'utf-8'))
    } catch (err) {
        // console.error(err)
        console.log(`\nOcorreu um erro na abertura do arquivo ${_file_name}.`)
        console.log(`Verifique se o arquivo existe ou está com o nome correto.`)
        console.log(`${err}\n`)
        return null
    }
}

// 1 b/c/d) Fix JSON File and create objects produto
function fixJSON(_json_File) {
    // Create produtos objects
    try {

        // console.log('\n********************************')
        // console.log('  Os dados serão corrigidos, ')
        // console.log('  se necessário.             ')
        // console.log('********************************')

        const data = _json_File

        for (var i in data) {

            produtos[i] = new Produto(parseInt(data[i].id), fixString(data[i].name),
                fixQuantity(data[i].quantity), fixPrice(data[i].price), data[i].category)

        }

        // console.log('\n********************************')
        // console.log('  Dados obtidos com sucesso  ')
        // console.log('********************************')
    }
    catch (err) {
        console.log(`${err}`)
    }
}

// 1 b) Fix string function
function fixString(stringToFix) {
    // Quatro tipos de erros conhecidos:
    /* 
        "a" por "æ", 
        "c" por "¢", 
        "o" por "ø", 
        "b" por "ß".
    */
    // o /g significará que todos os valores correspondentes serão substituídos.
    // por padrão, replace substitui somente a primeira ocorrência

    // Código retirado no questionamento de ajuda do stackoverflow: 
    // https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
    stringToFix = stringToFix.replace(new RegExp(/æ/g), "a");
    stringToFix = stringToFix.replace(new RegExp(/¢/g), "c");
    stringToFix = stringToFix.replace(new RegExp(/ø/g), "o");
    stringToFix = stringToFix.replace(new RegExp(/ß/g), "b");

    return stringToFix
}

// 1 c) Fix prices
function fixPrice(priceToFix) {
    return parseFloat(priceToFix)
}

// 1 d) Fix quantities
function fixQuantity(quantityToFix) {
    let quantity

    if (isNaN(quantityToFix)) {
        quantity = 0
    }
    else {
        quantity = parseFloat(quantityToFix)
    }
    return quantity

}

// 1 e) create and write fixed Json file
function createAndWriteFixedJsonFile(_fixedFileName) {
    try {
        fs.writeFileSync(_fixedFileName, JSON.stringify(produtos, null, 2))
        // console.log('\n********************************')
        // console.log(`  Arquivo ${_fixedFileName}`)
        // console.log('  criado com sucesso')
        // console.log('********************************')

    } catch (err) {
        console.log(`Ocorreu um erro na gravação do arquivo ${_file_name}.`)
        console.log(`Erro: ${err}\n`)
        return null
    }
}

// 2 a)
function order(_produto_1, _produto_2) {
    if (_produto_1.category < _produto_2.category) {
        return -1
    } else if (_produto_1.category === _produto_2.category) {
        if (_produto_1.id < _produto_2.id) {
            return -1
        } else {
            return 0
        }
    } else {
        return 0
    }
}

// 2 b)
function categorySumPrice(_jsonFile) {
    let estoquePorCategoria = []
    let indice
    let countCategories = 0

    for (var i in _jsonFile) {
        if (i === 0) {
            estoquePorCategoria[countCategories] = { categoria: _jsonFile[i].category, valor: (_jsonFile[i].quantity * _jsonFile[i].price) }
            countCategories++
        }
        else {
            // Busca de índices retirado do stackoverflow:
            // https://pt.stackoverflow.com/questions/32185/resgatar-o-index-de-um-objeto-com-certo-atributo-dentro-de-um-array-de-objetos
            indice = estoquePorCategoria.indexOf(estoquePorCategoria.filter(function (obj) {
                return obj.categoria == _jsonFile[i].category;
            })[0]);
            if (indice != -1) {
                estoquePorCategoria[indice].valor += (_jsonFile[i].quantity * _jsonFile[i].price)
            }
            else {
                estoquePorCategoria[countCategories] = { categoria: _jsonFile[i].category, valor: (_jsonFile[i].quantity * _jsonFile[i].price) }
                countCategories++
            }
        }
    }

    console.log(estoquePorCategoria)
}