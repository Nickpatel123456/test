var question = [];
var questionid = [];
var questionImage = [];
var currentquestionnumber = 0;
var correctAnswer = [];
var shuffledQuestionNumber = [];
var totalquestion;
var storeRowColumnValue = [];
var userSelectStoreCellId = [];
var questionRightAnswer;
var answermarks = [];

var xmlname = "/question.xml";
var session = sessionStorage.getItem("subject") + "/" + sessionStorage.getItem("level");
var url = window.location.href;
url = url.split("/");
url = url[0] + "//" + url[2];
url = url.slice(0, url.length - 4);
url = url + "9999/slearn";
var questionxmlurl = url + "/cont/" + session + xmlname;
var mat = url + "/mat/" + session + "/";
var anchor = sessionStorage.getItem("anchor"); // anchor activity session Yes Or No

$(document).ready(function () {
    $.ajax({
        type: 'GET',
        url: questionxmlurl,
        dataType: "xml",
        success: function (data) {
            xml = $(data);
            CheckAnchor();
            loadQuestionsToMemory();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("Loading question failed");
            console.log(xhr);
            console.log(ajaxOptions);
            console.log(thrownError);
        }
    });
});

function CheckAnchor() {
    launchLaunchModal();
}

function startGame() {
    $("#launchmodal").modal('hide');
    var vid = document.getElementById("audioIns");
    vid.pause();
    LoadXmlTableData();
    displayQuestions(currentquestionnumber);
}

function loadQuestionsToMemory() {
    var count = 0;
    $(xml).find('Question').each(function () {
        questionid[count] = xml.find("QuestionID")[count].firstChild.data;
        question[count] = xml.find("QuestionText")[count].firstChild.data;
        questionImage[count] = mat + xml.find("QuestionImage")[count].firstChild.data;
        correctAnswer[count] = xml.find("Answer")[count].firstChild.data;
        shuffledQuestionNumber[count] = count;
        count++;
    });
    shuffledQuestionNumber = shuffle(shuffledQuestionNumber);
}

function displayQuestions(count) {
    if ((currentquestionnumber + 1) > question.length) {
        checkGameStatus();
    } else {
        userSelectStoreCellId = [];
        questionRightAnswer = '';
        $('td').removeClass('click');
        document.getElementById('answertext').innerHTML = '';
        document.getElementById('deleteanswer').style.display = 'none';

        $("#questiontext").html( "<span onclick='togglePlay(" + questionid[shuffledQuestionNumber[count]] + ")'><img id='audioImg' src='/apps/slearn/slearntemplates/assets/pause.png' width='40'></span><span class='pl-5'> [" + (currentquestionnumber + 1) + "] " + question[shuffledQuestionNumber[count]] + "</span>");
        $("#questionimage").html("<img src='" + questionImage[shuffledQuestionNumber[count]] + "' style='width:100%;'/>");
        questionRightAnswer = correctAnswer[shuffledQuestionNumber[count]];
        hideQuesAudioImg();
    }
}

function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) ;
    return o;
}

// this function checks if user has selected one cell for more then one time
function isInArray(value, array) {
    return array.indexOf(value) > -1;
}

//this function load all cell value in table
function LoadXmlTableData() {
    var columnLength = $(xml).find('Cell').length;
    totalquestion = $(xml).find('QuestionID').length;

    for (l = 0; l < columnLength; l++) {
        storeRowColumnValue.push($(xml).find('Cell')[l].firstChild.data);
    }

    console.log(storeRowColumnValue);

    var setColumnId = 0;
    var $game_table = $("#game_table");
    for (var i = 0; i < 6; ++i) {
        var tr = $("<tr></tr>");
        $game_table.append(tr);
        for (var j = 0; j < 6; ++j) {
            tr.append("<td align='center' id='" + setColumnId + "'>" + storeRowColumnValue[setColumnId] + "</td>");
            setColumnId++;
        }
    }

    $('td').click(function () {
        document.getElementById('deleteanswer').style.display = 'inline-block';
        if (userSelectStoreCellId.length > 0) {
            var matchAnsValue = isInArray(this.id, userSelectStoreCellId);
            if (matchAnsValue == true) {
                console.log('User Allready Selected this value');
                return;
            }
        }

        $(this).addClass('click');
        userSelectStoreCellId.push(this.id);
        $("#answertext").append("<div id='ans' class='answer'>" + $(this).text() + "</div>");
    });
}

function deleteLastWord() {
    var deleteWordCellId = userSelectStoreCellId.pop();
    if (userSelectStoreCellId.length == 0) {
        document.getElementById('deleteanswer').style.display = 'none';
        addRemoveClassDisplayLeftUserSelectCellValue(deleteWordCellId);
    } else {
        addRemoveClassDisplayLeftUserSelectCellValue(deleteWordCellId);
    }
}

function addRemoveClassDisplayLeftUserSelectCellValue(cellId) {
    console.log(userSelectStoreCellId);
    console.log(cellId);
    $('#' + cellId).removeClass('click');
    document.getElementById('answertext').innerHTML = '';
    for (var i = 0; i < userSelectStoreCellId.length; i++) {
        $("#answertext").append("<div id='ans' class='answer'>" + $('#' + userSelectStoreCellId[i]).text() + "</div>");
    }
}

//this function check answer
function CheckAnswer() {
    stopQuestionAudio();
    var num = Math.floor(Math.random() * 3);
    if (userSelectStoreCellId.length > 0) {
        console.log('Check Answer Works');
        console.log(userSelectStoreCellId);

        var splitAnswerValue = questionRightAnswer.split('-');
        console.log(splitAnswerValue)

        var matchValue = 0; // if value 1 answer not match && if value 0 answer match
        $("#asnwermodal").modal('show');
        if (userSelectStoreCellId.length == splitAnswerValue.length) {
            for (var i = 0; i < userSelectStoreCellId.length; i++) {
                if (userSelectStoreCellId[i] != splitAnswerValue[i]) {
                    matchValue = 1;
                    break;
                }
            }

            if (matchValue == 1) {
                answermarks.push(0); //this array store value 0 if answer false
                $("#answermessage").html("<h3 style='color:red'>  તમારો જવાબ ખોટો છે. </h3><img src='" + pathgif + imagesArrayF[num] + "'/>");
            } else {
                answermarks.push(1); //this array store value 1 if answer true
                $("#answermessage").html("<h3 style='color:green'>  શાબાશ! તમારો જવાબ સાચો છે.  </h3><img src='" + pathgif + imagesArrayT[num] + "'/>");
            }
        } else {
            console.log('Answer Not Match');
            answermarks.push(0); //this array store value 0 if answer false
            $("#answermessage").html("<h3 style='color:red'>  તમારો જવાબ ખોટો છે. </h3><img src='" + pathgif + imagesArrayF[num] + "'/>");
        }

        currentquestionnumber++;
    } else {
        console.log('Please Select Aleast One Value');
    }
}

function askNextQuestion() {
    $("#asnwermodal").modal('hide');
    showhidePreviousQuesionBtn();
    displayQuestions(currentquestionnumber);
}

function checkGameStatus() {
    var wornganswer = countElement(0, answermarks);
    var trueanswer = countElement(1, answermarks);
    var percentage_correct = (Number(trueanswer) / Number(totalquestion)) * 100;
    var current_floor = Number(sessionStorage.getItem("currentfloor"));
    var selected_floor = Number(sessionStorage.getItem("selectedfloor"));
    var marksInfo = "<div class='result'><span>Total Question </span><span class='marks lightblue'>" + totalquestion + "</span></div><div class='result'><span>Right Answer </span><span class='marks lightgreen'>" + trueanswer + "</span></div><div class='result'><span>Wrong Answer </span><span class='marks lightcoral'>" + wornganswer + "</span></div>";

    if (((selected_floor < (current_floor - 3)) && percentage_correct >= 90) || ((selected_floor >= (current_floor - 3)) && percentage_correct >= 80)) {
        $("#successmodal").modal('show');
        $("#result").html(marksInfo);
    } else {
        if (sessionStorage.clickcount == 1 && anchor == "Yes") {
            GoBackActivity();
        } else if (sessionStorage.clickcount == 1 && anchor == "No") {
            ConsultToTeacher();
        } else {
            $("#failuremodal").modal('show');
            $("#result1").html(marksInfo);
        }
    }
}

function restartGame() {
    $("#failuremodal").modal('hide');
    clickCounter();
}
