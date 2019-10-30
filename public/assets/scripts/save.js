'use strict';

/**
 * Original code from:
 * https://thiscouldbebetter.wordpress.com/2012/12/18/loading-editing-and-saving-a-text-file-in-html5-using-javascrip/
 * 
 * Extracted from answer for:
 * https://stackoverflow.com/questions/609530/download-textarea-contents-as-a-file-using-only-javascript-no-server-side
 * 
 * by NatureShade and SmartManoj
 * 
 * Adapted for jQuery by Rafael Vila 2019
 */

const downloadAction = () => {
    var saveThis = confirm('Do you want to download palette as file');

    if (saveThis) {
        saveTextAreaAs()
    } else {
        return false;
    }
}

const returnMime = (name) => {
    var date = new Date(),
        dateStamp = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`
            + `-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
    if (name.match(/^scss-/)) {
        return {file: name.replace('-template.temp', `-${dateStamp}.scss`), mime: 'text/x-scss'};
    } else if (name.match(/^c-/)) {
        return {file: name.replace('-template.temp', `-${dateStamp}.php`), mime: 'application/x-httpd-php'};
    } else if (name.match(/^json-/)) {
        return {file: name.replace('-template.temp', `-${dateStamp}.json`), mime: 'application/json'};
    }

    return false;
}

const saveTextAreaAs = () => {
    const filename = $('#filename').text(),
          mimeStr = returnMime(filename);

    var textToSave = $('#console').text(),
        textBlob,
        downloadLink;

    if (!mimeStr || filename.length === 0) {
        alert('Select format to download');
        return false;
    }
    $('body').append('<a id="downloadLink" style="display: none;">Downloading File</a>');

    if (mimeStr.mime === 'application/x-httpd-php') {
        textToSave = '<?php\r\n' + textToSave + '\r\n?>';
    }

    textBlob = new Blob([textToSave], {type: mimeStr.mime});
    downloadLink = $('#downloadLink');


    downloadLink.attr('download', mimeStr.file);

    if (window.webkitURL !== null) {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.attr('href', window.webkitURL.createObjectURL(textBlob));
    } else {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.attr('href', window.URL.createObjectURL(textBlob));
    }

    document.getElementById('downloadLink').click();
    $(downloadLink).remove();
}

//original code
function saveTextAsFile(textToWrite, fileNameToSaveAs)
{
    var textFileAsBlob = new Blob([textToWrite], {type:'text/plain'}); 
    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null)
    {
        // Chrome allows the link to be clicked
        // without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    }
    else
    {
        // Firefox requires the link to be added to the DOM
        // before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();
}