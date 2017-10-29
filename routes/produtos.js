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
      const v = $("dd.description").text().split('\n').filter((x)=>{ if(x!=""){return x}})
      const p = $("dt").text().split('\n').filter((x)=>{ if(x!=""){return x}})
      
      
      
      
      
      
      if(arr[1]){
        var txt = ''
        var str = '{'
          
        for (var i = 0; i < p.length; i++) {

          switch (p[i]) {
            case 'País de Registro:':
              txt += ',"pais":"'+v[i]+'"'
              break;
            case 'Categoria (GPC):':
              txt += ',"categoria":"'+v[i]+'"'
              break;
            case 'Marca:':
              txt += ',"marca":"'+v[i]+'"'
              break;
            case 'Fabricante:':
              txt += ',"fabricante":"'+v[i]+'"'
              break;
            case 'Distribuidores:':
              txt += ',"distribuidores":"'+v[i]+'"'
              break;
          
            
          }

                 
        }

        str += txt.substring(1)
        str+='}'
        var obj = JSON.parse(str)

          obj.nome=arr[1]
          obj.codigo_barras=arr[5]
                  
          res.send(obj)
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