const nsAPI = require('../../api_module/nsAPI')

const url = "https://nfce.ns.eti.br/v1/nfce/status"

class Body {
    constructor(licencaCnpj, chNFe, tpAmb) {
        this.licencaCnpj = licencaCnpj;
        this.chNFe = chNFe;
        this.tpAmb = tpAmb;
    }
}

class Response {
    constructor({status, motivo, nfeProc, erros}) {
        this.status = status;
        this.motivo = motivo;
        this.nfeProc = nfeProc;
        this.erros = erros
    }
}

async function sendPostRequest(conteudo) {

    try {

        let responseAPI = new Response(await nsAPI.PostRequest(url, conteudo))
        return responseAPI

    }

    catch (error) {
        gravarLinhaLog("[ERRO_CONSULTA_SITUACAO]: " + error)
    }

}

module.exports = { Body, sendPostRequest }