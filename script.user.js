// ==UserScript==
// @name           BBC Corrector
// @namespace      https://github.com/jj-style/bbcorrector
// @description    Corrects the BBCs refusal to use the word terrorist when talking about terrorists.
// @match          *://*.bbc.com/news/*
// @match          *://*.bbc.co.uk/news/*
// @copyright      JJ Style
// @version        0.0.2
// @license        GPLv3
// ==/UserScript==

(function () {
    'use strict';
    // bit hacky with timeout but on slower connections makes loading the images a bit more reliable.
    setTimeout(function() { }, 1000);
    window.addEventListener('load', function() {
        const ignoreTags = ['PRE', 'BLOCKQUOTE', 'CODE', 'INPUT', 'BUTTON', 'TEXTAREA'];
        const allBodyText = document.body.innerText.toLowerCase();
        const bodyText = document.evaluate('//body//text()[ normalize-space(.) != "" ]', document, null, 6, null);

        // substitutions to make based on any of the keywords appearing in the article
        let subs = [
            {from: 'militant(s)?', to: 'terrorist$1', keywords: ['hamas', 'gaza', 'israel']},
            {from: 'Militant(s)?', to: 'Terrorist$1', keywords: ['hamas', 'gaza', 'israel']},
            {from: 'Hamas fighters', to: 'Hamas terrorists', keywords: ['hamas', 'gaza', 'israel']},
        ]

        // filter the substitutions to apply based on whether the keywords are in the article
        subs = subs.filter(x => x.keywords.some(word => new RegExp(word,'g').test(allBodyText)));

        // get document text and perform replacements
        var text;
        for (let i = 0; text = bodyText.snapshotItem(i); ++i) {
            if ( ignoreTags.indexOf(text.parentNode.tagName) === -1 ) {
                for (const sub of subs) {
                    text.data = text.data.replace(new RegExp(sub.from,'g'), sub.to);
                }
            }
        }
    }, false);

}());


