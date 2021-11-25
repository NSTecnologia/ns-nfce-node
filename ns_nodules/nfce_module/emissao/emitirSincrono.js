const download = require('./download')
const emitir = require('./emitir')
const util = require('../../api_module/util')

class ResponseSincrono {
    constructor(statusEnvio, statusDownload, motivo, xMotivo, chNFe, cStat, nProt, xml, json, pdf, erros) {
        this.statusEnvio = statusEnvio;
        this.statusDownload = statusDownload;
        this.motivo = motivo;
        this.xMotivo = xMotivo;
        this.chNFe = chNFe;
        this.cStat = cStat;
        this.nProt = nProt;
        this.xml = xml;
        this.json = json;
        this.pdf = pdf;
        this.erros = erros;
    }
}

async function emitirNFCeSincrono(conteudo, tpAmb, impressao, caminhoSalvar) {

    let respostaSincrona = new ResponseSincrono();

    let emissaoResponse = await emitir.sendPostRequest(conteudo)

    if ((emissaoResponse.status == 100) || (emissaoResponse.status == -6 || (emissaoResponse.status == -7))){
        
        respostaSincrona.statusEnvio = emissaoResponse.status
        respostaSincrona.cStat = emissaoResponse.cStat

            if ((emissaoResponse.cStat == 100) || (emissaoResponse.cStat == 150)){
            
                respostaSincrona.cStat = emissaoResponse.cStat
                respostaSincrona.chNFe = emissaoResponse.chNFe
                respostaSincrona.nProt = emissaoResponse.nProt
                respostaSincrona.xml = emissaoResponse.xml
                respostaSincrona.motivo = emissaoResponse.motivo
                respostaSincrona.xMotivo = emissaoResponse.xMotivo

                let downloadBody = new download.Body(
                    emissaoResponse.chNFe,
                    tpAmb,
                    impressao
                )
                await new Promise(resolve => setTimeout(resolve, 500));

                let downloadResponse = await download.sendPostRequest(downloadBody, caminhoSalvar)

                if (downloadResponse.status == 100) {
                    respostaSincrona.statusDownload = downloadResponse.status
                    respostaSincrona.cStat = downloadResponse.cStat
                    respostaSincrona.json = downloadResponse.json
                    respostaSincrona.pdf = downloadResponse.pdf
                }
                
                else {
                    respostaSincrona.cStat = downloadResponse.cStat
                    respostaSincrona.statusDownload = downloadResponse.status
                    respostaSincrona.motivo = downloadResponse.motivo;
                    respostaSincrona.xMotivo = downloadResponse.xMotivo;
                }
            }

            else {
                respostaSincrona.motivo = statusResponse.motivo;
                respostaSincrona.xMotivo = statusResponse.xMotivo;
            }
    }
    
    else if ((emissaoResponse.status == -4) || (emissaoResponse.status ==-2)) {

        respostaSincrona.motivo = emissaoResponse.motivo

        try { 
            respostaSincrona.erros = emissaoResponse.erros 
        }

        catch (error){ 
            console.log(error);
        }
    }

    else if ((emissaoResponse.status == -999) || (emissaoResponse.status == -5)) {
        respostaSincrona.motivo = emissaoResponse.motivo
    }
    
    else {

        try { 
            respostaSincrona.cStat = emissaoResponse.cStat
            respostaSincrona.statusEnvio = emissaoResponse.status
            respostaSincrona.motivo = emissaoResponse.motivo
            respostaSincrona.xMotivo = emissaoResponse.xMotivo
        }

        catch (error) {

            respostaSincrona.motivo = JSON.stringify("ERRO_EMISSAO_SINCRONA: " + error + "\r\n" + emissaoResponse)
        }
    }

    return respostaSincrona
}

module.exports = { ResponseSincrono, emitirNFCeSincrono }
