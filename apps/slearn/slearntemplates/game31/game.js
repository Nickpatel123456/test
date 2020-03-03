var quesArr = [];
var quesArrFinalData = [];
var ansStoreArr = [];
var spanId = 0;
var optionLenght;
var allanswerstrue = true;
var line = "_____";
var pid;
var oldPID;
var psplit;
var totalquestion = 1;
var trueanswer = 0;
var falseanswer = 0;
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
    LoadXmlData();
    LoadXmlAnsweData();
}

function LoadXmlData() {
    var len = $(xml).find("QuestionText").length;

    for (i = 0; i < len; i++) {
        quesArr[i] = $(xml).find("QuestionText")[i].firstChild.data;

        if (quesArr[i].trim() == "*") {
            spanId++;
            quesArrFinalData[i] = "<span id='spa" + spanId + "'>" + line + "</span><div id='div" + spanId + "' style='display:inline'></div>";
        } else {
            quesArrFinalData[i] = $(xml).find("QuestionText")[i].firstChild.data + "&nbsp;";
        }
    }

    console.log(quesArrFinalData);

    for (j = 0; j < quesArrFinalData.length; j++) {
        $("#questiontext").append(quesArrFinalData[j]);
    }
}

function LoadXmlAnsweData() {
    optionLenght = $(xml).find("OptionText").length;

    console.log("Option Length " + optionLenght);

    for (k = 0; k < optionLenght; k++) {
        ansStoreArr.push($(xml).find("OptionText")[k].firstChild.data);
    }

    var spltLength;
    for (i = 0; i < optionLenght; i++) {
        var splt = ansStoreArr[i].split("-");
        var op = [];

        spltLength = splt.length;
        console.log("ans split new length :-" + spltLength);
        $("#div" + (i + 1)).html(" ( ");
        for (q = 0; q < spltLength; q++) {
            $("#div" + (i + 1)).append("<p id='" + q + "p" + (i + 1) + "' style='display:inline' class='p'>" + splt[q] + "</p>");
            if (q != (spltLength - 1)) {
                $("#div" + (i + 1)).append(", ");
            }
            console.log("split ans Value is:- " + splt[q]);
        }
        $("#div" + (i + 1)).append(" ) ");
    }

    $("p").click(function () {
        oldPID = pid;
        if (oldPID != undefined) {
            var removeclassid = oldPID.slice(1, 3);
            var removeclassid1 = oldPID.slice(0, 1);
            console.log("removeclassid " + removeclassid1);
        }

        pid = this.id;
        $("#" + pid).addClass('selectOptionColor');
        var pvalue = $(this).text();
        psplit = pid.split("p");

        if (removeclassid == "p" + psplit[1]) {
            $("#" + removeclassid1 + removeclassid).removeClass("selectOptionColor");
        } else {
            $("#0p" + psplit[1]).removeClass("selectOptionColor");
            $("#1p" + psplit[1]).removeClass("selectOptionColor");
            $("#2p" + psplit[1]).removeClass("selectOptionColor");
            $("#" + pid).addClass('selectOptionColor');
        }

        console.log(psplit[1] + "Value is:- " + pvalue);
        console.log("P tag id: - " + pid)

        $("#spa" + psplit[1]).html("<u>&nbsp;&nbsp;&nbsp;&nbsp;" + pvalue + "&nbsp;&nbsp;&nbsp;&nbsp;</u>");
    });

    console.log(ansStoreArr);
}

function CheckAnswer() {
    var num = Math.floor(Math.random() * 3); //changeG
    var spanLenght = $("span").length;
    console.log("Span Length " + spanLenght);

    var spanTexrArray = [];
    var ansTextXmlArrayy = [];
    var correctAnsXmlLength = $(xml).find("Answer").length;

    var blankCount = spanLenght;
    for (i = 0; i < spanLenght; i++) {
        spanTexrArray.push($("#spa" + (i + 1)).text().trim());
        console.log("span Array is:-" + spanTexrArray[i]);
        if (spanTexrArray[i] == line) {
            console.log("Blank " + blankCount);
        } else {
            blankCount--;
            console.log("NotBlank " + blankCount);
        }
    }

    for (j = 0; j < correctAnsXmlLength; j++) {
        ansTextXmlArrayy.push($(xml).find("Answer")[j].firstChild.data);
        console.log("Correct answer Array is:-" + ansTextXmlArrayy[j])
    }

    flag = 0;
    for (row = 0; row < correctAnsXmlLength; row++) {
        console.log(ansTextXmlArrayy[row] + "  " + spanTexrArray[row]);
        if (ansTextXmlArrayy[row] == spanTexrArray[row]) {
            console.log("Match");
            flag++;
        } else {
            console.log("Not Match");
            flag = 0;
            break;
        }
    }

    if (blankCount == 0) {
        console.log("ALl span tag is fill");
        if (flag == 0) {
            console.log("Answer is wrong");
            if (sessionStorage.clickcount == 1 && anchor == "Yes") {
                GoBackActivity(); //call the logic common anchor js file
            } else if (sessionStorage.clickcount == 1 && anchor == "No") {
                ConsultToTeacher();
            } else {
                $("#failuremodal").modal('show');
                falseanswer++;
                $("#ansf").html("<img src='" + pathgif + imagesArrayF[num] + "'/>");
                $("#result1").html("Total Questions: " + totalquestion + "&nbsp;&nbsp;&nbsp;&nbsp;  Wrong Answer: " + falseanswer + "&nbsp;&nbsp;&nbsp;&nbsp;  Right Answer: " + trueanswer);
            }
        } else {
            $("#successmodal").modal('show');
            console.log("Answer is correct");
            trueanswer++;
            $("#anst").html("<img src='" + pathgif + imagesArrayT[num] + "'/>");
            $("#result").html("Total Questions: " + totalquestion + "&nbsp;&nbsp;&nbsp;&nbsp;  Wrong Answer: " + falseanswer + "&nbsp;&nbsp;&nbsp;&nbsp;  Right Answer: " + trueanswer);
        }
    } else {
        console.log("anyone span tag is not fill");
    }
}

function restartGame() {
    $("#failuremodal").modal('hide');
    clickCounter();
}