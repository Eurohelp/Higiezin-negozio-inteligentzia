const fs = require('fs');
const converter = require('json-2-csv');
const csv = require('csvtojson');
const { count } = require('console');
const { randomInt } = require('crypto');
const randomFloat = require('random-float');
const { resolve } = require('path');

const dir_idealista = "../BCN/Idealista/Barcelona.csv";
const dir_years = "../BCN/Registros/2011_HABIT_FAM_DEST_HABIT_SEGONS_ANY_CONST2011.csv";
const dir_avg_euro_m2 = "../BCN/Registros/2011_HABITATGES_2NA_MA.csv";
const dir_neigh_status = "../BCN/Registros/2011_HABIT_PPAL_SEGONS_ESTAT_CONSERV_EDIF2011.csv";
const dir_neigh_type = "../BCN/Registros/2011_N_EDIF_HAB_SEGONS_N_IMMO2011.csv";
const dir_neigh_floors = "../BCN/Registros/2011_N_EDIF_HAB_SEGONS_NOMBRE_PLANTES_SOBRE_RASANT2011.csv";
const dir_neigh_rent = "../BCN/Registros/2011_HABIT_PPAL_SEGONS_REGIM_TIN2011.csv";
const dir_neigh_rooms = "../BCN/Registros/2011_HABIT_PPAL_SEGONS_NOM_HABIT2011.csv";
const dir_neigh_m2_useful = "../BCN/Registros/2011_habit_ppal_segons_sup_util2011.csv";
const dir_csv = "../BCN/Registros/Barcelona_Idealista_Registros.csv";

async function main(){
    await csv2json();
}

async function csv2json(){
    return new Promise(async function(resolve) {
    
        // Reading Idealista information
        // idealista[0] = headers , idealista[>0] = content
        var idealista = fs.readFileSync(dir_idealista)
        .toString() // convert Buffer to string
        .replace(/\, S./gi, ' S.') // remove comas inside real state
        .replace(/\, Barcelona/gi, '') // remove , Barcelona from real state
        .split('\n') // split string to lines
        .map(e => e.trim()) // remove white spaces for each line
        .map(e => e.split(',').map(e => e.trim())); // split each line to array
        
        // Reading Registro OpenData BCN 2011_HABIT_FAM_DEST_HABIT_SEGONS_ANY_CONST2011.csv
        // years[0] = headers , years[1] = totals , years[>1] = content
        var years = fs.readFileSync(dir_years, {encoding:'latin1'})
        .toString() // convert Buffer to string
        .replace(/\, /gi, ' ') // remove comas inside neighbourhood
        .split('\n') // split string to lines
        .map(e => e.trim()) // remove white spaces for each line
        .map(e => e.split(',').map(e => e.trim())); // split each line to array

        years.pop();
        years.shift()

        // Reading Registro OpenData BCN 2011_HABITATGES_2NA_MA.csv
        // avg_euro_m2[0] = headers , avg_euro_m2[1] = totals , avg_euro_m2[>1] = content
        var avg_euro_m2 = fs.readFileSync(dir_avg_euro_m2)
        .toString() // convert Buffer to string
        .replace(/\, /gi, ' ') // remove comas inside neighbourhood
        .split('\n') // split string to lines
        .map(e => e.trim()) // remove white spaces for each line
        .map(e => e.split(',').map(e => e.trim())); // split each line to array
        
        avg_euro_m2.pop();

        // Reading Registro OpenData BCN 2011_HABIT_PPAL_SEGONS_ESTAT_CONSERV_EDIF2011.csv
        // neigh_status[0] = headers , neigh_status[1] = totals , neigh_status[>1] = content
        var neigh_status = fs.readFileSync(dir_neigh_status, {encoding:'latin1'})
        .toString() // convert Buffer to string
        .replace(/\, /gi, ' ') // remove comas inside neighbourhood
        .split('\n') // split string to lines
        .map(e => e.trim()) // remove white spaces for each line
        .map(e => e.split(',').map(e => e.trim())); // split each line to array
        
        neigh_status.pop();

        // Reading Registro OpenData BCN 2011_N_EDIF_HAB_SEGONS_N_IMMO2011.csv
        // neigh_type[0] = headers , neigh_type[1] = totals , neigh_type[>1] = content
        var neigh_type = fs.readFileSync(dir_neigh_type, {encoding:'latin1'})
        .toString() // convert Buffer to string
        .replace(/\, /gi, ' ') // remove comas inside neighbourhood
        .split('\n') // split string to lines
        .map(e => e.trim()) // remove white spaces for each line
        .map(e => e.split(',').map(e => e.trim())); // split each line to array
        
        neigh_type.pop();

        // Reading Registro OpenData BCN 2011_N_EDIF_HAB_SEGONS_NOMBRE_PLANTES_SOBRE_RASANT2011.csv
        // neigh_floors[0] = headers , neigh_floors[1] = totals , neigh_floors[>1] = content
        var neigh_floors = fs.readFileSync(dir_neigh_floors, {encoding:'latin1'})
        .toString() // convert Buffer to string
        .replace(/\, /gi, ' ') // remove comas inside neighbourhood
        .split('\n') // split string to lines
        .map(e => e.trim()) // remove white spaces for each line
        .map(e => e.split(',').map(e => e.trim())); // split each line to array
        
        neigh_floors.pop();

        // Reading Registro OpenData BCN 2011_HABIT_PPAL_SEGONS_REGIM_TIN2011.csv
        // neigh_rent[0] = headers , neigh_rent[1] = totals , neigh_rent[>1] = content
        var neigh_rent = fs.readFileSync(dir_neigh_rent, {encoding:'latin1'})
        .toString() // convert Buffer to string
        .replace(/\, /gi, ' ') // remove comas inside neighbourhood
        .split('\n') // split string to lines
        .map(e => e.trim()) // remove white spaces for each line
        .map(e => e.split(',').map(e => e.trim())); // split each line to array
        
        neigh_rent.pop();

        // Reading Registro OpenData BCN 2011_HABIT_PPAL_SEGONS_NOM_HABIT2011.csv
        // neigh_rooms[0] = headers , neigh_rooms[1] = totals , neigh_rooms[>1] = content
        var neigh_rooms = fs.readFileSync(dir_neigh_rooms, {encoding:'latin1'})
        .toString() // convert Buffer to string
        .replace(/\, /gi, ' ') // remove comas inside neighbourhood
        .split('\n') // split string to lines
        .map(e => e.trim()) // remove white spaces for each line
        .map(e => e.split(',').map(e => e.trim())); // split each line to array
        
        neigh_rooms.pop();
        
        // Reading Registro OpenData BCN 2011_habit_ppal_segons_sup_util2011.csv
        // neigh_rooms[0] = headers , neigh_rooms[1] = totals , neigh_rooms[>1] = content
        var neigh_m2_useful = fs.readFileSync(dir_neigh_m2_useful, {encoding:'latin1'})
        .toString() // convert Buffer to string
        .replace(/\, /gi, ' ') // remove comas inside neighbourhood
        .split('\n') // split string to lines
        .map(e => e.trim()) // remove white spaces for each line
        .map(e => e.split(',').map(e => e.trim())); // split each line to array
        
        neigh_m2_useful.pop();
        

        let count = 0;
        for await (let idea_flat of idealista){
            // Assigning years by Districts for those flats with no info //
            let idea_years = idea_flat[1];
            if (idea_years == 'null'){
                let assignedYear = await assign_year(idea_flat,years);
                if (assignedYear != 0){
                    idea_flat[1] = assignedYear;
                }
            }

            // Assigning elevator or not depending on the value on CSV //
            let pos = 3;
            if (idea_flat[pos].includes("1")){
                idea_flat[pos] = 1;
            }
            else if (idea_flat[pos].includes("null")){
                idea_flat[pos] = 0;
            }     
            
            // Assigning energetic qualification kW/h m2 or not depending on the value on CSV //
            pos = 4;
            if (idea_flat[pos].includes("0")){
                idea_flat[pos] = 0;
            }
            else if (!isNaN(parseInt(idea_flat[pos]))){
                idea_flat[pos] = parseInt(idea_flat[pos]);
            }   

            // Assigning floor or not depending on the value on CSV //
            pos = 5;
            if (!isNaN(parseInt(idea_flat[pos]))){
                idea_flat[pos] = parseInt(idea_flat[pos]);
            }
            else if (idea_flat[pos].includes("null")){
                idea_flat[pos] = 0;
            }

            // Assigning itsNew or not depending on the value on CSV //
            pos = 7;
            if (idea_flat[pos].includes("Obra nueva")){
                idea_flat[pos] = 1;
            }
            else if (idea_flat[pos].includes("null") || idea_flat[pos].includes("Urge")){
                idea_flat[pos] = 0;
            }
            
            // Assigning m2 build or not depending on the value on CSV //
            pos = 8;
            if (!isNaN(parseInt(idea_flat[pos]))){
                idea_flat[pos] = parseInt(idea_flat[pos]);
            }
            else if (idea_flat[pos].includes("null")){
                idea_flat[pos] = 0;
            }

            // Assigning m2 useful or not depending on the value on CSV //
            pos = 9;
            if (!isNaN(parseInt(idea_flat[pos]))){
                idea_flat[pos] = parseInt(idea_flat[pos]);
            }
            else if (idea_flat[pos].includes("null")){
                idea_flat[pos] = 0;
            }

            // Assigning parking to garden or not depending on the value on CSV //
            pos = 11;
            if (idea_flat[pos].includes("1")){
                idea_flat[pos] = 1;
            }
            else if (idea_flat[pos].includes("null")){
                idea_flat[pos] = 0;
            }
            else if (count == 0){
                idea_flat[pos] = 'garden';
            }

            // Assigning price_down_euro depending on the value on CSV //
            pos = 12;
            if (!isNaN(parseInt(idea_flat[pos]))){
                idea_flat[pos] = idea_flat[pos].replace('.','');
                idea_flat[pos] = parseInt(idea_flat[pos]);
            }
            else if (idea_flat[pos].includes("null")){
                idea_flat[pos] = 0;
            }

            // Assigning price_down_percentage depending on the value on CSV //
            pos = 13;
            if (!isNaN(parseInt(idea_flat[pos]))){
                idea_flat[pos] = parseInt(idea_flat[pos]);
            }
            else if (idea_flat[pos].includes("null")){
                idea_flat[pos] = 0;
            }

            // Assigning price_euro depending on the value on CSV //
            pos = 14;
            if (!isNaN(parseInt(idea_flat[pos]))){
                idea_flat[pos] = idea_flat[pos].replace(/\./gi,'');
                idea_flat[pos] = parseInt(idea_flat[pos]);
            }
            else if (idea_flat[pos].includes("null")){
                idea_flat[pos] = 0;
            }

            // Assigning price_m2_euro depending on the value on CSV //
            pos = 15;
            if (!isNaN(parseInt(idea_flat[pos]))){
                idea_flat[pos] = idea_flat[pos].replace('€/m²','');
                idea_flat[pos] = idea_flat[pos].replace(/\./gi,'');
                idea_flat[pos] = parseInt(idea_flat[pos]);
            }
            else if (idea_flat[pos].includes("null")){
                idea_flat[pos] = 0;
            }

            // Assigning rooms depending on the value on CSV //
            pos = 18;
            if (!isNaN(parseInt(idea_flat[pos]))){
                idea_flat[pos] = parseInt(idea_flat[pos]);
            }
            else if (idea_flat[pos].includes("9 o más")){
                idea_flat[pos] = 9;
            }

            // Assigning status (0 = undefined, 1 = New, 2 = Second Hand but good, 3 = Second Hand but reform needed) depending on the valuo on CSV //
            pos = 19;
            if (idea_flat[pos].includes('obra nueva')){
                idea_flat[pos] = 1;
            }
            else if (idea_flat[pos].includes('buen estado')){
                idea_flat[pos] = 2;
            }
            else if (idea_flat[pos].includes('para reformar')){
                idea_flat[pos] = 3;
            }
            else if (idea_flat[pos].includes("null")){
                idea_flat[pos] = 0;
            }

            // Assigning terrace (1 = has terrace, 0 = does not have terrace) //
            pos = 20;
            if (idea_flat[pos].includes('1')){
                idea_flat[pos] = 1;
            }
            else if (idea_flat[pos].includes("null")){
                idea_flat[20] = 0;
            }

            if (count > 0){
                // Create new column called avg_neigh_euro_m2 using info from 2011_HABITATGES_2NA_MA.csv //
                let avg = await assign_avg_neigh_euro_m2(avg_euro_m2,idea_flat);
                idea_flat.push(avg);

                // Create new column called neigh_quality using info from 2011_HABIT_PPAL_SEGONS_ESTAT_CONSERV_EDIF2011.csv //
                let status = await assign_neigh_status(neigh_status,idea_flat);
                idea_flat.push(status);

                // Create new column called neigh_type using info from 2011_N_EDIF_HAB_SEGONS_N_IMMO2011.csv //
                let type = await assign_neigh_type(neigh_type,idea_flat);
                idea_flat.push(type);

                // Create new column called neigh_floors using info from 2011_N_EDIF_HAB_SEGONS_NOMBRE_PLANTES_SOBRE_RASANT2011.csv //
                let floors = await assign_neigh_floors(neigh_floors,idea_flat);
                idea_flat.push(floors);

                // Create new column called neigh_rent using info from 2011_HABIT_PPAL_SEGONS_REGIM_TIN2011.csv //
                let rent = await assign_neigh_rent(neigh_rent,idea_flat);
                idea_flat.push(rent);

                // Create new column called neigh_rooms using info from 2011_HABIT_PPAL_SEGONS_NOM_HABIT2011.csv //
                let rooms = await assign_neigh_rooms(neigh_rooms,idea_flat);
                idea_flat.push(rooms);

                // Create new column called m2 useful using info from 2011_habit_ppal_segons_sup_util2011.csv //
                let m2_useful = await assign_neigh_m2_useful(neigh_m2_useful,idea_flat);
                idea_flat[9] = m2_useful;

            }
            else{
                idea_flat.push('avg_neigh_euro_m2');
                idea_flat.push('neigh_quality');
                idea_flat.push('neigh_type');
                idea_flat.push('neigh_floors');
                idea_flat.push('neigh_rent');
                idea_flat.push('neigh_rooms');
                idea_flat[9] = 'neigh_m2_useful';
            }

            count += 1;

        }
        
        idealista = await idealista2json(idealista);
        await writeDataCSV(idealista);
    })
}

function assign_neigh_m2_useful(neigh_m2_useful,idea_flat){
    return new Promise(async function(resolve) {
        let posible_neighbourhoods = [];
        let idea_neighbourhood = idea_flat[10];

        posible_neighbourhoods = await neighbourhood_Search(idea_neighbourhood,neigh_m2_useful);

        let m2_useful = await neigh_m2_useful_prediction(neigh_m2_useful,posible_neighbourhoods);

        resolve(m2_useful);
    });
}

function assign_neigh_rooms(neigh_rooms,idea_flat){
    return new Promise(async function(resolve) {
        let posible_neighbourhoods = [];
        let idea_neighbourhood = idea_flat[10];

        posible_neighbourhoods = await neighbourhood_Search(idea_neighbourhood,neigh_rooms);

        let rooms = await neigh_rooms_prediction(neigh_rooms,posible_neighbourhoods);

        resolve(rooms);
    });
}

function assign_neigh_rent(neigh_rent,idea_flat){
    return new Promise(async function(resolve) {
        let posible_neighbourhoods = [];
        let idea_neighbourhood = idea_flat[10];

        posible_neighbourhoods = await neighbourhood_Search(idea_neighbourhood,neigh_rent);

        let rent = await neigh_rent_prediction(neigh_rent,posible_neighbourhoods);

        resolve(rent);
    });
}

function assign_neigh_floors(neigh_floors,idea_flat){
    return new Promise(async function(resolve) {
        let posible_neighbourhoods = [];
        let idea_neighbourhood = idea_flat[10];

        posible_neighbourhoods = await neighbourhood_Search(idea_neighbourhood,neigh_floors);

        let floors = await neigh_floors_prediction(neigh_floors,posible_neighbourhoods);

        resolve(floors);
    });
}

function assign_neigh_type(neigh_type,idea_flat){
    return new Promise(async function(resolve) {
        let posible_neighbourhoods = [];
        let idea_neighbourhood = idea_flat[10];

        posible_neighbourhoods = await neighbourhood_Search(idea_neighbourhood,neigh_type);

        let type = await neigh_type_prediction(neigh_type,posible_neighbourhoods);

        resolve(type);
    });
}

function assign_neigh_status(neigh_status,idea_flat){
    return new Promise(async function(resolve) {
        let posible_neighbourhoods = [];
        let idea_neighbourhood = idea_flat[10];

        posible_neighbourhoods = await neighbourhood_Search(idea_neighbourhood,neigh_status);

        let status = await neigh_status_prediction(neigh_status,posible_neighbourhoods);

        resolve(status);
    });
}

function assign_avg_neigh_euro_m2(avg_euro_m2,idea_flat){
    return new Promise(async function(resolve) {
        let posible_neighbourhoods = [];
        let idea_neighbourhood = idea_flat[10];

        posible_neighbourhoods = await neighbourhood_Search(idea_neighbourhood,avg_euro_m2);

        let avg = await avg_neigh_euro_m2_prediction(avg_euro_m2,posible_neighbourhoods);
        avg = parseInt(avg);

        if (isNaN(avg)){
            avg = 0;
        }

        resolve(avg);
    });
}

function assign_year(idea_flat, years){
    return new Promise(async function(resolve) {
        let posible_neighbourhoods = [];
        let year = 0;
        let idea_neighbourhood = idea_flat[10];

        posible_neighbourhoods = await neighbourhood_Search(idea_neighbourhood,years);

        year = await year_prediction(posible_neighbourhoods,years);
        
        resolve(year);
    });
}

function neighbourhood_Search(idea_neighbourhood,aux){
    return new Promise(async function(resolve) {
        let posible_neighbourhoods = [];

        let found = false;
        if (idea_neighbourhood == 'Nou Barris'){
            for (let i = 45; i <= 57; i++){
                posible_neighbourhoods.push(i);
            }
            found = true;
        }

        if (idea_neighbourhood == 'Ciutat Vella'){
            for (let i = 1; i <= 4; i++){
                posible_neighbourhoods.push(i);
            }
            found = true;
        }

        if (!found){
            let count = 0;
            let all_name = idea_neighbourhood.replace(/"/gi,'');
            for await(let aux_district of aux){
                let actual_district = aux_district[1];
                if (actual_district.includes(all_name)){
                    found = true;
                    posible_neighbourhoods= [count];
                }
                count += 1;
            }
        }
        if (!found){
            idea_neighbourhood = idea_neighbourhood.replace(/-/gi,' ').split(' ');
            if (idea_neighbourhood == 'null'){
                idea_neighbourhood = idea_flat[8].split(' ');
            }
            for await(let actual_neighbourhood of idea_neighbourhood){
                actual_neighbourhood = actual_neighbourhood.replace(/"/gi,'');
                if (found){
                    break;
                }
                if (actual_neighbourhood.length > 3){
                    for await(let aux_district of aux){
                        let actual_district = aux_district[1];
                        actual_neighbourhood = actual_neighbourhood.replace(/-/gi,' ');
                        if (actual_district.includes(actual_neighbourhood)){
                            let posible = actual_district.replace(/"/gi,'').split('.')[0];
                            if (!posible_neighbourhoods.includes(parseInt(posible))){
                                posible_neighbourhoods.push(parseInt(posible));
                            }
                            
                        }                 
                    }
                } 
            }
        }
        resolve(posible_neighbourhoods);
    });
}

function neigh_m2_useful_prediction(neigh_m2_useful,posible_neighbourhoods){
    return new Promise(async function(resolve) {
        let m2_useful = 0;

        let definitive_neighbourhood = await prediction(posible_neighbourhoods,neigh_m2_useful);

        m2_useful = await medianCalculatorM2Useful(definitive_neighbourhood);
        
        resolve(m2_useful);
    });
}

function neigh_rooms_prediction(neigh_rooms,posible_neighbourhoods){
    return new Promise(async function(resolve) {
        let rooms = 0;

        let definitive_neighbourhood = await prediction(posible_neighbourhoods,neigh_rooms);

        rooms = await medianCalculatorRooms(definitive_neighbourhood);
        
        resolve(rooms);
    });
}

function neigh_rent_prediction(neigh_rent,posible_neighbourhoods){
    return new Promise(async function(resolve) {
        let rent = 0;

        let definitive_neighbourhood = await prediction(posible_neighbourhoods,neigh_rent);

        rent = await rentCalculator(definitive_neighbourhood);
        
        resolve(rent);
    });
}

function neigh_floors_prediction(neigh_floors,posible_neighbourhoods){
    return new Promise(async function(resolve) {
        let floors = 0;

        let definitive_neighbourhood = await prediction(posible_neighbourhoods,neigh_floors);

        floors = await medianCalculatorFloors(definitive_neighbourhood);
        
        resolve(floors);
    });
}

function neigh_type_prediction(neigh_type,posible_neighbourhoods){
    return new Promise(async function(resolve) {
        let type = 0;

        let definitive_neighbourhood = await prediction(posible_neighbourhoods,neigh_type);

        type = await medianCalculatorType(definitive_neighbourhood);
        
        resolve(type);
    });
}

function neigh_status_prediction(neigh_status,posible_neighbourhoods){
    return new Promise(async function(resolve) {
        let status = 0;

        let definitive_neighbourhood = await prediction(posible_neighbourhoods,neigh_status);

        status = await statusCalculator(definitive_neighbourhood);
        
        resolve(status);
    });
}

function avg_neigh_euro_m2_prediction(avg_euro_m2,posible_neighbourhoods){
    return new Promise(async function(resolve) {
        let avg_m2;

        let definitive_neighbourhood = await prediction(posible_neighbourhoods,avg_euro_m2);
        
        avg_m2 = definitive_neighbourhood[2];

        resolve(avg_m2);
    });
}

async function year_prediction(posible_neighbourhoods,years){
    return new Promise(async function(resolve) {
        let year = 0;

        let definitive_neighbourhood = await prediction(posible_neighbourhoods,years);
                
        year = await medianCalculatorYear(definitive_neighbourhood);
        
        resolve(year);
    }); 
}

function prediction(posible_neighbourhoods,aux){
    return new Promise(async function(resolve) {

        let posible_totals = []
        let total = 0;
        let count = 0;

        for await(let posible_year of posible_neighbourhoods){
            let actual_year = aux[posible_year];
            let actual_total;
            for (let i = 2; i < actual_year.length; i++){
                if (!isNaN(actual_year[i])){
                    actual_total = parseInt(actual_year[i].replace(/\./,''));
                    break;
                }
            }
            if (!isNaN(actual_total)){
                total += actual_total;
                posible_totals.push(actual_total);
            }
            count += 1;
        }

        count = 0;
        for await (let posible_total of posible_totals){
            if (count > 0){
                posible_totals[count] = posible_totals[count-1] + (posible_total/total);
            }
            else{
                posible_totals[count] = (posible_total/total);
            }
            count += 1;
        }
        
        let random_prob = randomFloat(1);
        count = 0;
        let definitive_neighbourhood = [];
        for await (let posible_total of posible_totals){
            if (random_prob <= posible_total){
                definitive_neighbourhood = aux[posible_neighbourhoods[count]];
                break;
            }
            count += 1;
        }

        resolve(definitive_neighbourhood);
    });
}

function medianCalculatorYear(definitive_neighbourhood){
    return new Promise(async function(resolve) {
        let year = 0;
        let median = parseInt(definitive_neighbourhood[2].replace(/\./gi,''))/2;
        let neighbourhood = definitive_neighbourhood.slice(3);

        let acumulative = 0;
        for (let year_kop in neighbourhood){
            let actual_year_Qty = parseInt(neighbourhood[year_kop].replace(/\./gi,''));
            if (!isNaN(actual_year_Qty)){
                acumulative += actual_year_Qty;
            }  
            if (acumulative >= median){
                switch(parseInt(year_kop)){
                    case(0):
                        year = 1900;
                        break;
                    case(1):
                        year = 1910;
                        break;
                    case(2):
                        year = 1930;
                        break;
                    case(3):
                        year = 1945;
                        break;
                    case(4):
                        year = 1955;
                        break;
                    case(5):
                        year = 1965;
                        break;
                    case(6):
                        year = 1975;
                        break;
                    case(7):
                        year = 1985;
                        break;
                    case(8):
                        year = 1995;
                        break;
                    case(9):
                        year = 2005;
                        break;
                }
                break;
            }
        }
        resolve(year);
    });
}

function statusCalculator(definitive_neighbourhood){
    return new Promise(async function(resolve) {
        let total_status = parseInt(definitive_neighbourhood[2].replace(/\./gi,''));
        let good_quality = parseInt(definitive_neighbourhood[6].replace(/\./gi,''));
        
        let bad_quality = 1-(good_quality/total_status);
        resolve(bad_quality);
    });
}

function medianCalculatorType(definitive_neighbourhood){
    return new Promise(async function(resolve) {
        let type = 0;
        let median = parseInt(definitive_neighbourhood[2].replace(/\./gi,''))/2;
        let neighbourhood = definitive_neighbourhood.slice(3);

        let acumulative = 0;
        for (let type_kop in neighbourhood){
            let actual_type_Qty = parseInt(neighbourhood[type_kop]);
            if (!isNaN(actual_type_Qty)){
                acumulative += actual_type_Qty;
            }  
            if (acumulative >= median){
                switch(parseInt(type_kop)){
                    case(0):
                        type = 1;
                        break;
                    case(1):
                        type = 2;
                        break;
                    case(2):
                        type = 3;
                        break;
                    case(3):
                        type = 4;
                        break;
                    case(4):
                        type = 7;
                        break;
                    case(5):
                        type = 15;
                        break;
                    case(6):
                        type = 25;
                        break;
                    case(7):
                        type = 35;
                        break;
                    case(8):
                        type = 40;
                        break;
                }
                break;
            }
        }
        resolve(type);
    });
}

function medianCalculatorFloors(definitive_neighbourhood){
    return new Promise(async function(resolve) {
        let floors = 0;
        let median = parseInt(definitive_neighbourhood[2].replace(/\./gi,''))/2;
        let neighbourhood = definitive_neighbourhood.slice(3);

        let acumulative = 0;
        for (let floors_kop in neighbourhood){
            let actual_floors_Qty = parseInt(neighbourhood[floors_kop]);
            if (!isNaN(actual_floors_Qty)){
                acumulative += actual_floors_Qty;
            }  
            if (acumulative >= median){
                switch(parseInt(floors_kop)){
                    case(0):
                        floors = 1;
                        break;
                    case(1):
                        floors = 2;
                        break;
                    case(2):
                        floors = 3;
                        break;
                    case(3):
                        floors = 4;
                        break;
                    case(4):
                        floors = 5;
                        break;
                    case(5):
                        floors = 6;
                        break;
                    case(6):
                        floors = 7;
                        break;
                    case(7):
                        floors = 8;
                        break;
                    case(8):
                        floors = 9;
                        break;
                    case(9):
                        floors = 10;
                        break;
                }
                break;
            }
        }
        resolve(floors);
    });
}

function rentCalculator(definitive_neighbourhood){
    return new Promise(async function(resolve) {
        let total_rent = parseInt(definitive_neighbourhood[2].replace(/\./gi,''));
        let rent = parseInt(definitive_neighbourhood[6].replace(/\./gi,''));
        
        let rented = rent/total_rent;

        if (isNaN(rented)){
            rented = 0;
        }
        resolve(rented);
    });
}

function medianCalculatorRooms(definitive_neighbourhood){
    return new Promise(async function(resolve) {
        let rooms = 0;
        let median = parseInt(definitive_neighbourhood[2].replace(/\./gi,''))/2;
        let neighbourhood = definitive_neighbourhood.slice(3);

        let acumulative = 0;
        for (let rooms_kop in neighbourhood){
            let actual_rooms_Qty = parseInt(neighbourhood[rooms_kop].replace(/\./gi,''));
            if (!isNaN(actual_rooms_Qty)){
                acumulative += actual_rooms_Qty;
            }  
            if (acumulative >= median){
                switch(parseInt(rooms_kop)){
                    case(0):
                        rooms = 1;
                        break;
                    case(1):
                        rooms = 2;
                        break;
                    case(2):
                        rooms = 3;
                        break;
                    case(3):
                        rooms = 4;
                        break;
                    case(4):
                        rooms = 5;
                        break;
                    case(5):
                        rooms = 6;
                        break;
                    case(6):
                        rooms = 7;
                        break;
                    case(7):
                        rooms = 8;
                        break;
                    case(8):
                        rooms = 9;
                        break;
                }
                break;
            }
        }
        resolve(rooms);
    });
}

function medianCalculatorM2Useful(definitive_neighbourhood){
    return new Promise(async function(resolve) {
        let m2_useful = 0;
        let median = parseInt(definitive_neighbourhood[2].replace(/\./gi,''))/2;
        let neighbourhood = definitive_neighbourhood.slice(3);

        let acumulative = 0;
        for (let m2_useful_kop in neighbourhood){
            let actual_m2_useful_Qty = parseInt(neighbourhood[m2_useful_kop].replace(/\./gi,''));
            if (!isNaN(actual_m2_useful_Qty)){
                acumulative += actual_m2_useful_Qty;
            }  
            if (acumulative >= median){
                switch(parseInt(m2_useful_kop)){
                    case(0):
                        m2_useful = 30;
                        break;
                    case(1):
                        m2_useful = 45;
                        break;
                    case(2):
                        m2_useful = 75;
                        break;
                    case(3):
                        m2_useful = 105;
                        break;
                    case(4):
                        m2_useful = 135;
                        break;
                    case(4):
                        m2_useful = 150;
                        break;
                }
                break;
            }
        }
        resolve(m2_useful);
    });
}

async function idealista2json(idealista){
    return new Promise(async function(resolve) {
        let idealista_json = [];
        
        let count = 0;
        for await (let actual_idealista of idealista){
            if (count > 1){
                let flat = {
                    bathrooms: actual_idealista[0],
                    constructed_year: actual_idealista[1],
                    description: actual_idealista[2],
                    elevator: actual_idealista[3],
                    energetic_qualification_kWhm2_year: actual_idealista[4],
                    floor: actual_idealista[5],
                    heater_system: actual_idealista[6],
                    its_new: actual_idealista[7],
                    m2_build: actual_idealista[8],
                    neigh_m2_useful: actual_idealista[9],
                    neighbourhood: actual_idealista[10],
                    garden: actual_idealista[11],
                    price_down_euro: actual_idealista[12],
                    price_down_percentage: actual_idealista[13],
                    price_euro: actual_idealista[14],
                    price_m2: actual_idealista[15],
                    real_estate: actual_idealista[16],
                    ref: actual_idealista[17],
                    rooms: actual_idealista[18],
                    status: actual_idealista[19],
                    terrace: actual_idealista[20],
                    title: actual_idealista[21],
                    link: actual_idealista[22],
                    avg_neigh_euro_m2: actual_idealista[23],
                    neigh_quality: actual_idealista[24],
                    neigh_type: actual_idealista[25],
                    neigh_floors: actual_idealista[26],
                    neigh_rent: actual_idealista[27],
                    neigh_rooms: actual_idealista[28]
                }
                idealista_json.push(flat);
            }
            count += 1;
        }

        resolve(idealista_json);
    });
    
}

async function writeDataCSV(idealista_registros){
    return new Promise(resolve => {
        
      converter.json2csv(idealista_registros, (err, csv_string) => {
        if (err) {
            throw err;
        }
        fs.writeFileSync(dir_csv, csv_string);
      });
      resolve(true);
    })
  }

main();