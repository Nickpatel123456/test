var gridimages = [];
var allanswercorrect = true;
var xml;
var questionId = [];
var questions = [];
var answers = [];
var hintTextMatch = [];
var hintImgMatch = [];
var shuffledQuestionNumber = [];
var hinttext = [];
var hintimage = [];
var currentquestion = 0;
var totalquestion;
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
            launchLaunchModal();
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("Loading xml questions failed");
            console.log(xhr);
            console.log(ajaxOptions);
            console.log(thrownError);
        }
    });
});


function loadQuestions() {
    for (count = 0; count < 9; count++) {
        $(xml).find('imageanswers').each(function () {
            gridimages[count] = xml.find("image")[count].firstChild.data;
        });

        $(xml).find('totalquestions').each(function () {
            totalquestion = xml.find("question").length;
            questionId.push(count + 1);
            questions[count] = xml.find("question")[count].firstChild.data;
        });

        $(xml).find('totalanswers').each(function () {
            answers[count] = xml.find("answer")[count].firstChild.data;
        });

        $(xml).find('hinttext').each(function () {
            hinttext[count] = xml.find("hint")[count].firstChild.data;
        });

        $(xml).find('hintimage').each(function () {
            hintimage[count] = xml.find("hinti")[count].firstChild.data;
        });
        shuffledQuestionNumber[count] = count;
    }
    shuffledQuestionNumber = shuffle(shuffledQuestionNumber);
}

function startGame() {
    $("#launchmodal").modal('hide');
    var vid = document.getElementById("audioIns");
    vid.pause();
    loadQuestions();
    loadGridAndLaunchQuestion();
}

function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x) ;
    return o;
}

function loadGridAndLaunchQuestion() {
    document.getElementById('image1').src = mat + gridimages[0];
    document.getElementById('image2').src = mat + gridimages[1];
    document.getElementById('image3').src = mat + gridimages[2];
    document.getElementById('image4').src = mat + gridimages[3];
    document.getElementById('image5').src = mat + gridimages[4];
    document.getElementById('image6').src = mat + gridimages[5];
    document.getElementById('image7').src = mat + gridimages[6];
    document.getElementById('image8').src = mat + gridimages[7];
    document.getElementById('image9').src = mat + gridimages[8];
    loadQuestion(currentquestion);
}

function loadQuestion(count) {
    $("#questiondiv").html("<span onclick='togglePlay(" + questionId[shuffledQuestionNumber[count]] + ")'><img id='audioImg' src='/apps/slearn/slearntemplates/assets/pause.png' width='40'></span><span class='pl-5'> [" + (currentquestion + 1) + "] " + questions[shuffledQuestionNumber[count]] + "</span>");
    currentquestion++;
    hideQuesAudioImg();
}

function checkAnswers(ans) {
    stopQuestionAudio();
    var num = Math.floor(Math.random() * 3); //changeG
    if (ans == answers[shuffledQuestionNumber[currentquestion - 1]]) {
        $("#successmodal").modal('show');
        $("#anst").html("<img src='" + pathgif + imagesArrayT[num] + "'/>");
        $("#result").html("Total Questions: " + totalquestion);
    } else {
        //allanswercorrect = false;
        if (hinttext[shuffledQuestionNumber[currentquestion - 1]] != '*') {

            $("#hinttext").html(hinttext[shuffledQuestionNumber[currentquestion - 1]]);
        }
        if (hintimage[shuffledQuestionNumber[currentquestion - 1]] != '*') {
            $("#hintimage").html("<img src='" + mat + hintimage[shuffledQuestionNumber[currentquestion - 1]] + "' />");
        }
        $("#failuremodal").modal('show');
        $("#ansf").html("<img src='" + pathgif + imagesArrayF[num] + "'/>");
        // $("#result1").html("Total Questions: "+totalquestion);
    }
}

function goToNext() {
    $("#successmodal").modal('hide');
    if (currentquestion > 8) {
        checkResults();
    } else {
        loadQuestion(currentquestion);
    }
}

function tryAgain() {
    $("#hinttext").html("");
    $("#hintimage").html("");
    $("#failuremodal").modal('hide');
}

function checkResults() {
    $("#gameovermodal").modal('toggle');
    /*if (allanswercorrect == true) {
        $("#gameovermodal").modal('toggle');
    } else {
        $("#restartmodal").modal('toggle');
    } */
}

function restartGame() {
    $("#restartmodal").modal('hide');
}
