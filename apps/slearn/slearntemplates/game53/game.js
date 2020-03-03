var storeImageName = [];
var userSelectStoreImageId = [];
var imagematchcounter = 0;
var row = 5;
var column = 6;
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
    LoadFrontImage();
    // var time = $(xml).find('ShowImageTime').text();
    var time = 10;
    setTimeout(function () {
        BackImageLoad();
    }, time * 1000);
}

function LoadFrontImage() {
    // this for loop store image name in array
    for (i = 1; i <= row * column; i++) {
        var removeExtension = xml.find("Image" + i).text().split('.'); // remove extension .jpg
        storeImageName.push(removeExtension[0]);
    }

    // this function sort store image array
    storeImageName.sort(function () {
        return Math.random() - .5
    });

    // this below code sort after show image on table
    var $game_table1 = $("#imageDisplay");
    var counter = 0;
    for (var i = 0; i < row; ++i) {
        var tr = $("<tr></tr>");
        $game_table1.append(tr);
        for (var j = 0; j < column; ++j) {
            var frontImageUrl = mat + "images/" + storeImageName[counter] + '.jpg';
            tr.append("<td align='center'><img src='" + frontImageUrl + "' class='img-thumbnail img-responsive' width='100' height='100'></td>");
            counter++;
        }
    }
}

// this function checks if user has selected one cell for more then one time
function isInArray(value, array) {
    return array.indexOf(value) > -1;
}

function BackImageLoad() {
    document.getElementById('imageDisplay').innerHTML = '';
    var $game_table = $("#imageDisplay");
    var counter = 0;
    for (var i = 0; i < row; ++i) {
        var tr = $("<tr></tr>");
        $game_table.append(tr);
        for (var j = 0; j < column; ++j) {
            var backImageUrl = mat + "images/click.gif";
            tr.append("<td align='center'><img src='" + backImageUrl + "' id='" + counter + "' width='100' height='100'></td>");
            counter++;
        }
    }

    $('img').click(function () {
        if (userSelectStoreImageId.length > 0) {
            var matchImageId = isInArray(this.id, userSelectStoreImageId);
            if (matchImageId == true) {
                console.log('this image is all ready selected');
            } else {
                console.log('Add imageId in array successfully');
                clickOnImageShowFrontImage(this.id, true);
            }
        } else {
            clickOnImageShowFrontImage(this.id, false);
        }
    });
}

function clickOnImageShowFrontImage(imageid, condition) {
    userSelectStoreImageId.push(imageid);
    $("#" + imageid).attr('src', mat + "images/" + storeImageName[imageid] + '.jpg');

    if (condition == true) {
        checkUserSelectImageMatchOrNot();
    }
}

function checkUserSelectImageMatchOrNot() {
    // this if condition remove last word if length greater then 1
    if (storeImageName[userSelectStoreImageId[0]].length > 1) {
        var removeLastWordImageName = storeImageName[userSelectStoreImageId[0]].substring(0, storeImageName[userSelectStoreImageId[0]].length - 1);
    } else {
        var removeLastWordImageName = storeImageName[userSelectStoreImageId[0]];
    }

    // this if condition remove last word if length greater then 1
    if (storeImageName[userSelectStoreImageId[1]].length > 1) {
        var removeLastWordImageName1 = storeImageName[userSelectStoreImageId[1]].substring(0, storeImageName[userSelectStoreImageId[1]].length - 1);
    } else {
        var removeLastWordImageName1 = storeImageName[userSelectStoreImageId[1]];
    }

    // this if condition check image name match or not
    if (removeLastWordImageName == removeLastWordImageName1) {
        console.log("Match");
        imagematchcounter++;
        playAudio("/apps/slearn/slearntemplates/libs/mp3/applause.mp3");
        setTimeout(function () {
            $("#" + userSelectStoreImageId[0]).addClass("hide");
            $("#" + userSelectStoreImageId[1]).addClass("hide");
            userSelectStoreImageId = [];
        }, 100);
    } else {
        console.log("Not match");
        playAudio("/apps/slearn/slearntemplates/libs/mp3/no.mp3");
        setTimeout(function () {
            $("#" + userSelectStoreImageId[0]).attr('src', mat + "images/click.gif");
            $("#" + userSelectStoreImageId[1]).attr('src', mat + "images/click.gif");
            userSelectStoreImageId = [];
        }, 100);
    }

    if (imagematchcounter == (row * column) / 2) {
        var num = Math.floor(Math.random() * 3);
        $("#successmodal").modal('show');
        $("#anst").html("<img src='" + pathgif + imagesArrayT[num] + "'/>");
    }
}

function playAudio(sAudio) {
    var audioElement = document.getElementById('audioEngine');
    if (audioElement !== null) {
        audioElement.src = sAudio;
        audioElement.play();
    }
}