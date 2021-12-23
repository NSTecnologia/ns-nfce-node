# ns-nfce-node

Esta biblioteca possibilita a comunicação e o consumo da solução API para NFCe da NS Tecnologia.

Para implementar esta biblioteca em seu projeto, você pode:

1. Realizar a instalação do [pacote](https://www.npmjs.com/package/ns-nfce-node) através do npm:

       npm install ns-nfce-node

2. Realizar o download da biblioteca pelo [GitHub](https://github.com/NSTecnologia/ns-nfce-node/archive/refs/heads/main.zip) e adicionar a pasta "ns-modules" em seu projeto.

# Exemplos de uso do pacote

Para que a comunicação com a API possa ser feita, é necessário informar o seu Token no cabeçalho das requisições. 

Para isso, crie um arquivo chamado `configParceiro.js`, e nele adicione:

       const token = ""
       const CNPJ = ""

       module.exports = {token, CNPJ}
       
Dessa forma, o pacote conseguirá importar as suas configurações, onde você estará informando o token da software house e o cnpj do emitente.

## Emissão

Para realizarmos a emissão de uma NFCe, vamos utilizar os seguintes métodos.

Primeiramente, vamos fazer referencia da classe *emitirSincrono*, para utilizarmos o método **emitirNFCeSincrono**

       const nsAPI = require('ns-nfce-node/ns_modules/nfce_module/emissao/emitirSincrono')

O segundo passo é importar, ou construir o arquivo de emissão em **.json** da NFe.

       const nfeJSON = require('./nfce.json')
           
Apos isso, vamo utilizar o método **sendPostRequest** da classe *EmissaoSincrona* para realizar o envio deste documento NFCe para a API.
Este método realiza a emissão, a consulta de status de processamento e o download de forma sequencial.

       var retorno = nsAPI.emitirNFCeSincrono(nfceJSON,"2","XP","Documentos/NFe")
       retorno.then(()=>)

Os parâmetros deste método são:

+ *nfceJSON* = objeto NFCe que será serializado para envio;
+ *2* = tpAmb = ambiente onde será autorizado a NFCe. *1 = produção, 2 = homologação / testes* ;
+ *"XP"* = tpDown = tipo de download, indicando quais os tipos de arquivos serão obtidos no Download;
+ *"Documentos/NFCe"* = diretório onde serão salvos os documentos obtidos no download;

O retorno deste método é um objeto json contendo um compilado dos retornos dos métodos realizados pela emissão sincrona:

        ResponseSincrono {
		statusEnvio: 100,
		statusDownload: 100,
		motivo: 'NFC-e autorizada com sucesso',
		xMotivo: 'Autorizado o uso da NF-e',
		chNFe: '43211207364617000135650000000224121823802320',
		cStat: 100,
		nProt: '143210000692032',
		xml: '<?xml version="1.0" encoding="utf-8"?><nfeProc versao="4.00" xmlns="http://www.portalfiscal.inf.br/nfe"><NFe><infNFe versao="4.00",
           json: undefined, // json da NFCe autorizada quando tpDown = "J", ou "JP"
           pdf: undefined, // base64 do PDF da NFCe ( DANFE ) autorizada quando tpDown = "P", "XP", "JP"
           erros: undefined // array de erros quando a comunicação, emissão, ou processamento apresentar erros
         }
       }
    
Podemos acessarmos os dados de retorno e aplicarmos validações da seguinte forma. Tenhamos como exemplo:

       i if ((emissaoResponse.status == 100) || (emissaoResponse.status == -6 || (emissaoResponse.status == -7))){
        
        respostaSincrona.statusEnvio = emissaoResponse.status
        respostaSincrona.cStat = emissaoResponse.cStat

           // Verifica se houve sucesso na consulta
           if (retorno.statusConsulta == "200") {
               var statusConsulta = retorno.statusConsulta
               var motivo = retorno.motivo
               var xMotivo = retorno.xMotivo

               // Verifica se a nota foi autorizada
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

## Eventos

### Cancelar NFCe

Para realizarmos um cancelamento de uma NFCe, devemos gerar o objeto do corpo da requisição e depois, fazer a chamada do método. Veja um exemplo:
       
       const cancelarNFC = require('./node_modules/ns-nfce-node/ns_nodules/nfce_module/eventos/cancelamento')

	let corpo = new cancelarNFC.Body(
		"43211207364617000135650000000224061514316849",
		"2",
		"2021-12-21T15:37:56-03:00",
		"143210000688971",
		"CANCELAMENTO REALIZADO PARA TESTES DE INTEGRACAO EXEMPLO NODE JS"
	)

	cancelarNFC.sendPostRequest(corpo, "XP", "Documentos/NFCe").then(getResponse => { console.log(getResponse) })
        
Os parâmetros informados no método são:

+ *requisicaoCancelamento* =  Objeto contendo as informações do corpo da requisição de cancelamento;
+ "XP" = tpDown = tipo de download, indicando quais os tipos de arquivos serão obtidos no download do evento de cancelamento;
+ *@"Documentos/NFCe"* = diretório onde serão salvos os arquivos obtidos no download do evento de cancelamento;

### Inutilização de numeração da NFCe

Para emitirmos uma inutilização de numeração da NFe, devemos gerar o objeto do corpo da requisição, utilizando a classe *Inutilizacao.Body*, e utilizar o método *Inutilizacao.sendPostRequest*, da seguinte forma:

	const inutilizarNFCe = require('./node_modules/ns-nfce-node/ns_nodules/nfce_module/eventos/inutilizacao') 

	let corpo = new inutilizarNFCe.Body(
		"43", 
		"2", 
		"21", 
		"07364617000135", 
		"0", 
		"22901", 
		"22901", 
		"INUTILIZADO PARA TESTES DE INTEGRACAO"
    )

		inutilizarNFCe.sendPostRequest(corpo, "X", "./Documentos").then(getResponse => { console.log(getResponse) })
        
Os parâmetros informados no método são:

+ *requisicaoInutilizar* =  Objeto contendo as informações do corpo da requisição de inutilização;
+ "X" = tpDown = tipo de download, indicando quais os tipos de arquivos serão obtidos no download do evento de inutilização;
+ *@"./Documentos"* = diretório onde serão salvos os arquivos obtidos no download do evento de inutilização;

## Utilitários

Ainda com esta biblioteca, é possivel acessar método utilitários da API de NFCe. Veja exemplos:

### Consultar situação de NFCe
        
       const consultarNFe = require('./node_modules/ns-nfce-node/ns_nodules/nfce_module/util/consultarSituacao')

		let corpo = new consultarNFe.Body(
			"07364617000135",
			"43211207364617000135650000000223501529141481",
			"2"
		)

	consultarNFe.sendPostRequest(corpo).then(getResponse => { console.log(getResponse) })
        


### Agendamento de Envio de E-Mail de NFCe
        
		const enviarEmail = require('./node_modules/ns-nfce-node/ns_nodules/nfce_module/util/envioEmail')

		let corpo = new enviarEmail.Body(
			"43211207364617000135650000000223501529141481",
			"2",
			"true",
			"true",
			"cleiton.fagundes@nstecnologia.com.br"
		)

		enviarEmail.sendPostRequest(corpo).then(getResponse => { console.log(getResponse) })
        
### Listagem de nsNRec's vinculados à uma NFe

       const listarNSNRec = require('./node_modules/ns-nfe-node/ns_modules/nfe_module/util/listarNSNrec')
       let corpo = new listarNSNRec.body("43210914139046000109550000000257891100116493")

       listarNSNRec.sendPostRequest(corpo).then(() => {})

### Gerar prévia de NFCe 

		const nsAPI = require('./node_modules/ns-nfce-node/ns_nodules/nfce_module/util/previa')
		const nfceJSON = require('./nfce.json')

		previa = nsAPI.sendPostRequest(nfceJSON).then(getResponse => { console.log(getResponse) })

### Informações Adicionais

Para saber mais sobre o projeto NFCe API da NS Tecnologia, consulte a [documentação](https://docsnstecnologia.wpcomstaging.com/docs/ns-nfce/)


