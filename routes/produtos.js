const express = require('express')
const router = express.Router()
const puppeteer = require('puppeteer')
const cheerio = require('cheerio')

router.get('/:cod', async (req, res, next) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.75 Safari/537.36')
    await page.goto('https://cosmos.bluesoft.com.br/produtos/'+req.params.cod)
      const html = await page.content()
      const $ = cheerio.load(html);

      const arr =  $('h1.page-header').text().split('\n')
      const v = $("dd.description").text().split('\n').filter((x)=>{ if(x!=""){return x}})
      const p = $("dt").text().split('\n').filter((x)=>{ if(x!=""){return x}})

      const img  = $(".product-thumbnail img").attr('src')
      console.log(img)
      const temImg = String(img).split("/")
      console.log(temImg)

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
        obj.nome = arr[1]
        obj.codigo_barras = req.params.cod
        if(img){
          if (temImg[1] == "assets" ) {
            res.send(obj)
          }else{
              obj.img = img
              res.send(obj)
          }
        }else{
          res.send(obj)
        }
        
      }else{
        res.send({status:-1, msg:"Código de barras inválido"})
      }      
  } catch (error) { 
    res.send({status:-1, msg:"Código de barras inválido"});
  }
  
})
router.get('/', (req, res, next) => {
  res.send({status:-1, msg:"Código de barras inválido"});
})

module.exports = router;