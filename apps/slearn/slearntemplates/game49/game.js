var questiontext = [];
var question = [];
var option1 = [];
var option2 = [];
var option3 = [];
var option4 = [];
var correctAnswer = [];
var hintType = [];
var hintText = [];
var hintImagePath = [];
var shuffledQuestionNumber = [];
var xml;
var currentquestionnumber = 0;
var allanswerstrue = true;
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

$(document).ready(function () {
    var count = 0;
    $.ajax({
        type: 'GET',
        url: questionxmlurl,
        dataType: "xml",
        success: function (data) {
            xml = $(data);
            loadQuestionsToMemory();
            launchLaunchModal();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("Loading question failed");
            console.log(xhr);
            console.log(ajaxOptions);
            console.log(thrownError);
        }
    });
});

function loadQuestionsToMemory() {
    var count = 0;
    $(xml).find('Question').each(function () {
        questiontext[count] = xml.find("QuestionText")[count].firstChild.data;
        question[count] = mat + xml.find("QuestionImage")[count].firstChild.data;
        shuffledQuestionNumber[count] = count;
        count++;
    });
    shuffledQuestionNumber = shuffle(shuffledQuestionNumber);
}

function startGame() {
    $("#launchmodal").modal('hide');
    var vid = document.getElementById("audioIns");
    vid.pause();
    displayQuestions(currentquestionnumber);
}

function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) ;
    return o;
}

function displayQuestions(count) {
    console.log(count)
    console.log(currentquestionnumber)
    if ((currentquestionnumber + 1) > questiontext.length) {
        checkGameStatus();
    } else {
        $("#questiontext").html("[" + (currentquestionnumber + 1) + "] " + questiontext[shuffledQuestionNumber[count]]);
        $("#questionimage").html("<img src='" + question[shuffledQuestionNumber[count]] + "' class='img-responsive center-block' width='100%'/>");
    }
}

function nextQuestion() {
    currentquestionnumber++;
    $("#asnwermodal").modal('hide');
    showhidePreviousQuesionBtn();
    console.log(currentquestionnumber)
    displayQuestions(currentquestionnumber);
}

function checkGameStatus() {
    if (allanswerstrue == false) {
        $("#failuremodal").modal('show');
    } else {
        $("#successmodal").modal('show');
    }
}