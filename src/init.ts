import M from '@materializecss/materialize';
import  timeago  from 'timeago.js';

document.addEventListener("DOMContentLoaded", function() {
  
    function rgb2hex(rgb) {
      if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;
      rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
      if (rgb === null) return 'N/A';
      function hex(x) {
        return ('0' + parseInt(x).toString(16)).slice(-2);
      }
      return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    }
  
    // Detect touch screen and enable scrollbar if necessary
    function is_touch_device() {
      try {
        document.createEvent('TouchEvent');
        return true;
      } catch (e) {
        return false;
      }
    }
  
    // CSS > Colors
    document.querySelectorAll('.dynamic-color .col > div').forEach(el => {
      const color = getComputedStyle(el).backgroundColor;
      const classesText = Array.from(el.classList).join(' ');
      (el as any).innerText = `${rgb2hex(color)} ${classesText}`;
      // swap text color
      if (classesText.indexOf('darken') >= 0 || el.classList.contains('black'))
        (el as any).style.color = 'rgba(255,255,255,.87';
      else
        (el as any).style.color = 'rgba(0, 0, 0, .87';
    });
  
    // Github Latest Commit
    const githubCommitElem = document.querySelector('.github-commit');
    if (githubCommitElem != null) {         
      // Checks if widget div exists (Index only)
      fetch('https://api.github.com/repos/materializecss/materialize/commits/main')
      .then(resp => resp.json())
      .then(data => {
        const url = data.html_url;
        const sha = data.sha;
        const date = timeago.format(data.commit.author.date);
        (githubCommitElem.querySelector('.date') as HTMLElement).innerText = date;
        (githubCommitElem.querySelector('.sha') as HTMLElement).innerText = sha;
        (githubCommitElem.querySelector('.sha') as HTMLLinkElement).href = url;
      });
    }
  
    // Floating-Fixed Table of Contents
    const tocWrapperHeight = 260; // Max height of ads.
    const socialHeight = 95; // Height of unloaded social media in footer.
    const tocElem = document.querySelector('.toc-wrapper .table-of-contents');
    const tocHeight = tocElem ? tocElem.getBoundingClientRect().height : 0;
    
    const footerElem = document.querySelector('body > footer');
    const footerOffset = footerElem ? (
      // https://youmightnotneedjquery.com/#offset
      footerElem.getBoundingClientRect().top - window.scrollY + document.documentElement.clientTop
    ) : 0;
    const bottomOffset = footerOffset - socialHeight - tocHeight - tocWrapperHeight;
  
    const nav = document.querySelector('nav');
    const indexBanner = document.querySelector('#index-banner');
    const tocWrappers = document.querySelectorAll('.toc-wrapper');
  
    if (M.Pushpin) {
        if (nav)
        M.Pushpin.init(tocWrappers, {top: nav.getBoundingClientRect().height, bottom: bottomOffset});
      else if (indexBanner)
        M.Pushpin.init(tocWrappers, {top: indexBanner.getBoundingClientRect().height, bottom: bottomOffset});
      else
        M.Pushpin.init(tocWrappers, {top: 0, bottom: bottomOffset});  
    }
  
  
    // Toggle Flow Text
    const toggleFlowTextButton = document.querySelector('#flow-toggle');
    const flowDemoParagraphs = document.querySelectorAll('#flow-text-demo p');
    toggleFlowTextButton?.addEventListener('click', e => {
      flowDemoParagraphs.forEach(p => {
        p.classList.toggle('flow-text');
      });
    });
  
    // Toggle Containers on page
    const toggleContainersButton = document.querySelector('#container-toggle-button');
    toggleContainersButton?.addEventListener('click', e => {
      document.querySelectorAll('body .browser-window .container, .had-container').forEach(el => {
        el.classList.toggle('had-container');
        el.classList.toggle('container');
        const nextStateText = el.classList.contains('container') ? 'off' : 'on';
        (toggleContainersButton as HTMLElement).innerText = 'Turn '+ nextStateText +' Containers';
      });
    });
  
    // Set checkbox on forms.html to indeterminate
    const indeterminateCheckbox = document.getElementById('indeterminate-checkbox');
    if (indeterminateCheckbox !== null) 
        (indeterminateCheckbox as any).indeterminate = true;
  
    // CSS Transitions Demo Init
    const scaleDemoElem = document.querySelector('#scale-demo');
    const scaleDemoTriggerElem = document.querySelector('#scale-demo-trigger');
    if (scaleDemoElem && scaleDemoTriggerElem) {
      scaleDemoTriggerElem.addEventListener('click', e => {
        scaleDemoElem.classList.toggle('scale-out');
      });
    }
  
    // Pushpin Demo Init
    const pushPinDemoNavElems = document.querySelectorAll('.pushpin-demo-nav');
    pushPinDemoNavElems.forEach(navElem => {
      const navBox = navElem.getBoundingClientRect();    
      const contentElem = document.querySelector('#'+navElem.getAttribute('data-target'));
      const contentBox = contentElem.getBoundingClientRect();
      const offsetTop = Math.floor(contentBox.top + window.scrollY - document.documentElement.clientTop);
      M.Pushpin.init(navElem, {
        top: offsetTop,
        bottom: offsetTop + contentBox.height - navBox.height
      });
    });
  
    // Mobile Overflow
    if (is_touch_device()) {
      (document.querySelector('#nav-mobile') as HTMLElement).style.overflow = 'auto';
    }
  
    // Theme
    const theme = localStorage.getItem('theme');
    const themeSwitch = document.querySelector('#theme-switch');
    const setTheme = (isDark) => {
      if (isDark) {
        themeSwitch.classList.add('is-dark');
        themeSwitch.querySelector('i').innerText = 'light_mode';
        (themeSwitch as any).title = 'Switch to light mode';
      }
      else {
        themeSwitch.classList.remove('is-dark');
        themeSwitch.querySelector('i').innerText = 'dark_mode';
        (themeSwitch as any).title = 'Switch to dark mode';
      }
    }
    if (themeSwitch) {
      // Load
      if (theme) setTheme(true);
      // Change
      themeSwitch.addEventListener('click', e => {
        e.preventDefault();
        if (!themeSwitch.classList.contains('is-dark')) {
          // Dark Theme
          document.documentElement.setAttribute('theme', 'dark');
          localStorage.setItem('theme', 'dark');
          setTheme(true);
        }
        else {
          // Light Theme
          document.documentElement.removeAttribute('theme');
          localStorage.removeItem('theme');
          setTheme(false);
        }
      });
    }
  
    // Copy Button
    const copyBtn = Array.prototype.slice.call(
      document.querySelectorAll(".copyButton")
    );
    const copiedText = Array.prototype.slice.call(
      document.querySelectorAll(".copiedText")
    );
    const copyMsg = Array.prototype.slice.call(
      document.querySelectorAll(".copyMessage")
    );
    copyBtn.forEach((copyBtn, i) => {
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(copiedText[i].innerText);
        copyMsg[i].style.opacity = 1;
        setTimeout(() => {
          copyMsg[i].style.opacity = 0;
        }, 2000);
      });
    });
  
    // Materialize Components
  
    M.Carousel.init(document.querySelectorAll('.carousel'), {});
    M.Carousel.init(document.querySelectorAll('.carousel.carousel-slider'), {
      fullWidth: true,
      indicators: true,
      onCycleTo: function(item, dragged) {
      }
    });
  
    M.Collapsible.init(document.querySelectorAll('.collapsible'), {});
    M.Collapsible.init(document.querySelectorAll('.collapsible.expandable'), {
      accordion: false
    });
  
    M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'), {});
    M.Dropdown.init(document.querySelector('#dropdown-demo-left'), {alignment: 'left', constrainWidth: false});
    M.Dropdown.init(document.querySelector('#dropdown-demo-right'), {alignment: 'right', constrainWidth: false});
  
    M.Parallax.init(document.querySelectorAll('.parallax'), {});
    
    // Media
    M.Materialbox.init(document.querySelectorAll('.materialboxed'), {});
    M.Slider.init(document.querySelectorAll('.slider'), {});
  
    M.Modal.init(document.querySelectorAll('.modal'), {});
  
    M.ScrollSpy.init(document.querySelectorAll('.scrollspy'), {});
  
    M.Datepicker.init(document.querySelectorAll('.datepicker'), {});
  
    M.Tabs.init(document.querySelectorAll('.tabs'), {});
    M.Tabs.init(document.querySelectorAll('#tabs-swipe-demo'), {swipeable: true});
  
    M.Timepicker.init(document.querySelectorAll('.timepicker'), {});
    
    M.Tooltip.init(document.querySelectorAll('.tooltipped'), {});
  
    M.Sidenav.init(document.querySelectorAll('.sidenav'), {});
    
    const tts = M.TapTarget.init(document.querySelectorAll('.tap-target'), {});
    document.querySelector('#open-taptarget')?.addEventListener('click', e => tts[0].open());
    document.querySelector('#close-taptarget')?.addEventListener('click', e => tts[0].close());
  
    M.FormSelect.init(document.querySelectorAll('select:not(.disabled)'), {});
  
    M.CharacterCounter.init(document.querySelectorAll('input[data-length], textarea[data-length]'), {});
  
    const autocompleteDemoData = [
      {id: 12, text: "Apple"},
      {id: 13, text: "Microsoft"},
      {id: 42, text: "Google", image: 'http://placehold.it/250x250'}
    ];
  
    M.Autocomplete.init(document.querySelectorAll('input.autocomplete'), {
      minLength: 0,
      data: autocompleteDemoData
    });
    M.Autocomplete.init(document.querySelectorAll('input.autocomplete-multiple'), {
      isMultiSelect: true,
      minLength: 1,
      data: autocompleteDemoData
    });
  
    M.Chips.init(document.querySelectorAll('.chips'), {});
    M.Chips.init(document.querySelectorAll('.chips-initial'), {
      readOnly: true,
      data: autocompleteDemoData
    });
    M.Chips.init(document.querySelectorAll('.chips-placeholder'), {
      placeholder: 'Enter a tag',
      secondaryPlaceholder: '+Tag'
    });
    M.Chips.init(document.querySelectorAll('.chips-autocomplete'), {
      autocompleteOptions: {
        data: autocompleteDemoData
      }
    });
  
    M.FloatingActionButton.init(document.querySelectorAll('.fixed-action-btn'), {});
    M.FloatingActionButton.init(document.querySelectorAll('.fixed-action-btn.horizontal'), {
      direction: 'left'
    });
    M.FloatingActionButton.init(document.querySelectorAll('.fixed-action-btn.click-to-toggle'), {
      direction: 'left',
      hoverEnabled: false
    });
    M.FloatingActionButton.init(document.querySelectorAll('.fixed-action-btn.toolbar'), {
      toolbarEnabled: true
    });
  
  });
  