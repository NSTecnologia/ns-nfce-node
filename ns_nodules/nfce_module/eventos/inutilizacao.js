const nsAPI = require('../../api_module/nsAPI')
const downloadInut = require("./downloadInutilizacao")

const url = "https://nfce.ns.eti.br/v1/nfce/inut"

class Body {
    constructor(cUF, tpAmb, ano, CNPJ, serie, nNFIni, nNFFin, xJust) {
        this.cUF = cUF;
        this.tpAmb = tpAmb;
        this.ano = ano;
        this.CNPJ = CNPJ;
        this.serie = serie;
        this.nNFIni = nNFIni;
        this.nNFFin = nNFFin;
        this.xJust = xJust;
    }
}

class Response {
    constructor({ status, motivo, retInutNFe, erros }) {
        this.status = status;
        this.motivo = motivo;
        this.retInutNFe = retInutNFe;
        this.erros = erros
    }
}

async function sendPostRequest(conteudo, caminhoSalvar) {
    
    try {
        
        let responseAPI = new Response(await nsAPI.PostRequest(url, conteudo))

        if (responseAPI.status == 102){
            let downloadInutBody = new downloadInut.Body(responseAPI.retInutNFe.idInut, "2", "X")

            let downloadInutResponse = await downloadInut.sendPostRequest(downloadInutBody, caminhoSalvar)
    
            return downloadInutResponse
        }
        else {
            return responseAPI
        }

    } 
    
    catch (error) {
        
        return error
    }


}

module.exports = { Body, sendPostRequest }
