window.onload = init;

function init() {
  initMobileMenu();
  preventPasteStyles();
}

function initMobileMenu() {

  var forEach = function (array, callback, scope) {
    for (var i = 0; i < array.length; i++) {
      callback.call(scope, i, array[i]); // passes back stuff we need
    }
  };
  var sidebarMenuContainers = document.querySelectorAll( '.sidebar-menu' );

  forEach(sidebarMenuContainers, function ( index, el ) {

    var sidebarMenuElements = el.querySelectorAll( 'li' );

    forEach(sidebarMenuElements, function ( index, element ) {
      var currentWidget = window.location.href;
      var sidebarMenuLink  = element.querySelector( 'a' );

      if ( currentWidget == sidebarMenuLink.href + '/' ) {
        element.className += 'active-widget';
      }
    } );

  } );

  var hamburger = {
    navToggle: document.querySelectorAll( '.nav-toggle' ),
    nav: document.querySelector( '.nav-mobile' ),

    doToggle: function( e ) {
      e.preventDefault();
      this.nav.classList.toggle( 'expanded' );
    }
  };

  forEach(hamburger.navToggle, function(index, el ) {
    el.addEventListener( 'click', function( e ) {
            hamburger.doToggle( e );
        } );
  } );

}


function preventPasteStyles() {
  var configurationBox = document.getElementsByName('contentEditableConfig')[0];
  if(!configurationBox) {return }

  configurationBox.addEventListener('paste', function (e) {
    e.preventDefault();
    e.stopPropagation();
    var text = '';
    if (e.clipboardData || (e.originalEvent && e.originalEvent.clipboardData)) {
      text = (e.originalEvent || e).clipboardData.getData('text/plain');
    } else if (window.clipboardData) {
      text = window.clipboardData.getData('text');
    }
    replaceSelectedText(text);
  });
}
function replaceSelectedText(replacementText) {
  var sel, range;
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel.rangeCount) {
      range = sel.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(replacementText));
    }
  } else if (document.selection && document.selection.createRange) {
    range = document.selection.createRange();
    range.text = replacementText;
  }
}

function setMenuLinks(domain) {
  var contentDomainLink = document.querySelectorAll('.contentDomainLink');
  var contentDomainApiLink = document.querySelectorAll('.contentDomainApiLink');
  var contentDomainSupportLink = document.querySelectorAll('.contentDomainSupportLink');
  var logoLink = document.querySelectorAll('.logo-link')[0];
  logoLink.href = domain;
  for (var i = 0; i < contentDomainLink.length; i++) {
    contentDomainLink[i] = contentDomainLink[i] ? contentDomainLink[i].href = domain + 'getting-started/' : "";
    contentDomainApiLink[i] = contentDomainApiLink[i] ? contentDomainApiLink[i].href = domain + 'dtn-apis/' : "";
    contentDomainSupportLink[i] = contentDomainSupportLink[i] ? contentDomainSupportLink[i].href = domain + 'support/' : "";
  }
}

function reviver(key, value) {
  if (key === "callbacks") {
    var callbacks = {};

    Object.keys(value).forEach(function (cbName) {
      callbacks[cbName] = window[value[cbName]];
    });
    return callbacks;
  }
  return value;
}

function logCallback() {
  var args = Array.prototype.slice.call(arguments);
  args.forEach(function (arg) {
    console.log(arg);
  })
}

function deCapitalize(str) {
  return str[0].toLowerCase() + str.slice(1);
}
