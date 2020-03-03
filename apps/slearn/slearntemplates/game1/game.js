var quesionId = [];
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
var allanswerstrue = true;
var totalquestion;
var answermarks = [];
var xmlname = "/question.xml";
var session = sessionStorage.getItem("subject") + "/" + sessionStorage.getItem("level");
var url = window.location.href;
url = url.split("/");
url = url[0] + "//" + url[2];
url = url.slice(0, url.length - 4);
url = url + "9999/slearn";
questionxmlurl = url + "/cont/" + session + xmlname;
var mat = url + "/mat/" + session + "/";
var anchor = sessionStorage.getItem("anchor"); // anchor activity session Yes Or No

//first load this document ready function
$(document).ready(function () {
    var count = 0;
    $.ajax({
        type: 'GET',
        url: questionxmlurl,
        dataType: "xml",
        success: function (data) {
            xml = $(data);
            //call document ready after call below function
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

//this function check select option radio button select or not click on check answer button
function checkEmpty() {
    var emapty = $("input[name=optradio]:checked").val();
    if (emapty == undefined) {
        console.log("Select Answer");
    } else {
        checkAnswer();
    }
}

//this function work show start game modal toggle
function CheckAnchor() {
    launchLaunchModal();
}

//this function work start game modal toggle modal and after click on start button
function startGame() {
    $("#launchmodal").modal('hide');
    var vid = document.getElementById("audioIns");
    vid.pause();
    displayQuestions(currentquestionnumber);
}

//this function call && load all question, answer and diff. array wise store question, answer. Declare array variable name below function for ex. question(Array), option1(Array)... 
function loadQuestionsToMemory() {
    var count = 0;
    $(xml).find('Question').each(function () {
        totalquestion = xml.find("QuestionText").length;
        quesionId[count] = xml.find("QuestionID")[count].firstChild.data;
        question[count] = xml.find("QuestionText")[count].firstChild.data; //this array store all question
        option1[count] = xml.find("QuestionText")[count].nextElementSibling.children[0].firstChild.data; //this array store all option1
        option2[count] = xml.find("QuestionText")[count].nextElementSibling.children[1].firstChild.data; //this array store all option2
        option3[count] = xml.find("QuestionText")[count].nextElementSibling.children[2].firstChild.data; //this array store all option3
        option4[count] = xml.find("QuestionText")[count].nextElementSibling.children[3].firstChild.data; //this array store all option4
        correctAnswer[count] = xml.find("CorrectAnswerOptionID")[count].firstChild.data; //this array store all question correctAnswer
        hintType[count] = xml.find("HintType")[count].firstChild.data; //this array store all question hint Type
        hintText[count] = xml.find("HintText")[count].firstChild.data;
        hintImagePath[count] = mat + xml.find("HintImagePath")[count].firstChild.data;
        shuffledQuestionNumber[count] = count;
        count++;
    });
    shuffledQuestionNumber = shuffle(shuffledQuestionNumber); //this function use to suffle question
}

function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) ;
    return o;
}

//this function work click on check answer button after display question one by one 
function displayQuestions(count) {
    if ((currentquestionnumber + 1) > question.length) {
        checkGameStatus(); // last question answer submit after work this function
    } else {
        var optionArray = []; //this array store display one question then store that question all option answer
        optionArray = [
            {optionid: 1, optionvalue: option1[shuffledQuestionNumber[count]]},
            {optionid: 2, optionvalue: option2[shuffledQuestionNumber[count]]},
            {optionid: 3, optionvalue: option3[shuffledQuestionNumber[count]]},
            {optionid: 4, optionvalue: option4[shuffledQuestionNumber[count]]}
        ];

        //below array store suffle answer
        var mcqshuffledquestionnumber = [];
        for (var i = 0; i < optionArray.length; i++) {
            mcqshuffledquestionnumber[i] = i;
            mcqshuffledquestionnumber = shuffle(mcqshuffledquestionnumber);
        }

        $("#questiontext").html("<span onclick='togglePlay(" + quesionId[shuffledQuestionNumber[count]] + ")'><img id='audioImg' src='/apps/slearn/slearntemplates/assets/pause.png' width='40'></span><span class='pl-5'> [" + (currentquestionnumber + 1) + "] " + question[shuffledQuestionNumber[count]] + "</span>"); //write question on html tag
        $("#loadoptionsdetails").html(" ");

        //this for loop write suffle answer in html
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

//this function check answer 
function checkAnswer() {
    stopQuestionAudio();
    currentquestionnumber++;
    var num = Math.floor(Math.random() * 3); //changeG
    var valueRadio = $("input[name=optradio]:checked").val(); // this stroe radio button option value
    if (correctAnswer[shuffledQuestionNumber[currentquestionnumber - 1]] == valueRadio) {
        console.log("Answer is correct");
        $("#asnwermodal").modal('show');
        $("#answermessage").html("<h3 style='color:green'> શાબાશ! તમારો જવાબ સાચો છે. </h3><img src='" + pathgif + imagesArrayT[num] + "'/>"); //imagesArrayT declare logic-common-anchor.js file
        answermarks.push(1); //this array store value 1 if answer true
    } else {
        console.log("Answer is wrong");
        $("#asnwermodal").modal('show');
        $("#answermessage").html("<h3 style='color:red'> તમારો જવાબ ખોટો છે.  </h3><img src='" + pathgif + imagesArrayF[num] + "'/>"); //imagesArrayF declare logic-common-anchor.js file
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

//this function work answer modal toggle and after click on next question button
function askNextQuestion() {
    $("#asnwermodal").modal('hide');
    $('input[name=optradio]').attr('checked', false);
    showhidePreviousQuesionBtn();
    displayQuestions(currentquestionnumber);
}

//all question finish after work this function
function checkGameStatus() {
    //this countElement Function declare slearn\slearntemplates\libs\logic-common-anchor.js file and count right and wrong answer,  right count 1 and wrong count 0
    var wornganswer = countElement(0, answermarks);
    var trueanswer = countElement(1, answermarks);
    var percentage_correct = (Number(trueanswer) / Number(totalquestion)) * 100; //this store percetage
    var current_floor = Number(sessionStorage.getItem("currentfloor"));
    var selected_floor = Number(sessionStorage.getItem("selectedfloor"));
    var marksInfo = "<div class='result'><span>Total Question </span><span class='marks lightblue'>" + totalquestion + "</span></div><div class='result'><span>Right Answer </span><span class='marks lightgreen'>" + trueanswer + "</span></div><div class='result'><span>Wrong Answer </span><span class='marks lightcoral'>" + wornganswer + "</span></div>";

    if (((selected_floor < (current_floor - 3)) && percentage_correct >= 90) || ((selected_floor >= (current_floor - 3)) && percentage_correct >= 80)) {
        $("#successmodal").modal('show');
        $("#result").html(marksInfo);
    } else {
        if (sessionStorage.clickcount == 1 && anchor == "Yes") {
            GoBackActivity(); //this Function declare slearn\slearntemplates\libs\logic-common-anchor.js file
        } else if (sessionStorage.clickcount == 1 && anchor == "No") {
            ConsultToTeacher(); //this Function declare slearn\slearntemplates\libs\logic-common-anchor.js file
        } else {
            $("#failuremodal").modal('show');
            $("#result1").html(marksInfo);
        }
    }
}


//this function work right answer percetage < 80 OR 90
function restartGame() {
    $("#failuremodal").modal('hide');
    clickCounter();
}
