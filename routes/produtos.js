const express = require('express')
const router = express.Router()
const request = require('request')
const cheerio = require('cheerio')
const  base64Img = require('base64-img');



/* GET users listing. */
router.get('/:cod', (req, res, next) => {
  if(Number(req.params.cod))
    request('https://cosmos.bluesoft.com.br/produtos/'+req.params.cod, (error, response, html) => {

      if(!error){
        const $ = cheerio.load(html);

        const arr =  $('h1.page-header').text().split('\n')
        const v = $("dd.description").text().split('\n').filter((x)=>{ if(x!=""){return x}})
        const p = $("dt").text().split('\n').filter((x)=>{ if(x!=""){return x}})

        const img  = $(".product-thumbnail img").attr('src')
        console.log(img)
        const temImg = String(img).split("/")


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
          obj.status = 1
          obj.nome=arr[1]
          obj.codigo_barras=req.params.cod
          if(img){
            if (temImg[1] == "assets" ) {
              res.send(obj)
            }else{
              base64Img.requestBase64(img, function(erro, resu, body) {
                obj.img = body
                res.send(obj)
              })
            }
          }else{
            res.send(obj)
          }
          
        }else{
          res.send({status:-1, msg:"Código de barras inválido"})
        }
      }
    })
  else
    res.send({status:-1, msg:"Código de barras inválido"});

})
router.get('/', (req, res, next) => {
  res.send({status:-1, msg:"Código de barras inválido"});
})

module.exports = router;