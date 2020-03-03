var questionId = [];
var questiontext = [];
var questionImage = [];
var questionaudio = [];
var storeOriginalOptionText = [];
var storeCopyOptionText = [];
var storeCorrectAnswer = [];
var storeUserSelectAnswer = [];
var shuffledQuestionNumber = [];
var xml;
var currentquestionnumber = 0;
var totalquestion;
var answermarks = [];
var loadAudioSrcPath = "";
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
            //launchLaunchModal();
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

Array.prototype.diff = function (arr2) {
    var ret = [];
    this.sort();
    arr2.sort();
    for (var i = 0; i < this.length; i += 1) {
        if (arr2.indexOf(this[i]) > -1) {
            ret.push(this[i]);
        }
    }
    return ret;
};

function checkEmpty() {
    var emapty = $("input[name=check]:checked").val();
    if (emapty == undefined) {
        console.log("Select Answer");
    } else {
        checkAnswer();
    }
}

function loadQuestionsToMemory() {
    var count = 0;
    $(xml).find('Question').each(function () {
        totalquestion = xml.find("QuestionText").length;
        questionId[count] = xml.find("QuestionID")[count].firstChild.data;
        questiontext[count] = xml.find("QuestionText")[count].firstChild.data;
        questionImage[count] = mat + xml.find("QuestionImage")[count].firstChild.data;
        questionaudio[count] = xml.find("QuestionAudio")[count].firstChild.data;
        shuffledQuestionNumber[count] = count;
        count++;
    });
    shuffledQuestionNumber = shuffle(shuffledQuestionNumber);
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

function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) ;
    return o;
}

function displayQuestions(count) {
    if ((currentquestionnumber + 1) > questiontext.length) {
        checkGameStatus();
    } else {
        loadAudioSrcPath = questionaudio[shuffledQuestionNumber[count]];
        console.log("audiopath is : " + loadAudioSrcPath)


        $("#questiontext").html('<span>' + '<img id="audioImg" src="/apps/slearn/slearntemplates/assets/pause.png" height="42" width="42" onClick="togglePlay(loadAudioSrcPath)"></span><span class="pl-5"> ' + '[' + (currentquestionnumber + 1) + ']' + '</span>' + '<span>'
            + questiontext[shuffledQuestionNumber[count]] + '</span>'
        );
        $("#questionimage").html("<img src='" + questionImage[shuffledQuestionNumber[count]] + "' style='width:100%;' />");
        qusid = questionId[shuffledQuestionNumber[count]];
        LoadDataToMemory();
    }
}


function LoadDataToMemory() {
    storeCorrectAnswer = [];
    storeCopyOptionText = [];
    storeOriginalOptionText = [];
    storeUserSelectAnswer = [];

    var questionNo = $(xml).find('QuestionID').filter(function () {
        return $(this).text() === qusid; // pass the question
    }).parent();

    // Display Question id wise
    for (i = 0; i < questionNo.length; i++) {
        var optionLength = $(questionNo[i]).find('OptionText').length;
        var answerLength = $(questionNo[i]).find('answer').length;

        for (j = 0; j < optionLength; j++) {
            var optionText = $(questionNo[i]).find('OptionText')[j].firstChild.data;
            storeOriginalOptionText.push(optionText);
            storeCopyOptionText.push(optionText);
        }

        for (m = 0; m < answerLength; m++) {
            var answerText = $(questionNo[i]).find('answer')[m].firstChild.data;
            storeCorrectAnswer.push(answerText);
        }
    }

    // Randomly Generate the Array Value
    storeCopyOptionText.sort(function () {
        return Math.random() - .5
    });
    console.log('Display Random Option Text : ' + storeCopyOptionText);

    $("#loadoptionsdetails").html(' ');
    for (var k = 0; k < storeCopyOptionText.length; k++) {
        $("#loadoptionsdetails").append('<div class="radio"><label class="radioButton"><span class="pt-2 pl-5"><input type="checkbox" name="check" class="chk" value="' + storeCopyOptionText[k] + '" id="' + k + '"></span><span class="pl-10">' +
        storeCopyOptionText[k] + '</span></label></div>');
    }
}

function checkAnswer() {
    stopQuestionAudio();
    currentquestionnumber++;
    var num = Math.floor(Math.random() * 3);

    $(".chk:checked").each(function () {
        storeUserSelectAnswer.push($(this).val());
    });
    console.log('User Select Option Answer : ' + storeUserSelectAnswer);

    if (storeCorrectAnswer.length === storeUserSelectAnswer.length) {
        console.log('Both Length Match');
        var matchAnsValue = storeCorrectAnswer.diff(storeUserSelectAnswer);

        if (matchAnsValue.length === storeCorrectAnswer.length) {
            answermarks.push(1); //this array store value 1 if answer true
            $("#asnwermodal").modal('show');
            $("#answermessage").html("<h3 style='color:green'>શાબાશ! તમારો જવાબ સાચો છે. </h3><img src='" + pathgif + imagesArrayT[num] + "'/>");
        } else {
            answermarks.push(0); //this array store value 0 if answer false
            $("#asnwermodal").modal('show');
            $("#answermessage").html("<h3 style='color:red'> તમારો જવાબ ખોટો છે. </h3><img src='" + pathgif + imagesArrayF[num] + "'/>");
        }
    } else {
        answermarks.push(0); //this array store value 0 if answer false
        $("#asnwermodal").modal('show');
        $("#answermessage").html("<h3 style='color:red'> તમારો જવાબ ખોટો છે. </h3><img src='" + pathgif + imagesArrayF[num] + "'/>");
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
