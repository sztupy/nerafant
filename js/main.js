var images =
    [
        ['GU',
        'PAL',
        'PIN',
        'SEM',
        'OR',
        'KÁS',
        'SZÍJ',
        'RO',
        'MÜL',
        'MÉ',
        'HA',
        'MÁ',
        'Dr',
        'KÖ',
        'SI',
        'KO',
        'Dr',
        'FÓ',
        'NO',
        'DE'],
        ['LYÁ',
        'KO',
        'TÉ',
        'JÉ',
        'BÁ',
        'LE',
        'JÁ',
        'GÁ',
        'LE',
        'SZÁ',
        'BO',
        'GE',
        'VA',
        'VÉ',
        'MO',
        'VÁ',
        'PO',
        'NA',
        'VÁ',
        'ME'],
        ['S',
        'VICS',
        'R',
        'N',
        'N',
        'R',
        'RTÓ',
        'N',
        'R',
        'ROS',
        'NY',
        'R',
        'RGA',
        'R',
        'NKA',
        'CS',
        'LT',
        'GY',
        'K',
        'TER']
    ];

var numImages = images[0].length + images[1].length + images[2].length;
var notPreLoadedImages = numImages;

var selected = [0,0,0];

function getFileName(type, pos) {
    var character = 'A';
    if (type === 1) character = 'B';
    if (type === 2) character = 'C';

    var num = pos + '';
    if (num.length<2) num = '0' + num;

    return 'img/' + character + '_' + num + '_' + images[type][pos] + '.jpg';
}

function getAnother() {
    if (notPreLoadedImages > 0) {
        return;
    }

    for (var type = 0; type <= 2; type++) {
        animatedChange(type);
    }

    return false;
}

function animatedChange(type) {
    var timeoutRemainig = type * 1000 + 2000;
    var step = 50;

    change(type);
    animatedChangeStep(type, timeoutRemainig, step);
}

function animatedChangeStep(type, timeoutRemainig, step) {
    setTimeout(
        function() {
            change(type);
            var newStep = 50;
            if (timeoutRemainig<1000) newStep = 100;
            if (timeoutRemainig<600) newStep = 200;
            if (timeoutRemainig<300) newStep = 500;
            if (timeoutRemainig>0) {
                animatedChangeStep(type, timeoutRemainig - step, newStep)
            } else {
                randomChange(type);
            }
        },
        step
    )
}

function randomChange(type) {
    var num = Math.floor(Math.random() * images[type].length);

    selected[type] = num;

    document.getElementById("img_" + type).src = getFileName(type, num)
}

function change(type) {
    if (notPreLoadedImages > 0) {
        return;
    }

    var num = (selected[type] + 1) % images[type].length;
    selected[type] = num;

    document.getElementById("img_" + type).src = getFileName(type, num)
}

function loaded() {
    notPreLoadedImages -= 1;

    document.getElementById("progress").textContent = Math.round((1 - notPreLoadedImages/numImages)*100) + '%';

    if (notPreLoadedImages == 0) {
        document.getElementById("loading").style.display = "none";
        document.getElementById("buttons").style.display = "block";
        getAnother();
    }
    return true;
}

function downloadImage(e) {
    if (notPreLoadedImages > 0) {
        e.preventDefault();
        return;
    }

    var c = document.createElement('canvas');

    var img = [
        document.getElementById("img_0"),
        document.getElementById("img_1"),
        document.getElementById("img_2")
    ];

    if (c.getContext) {
        c.width = img[0].naturalWidth + 8;
        c.height = img[0].naturalHeight * 3 + 16;

        ctx = c.getContext("2d"), {alpha:false};

        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(img[0], 4, 4);
        ctx.drawImage(img[1], 4, 8 + img[0].naturalHeight);
        ctx.drawImage(img[2], 4, 12 + img[0].naturalHeight + img[1].naturalHeight);

        var dt = c.toDataURL('image/jpeg');

        dt = dt.replace(/^data:image\/[^;]*/, 'data:application/octet-stream');

        var filename = 'NER_'+images[0][selected[0]]+'_'+images[1][selected[1]]+'_'+images[2][selected[2]]+'.jpg';

        dt = dt.replace(/^data:application\/octet-stream/, 'data:application/octet-stream;headers=Content-Disposition%3A%20attachment%3B%20filename='+filename);

        this.download = filename;
        this.href = dt;
    }
}

var support = function support(feature){
    var tokenList;
    var fakeLink = document.createElement('link');
    try {
        if(fakeLink.relList && fakeLink.relList.supports){
            return fakeLink.relList.supports(feature);
        }
    } catch(err){
        return false;
    }
};
var isPreloadSupported = support('preload');

if (isPreloadSupported) {
    for (var type = 0; type <= 2; type++) {
        for (var i = 0; i < images[type].length; i++) {
            var preloadLink = document.createElement("link");
            preloadLink.href = getFileName(type, i);
            preloadLink.rel = "preload";
            preloadLink.as = "image";
            preloadLink.addEventListener("load", loaded);
            document.head.appendChild(preloadLink);
        }
    }
} else {
    notPreLoadedImages = 1;
    loaded();
}

document.getElementById("downloadButton").addEventListener("click", downloadImage, false);
