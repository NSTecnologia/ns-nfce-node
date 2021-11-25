const nsAPI = require('../../api_module/nsAPI');
const { gravarLinhaLog } = require('../../api_module/util');
const url = "https://nfce.ns.eti.br/v1/nfce/issue"

class Response {
    constructor({ status, motivo, nfeProc, xml, nsNRec, erros }) {
        this.status = status;
        this.motivo = motivo;
        this.nfeProc = nfeProc;
        this.nProt = nfeProc.nProt;
        this.digVal = nfeProc.digVal;
        this.cStat = nfeProc.cStat;
        this.xMotivo = nfeProc.xMotivo;
        this.chNFe = nfeProc.chNFe;
        this.serie = nfeProc.serie;
        this.numero = nfeProc.numero;
        this.dhRecbto = nfeProc.dhRecbto;
        this.nsNRec = nsNRec;
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
        gravarLinhaLog("[ERRO_EMISSAO_NFCE]: " + error)
        return error
    }
}

module.exports = { sendPostRequest }