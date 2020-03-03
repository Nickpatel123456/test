var quesionId = [];
var question1 = [];
var question2 = [];
var question3 = [];
var option1 = [];
var option2 = [];
var option3 = [];
var option4 = [];
var correctAnswer = [];
var hintType = [];
var hintText = [];
var hintTextMatch = [];
var hintImgMatch = [];
var hintImagePath = [];
var shuffledQuestionNumber = [];
var xml;
var currentquestionnumber = 0;
var allanswerstrue = true;
var osAgent = navigator.userAgent;
var totalquestion;
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
    var count = 0;
    $.ajax({
        type: 'GET',
        url: questionxmlurl,
        dataType: "xml",
        success: function (data) {
            xml = $(data);
            loadQuestionsToMemory();
            CheckAnchor();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("Loading question failed");
            console.log(xhr);
            console.log(ajaxOptions);
            console.log(thrownError);
        }
    });
});

function checkEmpty() {
    var emapty = $("input[name=optradio]:checked").val();
    if (emapty == undefined) {
        console.log("Select Answer");
    } else {
        var valueRadio = $("input[name=optradio]:checked").val();
        checkAnswer(valueRadio);
    }
}

function CheckAnchor() {
    launchLaunchModal();
}

function startGame() {
    $("#launchmodal").modal('hide');
    var vid = document.getElementById("audioIns");
    vid.pause();
    displayQuestions(currentquestionnumber);
}

function loadQuestionsToMemory() {
    var count = 0;
    $(xml).find('Question').each(function () {
        totalquestion = xml.find("QuestionID").length;
        quesionId[count] = xml.find("QuestionID")[count].firstChild.data;
        question1[count] = xml.find("QuestionText1")[count].firstChild.data;
        question2[count] = xml.find("QuestionText2")[count].firstChild.data;
        question3[count] = xml.find("QuestionText3")[count].firstChild.data;
        option1[count] = xml.find("QuestionText3")[count].nextElementSibling.children[0].firstChild.data;
        option2[count] = xml.find("QuestionText3")[count].nextElementSibling.children[1].firstChild.data;
        option3[count] = xml.find("QuestionText3")[count].nextElementSibling.children[2].firstChild.data;
        option4[count] = xml.find("QuestionText3")[count].nextElementSibling.children[3].firstChild.data;
        correctAnswer[count] = xml.find("CorrectAnswerOptionID")[count].firstChild.data;
        hintType[count] = xml.find("HintType")[count].firstChild.data;
        hintText[count] = xml.find("HintText")[count].firstChild.data;
        hintImagePath[count] = mat + xml.find("HintImagePath")[count].firstChild.data;
        shuffledQuestionNumber[count] = count;
        count++;
    });
    shuffledQuestionNumber = shuffle(shuffledQuestionNumber);
}


function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) ;
    return o;
}

function displayQuestions(count) {
    if ((currentquestionnumber + 1) > question1.length) {
        checkGameStatus();
    } else {
        var part1 = question1[shuffledQuestionNumber[count]];
        var part2 = question2[shuffledQuestionNumber[count]];
        var part3 = question3[shuffledQuestionNumber[count]];

        if (part1 == "*") {
            part1 = "<span id='blank'>__________</span>";
        } else if (part2 == "*") {
            part2 = "<span id='blank'>__________</span>";
        } else if (part3 == "*") {
            part3 = "<span id='blank'>__________</span>";
        }

        $("#questiontext").html("<span onclick='togglePlay(" + quesionId[shuffledQuestionNumber[count]] + ")'><img id='audioImg' src='/apps/slearn/slearntemplates/assets/pause.png' width='40'></span><span class='pl-5'> [" + (currentquestionnumber + 1) + "] " + part1 + "</span><span> " + part2 + "</span><span> " + part3 + "</span>");
        $("#option1text").html('<div class="radio radioButton"><label><span class="pt-2 pl-5"><input type="radio" name="optradio" value="1"></span><span class="pl-5">' + option1[shuffledQuestionNumber[count]] + '</span></label></div>');
        $("#option2text").html('<div class="radio radioButton"><label><span class="pt-2 pl-5"><input type="radio" name="optradio" value="2"></span><span class="pl-5">' + option2[shuffledQuestionNumber[count]] + '</span></label></div>');
        $("#option3text").html('<div class="radio radioButton"><label><span class="pt-2 pl-5"><input type="radio" name="optradio" value="3"></span><span class="pl-5">' + option3[shuffledQuestionNumber[count]] + '</span></label></div>');
        $("#option4text").html('<div class="radio radioButton"><label><span class="pt-2 pl-5"><input type="radio" name="optradio" value="4"></span><span class="pl-5">' + option4[shuffledQuestionNumber[count]] + '</span></label></div>');
        hintTextMatch = hintText[shuffledQuestionNumber[count]];
        hintImgMatch = hintImagePath[shuffledQuestionNumber[count]];
        hideQuesAudioImg();
    }
}

function checkAnswer(options) {
    stopQuestionAudio();
    $("#asnwermodal").modal('show');
    currentquestionnumber++;
    var num = Math.floor(Math.random() * 3); //changeG
    if (correctAnswer[shuffledQuestionNumber[currentquestionnumber - 1]] == options) {
        console.log("Answer is correct");
        $("#answermessage").html("<h3 style='color:green'>શાબાશ! તમારો જવાબ સાચો છે.  </h3><img src='" + pathgif + imagesArrayT[num] + "'/>");
        answermarks.push(1); //this array store value 1 if answer true
    } else {
        console.log("Answer is wrong");
        $("#answermessage").html("<h3 style='color:red'> તમારો જવાબ ખોટો છે. </h3><img src='" + pathgif + imagesArrayF[num] + "'/>");
        allanswerstrue = false;
        answermarks.push(0); //this array store value 0 if answer false
        if (hintType[shuffledQuestionNumber[currentquestionnumber - 1]] == "Text") {
            if (hintTextMatch.trim() != "*") {
                $("#answermessage").append(hintTextMatch);
            }
        } else if (hintType[shuffledQuestionNumber[currentquestionnumber - 1]] == "Image") {
            if (hintTextMatch.trim() != "*") {
                $("#answermessage").append(hintTextMatch);
                $("#answermessage").append("<img src='" + hintImgMatch + "'/>");
            } else {
                $("#answermessage").append("<img src='" + hintImgMatch + "'/>");
            }
        }
    }
}

function askNextQuestion() {
    $("#asnwermodal").modal('hide');
    showhidePreviousQuesionBtn();
    $('input[name=optradio]').attr('checked', false);
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