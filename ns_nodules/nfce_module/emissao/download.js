const nsAPI = require('../../api_module/nsAPI')
var fs = require('fs');
const util = require("../../api_module/util")
'use strict';

const url = "https://nfce.ns.eti.br/v1/nfce/get"

class Body {
    constructor(chNFe, tpAmb, impressao) {
        this.chNFe = chNFe;
        this.tpAmb = tpAmb;
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
    constructor({ status, motivo, nfeProc, nsNRec, erros, pdf, json }) {
        this.status = status;
        this.motivo = motivo;
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
        this.xml = nfeProc.xml;
        this.pdf = pdf;
        this.json = JSON.stringify(json);
    }
}

async function sendPostRequest(body, caminho) {
    
    try {
        
        let responseAPI = new Response(await nsAPI.PostRequest(url, body))

        if (responseAPI.json != null) {
            util.salvarArquivo(caminho, responseAPI.chNFe, "-nfeProc.json", responseAPI.json)
        }

        if (responseAPI.pdf != null) {
            let data = responseAPI.pdf;
            let buff = Buffer.from(data, 'base64');
            util.salvarArquivo(caminho, responseAPI.chNFe, "-nfeProc.pdf", buff)
        }

        if (responseAPI.xml != null) {
            util.salvarArquivo(caminho, responseAPI.chNFe, "-nfeProc.xml", responseAPI.xml)
        }

        return responseAPI
    } 
    
    catch (error) {
        util.gravarLinhaLog("[ERRO_DOWNLOAD_NFCE]: " + error)
        return error
    }
    

}

module.exports = { Body, sendPostRequest, Impressao }

