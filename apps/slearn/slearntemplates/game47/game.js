var question = [];
var questionid = [];
var correctanswer = [];
var cppanswer = [];
var currentquestionnumber = 0;
var allanswerstrue = true;
var shuffledQuestionNumber = [];
var arrayText = [];
var cparry;
var quesid;
var len;
var xmlname = "/question.xml";
var session = sessionStorage.getItem("subject") + "/" + sessionStorage.getItem("level");
var url = window.location.href;
url = url.split("/");
url = url[0] + "//" + url[2];
url = url.slice(0, url.length - 4);
url = url + "9999/slearn";
var questionxmlurl = url + "/cont/" + session + xmlname;
var mat = url + "/mat/" + session + "/";
var audioSrc = "";
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

function startGame() {
    $("#launchmodal").modal('hide');
    var vid = document.getElementById("audioIns");
    vid.pause();
    audioSrc = mat + '0.mp3';
    $("#gmins").html("<span onclick='playAudio(audioSrc)'><img id='audioImg0' src='/apps/slearn/slearntemplates/assets/play.jpg' width='40'></span><span class='pl-5'>" + $(xml).find("GameInstruction").text() + "</span>");
    LoadWordToMemomery();
    displayQuestions(currentquestionnumber);
}

function CheckAnchor() {
    launchLaunchModal();
}

function loadQuestionsToMemory() {
    var count = 0;
    $(xml).find('Question').each(function () {
        questionid[count] = xml.find("QuestionID")[count].firstChild.data;
        question[count] = xml.find("QuestionText")[count].firstChild.data;
        correctanswer[count] = xml.find("CorrectAnswer")[count].firstChild.data;
        $("#op" + (count + 1)).html(xml.find("Title")[count].firstChild.data);
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
    if ((currentquestionnumber + 1) > question.length) {
        $("#successmodal").modal('show');
    } else {
        quesid = questionid[shuffledQuestionNumber[count]];
        $("#questiontext").html("<span onclick='togglePlay(" + quesid + ")'><img id='audioImg' src='/apps/slearn/slearntemplates/assets/pause.png' width='40'></span><span class='pl-5'> [" + (currentquestionnumber + 1) + "] " + question[shuffledQuestionNumber[count]] + "</span>");
        cppanswer = correctanswer[shuffledQuestionNumber[count]];
        currentquestionnumber++;
        hideQuesAudioImg();
        hideInsAudioImg();
    }
}

function LoadWordToMemomery() {
    var wordLen = $(xml).find('Word').length;
    var wordText = $(xml).find('Word');
    len = wordLen / 2;

    for (m = 0; m < wordLen; m++) {
        cparry = wordText[m].firstChild.data;
        arrayText[m] = cparry.trim();
    }

    arrayText.sort(function () {
        return Math.random() - .5
    });

    var game_table = $("#game_table");
    var counter = 0;
    for (i = 0; i < len; i++) {
        var tr = $("<tr></tr>");
        game_table.append(tr);
        for (j = 0; j < 2; j++) {
            tr.append("<td align='center' id='" + "cl" + counter + "'>" + arrayText[counter] + "</td>");
            counter++;
        }
    }

    InsertData();
}

function InsertData() {
    var num = Math.floor(Math.random() * 3); //changeG
    var cnt = 0;
    var storeselectoptionValue = [];

    $("td").click(function () {
        var splt = cppanswer.split("-");
        var tdText = $(this).text();
        var tdId = this.id;

        if (quesid == 1 || quesid == 2) {
            console.log(tdText);

            var selectOptionValueMatch = 0;

            if (storeselectoptionValue.length > 0) {
                for (var i = 0; i < storeselectoptionValue.length; i++) {
                    if (tdText === storeselectoptionValue[i]) {
                        selectOptionValueMatch = 1;
                    }
                }
            }

            if (selectOptionValueMatch != 1) {
                var flag = 0;
                for (row = 0; row < splt.length && !flag; row++) {
                    console.log(splt[row]);
                    if (splt[row] === tdText) {
                        flag++;
                    } else {
                        flag = 0;
                    }
                }

                if (flag == 0) {
                    console.log("Not Match");
                    playAudio("/apps/slearn/slearntemplates/libs/mp3/no.mp3");
                } else {
                    console.log("Match");
                    playAudio("/apps/slearn/slearntemplates/libs/mp3/applause.mp3");
                    $("#div" + quesid).append("<h4 align='center' class='answer'>" + tdText + "</h4>");
                    var elem = document.getElementById(tdId);
                    storeselectoptionValue.push(tdText);
                    // elem.style.display = "none";
                    cnt++;
                }

                if (cnt == len || cnt == (len * 2)) {
                    stopQuestionAudio();
                    console.log("current question numeber:-" + currentquestionnumber)
                    if (currentquestionnumber == 1) {
                        setTimeout(function () {
                            $("#asnwermodal").modal('show');
                        }, 100);
                    } else {
                        setTimeout(function () {
                            $("#successmodal").modal('show');
                        }, 100);
                    }
                }
            }
        }
    });
}

function playAudio(sAudio) {
    var audioElement = document.getElementById('audioEngine');
    if (audioElement !== null) {
        audioElement.src = sAudio;
        audioElement.play();
    }
}

function askNextQuestion() {
    $("#asnwermodal").modal('hide');
    displayQuestions(currentquestionnumber);
}
