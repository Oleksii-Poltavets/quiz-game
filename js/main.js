'use strict';

const 
    buttonPlay = document.querySelector('.start__button'),
    startTitle = document.querySelector('.start__title'),
    startScore = document.querySelector('.start__score'),
    endScoreModal = document.querySelector('.modal-end-score'),
    inner = document.querySelector('#inner'),
    burger = document.querySelector('.burger'),
    play = document.querySelector('.play'),
    playMenu = document.querySelector('.play__menu');

const
    modal = document.querySelector('.modal'),
    modalShure = document.querySelector('.modal-shure'),
    modalScore = document.querySelector('.modal-end-score');

const
    question = document.querySelector('.question__inner'),
    variantsOfUnsvers = document.querySelectorAll('.variant'),
    boxOfVariants = document.querySelector('.variants');

const
    lifeFull = document.querySelectorAll('.life__full'),
    lifeEmpty = document.querySelectorAll('.life__empty');

const
    inGamePoints = document.querySelector('#in-game-points'),
    afterGamePoints = document.querySelector('#after-game-points'),
    highiestScore = document.querySelector('#highiest-score');


const localState = {
    points: 0,
    rn: 0,
    prn: 0,
    lives: 2,
}

//*************start the game**************//

//set hiest score if played
if(localStorage.getItem('score')) {
    highiestScore.innerHTML = localStorage.getItem('score');
}

document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('reloaded') === 'true') {
        startTheGame();
        gameInProcess ();
        localStorage.removeItem('reloaded');
    }
});

buttonPlay.addEventListener('click', ()=> {
    startTheGame();
    gameInProcess();
});

function startTheGame() {
    startTitle.classList.add('animate__animated', 'animate__backOutUp');
    startScore.classList.add('animate__animated', 'animate__backOutUp');
    buttonPlay.classList.add('animate__animated', 'animate__fadeOut');
    inner.classList.add('big');
    setTimeout(() => {
        startTitle.classList.add('d-none');
        startScore.classList.add('d-none');
        buttonPlay.classList.add('d-none');
        play.classList.add('animate__animated', 'animate__fadeIn', 'active');
    }, 1000);
    //set state to start
    localState.points = 0;
    localState.rn = 0;
    localState.prn = 0;
    localState.lives = 2;
    inGamePoints.innerHTML = '000';
}

// window.onbeforeunload = function(e) {
//     var dialogText = 'Dialog text here';
//     e.returnValue = dialogText;
//     return dialogText;
// };

//*************open the menu**************//

//opening menu on burger click
burger.addEventListener('click', () => {
    burger.classList.toggle('burger-active');
    playMenu.classList.toggle('play__menu-active');
});

//opening modal are you shure and do reset or quit

playMenu.addEventListener('click', (e) => {
    const target = e.target;
    if (target.getAttribute('data-type') === 'restart') {
        modal.classList.add('active');
        modalShure.classList.add('active');
        modalShure.addEventListener('click', (e) => {
            if (e.target.getAttribute('data-type') === 'yes') {
                localStorage.setItem('reloaded', 'true');
                location.reload();
                // endTheGame();
                // startTheGame();
                // gameInProcess();
            } else if (e.target.getAttribute('data-type') === 'cancel') {
                modal.classList.remove('active');
                modalShure.classList.remove('active');
            }
        });
    } else if (target.getAttribute('data-type') === 'quit') {
        modal.classList.add('active');
        modalShure.classList.add('active');
        modalShure.addEventListener('click', (e) => {
            if (e.target.getAttribute('data-type') === 'yes') {
                endTheGame();
            } else if (e.target.getAttribute('data-type') === 'cancel') {
                modal.classList.remove('active');
                modalShure.classList.remove('active');
            }
        });
    } else if (target.getAttribute('data-type') === 'back') {
        burger.classList.remove('burger-active');
        playMenu.classList.remove('play__menu-active');
    }
});

//get random number
let getRandomNumber = max => Math.floor(Math.random() * max);

function gameInProcess () {

    const inGameQuestions = questions.map(question => question);

    showNewQuestion();

    boxOfVariants.addEventListener('click', (e) => {
        if (!e.target.getAttribute('disabled') && e.target != boxOfVariants) {
            variantsOfUnsvers.forEach(variant => variant.setAttribute('disabled', 'true'));
            let rn = getRandomNumber((inGameQuestions.length - 1));
            localState.rn = rn;
            checkIsAnsverRight(e);
            setTimeout(resetVariants, 1200);
            setTimeout(showNewQuestion, 1500);
        }
        setTimeout(()=> {
            variantsOfUnsvers.forEach(variant => variant.removeAttribute('disabled'));
        }, 1500)
    });

    //game in a proces
    function showNewQuestion () {
        if (inGameQuestions.length <= 0 || localState.lives === -1) {
            modal.classList.add('active');
            endScoreModal.classList.add('active');
            afterGamePoints.innerHTML = localState.points;
            if (localStorage.getItem('score') < localState.points) {
                localStorage.setItem('score', localState.points);
            }
            return;
        }
        let rn = localState.rn;
        for(let i = 0; i < variantsOfUnsvers.length; i++) {
            variantsOfUnsvers[i].innerHTML = inGameQuestions[rn].variants[i];
        }
        question.innerHTML = inGameQuestions[rn].question;
    }

    //reset variants
    function resetVariants () {
        variantsOfUnsvers.forEach(variant => {
            variant.classList.remove('right', 'wrong', 'animate__animated', 'animate__pulse', 'wasRight');
        })
    }

    //deside if the variant right add points and get another question
    function checkIsAnsverRight (e) {
        let prn = localState.prn;
        let target = e.target;
        if(target.innerHTML === inGameQuestions[prn].unsver && inGameQuestions.length > 0) {
            target.classList.add('right', 'animate__animated', 'animate__pulse');
            localState.points += 100;
            setTimeout(() => inGamePoints.innerHTML = localState.points, 600);
            //animate add life
            if(localState.lives < 2) {
                localState.lives++;
                lifeEmpty[localState.lives].classList.remove('active');
                lifeFull[localState.lives].classList.add('active');
                setTimeout(() => lifeFull[localState.lives].classList.add('animate__animated', 'animate__pulse'), 300)
                setTimeout(() => lifeFull[localState.lives].classList.remove('animate__animated', 'animate__pulse'), 1100);
            }
            //animate add points
            setTimeout(() => inGamePoints.classList.add('animate__animated', 'animate__pulse'), 700)
            setTimeout(() => inGamePoints.classList.remove('animate__animated', 'animate__pulse'), 1300);
        } else {
            target.classList.add('wrong', 'animate__animated', 'animate__pulse');
            lifeFull[localState.lives].classList.remove('active');
            lifeEmpty[localState.lives].classList.add('active');
            localState.lives--;
            variantsOfUnsvers.forEach(variant => {
                variant.innerHTML == inGameQuestions[prn].unsver && variant.classList.add('wasRight')
            })
        }
        inGameQuestions.splice(prn, 1);
        localState.prn = localState.rn;
    }
}

function endTheGame() {
    startTitle.classList.remove('animate__animated', 'animate__backOutUp');
    startScore.classList.remove('animate__animated', 'animate__backOutUp');
    buttonPlay.classList.remove('animate__animated', 'animate__fadeOut');
    inner.classList.remove('big');
    startTitle.classList.remove('d-none');
    startScore.classList.remove('d-none');
    buttonPlay.classList.remove('d-none');
    play.classList.remove('animate__animated', 'animate__fadeIn', 'active');
    modal.classList.remove('active');
    endScoreModal.classList.remove('active');
    modal.classList.remove('active');
    modalShure.classList.remove('active');
    burger.classList.remove('burger-active');
    playMenu.classList.remove('play__menu-active');
}

//quiz questions
const questions = [
    {
        question: 'What is the capital of Ukraine?',
        unsver: 'Kiev',
        variants: [
            'Kharkiv',
            'London',
            'Lviv',
            'Kiev'
        ]
    },
    {
        question: 'What is the capital of France?',
        unsver: 'Paris',
        variants: [
            'Paris',
            'London',
            'Dijon',
            'Kiev'
        ]
    },
    {
        question: 'What is the capital of Great Britain?',
        unsver: 'London',
        variants: [
            'Kharkiv',
            'London',
            'Lviv',
            'Grasgo'
        ]
    },
    {
        question: 'What is the capital of South Africa?',
        unsver: 'Pretoria, Bloemfontein, and Cape Town',
        variants: [
            'Boston',
            'Morocco',
            'Mexico',
            'Pretoria, Bloemfontein, and Cape Town'
        ]
    },
    {
        question: 'What is the capital of The Bahamas?',
        unsver: 'Nassau',
        variants: [
            'Bairiki, Ambo, and Betio',
            'Cairo',
            'Nassau',
            'Copenhagen'
        ]
    },
    {
        question: 'What is the capital of Bulgaria?',
        unsver: 'Sofia',
        variants: [
            'Sofia',
            'Reykjavik',
            'Washington, D.C.',
            'London'
        ]
    },
    {
        question: 'What is the capital of Moldova?',
        unsver: 'Chișinău',
        variants: [
            'Bairiki, Ambo, and Betio',
            'Chișinău',
            `Saint George''s`,
            'Amsterdam'
        ]
    },
    {
        question: 'What is the capital of Haiti?',
        unsver: 'Port-au-Prince',
        variants: [
            'Lima',
            'Havana',
            'Wellington',
            'Port-au-Prince'
        ]
    },
    {
        question: 'What is the capital of Marshall Islands?',
        unsver: 'Majuro',
        variants: [
            'Reykjavik',
            'Banjul',
            'Majuro',
            'Male'
        ]
    },
    {
        question: 'What is the capital of Rwanda?',
        unsver: 'Kigali',
        variants: [
            'Bujumbura',
            'Kigali',
            'Port of Spain',
            'Sarajevo'
        ]
    },
    {
        question: 'What is the capital of Kyrgyzstan?',
        unsver: 'Bishkek',
        variants: [
            'Tbilisi',
            'Kiev',
            'Funafuti',
            'Bishkek'
        ]
    },
    {
        question: 'What is the capital of Sri Lanka?',
        unsver: 'Colombo and Sri Jayewardenepura Kotte',
        variants: [
            'Pretoria, Bloemfontein, and Cape Town',
            'Quito',
            'Porto-Novo',
            'Colombo and Sri Jayewardenepura Kotte'
        ]
    },
    {
        question: 'What is the capital of Bolivia?',
        unsver: 'La Paz (administrative); Sucre (constitutional)',
        variants: [
            'Nairobi',
            'La Paz (administrative); Sucre (constitutional)',
            'Luanda',
            'Mogadishu'
        ]
    },
    {
        question: 'What is the capital of Philippines?',
        unsver: 'Manila',
        variants: [
            'Wellington',
            'Lusaka',
            'Manila',
            'Rabat'
        ]
    },
    {
        question: 'What is the capital of Guinea?',
        unsver: 'Conakry',
        variants: [
            'Pretoria, Bloemfontein, and Cape Town',
            'Nouakchott',
            'Kuwait',
            'Conakry'
        ]
    },
    {
        question: 'What is the capital of Zambia?',
        unsver: 'Lusaka',
        variants: [
            'Beijing',
            'Pristina',
            'Lusaka',
            'Damascus'
        ]
    },
    {
        question: 'What is the capital of Slovakia?',
        unsver: 'Bratislava',
        variants: [
            'Kyiv',
            'Bratislava',
            'Singapore',
            'Athens'
        ]
    },
    {
        question: 'What is the capital of Fiji?',
        unsver: 'Suva',
        variants: [
            'Warsaw',
            'Jakarta',
            'Suva',
            'Lima'
        ]
    },
    {
        question: 'What is the capital of Saint Vincent and the Grenadines?',
        unsver: 'Kingstown',
        variants: [
            'Chișinău',
            'Kingstown',
            'Rabat',
            'Kathmandu'
        ]
    },
    {
        question: 'What is the capital of Colombia?',
        unsver: 'Bogotá',
        variants: [
            'Tehrān',
            'Bogotá',
            'Brasília',
            'Kingston'
        ]
    },
    {
        question: 'What is the capital of El Salvador?',
        unsver: 'San Salvador',
        variants: [
            'San Salvador',
            'London',
            'Malabo',
            'Brazzaville'
        ]
    },
    {
        question: 'What is the capital of Liberia?',
        unsver: 'Monrovia',
        variants: [
            'Majuro',
            'Bangui',
            'Port-au-Prince',
            'Monrovia'
        ]
    },
    {
        question: 'What is the capital of Israel?',
        unsver: 'Jerusalem (proclaimed)',
        variants: [
            'Manila',
            'Tunis',
            'Kingstown',
            'Jerusalem (proclaimed)'
        ]
    },
    {
        question: 'What is the capital of Lesotho?',
        unsver: 'Maseru',
        variants: [
            'Yaren district',
            'Dublin',
            'Maseru',
            'Bujumbura'
        ]
    },
    {
        question: 'What is the capital of Spain?',
        unsver: 'Madrid',
        variants: [
            'Bucharest',
            'San Marino',
            'Madrid',
            'Dushanbe'
        ]
    },
    {
        question: 'What is the capital of Chile?',
        unsver: 'Santiago',
        variants: [
            'Dili',
            'Santiago',
            'Porto-Novo',
            'Yerevan'
        ]
    },
    {
        question: 'What is the capital of The Gambia?',
        unsver: 'Banjul',
        variants: [
            'Colombo',
            'Banjul',
            'Panama City',
            'Nassau'
        ]
    },
    {
        question: 'What is the capital of Tajikistan?',
        unsver: 'Dushanbe',
        variants: [
            'Vaduz',
            'Bamako',
            'Djibouti',
            'Dushanbe'
        ]
    },
    {
        question: 'What is the capital of Gabon?',
        unsver: 'Libreville',
        variants: [
            'Budapest',
            'Libreville',
            'Abu Dhabi',
            'Lisbon'
        ]
    },
    {
        question: 'What is the capital of Micronesia?',
        unsver: 'Palikir',
        variants: [
            `BostN''Djamenaon`,
            'Asunción',
            'Yamoussoukro',
            'Palikir'
        ]
    },
    {
        question: 'What is the capital of Bosnia and Herzegovina?',
        unsver: 'Sarajevo',
        variants: [
            'Sarajevo',
            'Santiago',
            'Bogotá',
            'Taipei'
        ]
    },
    {
        question: 'What is the capital of Central African Republic?',
        unsver: 'Bangui',
        variants: [
            'Warsaw',
            'Bangui',
            'Harare',
            'Victoria'
        ]
    },
    {
        question: 'What is the capital of Mali?',
        unsver: 'Bamako',
        variants: [
            'Bamako',
            'Doha',
            'Gaborone',
            'Kampala'
        ]
    },
    {
        question: 'What is the capital of Malawi?',
        unsver: 'Lilongwe',
        variants: [
            'Nukuʿalofa',
            'Abuja',
            'Freetown',
            'Lilongwe'
        ]
    },
    {
        question: 'What is the capital of Argentina?',
        unsver: 'Buenos Aires',
        variants: [
            'Monrovia',
            'Budapest',
            'Maseru',
            'Buenos Aires'
        ]
    },
    {
        question: 'What is the capital of Kuwait?',
        unsver: 'Kuwait',
        variants: [
            'Oslo',
            'Kuwait',
            'Amsterdam',
            'Nicosia'
        ]
    },
    {
        question: 'What is the capital of Iraq?',
        unsver: 'Baghdad',
        variants: [
            'Baku',
            'Basseterre',
            'Guatemala City',
            'Baghdad'
        ]
    },
    {
        question: 'What is the capital of Côte d’Ivoire?',
        unsver: 'Yamoussoukro',
        variants: [
            'Brussels',
            'Kingstown',
            'Dublin',
            'Yamoussoukro'
        ]
    },
    {
        question: 'What is the capital of Kazakhstan?',
        unsver: 'Astana',
        variants: [
            'Baku',
            'Astana',
            'Beirut',
            'Maputo'
        ]
    },
    {
        question: 'What is the capital of Croatia?',
        unsver: 'Zagreb',
        variants: [
            'Accra',
            'Zagreb',
            'Damascus',
            'Juba'
        ]
    },
    {
        question: 'What is the capital of Luxembourg?',
        unsver: 'Luxembourg',
        variants: [
            'Sofia',
            'Ottawa',
            'Luanda',
            'Luxembourg'
        ]
    },
    {
        question: 'What is the capital of Montenegro?',
        unsver: 'Podgorica',
        variants: [
            'Gaborone',
            'Podgorica',
            'Vaduz',
            'Dushanbe'
        ]
    },
    {
        question: 'What is the capital of North Macedonia?',
        unsver: 'Skopje',
        variants: [
            'Lomé',
            'Skopje',
            'Kingston',
            'Santiago'
        ]
    },
    {
        question: 'What is the capital of Honduras?',
        unsver: 'Tegucigalpa',
        variants: [
            'Windhoek',
            'Tegucigalpa',
            'Santo Domingo',
            'Asunción'
        ]
    },
    {
        question: 'What is the capital of Equatorial Guinea?',
        unsver: 'Malabo',
        variants: [
            'Bridgetown',
            'Castries',
            'Andorra la Vella',
            'Malabo'
        ]
    },
    {
        question: 'What is the capital of Bhutan?',
        unsver: 'Thimphu',
        variants: [
            'Yamoussoukro',
            'Kinshasha',
            'Georgetown',
            'Thimphu'
        ]
    },
    {
        question: 'What is the capital of Lebanon?',
        unsver: 'Beirut',
        variants: [
            'Islamabad',
            'Ulaanbaatar (Ulan Bator)',
            'Phnom Penh',
            'Beirut'
        ]
    },
    {
        question: 'What is the capital of Bangladesh?',
        unsver: 'Dhaka',
        variants: [
            'Apia',
            'Dhaka',
            'Male',
            'Ouagadougou'
        ]
    },
    {
        question: 'What is the capital of Belarus?',
        unsver: 'Minsk',
        variants: [
            'Dili',
            'Belmopan',
            'Doha',
            'Minsk'
        ]
    },
    {
        question: 'What is the capital of Senegal?',
        unsver: 'Dakar',
        variants: [
            'Dakar',
            'Vienna',
            'Lomé',
            'Kinshasha'
        ]
    },
    {
        question: 'What is the capital of South Sudan?',
        unsver: 'Juba',
        variants: [
            'Belgrade',
            'Juba',
            'Mbabane (administrative and judicial); Lobamba (legislative)',
            'Tokyo'
        ]
    },
    {
        question: 'What is the capital of Morocco?',
        unsver: 'Rabat',
        variants: [
            'Lilongwe',
            'Ulaanbaatar (Ulan Bator)',
            'Rabat',
            'Berlin'
        ]
    },
    {
        question: 'What is the capital of Myanmar (Burma)?',
        unsver: 'Nay Pyi Taw',
        variants: [
            'Bogotá',
            'Minsk',
            'Roseau',
            'Nay Pyi Taw'
        ]
    },
    {
        question: 'What is the capital of Democratic Republic of the Congo?',
        unsver: 'DinKinshashao',
        variants: [
            'Conakry',
            'Belgrade',
            'Bujumbura',
            'Kinshasha'
        ]
    },
    {
        question: 'What is the capital of Monaco?',
        unsver: 'Monaco',
        variants: [
            'Panama City',
            'Managua',
            'Sofia',
            'Monaco'
        ]
    },
    {
        question: 'What is the capital of Saint Lucia?',
        unsver: 'Castries',
        variants: [
            'Ngerulmud capitol complex in Melekeok on Babelthuap',
            'Moscow',
            'Seoul',
            'Castries'
        ]
    },
    {
        question: 'What is the capital of San Marino?',
        unsver: 'San Marino',
        variants: [
            'Stockholm',
            'Bucharest',
            'San Marino',
            'Dodoma (designated); Dar es Salaam (acting)'
        ]
    },
    {
        question: 'What is the capital of Panama?',
        unsver: 'Panama City',
        variants: [
            'Santo Domingo',
            'La Paz (administrative); Sucre (constitutional)',
            'Panama City',
            `P''yŏngyang`
        ]
    },
    {
        question: 'What is the capital of Guyana?',
        unsver: 'Georgetown',
        variants: [
            'Kigali',
            'Port-Vila',
            'Georgetown',
            'Podgorica'
        ]
    },
    {
        question: 'What is the capital of Australia?',
        unsver: 'Canberra',
        variants: [
            'Boston',
            'Canberra',
            'Guatemala City',
            'Majuro'
        ]
    },
    {
        question: 'What is the capital of Belize?',
        unsver: 'Belmopan',
        variants: [
            'Vaduz',
            'Libreville',
            'Dublin',
            'Belmopan'
        ]
    },
    {
        question: 'What is the capital of Cabo Verde (Cape Verde)?',
        unsver: 'Praia',
        variants: [
            'Riga',
            'Quito',
            'Bridgetown',
            'Praia'
        ]
    },
    {
        question: 'What is the capital of Venezuela?',
        unsver: 'Caracas',
        variants: [
            'Tegucigalpa',
            'Caracas',
            'Vientiane',
            'Vienna'
        ]
    },
    {
        question: 'What is the capital of Germany?',
        unsver: 'Berlin',
        variants: [
            'Port-au-Prince',
            'Yaren district',
            'Berlin',
            'Athens'
        ]
    },
    {
        question: 'What is the capital of Qatar?',
        unsver: 'Doha',
        variants: [
            'Baghdad',
            'Conakry',
            'Doha',
            'Montevideo'
        ]
    },
    {
        question: 'What is the capital of Solomon Islands?',
        unsver: 'Honiara',
        variants: [
            'Honiara',
            'Bamako',
            'Bangkok',
            'Brussels'
        ]
    },
    {
        question: 'What is the capital of Somalia?',
        unsver: 'Mogadishu',
        variants: [
            'Stockholm',
            'Port Louis',
            'Mogadishu',
            'Dodoma (designated); Dar es Salaam (acting)'
        ]
    },
    {
        question: 'What is the capital of Tonga?',
        unsver: 'Nukuʿalofa',
        variants: [
            'Skopje',
            'Dushanbe',
            'Nukuʿalofa',
            'Bratislava'
        ]
    },
    {
        question: 'What is the capital of Denmark?',
        unsver: 'Copenhagen',
        variants: [
            'Moscow',
            'Copenhagen',
            'Tokyo',
            'Islamabad'
        ]
    },
    {
        question: 'What is the capital of South Korea?',
        unsver: 'Seoul',
        variants: [
            'Pristina',
            'Vilnius',
            'Tbilisi',
            'Seoul'
        ]
    },
    {
        question: 'What is the capital of Saudi Arabia?',
        unsver: 'Riyadh',
        variants: [
            'Riyadh',
            `Saint John''s`,
            'Sarajevo',
            'Honiara'
        ]
    },
    {
        question: 'What is the capital of New Zealand?',
        unsver: 'Wellington',
        variants: [
            'Moroni',
            `Saint John''s`,
            'Wellington',
            'Port Moresby'
        ]
    },
    {
        question: 'What is the capital of Angola?',
        unsver: 'Luanda',
        variants: [
            'Honiara',
            'Luanda',
            'Castries',
            'Cairo'
        ]
    },
    {
        question: 'What is the capital of Switzerland?',
        unsver: 'Bern',
        variants: [
            'Tegucigalpa',
            'Bern',
            'Yaounde',
            'Nouakchott'
        ]
    },
    {
        question: 'What is the capital of Dominica?',
        unsver: 'Roseau',
        variants: [
            'Roseau',
            'Nicosia',
            'Belgrade',
            'Vientiane'
        ]
    },
    {
        question: 'What is the capital of Vanuatu?',
        unsver: 'Port-Vila',
        variants: [
            'Port-Vila',
            'Doha',
            'Asmara',
            'Majuro'
        ]
    },
    {
        question: 'What is the capital of Norway?',
        unsver: 'Oslo',
        variants: [
            'Port Louis',
            'Oslo',
            'Tehrān',
            'Nicosia'
        ]
    },
    {
        question: 'What is the capital of Georgia?',
        unsver: 'Tbilisi',
        variants: [
            'Malabo',
            'Roseau',
            'Tbilisi',
            'Panama City'
        ]
    },
    {
        question: 'What is the capital of Cameroon?',
        unsver: 'Yaoundé',
        variants: [
            'Brussels',
            'Yaoundé',
            'Kyiv',
            'Quito'
        ]
    },
    {
        question: 'What is the capital of Eswatini (Swaziland)?',
        unsver: 'Mbabane (administrative and judicial); Lobamba (legislative)',
        variants: [
            'Amman',
            'Paris',
            'Mbabane (administrative and judicial); Lobamba (legislative)',
            'Yaounde'
        ]
    },
    {
        question: 'What is the capital of Burundi?',
        unsver: 'Bujumbura',
        variants: [
            'Thimphu',
            'Bujumbura',
            'Reykjavik',
            'Juba'
        ]
    },
    {
        question: 'What is the capital of Mongolia?',
        unsver: 'Ulaanbaatar (Ulan Bator)',
        variants: [
            'Ulaanbaatar (Ulan Bator)',
            'Ottawa',
            'Bangui',
            'Conakry'
        ]
    },
    {
        question: 'What is the capital of Nauru?',
        unsver: 'Yaren district',
        variants: [
            'Brazzaville',
            'Algiers',
            'Yaren district',
            'Paris'
        ]
    },
    {
        question: 'What is the capital of Paraguay?',
        unsver: 'Asunción',
        variants: [
            'Bangui',
            'Nassau',
            'Nairobi',
            'Asunción'
        ]
    },
    {
        question: 'What is the capital of Liechtenstein?',
        unsver: 'Vaduz',
        variants: [
            'Accra',
            'Phnom Penh',
            'New Delhi',
            'Vaduz'
        ]
    },
    {
        question: 'What is the capital of Latvia?',
        unsver: 'Riga',
        variants: [
            'Riga',
            'Oslo',
            'Tripoli',
            'Beirut'
        ]
    },
    {
        question: 'What is the capital of Niger?',
        unsver: 'Niamey',
        variants: [
            'Skopje',
            'Mexico City',
            'Colombo',
            'Niamey'
        ]
    },
    {
        question: 'What is the capital of Guinea-Bissau?',
        unsver: 'Bissau',
        variants: [
            'Bissau',
            'Riga',
            'Malabo',
            'Male'
        ]
    },
    {
        question: 'What is the capital of Ethiopia?',
        unsver: 'Addis Ababa',
        variants: [
            'Bratislava',
            'Skopje',
            'Yaounde',
            'Addis Ababa'
        ]
    },
    {
        question: 'What is the capital of Mauritania?',
        unsver: 'Nouakchott',
        variants: [
            'Nouakchott',
            'Bishkek',
            'Jerusalem',
            'Port Louis'
        ]
    },
    {
        question: 'What is the capital of Nepal?',
        unsver: 'Kathmandu',
        variants: [
            'Kathmandu',
            'Dhaka',
            'Mogadishu',
            'Victoria'
        ]
    },
    {
        question: 'What is the capital of Romania?',
        unsver: 'Bucharest',
        variants: [
            'Dili',
            'Monrovia',
            'Bucharest',
            'Basseterre'
        ]
    },
    {
        question: 'What is the capital of Armenia?',
        unsver: 'Yerevan',
        variants: [
            'Valletta',
            'Yerevan',
            'Abuja',
            'Berlin'
        ]
    },
    {
        question: 'What is the capital of Maldives?',
        unsver: 'Male',
        variants: [
            'Monaco',
            'Kyiv',
            'Muscat',
            'Male'
        ]
    },
    {
        question: 'What is the capital of Grenada?',
        unsver: `Saint George''s`,
        variants: [
            'Harare',
            'Nay Pyi Taw',
            `Saint George''s`,
            'Helsinki'
        ]
    },
    {
        question: 'What is the capital of Bahrain?',
        unsver: 'Manama',
        variants: [
            'Helsinki',
            'Manama',
            'Praia',
            'Niamey'
        ]
    },
    {
        question: 'What is the capital of Madagascar?',
        unsver: 'Antananarivo',
        variants: [
            'Muscat',
            'Paramaribo',
            'Antananarivo',
            'Tokyo'
        ]
    },
    {
        question: 'What is the capital of Lebanon?',
        unsver: 'Beirut',
        variants: [
            'Islamabad',
            'Beirut',
            'Ulaanbaatar (Ulan Bator)',
            'Phnom Penh'
        ]
    },
    {
        question: 'What is the capital of Malta?',
        unsver: 'Valletta',
        variants: [
            'Saint George',
            'Ulaanbaatar (Ulan Bator)',
            'Kuwait',
            'Valletta'
        ]
    },
    {
        question: 'What is the capital of Indonesia?',
        unsver: 'Jakarta',
        variants: [
            'Jakarta',
            'Minsk',
            'Maputo',
            'Ankara'
        ]
    },
    {
        question: 'What is the capital of Albania?',
        unsver: 'Tirana',
        variants: [
            'Asmara',
            'Tirana',
            'Tunis',
            'Muscat'
        ]
    },
    {
        question: 'What is the capital of Italia?',
        unsver: 'Rome',
        variants: [
            'Buharest',
            'Deli',
            'Jacarta',
            'Rome'
        ]
    },
]
