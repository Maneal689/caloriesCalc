import $ from 'jquery';
import aliments from './calorie.js';
import style from './style.css';

function getSelectedAlims() {
    let search = $('#recherche').val();
    let resObj = {};
    for (let category in aliments) {
        resObj[category] = {};
        for (let alim in aliments[category]) {
            if (alim.toUpperCase().includes(search.toUpperCase()))
                resObj[category][alim] = aliments[category][alim];
        }
    }
    return resObj;
}

function displayListObj(obj, node) {
    let result = $('<ul></ul>');
    for (let categorie in obj) {
        let currentCategory = $('<li></li>').text(categorie);
        let currentList = $('<ul></ul>');
        for (let alim in obj[categorie]) {
            let currentLine = $('<li class="ligne-aliment"></li>');

            currentLine.append($('<span class="alim-name"></span>').text(alim));
            currentLine.append(
                $('<span class="value"></span>').text(obj[categorie][alim])
            );

            currentList.append(currentLine);
        }
        currentCategory.append(currentList);
        result.append(currentCategory);
    }
    node.append(result);
}

function updateOutput() {
    let selectedObj = getSelectedAlims();
    $('#output').empty();
    displayListObj(selectedObj, $('#output'));
}

function delElem(selectedObj, elem) {
    selectedObj[elem]['count']--;
    if (selectedObj[elem]['count'] <= 0)
        delete selectedObj[elem];
}

function displaySelectedObj(obj, node) {
    node.empty();
    let res = $('<ul></ul>');
    let totalCal = 0;
    for (let alim in obj) {
        let line = $('<li class=".ligne-aliment"></li>');
        let button = $('<button>-</button>');
        button.click(function() {
            delElem(obj, alim);
            displaySelectedObj(obj, node);
        });

        line.append($('<span></span>').text(obj[alim]['count'] + 'x'));
        line.append($('<span></span>').text(alim));
        line.append($('<span></span>').text(obj[alim]['value']));
        totalCal += obj[alim]['value'] * obj[alim]['count'];

        line.append(button);
        res.append(line);
    }
    node.append(res);
    $('#total').text(totalCal);
}

$(document).ready(() => {
    let selectedObj = {};
    updateOutput();
    $('#recherche').on('keyup', updateOutput);
    $('.ligne-aliment').on('click', function() {
        let alim = $(this)
            .children('.alim-name')
            .text();
        if (!(alim in selectedObj))
            selectedObj[alim] = {
                value: parseInt(
                    $(this)
                        .children('.value')
                        .text()
                ),
                count: 1,
            };
        else selectedObj[alim]['count']++;
        displaySelectedObj(selectedObj, $('#liste-ajout'));
    });
});
