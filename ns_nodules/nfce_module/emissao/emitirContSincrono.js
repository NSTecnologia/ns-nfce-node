const download = require('./downloadContingencia')
const emitir = require('./emissaoContingencia')

class ResponseSincrono {
    constructor(statusEnvio, statusDownload, motivoEnvio, motivoDownload, chNFe, xml, pdf, escpos, erros) {
        this.statusEnvio = statusEnvio;
        this.statusDownload = statusDownload;
        this.motivoEnvio = motivoEnvio;
        this.motivoDownload = motivoDownload;
        this.chNFe = chNFe;
        this.xml = xml;
        this.pdf = pdf;
        this.escpos = escpos;
        this.erros = erros;
    }
}

//Impressão pdf: Passar somente os paramentos conteudo, tpImpressao e caminhoSalvar;
//Impressão escpos: Passar todos os parametros (parametro caminhoSalvar pode passar como null);
async function emitirNFCeContSincrono(conteudo, tpImpressao, caminhoSalvar, itemDesconto, itemLinhas, larguraPapel, modMiniImpressora){

    let respostaSincrona = new ResponseSincrono();

    let emissaoResponse = await emitir.sendPostRequest(conteudo)

    //Verifica qual status retonou da emissão;
    if ((emissaoResponse.status == 200) || (emissaoResponse.status == -6) || (emissaoResponse.status == -2)){
        respostaSincrona.statusEnvio = emissaoResponse.status
        respostaSincrona.motivoEnvio = emissaoResponse.motivo

        //Caso o status for 200 retorna esses dados e parte para o download;
        if ((emissaoResponse.status == 200) ){
            respostaSincrona.statusEnvio = emissaoResponse.status
            respostaSincrona.chNFe = emissaoResponse.chNFe
            respostaSincrona.xml = emissaoResponse.xml
            respostaSincrona.motivoEnvio = emissaoResponse.motivo

            let impressao = new download.Impressao(
                tpImpressao,
                false,
                itemLinhas,
                itemDesconto,
                larguraPapel,
                modMiniImpressora
            )
             

            let downloadBody = new download.Body(
                emissaoResponse.xml,
                impressao
            )
            
            await new Promise(resolve => setTimeout(resolve, 500));

            let downloadResponse = await download.sendPostRequest(downloadBody, caminhoSalvar)

            if (downloadResponse.status == 200) {
                respostaSincrona.statusDownload = downloadResponse.status
                respostaSincrona.motivoDownload = downloadResponse.motivo
                respostaSincrona.escpos = downloadResponse.escpos
                respostaSincrona.pdf = downloadResponse.pdf
            }
            
            else {
                respostaSincrona.statusDownload = downloadResponse.status
                respostaSincrona.motivoDownload = downloadResponse.motivo;
            }
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

            respostaSincrona.motivo = JSON.stringify("ERRO_EMISSAO_CONTINGENCIA_SINCRONA: " + error + "\r\n" + emissaoResponse)
        }
    }

    return respostaSincrona

}
module.exports = { ResponseSincrono, emitirNFCeContSincrono }