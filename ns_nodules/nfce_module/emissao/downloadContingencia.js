const nsAPI = require('../../api_module/nsAPI')
var fs = require('fs');
const util = require("../../api_module/util")
'use strict';

const url = "https://nfce.ns.eti.br/v1/nfce/cont/print"

class Body {
    constructor(xml, impressao) {
        this.xml = xml;
        this.impressao = impressao
    }
    
}

class Impressao {
    constructor(tipo, ecologica, itemLinhas, itemDesconto,larguraPapel,modMiniImpressora) {
        this.tipo = tipo;
        this.ecologica = ecologica;
        this.itemLinhas = itemLinhas;
        this.itemDesconto = itemDesconto;
        this.larguraPapel = larguraPapel;
        this.modMiniImpressora = modMiniImpressora;
    }
}

class Response {
    constructor({ status, motivo, chNFe, erros, pdf, escpos, json }) {
        this.status = status;
        this.motivo = motivo;
        this.chNFe = chNFe;
        this.erros = erros;
        this.pdf = pdf;
        this.escpos = escpos;
        this.json = JSON.stringify(json);
    }
}

async function sendPostRequest(body, caminho) {
    
    try {
        
        let responseAPI = new Response(await nsAPI.PostRequest(url, body))

        if (responseAPI.pdf != null) {
            let data = responseAPI.pdf;
            let buff = Buffer.from(data, 'base64');
            util.salvarArquivo(caminho, responseAPI.chNFe, "-nfeProc.pdf", buff)
        }

        return responseAPI
    } 
    
    catch (error) {
        util.gravarLinhaLog("[ERRO_DOWNLOAD_CONTINGENCIA_NFCE]: " + error)
        return error
    }
    

}

module.exports = { Body, sendPostRequest, Impressao }

