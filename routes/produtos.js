const express = require('express')
const router = express.Router()
const request = require('request')
const cheerio = require('cheerio')


/* GET users listing. */
router.get('/:cod', (req, res, next) => {
  if(Number(req.params.cod))
    request('https://cosmos.bluesoft.com.br/produtos/'+req.params.cod, (error, response, html) => {
      
      if(!error){
        const $ = cheerio.load(html);
        
        const arr =  $('h1.page-header').text().split('\n')
        const d = $("dd.description").text().split('\n')

        




        if(arr[1]){

          res.send({
            nome:arr[1],
            codigo_barras:arr[5],
            pais:d[1],
            fabricante:d[4],
            distribuidor:d[7],
            marca:d[10]
          })
        }else{
          res.send({status:-1, msg:"Código de barras inválido"})
        }


      }
    })
  else
    res.send("passe um codigo de barras valido");

})
router.get('/', (req, res, next) => {
  res.send("passe um codigo de barras valido");
})

module.exports = router;