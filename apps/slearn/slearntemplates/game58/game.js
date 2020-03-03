var question = [];
var questionText = [];
var shuffledQuestionNumber = [];
var currentquestionnumber = 0;
var xml;
var allTrueAnswerCount = 0;
var xmlQuestionAnswerValue
var copyOptionArray = [];
var copyAnswerArray = [];
var count;
var cnt = 0;
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
    $.ajax({
        type: 'GET',
        url: questionxmlurl,
        dataType: "xml",
        success: function (data) {
            xml = $(data);
            CheckAnchor();
            loadAllQuestionsToMemory();
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
    displayQuestions(currentquestionnumber);
}

function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) ;
    return o;
}

function loadAllQuestionsToMemory() {
    count = 0;
    $(xml).find('Question').each(function () {
        totalquestion = xml.find("QuestionText").length;
        question[count] = xml.find("QuestionID")[count].firstChild.data;
        questionText[count] = xml.find("QuestionText")[count].firstChild.data;
        shuffledQuestionNumber[count] = count;
        count++;
    });
    shuffledQuestionNumber = shuffle(shuffledQuestionNumber);
}

function LoadXmlQuestionToMemory() {
    var QuestionNumber = $(xml).find('QuestionID').filter(function () {
        return $(this).text() === qusid; // pass the question
    }).parent();

    // console.log("Question Id Length " + QuestionNumber.length);

    // Store OptionText
    for (i = 0; i < QuestionNumber.length; i++) {
        var len = $(QuestionNumber[i]).find('OptionText').length;
        for (j = 0; j < len; j++) {
            var queText = $(QuestionNumber[i]).find('OptionText')[j].firstChild.data;
            copyOptionArray[j] = queText;
        }
    }
    // console.log(copyOptionArray)

    xmlQuestionAnswerValue = [];

    for (var key in copyOptionArray) {
        xmlQuestionAnswerValue.push({
            id: eval(key) + 1,
            value: copyOptionArray[key]
        })
    }
    // console.log(xmlQuestionAnswerValue);

    //this below generate the random number options
    xmlQuestionAnswerValue.sort(function () {
        return Math.random() - .5
    });

    $("#optiondetails").html('');
    for (var k = 0; k < xmlQuestionAnswerValue.length; k++) {
        $('#optiondetails').append('<div class="radio"><label class="radioButton">' +
            '<span><input style="margin-left:10px;" type="checkbox" name="chk" id="click' + k + '" onclick="ClickCount(' + k + ')" value="' + xmlQuestionAnswerValue[k].id + '"> </span><span class="pl-10">' +
            xmlQuestionAnswerValue[k].value + '</span></label></div>' +
            '</div>');
    }

    // Store AnswerText
    for (i = 0; i < QuestionNumber.length; i++) {
        var len = $(QuestionNumber[i]).find('Answer').length;
        for (j = 0; j < len; j++) {
            var queText = $(QuestionNumber[i]).find('Answer')[j].firstChild.data;
            copyAnswerArray[j] = queText;
        }
    }
}

//click check and count select tick
function ClickCount(id) {
    var check = document.getElementById("click" + id).checked;
    if (check == true) {
        cnt++;
        console.log("Counter is: " + cnt);
    } else {
        cnt--;
        console.log("Counter is: " + cnt);
    }
}

function displayQuestions(count) {
    if ((currentquestionnumber + 1) > question.length) {
        checkGameStatus();
    } else {
        qusid = question[shuffledQuestionNumber[count]]; // find the question id
        console.log("Display Current Question Number :- " + qusid);
        $("#questiontext").html("<span onclick='togglePlay(" + question[shuffledQuestionNumber[count]] + ")'><img id='audioImg' src='/apps/slearn/slearntemplates/assets/pause.png' width='40'></span><span class='pl-5'> [" + (currentquestionnumber + 1) + "] " + questionText[shuffledQuestionNumber[count]] + "</span>");
        LoadXmlQuestionToMemory();
        hideQuesAudioImg();
    }
}

function checkArrays(arrA, arrB) {
    //check if lengths are different
    if (arrA.length !== arrB.length) return false;

    //slice so we do not effect the original
    //sort makes sure they are in order
    //join makes it a string so we can do a string compare
    var cA = arrA.slice().sort().join(",");
    var cB = arrB.slice().sort().join(",");

    return cA === cB;
}

//click button and getSelect Checkbox Values and Check Answer
function GetDataAndCheckAnswe(anscheckboxName) {
    stopQuestionAudio();
    var num = Math.floor(Math.random() * 3); //changeG
    var storeselectAnswerValue = [];

    if (cnt != 0) {
        currentquestionnumber++;
        var flagCounterTrue = 0;

        var checkboxesvalue = document.querySelectorAll('input[name="chk"]:checked'), values = [];
        Array.prototype.forEach.call(checkboxesvalue, function (el) {
            values.push(eval(el.value));
        });

        if (values.length === copyAnswerArray.length) {
            for (var keyVal in values) {
                for (var keyVal1 in xmlQuestionAnswerValue) {
                    if (values[keyVal] === xmlQuestionAnswerValue[keyVal1].id) {
                        storeselectAnswerValue.push(xmlQuestionAnswerValue[keyVal1].value)
                    }
                }
            }

            var checkAnswerMatchOrNot = checkArrays(storeselectAnswerValue, copyAnswerArray);

            if (checkAnswerMatchOrNot === true) {
                $("#asnwermodal").modal('show');
                $("#answermessage").html("<h3 style='color:green'>શાબાશ! તમારો જવાબ સાચો છે. </h3><img src='" + pathgif + imagesArrayT[num] + "'/>");
                answermarks.push(1); //this array store value 1 if answer true
            } else {
                $("#asnwermodal").modal('show');
                $("#answermessage").html("<h3 style='color:red'> તમારો જવાબ ખોટો છે. </h3><img src='" + pathgif + imagesArrayF[num] + "'/>");
                answermarks.push(0); //this array store value 0 if answer false
            }

            console.log(checkArrays(storeselectAnswerValue, copyAnswerArray));
        } else {
            console.log("answer does not match");
            $("#asnwermodal").modal('show');
            $("#answermessage").html("<h3 style='color:red'> તમારો જવાબ ખોટો છે. </h3><img src='" + pathgif + imagesArrayF[num] + "'/>");
            answermarks.push(0); //this array store value 0 if answer false
        }
    }
}

//display next question
function askNextQuestion() {
    $("#asnwermodal").modal('hide');
    $("#questiontext").html('');
    $("#game_table").html('');
    copyOptionArray.length = 0;
    copyAnswerArray.length = 0;
    cnt = 0;
    console.log("Answer Length new :-" + copyOptionArray.length);
    showhidePreviousQuesionBtn();
    displayQuestions(currentquestionnumber);
}

function checkGameStatus() {
    var wornganswer = countElement(0, answermarks);
    var trueanswer = countElement(1, answermarks);
    var percentage_correct = (Number(trueanswer) / Number(question.length)) * 100;
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
