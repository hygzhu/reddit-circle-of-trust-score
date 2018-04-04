// ==UserScript==
// @name         Reddit April Fools 2018 Trust Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Updates Usernames with /r/CircleOfTrust flairs in the reddit inbox (Only works for accounts with old profile at the moment)
// @author       hygzhu
// @match        *.reddit.com/message/inbox/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // @run-at document-end
    let authors = document.getElementsByClassName("author");
    for(let i = 0; i < authors.length; i++){
        let profile_link = authors[i].href;
        let comment_permalink = "";
        let profile = new XMLHttpRequest();
        profile.onload = function () {
            if(profile.readyState == 4){
                let parser = new DOMParser();
                let doc = parser.parseFromString(profile.responseText, "text/html");
                let comments = doc.getElementsByClassName("bylink");
                for(let j = 0; j < comments.length; j++){
                    if(comments[j].href.startsWith("https://www.reddit.com/r/CircleofTrust/comments")){
                        comment_permalink = comments[j].href;
                        break;
                    }
                }
                let permalinked_comment = new XMLHttpRequest();
                permalinked_comment.onload = function(){
                    if(permalinked_comment.readyState == 4){
                        let new_doc = parser.parseFromString(permalinked_comment.responseText, "text/html");
                        let flairs = new_doc.getElementsByClassName("author submitter");
                        authors[i].innerHTML += ` (Flair: ${flairs[0].parentNode.getElementsByClassName("flair")[0].innerHTML})`;
                    }
                };
                console.log(comment_permalink);
                permalinked_comment.open("GET", comment_permalink, true);
                permalinked_comment.send();
            }
        };
        console.log(profile_link);
        profile.open("GET", profile_link, true);
        profile.send();
    }
})();