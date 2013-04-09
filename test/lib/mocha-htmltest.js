/* 
 * Copyright 2013 The Toolkitchen Authors. All rights reserved.
 * Use of this source code is governed by a BSD-style
 * license that can be found in the LICENSE file.
 */

(function() {
  var thisFile = 'lib/mocha-htmltest.js';
  var base, next, iframe;

  (function() {
    var s$ = document.querySelectorAll('script[src]');
    Array.prototype.forEach.call(s$, function(s) {
      var src = s.getAttribute('src');
      var re = new RegExp(thisFile + '[^\\\\]*');
      var match = src.match(re);
      if (match) {
        base = src.slice(0, -match[0].length);
      }
    });
  })();

  var listener = function(event) {
    if (event.data === 'ok') {
      next();
    } else if (event.data && event.data.msg) {
      throw event.data.msg;
    }
  };
  
  function htmlSetup() {
    window.addEventListener("message", listener);
    iframe = document.createElement('iframe');
    iframe.style.cssText = 'position: absolute; left: -9000em; width:768px; height: 1024px';
    document.body.appendChild(iframe);
  }

  function htmlTeardown() {
    window.removeEventListener('message', listener);
    document.body.removeChild(iframe);
  }

  function htmlTest(src) {
    test(src, function(done) {
      next = done;
      iframe.onload = function() {
      };
      iframe.src = base + src + "?" + Math.random();
    });
  };
  
  function htmlSuite(inName, inFn) {
    suite('bindProperties-declarative', function() {
      setup(htmlSetup);
      teardown(htmlTeardown);
      inFn();
    });
  };
  
  window.htmlTest = htmlTest;
  window.htmlSuite = htmlSuite;
})();