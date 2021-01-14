const {scraper_ini} = require('./scraper.js')

// Initialize
async function initialize() {
    showMode();
    process.stdin.setEncoding('utf8');
    process.stdin.on('readable', checkMenu);

    function checkMenu() {
        var input = process.stdin.read();
        if(input !== null) {
            menuHandler(input.trim());
        }
    }
}

var mode = '';
var place = 'Barcelona-Barcelona';

// Ask for a mode
function showMode() {

    console.log(
        '\n' + 
        'Zer nolako transakzio scrapeatu nahiko zenuke ?' + '\n' +
        '1 = Salmenta prezioa' + '\n' +
        '2 = Alokairu prezioa'  + '\n' +
        '3 = Bukatu'  + '\n\n' +
        'Aukeratu zenbakia eta sakatu ENTER:'
        );

    menuHandler = function(input){
        switch(input) {
            case '1': 
                mode = 'venta-viviendas';
                scraper_ini(mode,place); 
                break;
            case '2': 
                mode = 'alquiler-viviendas';
                scraper_ini(mode,place);
                break;
            case '3': 
                process.exit(); 
            default: 
                showMode();
        }
    };
   
}

initialize();