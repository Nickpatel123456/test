var quesionId = [];
var question = [];
var questionIns = [];
var shuffledQuestionNumber = [];
var xml;
var currentquestionnumber = 0;
var allanswerstrue = true;
var qusid = [];
var totalquestion;
var trueanswer = 0;
var wornganswer = 0;
var storeoriginalanswer = [];
var storeAnswer = [];
var storeuseranswer = [];
var selectanswer = "";
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

function startGame() {
    $("#launchmodal").modal('hide');
    var vid = document.getElementById("audioIns");
    vid.pause();
    displayQuestions(currentquestionnumber);
}

//this function call and store all question data in question array.
function loadQuestionsToMemory() {
    var count = 0;
    $(xml).find('Question').each(function () {
        totalquestion = xml.find("QuestionID").length;
        quesionId[count] = xml.find("QuestionID")[count].firstChild.data;
        question[count] = xml.find("QuestionID")[count].firstChild.data;
        questionIns[count] = xml.find("QuestionInstruction")[count].firstChild.data;
        shuffledQuestionNumber[count] = count;
        count++;
    });
    shuffledQuestionNumber = shuffle(shuffledQuestionNumber);
}

//this function display one by one question
function displayQuestions(count) {
    if ((currentquestionnumber + 1) > question.length) {
        checkGameStatus();
    } else {
        $("#questioninstruction").html("<span class='span' onclick='togglePlay(" + quesionId[shuffledQuestionNumber[count]] + ")'><img id='audioImg' src='/apps/slearn/slearntemplates/assets/pause.png' width='40'></span><span class='span pl-5'> [" + (count + 1) + "] " + questionIns[shuffledQuestionNumber[count]] + "</span>");
        qusid = question[shuffledQuestionNumber[count]];
        hideQuesAudioImg();
        LoadDataToMemory();
    }
}

function LoadDataToMemory() {
    storeoriginalanswer = [];
    storeAnswer = [];
    storeuseranswer = [];

    //this store display question number in all options value
    var questionNo = $(xml).find('QuestionID').filter(function () {
        return $(this).text() === qusid;
    }).parent();

    for (i = 0; i < questionNo.length; i++) {
        var len = $(questionNo[i]).find('QuestionText').length;
        for (j = 0; j < len; j++) {
            storeAnswer.push($(questionNo[i]).find('QuestionText')[j].firstChild.data);
            storeoriginalanswer.push($(questionNo[i]).find('QuestionText')[j].firstChild.data);
        }
    }

    storeAnswer.sort(function () {
        return Math.random() - .5
    }); //this is sort answer in array

    for (var valueKey in storeAnswer) {
        $("#questiontext").append('<span id="answer' + valueKey + '" class="span1" onclick="storeanswerselectvalue(' + valueKey + ')">' + storeAnswer[valueKey] + '</span>');
    }
}

//this function click on answer and store that keyvalue in array
function storeanswerselectvalue(indexnumber) {
    $("#deletewordid").css('display','');

    selectanswer = $("#answer" + indexnumber).text();
    storeAnswer.splice(indexnumber, 1); //this splice function remove array index number value in array

    storeuseranswer.push(selectanswer); //this array store value if user click on answer span tag

    $("#questiontext").html("");
    //this for loop write data after remove word and after avaliable array value
    for (var valueKey in storeAnswer) {
        $("#questiontext").append('<span id="answer' + valueKey + '" class="span1" onclick="storeanswerselectvalue(' + valueKey + ')">' + storeAnswer[valueKey] + '</span>');
    }

    //this html write data in user select span tag answer
    $("#questionanswer").append("<div class='answer'>" + selectanswer + "</div>");
}

//this function work click on રદ કરો  button 
function deleteAnswer() {
    var deletelastword = storeuseranswer.pop(); //this pop function delete last word in array
    storeAnswer.push(deletelastword); //this store which last word is deleted

    $("#questiontext").html("");
    for (var valueKey in storeAnswer) {
        $("#questiontext").append('<span id="answer' + valueKey + '" class="span1" onclick="storeanswerselectvalue(' + valueKey + ')">' + storeAnswer[valueKey] + '</span>');
    }

    $("#questionanswer").html("");
    for (var valueKey in storeuseranswer) {
        $("#questionanswer").append("<div class='answer'>" + storeuseranswer[valueKey] + "</div>");
    }

    if (storeuseranswer.length == 0) {
        $("#deletewordid").css('display','none');
    }
}

//this function work user click on check answer button.
function checkuseranswerMatchOrNot() {
    var matchornot = 0;
    var num = Math.floor(Math.random() * 3);

    if (storeoriginalanswer.length === storeuseranswer.length) {
        currentquestionnumber++;

        for (var key in storeoriginalanswer) {
            if (storeoriginalanswer[key] === storeuseranswer[key]) {
                matchornot = 1;
            } else {
                matchornot = 0;
                break;
            }
        }

        $("#asnwermodal").modal('show');
        if (matchornot === 0) {
            $("#answermessage").html("<h3 style='color:red'> તમારો જવાબ ખોટો છે. </h3><img src='" + pathgif + imagesArrayF[num] + "'/>");
            wornganswer++;
        } else {
            $("#answermessage").html("<h3 style='color:green'>શાબાશ! તમારો જવાબ સાચો છે. </h3><img src='" + pathgif + imagesArrayT[num] + "'/>");
            trueanswer++;
        }
    } else {
        $("#errormodal").modal("show");
    }
}

function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) ;
    return o;
}

function askNextQuestion() {
    $("#asnwermodal").modal('hide');
    $('#questiontext').html('');
    $('#questionanswer').html('');
    $("#deletewordid").hide();
    displayQuestions(currentquestionnumber);
}

//this function work after all question finish
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
