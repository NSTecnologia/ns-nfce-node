const nsAPI = require('../../api_module/nsAPI')
const util = require('../../api_module/util')

const url = "https://nfce.ns.eti.br/v1/nfce/get/inut"

class Body {
    constructor(idInut, tpAmb, tpDown) {
        this.idInut = idInut;
        this.tpAmb = tpAmb;
        this.tpDown = tpDown;
    }
}

class Response {
    constructor({ status, motivo, retInut, erros}) {
        this.status = status;
        this.motivo = motivo;
        this.retInutNFe = retInut;
        this.erros = erros
    }
}

async function sendPostRequest(conteudo, caminhoSalvar) {

    try {

        let responseAPI = new Response(await nsAPI.PostRequest(url, conteudo))

        if (responseAPI.retInutNFe.json != null) {
            util.salvarArquivo(caminhoSalvar, responseAPI.retInutNFe.idInut, "-procInut.json", responseAPI.retInutNFe.json)
        }

        if (responseAPI.retInutNFe.pdf != null) {
            let data = responseAPI.retInut.pdf;
            let buff = Buffer.from(data, 'base64');
            util.salvarArquivo(caminhoSalvar, responseAPI.retInutNFe.idInut, "-procInut.pdf", buff)
        }

        if (responseAPI.retInutNFe.xml != null) {
            util.salvarArquivo(caminhoSalvar, responseAPI.retInutNFe.idInut, "-procInut.xml", responseAPI.retInutNFe.xml)
        }

        return responseAPI

    } 
    
    catch (error) {
        util.gravarLinhaLog("[ERRO_DOWNLOAD_INUTILIZACAO]: " + error)
        return error
    }

}

module.exports = { Body, sendPostRequest }
