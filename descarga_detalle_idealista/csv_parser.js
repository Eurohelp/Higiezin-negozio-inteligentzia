const fs = require('fs');
const converter = require('json-2-csv');
const csv = require('csvtojson')

async function divide(){
    var links = fs.readFileSync('./csv/urls_links/Barcelona.csv')
    .toString() // convert Buffer to string
    .split('\n') // split string to lines
    .map(e => e.trim()) // remove white spaces for each line
    .map(e => e.split(',').map(e => e.trim())); // split each line to array

    
    let ten_links = [];

    let csv_count = 0;
    let count = 1;
    for await(let link of links){
        let actual_link = link[0];
        
        if (actual_link != 'link'){
            // console.log("\n NºCsv: " + csv_count + "\n NºUrls: " + count);
            actual_link = {url: link[0]};
            ten_links.push(actual_link);
            
            if (count == 31){
                await writeDataCSVDiv(ten_links, csv_count);
                ten_links = [];
                csv_count += 1;
                count = 1;
            }
            count += 1;
        }
    }
}

async function writeDataCSVDiv(ten_links, csv_count){
    return new Promise(resolve => {
    
        let dir_csv = './csv/urls_links/Barcelona_'; 

        converter.json2csv(ten_links, (err, csv_string) => {
            if (err) {
                throw err;
            }
            fs.writeFileSync(dir_csv + (csv_count*30) + '-' + ((csv_count*30)+30) + '.csv', csv_string);
        });
        resolve(true);
    })
  }


async function writeDataCSVJoin(ten_links){
    return new Promise(resolve => {
    
        let dir_csv = './csv/Barcelona'; 

        converter.json2csv(ten_links, (err, csv_string) => {
            if (err) {
                throw err;
            }
            fs.writeFileSync(dir_csv + '.csv', csv_string);
        });
        resolve(true);
    })
  }
async function join(){
    let all_info = []
    for (let i = 1; i <= 60; i++){
        const jsonArray = await csv().fromFile('./csv/Barcelona_' + ((i-1)*30) + '-' + (i*30) + '.csv');

        for (let info of jsonArray){
            all_info.push(info);
        }
    }
    await writeDataCSVJoin(all_info);
}

join();