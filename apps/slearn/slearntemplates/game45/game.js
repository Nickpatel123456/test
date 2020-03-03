var quesionId = [];
var question1 = [];
var question = [];
var option1 = [];
var option2 = [];
var option3 = [];
var option4 = [];
var correctAnswer = [];
var hintType = [];
var hintText = [];
var hintImagePath = [];
var hintTextMatch = [];
var hintImgMatch = [];
var shuffledQuestionNumber = [];
var xml;
var currentquestionnumber = 0;
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

function loadQuestionsToMemory() {
    var count = 0;
    $(xml).find('Question').each(function () {
        totalquestion = xml.find("QuestionText").length;
        quesionId[count] = xml.find("QuestionID")[count].firstChild.data;
        question1[count] = xml.find("QuestionText")[count].firstChild.data;
        option1[count] = xml.find("QuestionText")[count].nextElementSibling.children[0].firstChild.data;
        option2[count] = xml.find("QuestionText")[count].nextElementSibling.children[1].firstChild.data;
        option3[count] = xml.find("QuestionText")[count].nextElementSibling.children[2].firstChild.data;
        option4[count] = xml.find("QuestionText")[count].nextElementSibling.children[3].firstChild.data;
        correctAnswer[count] = xml.find("CorrectAnswerOptionID")[count].firstChild.data;
        hintType[count] = xml.find("HintType")[count].firstChild.data;
        hintText[count] = xml.find("HintText")[count].firstChild.data;
        hintImagePath[count] = mat + xml.find("HintImagePath")[count].firstChild.data;
        shuffledQuestionNumber[count] = count;
        count++;
    });
    shuffledQuestionNumber = shuffle(shuffledQuestionNumber);
}

function ShowVideo() {
    $(xml).find('Video').each(function () {
        var video = mat + xml.find("VideoPath").text();
        $("#questionvideo").html("<video id='myviddd' width='100%' controls><source src='" + video + "' type='video/mp4'></video>");
    });
}

function checkEmpty() {
    var emapty = $("input[name=optradio]:checked").val();
    if (emapty == undefined) {
        console.log("Select Answer");
    } else {
        checkAnswer();
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
    ShowVideo();
}

function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) ;
    return o;
}

function displayQuestions(count) {
    if ((currentquestionnumber + 1) > question1.length) {
        checkGameStatus();
    } else {
        var optionArray = [];
        optionArray = [
            {optionid: 1, optionvalue: option1[shuffledQuestionNumber[count]]},
            {optionid: 2, optionvalue: option2[shuffledQuestionNumber[count]]},
            {optionid: 3, optionvalue: option3[shuffledQuestionNumber[count]]},
            {optionid: 4, optionvalue: option4[shuffledQuestionNumber[count]]}
        ];

        var mcqshuffledquestionnumber = [];
        for (var i = 0; i < optionArray.length; i++) {
            mcqshuffledquestionnumber[i] = i;
            mcqshuffledquestionnumber = shuffle(mcqshuffledquestionnumber);
        }

        $("#questiontext").html("<span onclick='togglePlay(" + quesionId[shuffledQuestionNumber[count]] + ")'><img id='audioImg' src='/apps/slearn/slearntemplates/assets/pause.png' width='40'></span><span class='pl-5'> [" + (currentquestionnumber + 1) + "] " + question1[shuffledQuestionNumber[count]] + "</span>");

        $("#loadoptionsdetails").html(" ");

        for (var j = 0; j < optionArray.length; j++) {
            $("#loadoptionsdetails").append(
                '<div class="radio radioButton"><label><span class="pt-2 pl-5"><input type="radio" name="optradio" value="' + optionArray[mcqshuffledquestionnumber[j]].optionid + '"></span><span class="pl-5">' +
                optionArray[mcqshuffledquestionnumber[j]].optionvalue + '</span></label></div>');
        }

        hintTextMatch = hintText[shuffledQuestionNumber[count]];
        hintImgMatch = hintImagePath[shuffledQuestionNumber[count]];
        hideQuesAudioImg();
    }
}

function checkAnswer() {
    $('video').trigger('pause');
    stopQuestionAudio();
    currentquestionnumber++;
    var num = Math.floor(Math.random() * 3); //changeG
    var valueRadio = $("input[name=optradio]:checked").val(); // this line addd
    if (correctAnswer[shuffledQuestionNumber[currentquestionnumber - 1]] == valueRadio) {
        console.log("Answer is correct");
        $("#asnwermodal").modal('show');
        $("#answermessage").html("<h3 style='color:green'> શાબાશ! તમારો જવાબ સાચો છે.  </h3><img src='" + pathgif + imagesArrayT[num] + "'/>");
        answermarks.push(1);
    } else {
        console.log("Answer is wrong");
        $("#asnwermodal").modal('show');
        $("#answermessage").html("<h3 style='color:red'>  તમારો જવાબ ખોટો છે. </h3><img src='" + pathgif + imagesArrayF[num] + "'/>");
        answermarks.push(0);
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
    $('input[name=optradio]').attr('checked', false); // this line addd
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
    clickCounter();
    $("#failuremodal").modal('hide');
}
