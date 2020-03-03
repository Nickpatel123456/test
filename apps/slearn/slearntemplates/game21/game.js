var question = [];
var questionid = [];
var shuffledQuestionNumber = [];
var xml;
var correctAnswer = [];
var currentquestionnumber = 0;
var allanswerstrue = true;
var text = [];
var arrayImage = [];
var image;
var totalquestion;
var trueanswer = 0;
var wornganswer = 0;
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
    var count = 0;
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

function LoadImage() {
    var len = $(xml).find('ImageId').length; // find the length of Image
    for (i = 0; i < len; i++) {
        text[i] = xml.find("ImageId")[i].firstChild.data; // assign the value in second array
    }

    arrayImage = text;
    arrayImage.sort(function () {
        return Math.random() - .5
    });
    for (var j = 0; j < arrayImage.length; j++) {
        var image = mat + "images/" + arrayImage[j];
        $("#optionimages").append('<div class="col-md-2 col-xs-3"><img class="img-responsive imageGrid"  id="' + arrayImage[j] + '" src="' + image + '"/></div>');  // display Image
    }

    $('.imageGrid').click(function () {
        var str = this.id;
        var res = str.split('.');
        checkAnswer(res[0]);
    });
}

function loadQuestionsToMemory() {
    var count = 0;
    $(xml).find('Question').each(function () {
        totalquestion = xml.find("QuestionText").length;
        questionid[count] = xml.find("QuestionID")[count].firstChild.data;
        question[count] = xml.find("QuestionText")[count].firstChild.data;
        correctAnswer[count] = xml.find("ImageAnswer")[count].firstChild.data;
        shuffledQuestionNumber[count] = count;
        count++;
    });
    shuffledQuestionNumber = shuffle(shuffledQuestionNumber);
}

function CheckAnchor() {
    launchLaunchModal();
}

function startGame() {
    $("#op1").html("પ્રશ્ન.");
    $("#launchmodal").modal('hide');
    var vid = document.getElementById("audioIns");
    vid.pause();
    displayQuestions(currentquestionnumber);
    LoadImage();
}

function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) ;
    return o;
}

function displayQuestions(count) {
    if ((currentquestionnumber + 1) > question.length) {
        checkGameStatus();
    } else {
        $("#questiontext").html("<span onclick='togglePlay(" + questionid[shuffledQuestionNumber[count]] + ")'><img id='audioImg' src='/apps/slearn/slearntemplates/assets/pause.png' width='40'></span><span class='pl-5'> [" + (count + 1) + "] " + question[shuffledQuestionNumber[count]] + "</span>");
        hideQuesAudioImg();
    }
}

function askNextQuestion() {
    $("#asnwermodal").modal('hide');
    displayQuestions(currentquestionnumber);
}

function checkAnswer(options) {
    stopQuestionAudio();
    currentquestionnumber++;
    $("#asnwermodal").modal('show');
    var num = Math.floor(Math.random() * 3); //changeG
    if (correctAnswer[shuffledQuestionNumber[currentquestionnumber - 1]] == options) {
        console.log("Answer is correct");
        $("#answermessage").html("<h3 style='color:green'> શાબાશ! તમારો જવાબ સાચો છે.  </h3><img src='" + pathgif + imagesArrayT[num] + "'/>");
        trueanswer++;
    } else {
        console.log("Answer is wrong");
        $("#answermessage").html("<h3 style='color:red'> તમારો જવાબ ખોટો છે. </h3><img src='" + pathgif + imagesArrayF[num] + "'/>");
        allanswerstrue = false;
        wornganswer++;
    }
}

function checkGameStatus() {
    var percentage_correct = (Number(trueanswer) / Number(totalquestion)) * 100;
    var current_floor = Number(sessionStorage.getItem("currentfloor"));
    var selected_floor = Number(sessionStorage.getItem("selectedfloor"));
    var marksInfo = "<div class='result'><span>Total Question </span><span class='marks lightblue'>" + totalquestion + "</span></div><div class='result'><span>Right Answer </span><span class='marks lightgreen'>" + trueanswer + "</span></div><div class='result'><span>Wrong Answer </span><span class='marks lightcoral'>" + wornganswer + "</span></div>";

    if (((selected_floor < (current_floor - 3)) && percentage_correct >= 90) || ((selected_floor >= (current_floor - 3)) && percentage_correct >= 80)) {
        $("#successmodal").modal('show');
        $("#result").html(marksInfo);
    } else {
        if (sessionStorage.clickcount == 1 && anchor == "Yes") {
            GoBackActivity(); //call the logic common anchor js file
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

