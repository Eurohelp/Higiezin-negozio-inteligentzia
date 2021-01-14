const csv = require('csv-parser');
const fs = require('fs');
const { url } = require('inspector');
const converter = require('json-2-csv');

const email = 'Scrpide@gmail.com';
const pass = 'Idealista@2020';

let date_ob = new Date();

// adjust 0 before single digit date
let date = ("0" + date_ob.getDate()).slice(-2);

// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
let year = date_ob.getFullYear();

// current hours
let hours = date_ob.getHours();

// current minutes
let minutes = date_ob.getMinutes();

// current seconds
let seconds = date_ob.getSeconds();

const moment = year + "-" + month + "-" + date + "(" + hours + "-" + minutes + "-" + seconds + ')';

const csv_number = 1770;

const dir_exec = './executions/execution_' + moment + '.txt';
const dir_csv = './csv/Barcelona_' + csv_number + '-' + (csv_number+30) + '.csv'; 

fs.writeFile(dir_exec,'EXECUTION AT ' + moment + '\n\n', function (err){
  if (err) return console.log(err);
});

const Nightmare = require('nightmare');
const { resolve } = require('path');

const nightmare = Nightmare({
    show: true,
    webPreferences: {}})

async function scraper_ini(){
  /* For this case only scraping Barcelona-Barcelona and using already extracted CSV file with houses links. */
  
  let scraped = [];

  var links = fs.readFileSync('./csv/urls_links/Barcelona_' + csv_number + '-' + (csv_number+30) + '.csv')
  .toString() // convert Buffer to string
  .split('\n') // split string to lines
  .map(e => e.trim()) // remove white spaces for each line
  .map(e => e.split(',').map(e => e.trim())); // split each line to array

  for await (let link of links){
    let actual_link = link[0];
    if (actual_link.includes('idealista')){
      try{
        let actual_info = await scraper(actual_link);
        if (actual_info != null){
          scraped.push(actual_info);
        }
        /*if (actual_info == null){
          links.push(link);
          await timeout(10000);
        }
        else {
          scraped.push(actual_info);
        }*/
      }
      catch (error){
        console.log(error);
      }      
    }
  }
  
  let count = 1;
  for await (let info of scraped){
    let actual_link = links[count][0];
    info[0].link = actual_link;
    await writeDataTxT(info[0]);
    count += 1;
  }

  let full_info = []
  for await (let info of scraped){
    full_info.push(info[0]);
  }

  await writeDataCSV(full_info);
  return(true);
}

function scraper(url){  
  return new Promise(resolve => {
    
    const nightmare = Nightmare({
      show: true,
      waitTimeout: 10000,
      webPreferences: {}})
    
    nightmare
      .goto(url)
      /*
      .wait('.icon-user-no-logged')
      .click('.icon-user-no-logged')
      .wait('#email')
      .type('#email', email)
      .wait('.js-password-field')
      .type('.js-password-field', pass)
      .wait('#doLogin')
      .click('#doLogin')
      .wait('#btn-free-search')
      .back()
      .back()
      */
      /*;
      
      await scrollAllPage(nightmare);

      nightmare 
      
      */
      .wait('.detail-container')
      .evaluate(function() {
        var searchR = []

        // Reference
        let ref = document.querySelector('.txt-ref');
        if (ref != null){
          ref = ref.innerText;
        }

        // Real-Estate
        let real_estate = document.querySelector('.professional-name');
        if (real_estate != null){
          real_estate = real_estate.innerText.split('\n')[1];
        }

        // Title
        let title = document.querySelector('.h2-simulated');
        if (title != null){
          title = title.innerText;
          title = title.replace(/,/gi,'');
        }

        // Neighbourhood
        let neighbourhood = document.querySelector('.main-info__title-minor');
        if (neighbourhood != null){
          neighbourhood = neighbourhood.innerText;
          neighbourhood = neighbourhood.replace(/,/gi,'');
          neighbourhood = neighbourhood.replace(' Barcelona','');
        }

        // Actual Price
        let price = document.querySelector('.info-data-price');
        if (price != null){
          price = price.innerText;
          price = price.replace('€','');
        }

        // Price Down
        let price_down = document.querySelector('.pricedown_price');
        if (price_down != null){
          price_down = price_down.innerText;
          pricprice_downe = price_down.replace('€','');
        }

        // Price Down %
        let price_down_per = document.querySelector('.pricedown_icon');
        if (price_down_per != null){
          price_down_per = price_down_per.innerText;
          price_down_per = price_down_per.replace('%','');
        }

        // Its New
        let its_new = document.querySelector('.info-urgent');
        if (its_new != null){
          its_new = its_new.innerText;
        }

        // Description
        let description = document.querySelector('div.commentsContainer:nth-child(9) > div:nth-child(3) > div:nth-child(1)');
        if (description != null){
          description = description.innerHTML;
          description = description.replace(/,/gi,'');
          description = description.replace(/"/gi,'');
          description = description.replace(/<br>/gi,' ');
        }

        // Ul - Li
        let m2_build = null;
        let m2_useful = null;
        let rooms = null;
        let bathrooms = null;
        let terrace = null;
        let parking = null;
        let status = null;
        let constructed_year = null;
        let heater_system = null;
        let energetic_qualification = null;

        let ul_specs = document.querySelector('.details-property-feature-one > div:nth-child(2) > ul:nth-child(1)').children;
        for (var i = 0; i < ul_specs.length; i++){
          let actual_li = ul_specs[i];
          if (actual_li != null){
            actual_li = actual_li.innerHTML;
            if (actual_li.includes('construidos')){
              m2_build = actual_li.split(' construidos')[0];
              m2_build = m2_build.split(' ')[0];
              if (actual_li.includes('útiles')){
                m2_useful = actual_li.split(', ')[1];
                m2_useful = m2_useful.replace(' útiles','');
                m2_useful = m2_useful.split(' ')[0];
              }
            }
            else if (actual_li.includes('habitación') || actual_li.includes('habitaciones')){
              actual_li = actual_li.replace(' habitaciones','');
              rooms = actual_li.replace(' habitación','');
              if (rooms.includes('Sin')){
                rooms = 0;
              }
            }
            else if (actual_li.includes('baño') || actual_li.includes('baños')){
              actual_li = actual_li.replace(' baños','');
              bathrooms = actual_li.replace(' baño','');
            }
            else if (actual_li.includes('Terraza')){
              terrace = 1;
            }
            else if (actual_li.includes('garaje')){
              parking = 1;
            }
            else if (actual_li.includes('mano') || actual_li.includes('nueva')){
              status = actual_li;
            }
            else if (actual_li.includes('Construido en')){
              constructed_year = actual_li.replace('Construido en ','');
            }
            else if (actual_li.includes('Calefacción individual')){
              heater_system = actual_li.replace('Calefacción individual: ','');
            }
            else if (actual_li.includes('Certificación energética')){
              energetic_qualification = ul_specs[i].innerText;
              if (energetic_qualification.includes(' kWh/m² año')){
                if (energetic_qualification.includes('(')){
                  energetic_qualification = energetic_qualification.split('(')[1];
                  energetic_qualification = energetic_qualification.split(' ')[0];
                  if (energetic_qualification.includes(',')){
                    energetic_qualification = energetic_qualification.split(',')[0];
                  }
                }
              }
              else{
                energetic_qualification = 0;
              }
            }
          }
        }
        
        let floor = null;
        let elevator = null;

        let ul_specs2 = document.querySelector('.details-property-feature-two > div:nth-child(2) > ul:nth-child(1)')
        if (ul_specs2 != null){
          ul_specs2 = ul_specs2.children;
          for (var i = 0; i < ul_specs2.length; i++){
            let actual_li = ul_specs2[i];
            if (actual_li != null){
              actual_li = actual_li.innerHTML;
              if (actual_li.includes('Planta')){
                actual_li = actual_li.split(' ')[2];
                actual_li = actual_li.replace('º','');
                actual_li = actual_li.replace('ª','');
                floor = actual_li;
              }
              else if (actual_li.includes('Bajo')){
                floor = 0;
              }
              else if(actual_li.includes('ascensor')){
                actual_li = actual_li.split(' ')[1];
                if (actual_li.includes('con')){
                  elevator = 1;
                }
                else {
                  elevator = 0;
                }
              }
            }
          }
        }

        let price_m2 = document.querySelector('p.flex-feature:nth-child(2) > span:nth-child(2)');
        if (price_m2 != null){
          price_m2 = price_m2.innerText;
        }

        let updated = document.querySelector('#stats-ondemand > p:nth-child(1)');
        if (updated != null){
          updated = updated.innerText;
          updated = updated.split(' el')[1];
        }

        /* NOT WORKING SCROLL MISSING

        let views = document.querySelector('#stats-ondemand > ul:nth-child(2) > li:nth-child(1) > strong:nth-child(1)');
        if (views != null){
          views = views.textContent;
        }
        else{
          views = 0;
        }

        let send2friends = document.querySelector('#stats-ondemand > ul:nth-child(2) > li:nth-child(2) > strong:nth-child(1)');
        if (send2friends != null){
          send2friends = send2friends.textContent;
        }
        else{
          send2friends = 0;
        }

        let emails = document.querySelector('#stats-ondemand > ul:nth-child(2) > li:nth-child(3) > strong:nth-child(1)');
        if (emails != null){
          emails = emails.textContent;
        }
        else{
          emails = 0;
        }

        let fav = document.querySelector('#stats-ondemand > ul:nth-child(2) > li:nth-child(4) > strong:nth-child(1)');
        if (fav != null){
          fav = fav.textContent;
        }
        else{
          fav = 0;
        }

        */

        searchR.push(
          {
          floor: floor,
          elevator: elevator,
          ref: ref,
          real_estate: real_estate,
          title: title,
          neighbourhood: neighbourhood,
          price_euro: price,
          price_down_euro: price_down,
          price_down_percentage: price_down_per,
          price_m2: price_m2,
          its_new: its_new,
          m2_build: m2_build,
          m2_useful: m2_useful,
          rooms: rooms,
          bathrooms: bathrooms,
          terrace: terrace,
          parking: parking,
          status: status,
          constructed_year: constructed_year,
          heater_system: heater_system,
          energetic_qualification_kWhm2_año: energetic_qualification,
          description: description
          /*updated: updated,
          views: views,
          send2friends: send2friends,
          emails: emails,
          fav: fav*/
          })

        return searchR;
      })
      .end()
      .then(function(searchR) {
        resolve(searchR);
      })
      .catch(error => {
        console.error('Scraper failed in: ' + url + '\n');
        console.log(error);
        resolve(null);
      })
  });
}

async function writeDataCSV(searchR){
  return new Promise(resolve => {
    converter.json2csv(searchR, (err, csv_string) => {
      if (err) {
          throw err;
      }
      fs.writeFileSync(dir_csv, csv_string);
    });
    resolve(true);
  })
}

function writeDataTxT(searchR){
  return new Promise(resolve => {
    fs.appendFile(dir_exec, '\n' + '---------------- NEW HOUSE ----------------'+ '\n' +
    'URL: ' + searchR.link + '\n' +
    'FLOOR: ' + searchR.floor + '\n' +
    'ELEVATOR: ' + searchR.elevator + '\n' +
    'REFERENCE: ' + searchR.ref + '\n' +
    'REAL ESTATE: ' + searchR.real_estate + '\n' +
    'TITLE: ' + searchR.title + '\n' +
    'NEIGHBOURHOOD: ' + searchR.neighbourhood + '\n' +
    'PRICE: ' + searchR.price + '\n' +
    'PRICE DOWN: ' + searchR.price_down + '\n' +
    'PRICE DOWN %: ' + searchR.price_down_per + '\n' +
    'PRICE/m²: ' + searchR.price_m2 + '\n' +
    'ITS NEW?: ' + searchR.its_new + '\n' +
    'm² BUILDED: ' + searchR.m2_build + '\n' +
    'm² USEFUL: ' + searchR.m2_useful + '\n' +
    'Nº OF ROOMS: ' + searchR.rooms + '\n' +
    'Nº OF BATHROOMS: ' + searchR.bathrooms + '\n' +
    'HAS TERRACE?: ' + searchR.terrace + '\n' +
    'HAS PARKING?: ' + searchR.parking + '\n' +
    'STATUS: ' + searchR.status + '\n' +
    'YEAR OF CONSTRUCTION: ' + searchR.constructed_year + '\n' +
    'ENERGETIC QUALIFICATION: ' + searchR.energetic_qualification + '\n' +
    'DESCRIPTION: ' + searchR.description + '\n' 
    /*
    'LAST UPDATED: ' + searchR.updated + '\n' +
    'Nº OF VIEWS: ' + searchR.constructed_year + '\n' +
    'Nº OF TIMES SEND TO FRIENDS: ' + searchR.send2friends + '\n' +
    'Nº OF EMAILS: ' + searchR.emails + '\n' +
    'Nª OF FAVS: ' + searchR.fav + '\n' */
    , function (err){
      if (err) return console.log(err);
    });
    resolve(true);
  });
}

/* 
function scrollAllPage(nightmare){
  return new Promise(resolve => {
    var currentHeight = 0;
      var maxHeight = nightmare.evaluate(function() {
        return document.body.scrollHeight;
      });
      while(currentHeight < maxHeight) {
        currentHeight += maxHeight/250;
        nightmare.scrollTo(currentHeight, 0);
      }
    resolve(true);
  })
} 
*/

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports.scraper_ini = scraper_ini;
