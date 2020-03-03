var xml;
var count = 0;
var textboxanswers = 0;
var userscorrectanswers = 0;
var textboxid = [];
var allid = [];
var answerbox = [];
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
    var txtboxidcount = 0;
    for (i = 1; i < 10; i++) {
        for (j = 1; j < 10; j++) {
            answerbox[count] = xml.find("ansvalues")[count].firstChild.data;
            if (xml.find("values")[count].firstChild.data != "*") {
                $("#" + i + j).html("<p id='nor" + i + j + "' style='font-size:123%'>" + xml.find('values')[count].firstChild.data + "</p>");
                allid[count] = 'nor' + i + j;
            } else {
                textboxanswers++;
                $("#" + i + j).html("<input class='form-control' type='text' maxlength='1' id='txt" + i + j + "' required />");
                textboxid[txtboxidcount] = "txt" + i + j;
                txtboxidcount++;
                allid[count] = 'txt' + i + j;
            }
            count++;
        }
    }
}

function startGame() {
    $("#launchmodal").modal('hide');
    var vid = document.getElementById("audioIns");
    vid.pause();
}

function checkAnswer() {
    var finalcount = 0;
    for (i = 1; i < 10; i++) {
        for (j = 1; j < 10; j++) {
            if (allid[finalcount] == "txt" + i + j) {
                if ($("#" + allid[finalcount]).val() == answerbox[finalcount]) {
                    userscorrectanswers++;
                    if (textboxanswers == userscorrectanswers) {
                        $("#successmodal").modal("show");
                    }
                } else {
                    $("#warningmessage").html("<h3> કોઈ પણ એક ખાનું  ખાલી છે અથવા તમારો જવાબ ખોટો છે. મહેરબાની કરી ને તપાસો. </h3>");
                    $("#failuremodal").modal("show");
                    console.log("Answer is wrong !!!");
                    break;
                }
            }
            finalcount++
        }
    }
}
