const nsAPI = require('../../api_module/nsAPI');
const { gravarLinhaLog } = require('../../api_module/util');

const url = "https://nfce.ns.eti.br/v1/nfce/cont/issue"

class Response {
    constructor({ status, motivo, chNFe, xml,erros }) {
        this.status = status;
        this.motivo = motivo;
        this.chNFe = chNFe;
        this.erros = erros;
        this.xml = xml
    }
}

async function sendPostRequest(conteudo) {
    
    try {
        let responseAPI = new Response(await nsAPI.PostRequest(url, conteudo))
        return responseAPI
    } 
    
    catch (error) {
        gravarLinhaLog("[ERRO_EMISSAO_CONTINGENCIA_NFCE]: " + error)
        return error
    }
}

module.exports = { sendPostRequest }