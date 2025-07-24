import React, { useRef, useState } from 'react';
import './CodingLearnPage.css';

const cards = [
  {
    name: 'HTML',
    icon: 'fab fa-html5',
    unlocked: true,
  },
  {
    name: 'CSS',
    icon: 'fab fa-css3-alt',
    unlocked: true,
  },
  {
    name: 'JavaScript',
    icon: 'fab fa-js-square',
    unlocked: true,
  },
];

const htmlDetails = {
  title: 'HTML (HyperText Markup Language)',
  description: `HTML is the standard markup language for creating web pages. It describes the structure of a web page using a system of elements and tags. HTML elements form the building blocks of all websites.`,
  features: [
    'Defines the structure of web content',
    'Uses tags like <html>, <head>, <body>, <h1>–<h6>, <p>, <a>, <img>, and more',
    'Works together with CSS and JavaScript',
    'Is interpreted by web browsers',
  ],
  example: `<!DOCTYPE html>\n<html>\n  <head>\n    <title>My First HTML Page</title>\n  </head>\n  <body>\n    <h1>Hello, world!</h1>\n    <p>This is a simple HTML page.</p>\n  </body>\n</html>`
};

const cssDetails = {
  title: 'CSS (Cascading Style Sheets)',
  description: `CSS is the language used to style and layout web pages. It controls the color, font, spacing, positioning, and many other aspects of how HTML elements are displayed.`,
  features: [
    'Separates content (HTML) from presentation (CSS)',
    'Controls layout, colors, fonts, spacing, and more',
    'Supports responsive design with media queries',
    'Can be written inline, internally, or externally',
  ],
  example: `body {\n  background: #f7f9fb;\n  color: #222;\n  font-family: Arial, sans-serif;\n}\nh1 {\n  color: #007bff;\n  text-align: center;\n}`
};

const commonTags = [
  { tag: '<!DOCTYPE>', desc: 'Defines the document type', example: '<!DOCTYPE html>' },
  { tag: '<html>', desc: 'Root element of an HTML page', example: '<html>...</html>' },
  { tag: '<head>', desc: 'Container for metadata', example: '<head>...</head>' },
  { tag: '<title>', desc: 'Defines the title of the document', example: '<title>Page Title</title>' },
  { tag: '<body>', desc: 'Defines the document body', example: '<body>...</body>' },
  { tag: '<h1>–<h6>', desc: 'Defines HTML headings', example: '<h1>Heading</h1>' },
  { tag: '<p>', desc: 'Defines a paragraph', example: '<p>Paragraph text</p>' },
  { tag: '<a>', desc: 'Defines a hyperlink', example: '<a href="https://example.com">Link</a>' },
  { tag: '<img>', desc: 'Embeds an image', example: '<img src="image.jpg" alt="desc" />' },
  { tag: '<ul>', desc: 'Defines an unordered list', example: '<ul>...</ul>' },
  { tag: '<li>', desc: 'Defines a list item', example: '<li>Item</li>' },
  { tag: '<div>', desc: 'Defines a division or section', example: '<div>...</div>' },
  { tag: '<span>', desc: 'Defines an inline section', example: '<span>...</span>' },
  { tag: '<br>', desc: 'Inserts a single line break', example: '<br />' },
  { tag: '<form>', desc: 'Defines an HTML form', example: '<form>...</form>' },
  { tag: '<input>', desc: 'Defines an input control', example: '<input type="text" />' },
  { tag: '<button>', desc: 'Defines a clickable button', example: '<button>Click</button>' },
];

const allTags = [
  ...commonTags,
  { tag: '<abbr>', desc: 'Defines an abbreviation or acronym', example: '<abbr title="World Health Organization">WHO</abbr>' },
  { tag: '<address>', desc: 'Defines contact information', example: '<address>123 Main St.</address>' },
  { tag: '<area>', desc: 'Defines an area inside an image map', example: '<area shape="rect" coords="34,44,270,350" href="sun.htm" alt="Sun" />' },
  { tag: '<article>', desc: 'Defines an article', example: '<article>...</article>' },
  { tag: '<aside>', desc: 'Defines content aside from the page content', example: '<aside>...</aside>' },
  { tag: '<audio>', desc: 'Embeds sound content', example: '<audio controls src="audio.mp3"></audio>' },
  { tag: '<b>', desc: 'Defines bold text', example: '<b>Bold</b>' },
  { tag: '<base>', desc: 'Specifies the base URL for all relative URLs', example: '<base href="https://example.com/" />' },
  { tag: '<bdi>', desc: 'Isolates a part of text for bidirectional formatting', example: '<bdi>abc</bdi>' },
  { tag: '<bdo>', desc: 'Overrides the current text direction', example: '<bdo dir="rtl">This text is right-to-left</bdo>' },
  { tag: '<blockquote>', desc: 'Defines a section that is quoted from another source', example: '<blockquote>Quote</blockquote>' },
  { tag: '<canvas>', desc: 'Used to draw graphics via scripting', example: '<canvas id="myCanvas"></canvas>' },
  { tag: '<caption>', desc: 'Defines a table caption', example: '<caption>Table Caption</caption>' },
  { tag: '<cite>', desc: 'Defines the title of a work', example: '<cite>Book Title</cite>' },
  { tag: '<code>', desc: 'Defines a piece of computer code', example: '<code>let x = 5;</code>' },
  { tag: '<col>', desc: 'Specifies column properties for each column within a <colgroup>', example: '<col span="2" style="background-color:yellow" />' },
  { tag: '<colgroup>', desc: 'Specifies a group of one or more columns in a table', example: '<colgroup><col /></colgroup>' },
  { tag: '<data>', desc: 'Links the given content with a machine-readable translation', example: '<data value="21053">Cherry</data>' },
  { tag: '<datalist>', desc: 'Specifies a list of pre-defined options for input controls', example: '<datalist id="browsers"><option value="Chrome" /></datalist>' },
  { tag: '<dd>', desc: 'Defines a description/value of a term in a description list', example: '<dd>Description</dd>' },
  { tag: '<del>', desc: 'Defines text that has been deleted from a document', example: '<del>Deleted</del>' },
  { tag: '<details>', desc: 'Defines additional details that the user can view or hide', example: '<details><summary>More</summary>Details</details>' },
  { tag: '<dfn>', desc: 'Represents the defining instance of a term', example: '<dfn>HTML</dfn>' },
  { tag: '<dialog>', desc: 'Defines a dialog box or window', example: '<dialog open>Dialog</dialog>' },
  { tag: '<dt>', desc: 'Defines a term/name in a description list', example: '<dt>Term</dt>' },
  { tag: '<fieldset>', desc: 'Groups related elements in a form', example: '<fieldset>...</fieldset>' },
  { tag: '<figcaption>', desc: 'Defines a caption for a <figure> element', example: '<figcaption>Caption</figcaption>' },
  { tag: '<figure>', desc: 'Specifies self-contained content', example: '<figure>...</figure>' },
  { tag: '<footer>', desc: 'Defines a footer for a document or section', example: '<footer>...</footer>' },
  { tag: '<header>', desc: 'Defines a header for a document or section', example: '<header>...</header>' },
  { tag: '<iframe>', desc: 'Defines an inline frame', example: '<iframe src="demo.html"></iframe>' },
  { tag: '<label>', desc: 'Defines a label for an <input> element', example: '<label for="id">Label</label>' },
  { tag: '<legend>', desc: 'Defines a caption for a <fieldset>', example: '<legend>Legend</legend>' },
  { tag: '<link>', desc: 'Defines the relationship between a document and an external resource', example: '<link rel="stylesheet" href="style.css" />' },
  { tag: '<main>', desc: 'Specifies the main content of a document', example: '<main>...</main>' },
  { tag: '<map>', desc: 'Defines an image map', example: '<map name="mapname">...</map>' },
  { tag: '<mark>', desc: 'Defines marked/highlighted text', example: '<mark>Marked</mark>' },
  { tag: '<meta>', desc: 'Defines metadata about an HTML document', example: '<meta charset="UTF-8" />' },
  { tag: '<nav>', desc: 'Defines navigation links', example: '<nav>...</nav>' },
  { tag: '<noscript>', desc: 'Defines alternative content for users that do not support client-side scripts', example: '<noscript>...</noscript>' },
  { tag: '<object>', desc: 'Defines an embedded object', example: '<object data="movie.swf"></object>' },
  { tag: '<optgroup>', desc: 'Groups related options in a drop-down list', example: '<optgroup label="Group">...</optgroup>' },
  { tag: '<option>', desc: 'Defines an option in a drop-down list', example: '<option value="1">One</option>' },
  { tag: '<output>', desc: 'Represents the result of a calculation', example: '<output>42</output>' },
  { tag: '<param>', desc: 'Defines a parameter for an object', example: '<param name="autoplay" value="true" />' },
  { tag: '<picture>', desc: 'Defines a container for multiple image resources', example: '<picture>...</picture>' },
  { tag: '<pre>', desc: 'Defines preformatted text', example: '<pre>Text</pre>' },
  { tag: '<progress>', desc: 'Represents the progress of a task', example: '<progress value="70" max="100"></progress>' },
  { tag: '<q>', desc: 'Defines a short inline quotation', example: '<q>Quote</q>' },
  { tag: '<rp>', desc: 'Defines what to show in browsers that do not support ruby annotations', example: '<rp>(</rp>' },
  { tag: '<rt>', desc: 'Defines an explanation/pronunciation of characters (for East Asian typography)', example: '<rt>Text</rt>' },
  { tag: '<ruby>', desc: 'Defines a ruby annotation (for East Asian typography)', example: '<ruby>漢 <rt>Kan</rt></ruby>' },
  { tag: '<s>', desc: 'Defines text that is no longer correct', example: '<s>Old text</s>' },
  { tag: '<samp>', desc: 'Defines sample output from a computer program', example: '<samp>Sample</samp>' },
  { tag: '<script>', desc: 'Defines a client-side script', example: '<script>alert("Hi")</script>' },
  { tag: '<section>', desc: 'Defines a section in a document', example: '<section>...</section>' },
  { tag: '<select>', desc: 'Defines a drop-down list', example: '<select><option>One</option></select>' },
  { tag: '<small>', desc: 'Defines smaller text', example: '<small>Small</small>' },
  { tag: '<source>', desc: 'Specifies multiple media resources for media elements', example: '<source src="movie.mp4" type="video/mp4" />' },
  { tag: '<sub>', desc: 'Defines subscripted text', example: '<sub>Sub</sub>' },
  { tag: '<summary>', desc: 'Defines a visible heading for a <details> element', example: '<summary>More</summary>' },
  { tag: '<sup>', desc: 'Defines superscripted text', example: '<sup>Sup</sup>' },
  { tag: '<template>', desc: 'Defines a template', example: '<template>...</template>' },
  { tag: '<textarea>', desc: 'Defines a multiline input control (text area)', example: '<textarea>Text</textarea>' },
  { tag: '<time>', desc: 'Defines a specific time (or datetime)', example: '<time datetime="2023-01-01">Jan 1, 2023</time>' },
  { tag: '<track>', desc: 'Defines text tracks for media elements', example: '<track kind="captions" src="captions_en.vtt" />' },
  { tag: '<var>', desc: 'Defines a variable', example: '<var>x</var>' },
  { tag: '<video>', desc: 'Embeds a video', example: '<video src="movie.mp4" controls></video>' },
  { tag: '<wbr>', desc: 'Defines a possible line-break', example: 'word<wbr>break' },
];

const commonCSSProps = [
  { prop: 'color', desc: 'Sets the text color', example: 'color: red;' },
  { prop: 'background', desc: 'Sets the background color/image', example: 'background: #fff;' },
  { prop: 'font-size', desc: 'Sets the size of the font', example: 'font-size: 18px;' },
  { prop: 'font-family', desc: 'Sets the font family', example: 'font-family: Arial, sans-serif;' },
  { prop: 'margin', desc: 'Sets the outer margin', example: 'margin: 20px;' },
  { prop: 'padding', desc: 'Sets the inner padding', example: 'padding: 10px;' },
  { prop: 'border', desc: 'Sets the border', example: 'border: 1px solid #ccc;' },
  { prop: 'width', desc: 'Sets the width', example: 'width: 100px;' },
  { prop: 'height', desc: 'Sets the height', example: 'height: 50px;' },
  { prop: 'display', desc: 'Sets the display type', example: 'display: flex;' },
  { prop: 'position', desc: 'Sets the positioning method', example: 'position: absolute;' },
  { prop: 'top', desc: 'Sets the top position', example: 'top: 10px;' },
  { prop: 'left', desc: 'Sets the left position', example: 'left: 20px;' },
  { prop: 'right', desc: 'Sets the right position', example: 'right: 20px;' },
  { prop: 'bottom', desc: 'Sets the bottom position', example: 'bottom: 10px;' },
  { prop: 'background-color', desc: 'Sets the background color', example: 'background-color: #f0f0f0;' },
  { prop: 'border-radius', desc: 'Sets the border radius', example: 'border-radius: 8px;' },
  { prop: 'box-shadow', desc: 'Adds shadow to elements', example: 'box-shadow: 0 2px 8px #ccc;' },
  { prop: 'text-align', desc: 'Sets the horizontal alignment of text', example: 'text-align: center;' },
  { prop: 'overflow', desc: 'Sets overflow behavior', example: 'overflow: auto;' },
];

const allCSSProps = [
  ...commonCSSProps,
  { prop: 'align-items', desc: 'Aligns flex items along the cross axis', example: 'align-items: center;' },
  { prop: 'animation', desc: 'A shorthand for animation properties', example: 'animation: shake 0.4s;' },
  { prop: 'clear', desc: 'Specifies what elements can float beside the cleared element', example: 'clear: both;' },
  { prop: 'cursor', desc: 'Specifies the mouse cursor to be displayed', example: 'cursor: pointer;' },
  { prop: 'float', desc: 'Specifies whether or not a box should float', example: 'float: right;' },
  { prop: 'flex', desc: 'A shorthand for flex-grow, flex-shrink, and flex-basis', example: 'flex: 1 1 auto;' },
  { prop: 'flex-direction', desc: 'Specifies the direction of the flexible items', example: 'flex-direction: row;' },
  { prop: 'flex-wrap', desc: 'Specifies whether the flex items should wrap or not', example: 'flex-wrap: wrap;' },
  { prop: 'gap', desc: 'Specifies the gap between grid/flex items', example: 'gap: 1rem;' },
  { prop: 'grid-template-columns', desc: 'Specifies the columns of a grid container', example: 'grid-template-columns: 1fr 2fr;' },
  { prop: 'justify-content', desc: 'Aligns flex items along the main axis', example: 'justify-content: space-between;' },
  { prop: 'line-height', desc: 'Sets the height of a line box', example: 'line-height: 1.5;' },
  { prop: 'list-style', desc: 'Sets all the properties for a list in one declaration', example: 'list-style: none;' },
  { prop: 'max-width', desc: 'Sets the maximum width', example: 'max-width: 900px;' },
  { prop: 'min-height', desc: 'Sets the minimum height', example: 'min-height: 120px;' },
  { prop: 'opacity', desc: 'Sets the opacity level', example: 'opacity: 0.8;' },
  { prop: 'outline', desc: 'Sets the outline on elements', example: 'outline: 2px solid #007bff;' },
  { prop: 'transition', desc: 'A shorthand for transition properties', example: 'transition: background 0.2s;' },
  { prop: 'z-index', desc: 'Sets the stack order of elements', example: 'z-index: 10;' },
];

const jsDetails = {
  title: 'JavaScript (JS)',
  description: `JavaScript is the programming language of the web. It enables interactive web pages, dynamic content, and is essential for modern web development.`,
  features: [
    'Runs in the browser and on servers (Node.js)',
    'Can manipulate HTML and CSS (the DOM)',
    'Supports variables, functions, objects, and more',
    'Used for interactivity, animations, API calls, and more',
  ],
  example: `<button id='js-btn' onclick="document.getElementById('js-msg').textContent='Clicked!';">Click me</button> <span id='js-msg'></span>`
};

const commonJSProps = [
  { prop: 'console.log()', desc: 'Outputs a message to the web console', example: `console.log('Hello!');` },
  { prop: 'let/const/var', desc: 'Declares variables', example: 'let x = 5;' },
  { prop: 'function', desc: 'Declares a function', example: 'function greet() { ... }' },
  { prop: 'if/else', desc: 'Conditional statements', example: 'if (x > 0) { ... } else { ... }' },
  { prop: 'for/while', desc: 'Loops', example: 'for (let i=0; i<5; i++) { ... }' },
  { prop: 'return', desc: 'Returns a value from a function', example: 'return x + y;' },
  { prop: 'document.getElementById()', desc: 'Selects an element by ID', example: `document.getElementById('myId')` },
  { prop: 'addEventListener()', desc: 'Attaches an event handler', example: `btn.addEventListener('click', fn)` },
  { prop: 'Array.isArray()', desc: 'Checks if a value is an array', example: 'Array.isArray(arr)' },
  { prop: 'typeof', desc: 'Returns the type of a variable', example: `typeof 123 // 'number'` },
  { prop: 'Math.random()', desc: 'Returns a random number between 0 and 1', example: 'Math.random()' },
  { prop: 'JSON.stringify()', desc: 'Converts a value to a JSON string', example: `JSON.stringify({a:1})` },
  { prop: 'parseInt()', desc: 'Parses a string and returns an integer', example: `parseInt('42')` },
];

const allJSProps = [
  ...commonJSProps,
  { prop: 'Array.map()', desc: 'Creates a new array with the results of calling a function for every array element', example: '[1,2,3].map(x => x*2)' },
  { prop: 'Array.filter()', desc: 'Creates a new array with all elements that pass the test', example: '[1,2,3].filter(x => x>1)' },
  { prop: 'Array.reduce()', desc: 'Reduces the array to a single value', example: '[1,2,3].reduce((a,b)=>a+b,0)' },
  { prop: 'String.includes()', desc: 'Checks if a string contains another string', example: `'hello'.includes('he')` },
  { prop: 'String.replace()', desc: 'Replaces part of a string', example: `'hello'.replace('h','y')` },
  { prop: 'Object.keys()', desc: 'Returns an array of a given object’s own property names', example: 'Object.keys({a:1,b:2})' },
  { prop: 'Object.values()', desc: 'Returns an array of a given object’s own property values', example: 'Object.values({a:1,b:2})' },
  { prop: 'setTimeout()', desc: 'Calls a function after a delay', example: 'setTimeout(fn, 1000)' },
  { prop: 'setInterval()', desc: 'Calls a function repeatedly, with a fixed time delay', example: 'setInterval(fn, 1000)' },
  { prop: 'Promise', desc: 'Represents the eventual completion (or failure) of an async operation', example: 'new Promise((res,rej)=>{...})' },
  { prop: 'fetch()', desc: 'Performs a network request', example: `fetch('/api')` },
  { prop: 'try/catch', desc: 'Handles exceptions', example: 'try { ... } catch(e) { ... }' },
];

const jsArrayMethods = [
  { prop: 'push()', desc: 'Adds one or more elements to the end of an array', example: 'arr.push(4)' },
  { prop: 'pop()', desc: 'Removes the last element from an array', example: 'arr.pop()' },
  { prop: 'shift()', desc: 'Removes the first element from an array', example: 'arr.shift()' },
  { prop: 'unshift()', desc: 'Adds one or more elements to the beginning of an array', example: 'arr.unshift(0)' },
  { prop: 'slice()', desc: 'Returns a shallow copy of a portion of an array', example: 'arr.slice(1,3)' },
  { prop: 'splice()', desc: 'Adds/removes elements from an array', example: 'arr.splice(1,2)' },
  { prop: 'concat()', desc: 'Merges two or more arrays', example: 'arr1.concat(arr2)' },
  { prop: 'join()', desc: 'Joins all elements of an array into a string', example: 'arr.join(",")' },
];

const jsStringMethods = [
  { prop: 'charAt()', desc: 'Returns the character at a specified index', example: `'abc'.charAt(1)` },
  { prop: 'toUpperCase()', desc: 'Converts a string to uppercase', example: `'abc'.toUpperCase()` },
  { prop: 'toLowerCase()', desc: 'Converts a string to lowercase', example: `'ABC'.toLowerCase()` },
  { prop: 'split()', desc: 'Splits a string into an array of substrings', example: `'a,b'.split(',')` },
  { prop: 'trim()', desc: 'Removes whitespace from both ends', example: `' abc '.trim()` },
  { prop: 'substring()', desc: 'Returns a part of the string', example: `'hello'.substring(1,3)` },
];

const jsEvents = [
  { prop: 'click', desc: 'Mouse click event', example: `element.addEventListener('click', fn)` },
  { prop: 'input', desc: 'Input/change event', example: `input.addEventListener('input', fn)` },
  { prop: 'keydown', desc: 'Key pressed event', example: `window.addEventListener('keydown', fn)` },
  { prop: 'submit', desc: 'Form submit event', example: `form.addEventListener('submit', fn)` },
  { prop: 'load', desc: 'Page load event', example: `window.addEventListener('load', fn)` },
];

const tagMalayalam = {
  '<!DOCTYPE>': 'ഈ ടാഗ് വെബ് പേജിന്റെ തരം ബ്രൗസറിന് അറിയിക്കാൻ ഉപയോഗിക്കുന്നു.',
  '<html>': 'ഒരു വെബ് പേജിന്റെ മുഴുവൻ ഉള്ളടക്കവും ഉൾക്കൊള്ളുന്ന പ്രധാന ടാഗ്.',
  '<head>': 'തലക്കെട്ട്, സ്ക്രിപ്റ്റ്, സ്റ്റൈൽ, മറ്റ് വിവരങ്ങൾ അടങ്ങിയ ഭാഗം.',
  '<title>': 'ബ്രൗസറിന്റെ ടാബിൽ കാണുന്ന പേജിന്റെ പേര്.',
  '<body>': 'ഉപയോക്താവിന് കാണുന്ന എല്ലാ ഉള്ളടക്കവും ഇവിടെ എഴുതണം.',
  '<h1>–<h6>': 'പേജിലെ തലക്കെട്ടുകൾ. വലിയതിൽ ചെറിയതിലേക്കുള്ള തലക്കെട്ടുകൾ.',
  '<p>': 'ഒരു പാരഗ്രാഫ് എഴുതാൻ ഉപയോഗിക്കുന്നു.',
  '<a>': 'മറ്റൊരു പേജിലേക്കോ വെബ്‌സൈറ്റിലേക്കോ പോകാൻ ലിങ്ക് നൽകാൻ.',
  '<img>': 'ചിത്രങ്ങൾ വെബ് പേജിൽ ചേർക്കാൻ.',
  '<ul>': 'പൊതു പോയിന്റുകൾ അടങ്ങിയ ലിസ്റ്റ്.',
  '<li>': 'ലിസ്റ്റിലെ ഓരോ പോയിന്റും.',
  '<div>': 'വെബ് പേജിൽ വിഭാഗങ്ങൾ സൃഷ്ടിക്കാൻ.',
  '<span>': 'വാചകത്തിന്റെ ചെറിയ ഭാഗം സ്റ്റൈൽ ചെയ്യാൻ.',
  '<br>': 'പുതിയ വരി തുടങ്ങാൻ.',
  '<form>': 'ഉപയോക്താവിൽ നിന്ന് ഡാറ്റ ശേഖരിക്കാൻ.',
  '<input>': 'ഉപയോക്താവിൽ നിന്ന് വിവരങ്ങൾ എടുക്കാൻ.',
  '<button>': 'ക്ലിക്കുചെയ്യാവുന്ന ബട്ടൺ.',
  '_default': 'ഈ ടാഗിന്റെ വിശദീകരണം മലയാളത്തിൽ ലഭ്യമല്ല.',
};

const CodingLearnPage = () => {
  const cardRefs = [useRef(null), useRef(null), useRef(null)];
  const [showHtmlDetails, setShowHtmlDetails] = useState(false);
  const [showCssDetails, setShowCssDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [cssCopied, setCssCopied] = useState(false);
  const [cssPreviewMode, setCssPreviewMode] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [cssHovered, setCssHovered] = useState(false);
  const [showJsDetails, setShowJsDetails] = useState(false);
  const [jsCopied, setJsCopied] = useState(false);
  const [jsPreviewMode, setJsPreviewMode] = useState(false);
  const [jsHovered, setJsHovered] = useState(false);
  const [showMalayalamTag, setShowMalayalamTag] = useState({});

  const handleCardClick = (index, unlocked) => {
    if (!unlocked) {
      const card = cardRefs[index].current;
      if (card) {
        card.classList.remove('shake');
        void card.offsetWidth;
        card.classList.add('shake');
      }
    } else {
      if (index === 0) {
        setShowHtmlDetails(true);
        setShowCssDetails(false);
        setShowJsDetails(false);
      } else if (index === 1) {
        setShowCssDetails(true);
        setShowHtmlDetails(false);
        setShowJsDetails(false);
      } else if (index === 2) {
        setShowJsDetails(true);
        setShowHtmlDetails(false);
        setShowCssDetails(false);
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlDetails.example.replace(/\\n/g, '\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleCssCopy = () => {
    navigator.clipboard.writeText(cssDetails.example.replace(/\\n/g, '\n'));
    setCssCopied(true);
    setTimeout(() => setCssCopied(false), 1200);
  };

  const handleJsCopy = () => {
    navigator.clipboard.writeText(jsDetails.example.replace(/\\n/g, '\n'));
    setJsCopied(true);
    setTimeout(() => setJsCopied(false), 1200);
  };

  return (
    <div className="coding-learn-page light-bg">
      <section
        style={{
          position: 'relative',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2.5rem 0 1.5rem 0',
          background: 'linear-gradient(90deg, #f7f9fb 60%, #e3f0ff 100%)',
          borderBottom: '2px solid #e0e7ef',
          marginBottom: 40,
          borderRadius: 24,
          boxShadow: '0 6px 32px rgba(0,0,0,0.10)',
          maxWidth: 1100,
          marginLeft: 'auto',
          marginRight: 'auto',
          overflow: 'hidden',
        }}
      >
        {/* Background image overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          background: 'rgba(255,255,255,0.7)',
        }}>
          <img
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80"
            alt="Coding background"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'blur(16px) brightness(0.7)',
              opacity: 0.22,
            }}
          />
        </div>
        {/* Foreground content */}
        <div style={{ position: 'relative', zIndex: 1, flex: '1 1 350px', minWidth: 320, maxWidth: 520, padding: '0 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ width: 7, height: 48, background: '#1976d2', borderRadius: 6, marginRight: 18 }}></div>
            <h1 style={{ color: '#1976d2', fontSize: 44, fontWeight: 900, margin: 0, letterSpacing: '-1px', fontFamily: 'Poppins, Arial, sans-serif' }}>Coding Mastery</h1>
          </div>
          <div style={{ fontSize: 22, color: '#444', marginBottom: 14, fontWeight: 600, letterSpacing: '0.2px' }}>
            Build, Create, Innovate
          </div>
          <p style={{ fontSize: 20, color: '#555', marginBottom: 22, textAlign: 'left', maxWidth: 480 }}>
            Learn coding from the ground up: master HTML, CSS, JavaScript, and more. Build real projects, understand the logic, and become a confident developer. Whether you’re a total beginner or looking to level up, this is your home for coding improvement!
          </p>
        </div>
        <div style={{ position: 'relative', zIndex: 1, flex: '1 1 320px', minWidth: 280, maxWidth: 420, padding: '0 2rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: 400, borderRadius: 22, overflow: 'hidden', boxShadow: '0 4px 24px rgba(25,118,210,0.13)', transition: 'transform 0.3s' }}
            className="coding-hero-img-wrapper"
          >
            <img
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80"
              alt="Coding learning hero"
              style={{ width: '100%', display: 'block', borderRadius: 22, transition: 'transform 0.3s' }}
              className="coding-hero-img"
            />
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(120deg, rgba(25,118,210,0.08) 0%, rgba(255,255,255,0.10) 100%)', pointerEvents: 'none' }}></div>
          </div>
        </div>
      </section>
      <h1 className="coding-title">Learn Coding</h1>
      <div className="coding-cards-container">
        {cards.map((card, idx) => (
          <div
            key={card.name}
            ref={cardRefs[idx]}
            className={`coding-card${card.unlocked ? '' : ' locked'}`}
            onClick={() => handleCardClick(idx, card.unlocked)}
          >
            <i className={`${card.icon} coding-card-icon`} />
            <span className="coding-card-label">{card.name}</span>
            {!card.unlocked && <i className="fas fa-lock coding-card-lock" />}
          </div>
        ))}
      </div>
      {showHtmlDetails && (
        <>
          <div className="coding-html-box">
            <h2>{htmlDetails.title}</h2>
            <p>{htmlDetails.description}</p>
            <div style={{ color: '#007bff', fontWeight: 'bold', fontSize: 17, margin: '8px 0 12px 0' }}>മലയാളം: വെബ് പേജുകളുടെ ഘടന നിർവചിക്കാൻ ഉപയോഗിക്കുന്ന ഭാഷയാണ് HTML. എല്ലാ വെബ് സൈറ്റുകളും HTML ടാഗുകൾ ഉപയോഗിച്ചാണ് നിർമ്മിച്ചത്.</div>
            <ul>
              {htmlDetails.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
            {/* HTML Videos */}
            <div style={{ margin: '18px 0 8px 0', textAlign: 'center' }}>
              <div style={{ fontWeight: 600, color: '#e44d26', fontSize: 18, marginBottom: 8 }}>
                Watch: HTML Basics (English)
              </div>
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.10)', marginBottom: 8 }}>
                <iframe
                  src="https://www.youtube.com/embed/bWPMSSsVdPk"
                  title="Learn HTML in 12 Minutes (English)"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: 12 }}
                />
              </div>
            </div>
            <div style={{ margin: '8px 0 18px 0', textAlign: 'center' }}>
              <div style={{ fontWeight: 600, color: '#e44d26', fontSize: 18, marginBottom: 8 }}>
                Watch: HTML Basics (Malayalam)
              </div>
              <div style={{ fontWeight: 500, color: '#1976d2', fontSize: 16, marginTop: 8, marginBottom: 8, background: '#f0f4ff', borderRadius: 8, padding: '10px 0' }}>
                Malayalam video will be added soon!
              </div>
            </div>
            <div
              className="coding-w3s-codebox-wrapper"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              {!previewMode ? (
                <>
                  <pre className="coding-modal-example coding-w3s-codebox">
                    {htmlDetails.example}
                  </pre>
                  {hovered && (
                    <div className="coding-w3s-overlay">
                      <button className="coding-w3s-btn" onClick={handleCopy}>
                        <i className="fas fa-copy" /> {copied ? 'Copied!' : 'Copy'}
                      </button>
                      <button className="coding-w3s-btn" onClick={() => setPreviewMode(true)}>
                        <i className="fas fa-eye" /> Preview
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <iframe
                    title="HTML Preview"
                    className="coding-modal-example coding-html-preview coding-w3s-codebox"
                    srcDoc={htmlDetails.example.replace(/\\n/g, '\n')}
                    sandbox="allow-scripts"
                    style={{ background: '#fff', minHeight: 120 }}
                  />
                  {hovered && (
                    <div className="coding-w3s-overlay">
                      <button className="coding-w3s-btn" onClick={() => setPreviewMode(false)}>
                        <i className="fas fa-code" /> Show Code
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="coding-html-tags-section">
            <h3>Common HTML Tags</h3>
            <div className="coding-html-tags-table-wrapper">
              <table className="coding-html-tags-table">
                <thead>
                  <tr>
                    <th>Tag</th>
                    <th>Description</th>
                    <th>Example</th>
                  </tr>
                </thead>
                <tbody>
                  {commonTags.map((tag, i) => (
                    <tr key={i}>
                      <td className="coding-html-tag-name"><code>{tag.tag}</code></td>
                      <td className="coding-html-tag-desc" style={{ position: 'relative' }}
                        onMouseEnter={() => setShowMalayalamTag(prev => ({ ...prev, [tag.tag]: prev[tag.tag] || false }))}
                        onMouseLeave={() => setShowMalayalamTag(prev => ({ ...prev, [tag.tag]: false }))}
                      >
                        <span>{tag.desc}</span>
                        <button
                          style={{ marginLeft: 8, fontSize: 13, padding: '2px 8px', borderRadius: 6, border: '1px solid #007bff', background: '#f7f9fb', color: '#007bff', cursor: 'pointer', display: showMalayalamTag[tag.tag] ? 'none' : 'inline-block' }}
                          onClick={e => { e.stopPropagation(); setShowMalayalamTag(prev => ({ ...prev, [tag.tag]: true })); }}
                          onMouseDown={e => e.preventDefault()}
                        >Show Malayalam</button>
                        {showMalayalamTag[tag.tag] && (
                          <div style={{ color: '#007bff', fontWeight: 'bold', fontSize: 15, marginTop: 4, fontFamily: `'Baloo Chettan 2', 'Anek Malayalam', 'Noto Sans Malayalam', 'Manjari', 'Arial', 'sans-serif'` }}>
                            മലയാളം: {tagMalayalam[tag.tag] || tagMalayalam._default}
                          </div>
                        )}
                      </td>
                      <td className="coding-html-tag-example"><code>{tag.example}</code></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h3 style={{marginTop: '2.5rem'}}>All HTML Tags</h3>
            <div className="coding-html-tags-table-wrapper">
              <table className="coding-html-tags-table">
                <thead>
                  <tr>
                    <th>Tag</th>
                    <th>Description</th>
                    <th>Example</th>
                  </tr>
                </thead>
                <tbody>
                  {allTags.map((tag, i) => (
                    <tr key={i}>
                      <td className="coding-html-tag-name"><code>{tag.tag}</code></td>
                      <td className="coding-html-tag-desc" style={{ position: 'relative' }}
                        onMouseEnter={() => setShowMalayalamTag(prev => ({ ...prev, [tag.tag]: prev[tag.tag] || false }))}
                        onMouseLeave={() => setShowMalayalamTag(prev => ({ ...prev, [tag.tag]: false }))}
                      >
                        <span>{tag.desc}</span>
                        <button
                          style={{ marginLeft: 8, fontSize: 13, padding: '2px 8px', borderRadius: 6, border: '1px solid #007bff', background: '#f7f9fb', color: '#007bff', cursor: 'pointer', display: showMalayalamTag[tag.tag] ? 'none' : 'inline-block' }}
                          onClick={e => { e.stopPropagation(); setShowMalayalamTag(prev => ({ ...prev, [tag.tag]: true })); }}
                          onMouseDown={e => e.preventDefault()}
                        >Show Malayalam</button>
                        {showMalayalamTag[tag.tag] && (
                          <div style={{ color: '#007bff', fontWeight: 'bold', fontSize: 15, marginTop: 4, fontFamily: `'Baloo Chettan 2', 'Anek Malayalam', 'Noto Sans Malayalam', 'Manjari', 'Arial', 'sans-serif'` }}>
                            മലയാളം: {tagMalayalam[tag.tag] || tagMalayalam._default}
                          </div>
                        )}
                      </td>
                      <td className="coding-html-tag-example"><code>{tag.example}</code></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      {showCssDetails && (
        <>
          <div className="coding-html-box">
            <h2>{cssDetails.title}</h2>
            <p>{cssDetails.description}</p>
            <div style={{ color: '#007bff', fontWeight: 'bold', fontSize: 17, margin: '8px 0 12px 0' }}>മലയാളം: വെബ് പേജുകൾക്ക് നിറം, ഫോണ്ട്, ലേയൗട്ട് തുടങ്ങിയ ശൈലികൾ നൽകാൻ ഉപയോഗിക്കുന്ന ഭാഷയാണ് CSS. HTML ഉള്ളടക്കത്തിന് ആകർഷകമായ രൂപം നൽകുന്നു.</div>
            <ul>
              {cssDetails.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
            {/* CSS Videos */}
            <div style={{ margin: '18px 0 8px 0', textAlign: 'center' }}>
              <div style={{ fontWeight: 600, color: '#2965f1', fontSize: 18, marginBottom: 8 }}>
                Watch: CSS Basics (English)
              </div>
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.10)', marginBottom: 8 }}>
                <iframe
                  src="https://www.youtube.com/embed/1PnVor36_40"
                  title="Learn CSS in 20 Minutes (English)"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: 12 }}
                />
              </div>
            </div>
            <div style={{ margin: '8px 0 18px 0', textAlign: 'center' }}>
              <div style={{ fontWeight: 600, color: '#2965f1', fontSize: 18, marginBottom: 8 }}>
                Watch: CSS Basics (Malayalam)
              </div>
              <div style={{ fontWeight: 500, color: '#1976d2', fontSize: 16, marginTop: 8, marginBottom: 8, background: '#f0f4ff', borderRadius: 8, padding: '10px 0' }}>
                Malayalam video will be added soon!
              </div>
            </div>
            <div
              className="coding-w3s-codebox-wrapper"
              onMouseEnter={() => setCssHovered(true)}
              onMouseLeave={() => setCssHovered(false)}
            >
              {!cssPreviewMode ? (
                <>
                  <pre className="coding-modal-example coding-w3s-codebox">
                    {cssDetails.example}
                  </pre>
                  {cssHovered && (
                    <div className="coding-w3s-overlay">
                      <button className="coding-w3s-btn" onClick={handleCssCopy}>
                        <i className="fas fa-copy" /> {cssCopied ? 'Copied!' : 'Copy'}
                      </button>
                      <button className="coding-w3s-btn" onClick={() => setCssPreviewMode(true)}>
                        <i className="fas fa-eye" /> Preview
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <iframe
                    title="CSS Preview"
                    className="coding-modal-example coding-html-preview coding-w3s-codebox"
                    srcDoc={`<style>${cssDetails.example.replace(/\\n/g, '\n')}</style><div class='css-preview-demo'><h1>CSS Preview</h1><p>This is a styled preview box.</p></div>`}
                    sandbox="allow-scripts"
                    style={{ background: '#fff', minHeight: 120 }}
                  />
                  {cssHovered && (
                    <div className="coding-w3s-overlay">
                      <button className="coding-w3s-btn" onClick={() => setCssPreviewMode(false)}>
                        <i className="fas fa-code" /> Show Code
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="coding-html-tags-section">
            <h3>Common CSS Properties</h3>
            <div className="coding-html-tags-table-wrapper">
              <table className="coding-html-tags-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Description</th>
                    <th>Example</th>
                  </tr>
                </thead>
                <tbody>
                  {commonCSSProps.map((prop, i) => (
                    <tr key={i}>
                      <td className="coding-html-tag-name"><code>{prop.prop}</code></td>
                      <td className="coding-html-tag-desc">{prop.desc}</td>
                      <td className="coding-html-tag-example"><code>{prop.example}</code></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h3 style={{marginTop: '2.5rem'}}>All CSS Properties</h3>
            <div className="coding-html-tags-table-wrapper">
              <table className="coding-html-tags-table">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Description</th>
                    <th>Example</th>
                  </tr>
                </thead>
                <tbody>
                  {allCSSProps.map((prop, i) => (
                    <tr key={i}>
                      <td className="coding-html-tag-name"><code>{prop.prop}</code></td>
                      <td className="coding-html-tag-desc">{prop.desc}</td>
                      <td className="coding-html-tag-example"><code>{prop.example}</code></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Special Topics Tables */}
            <h3 style={{marginTop: '2.5rem'}}>Pseudo-classes</h3>
            <div className="coding-html-tags-table-wrapper">
              <table className="coding-html-tags-table">
                <thead>
                  <tr>
                    <th>Pseudo-class</th>
                    <th>Description</th>
                    <th>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="coding-html-tag-name"><code>:hover</code></td><td className="coding-html-tag-desc">Applies when the user hovers over an element</td><td className="coding-html-tag-example"><code>a:hover {'{ color: red; }'}</code></td></tr>
                  <tr><td className="coding-html-tag-name"><code>:active</code></td><td className="coding-html-tag-desc">Applies when an element is being activated (e.g., clicked)</td><td className="coding-html-tag-example"><code>button:active {'{ background: #eee; }'}</code></td></tr>
                  <tr><td className="coding-html-tag-name"><code>:focus</code></td><td className="coding-html-tag-desc">Applies when an element has focus</td><td className="coding-html-tag-example"><code>input:focus {'{ border: 2px solid #007bff; }'}</code></td></tr>
                  <tr><td className="coding-html-tag-name"><code>:nth-child()</code></td><td className="coding-html-tag-desc">Matches elements based on their position in a group of siblings</td><td className="coding-html-tag-example"><code>li:nth-child(2) {'{ color: blue; }'}</code></td></tr>
                  <tr><td className="coding-html-tag-name"><code>:first-child</code></td><td className="coding-html-tag-desc">Matches the first child element</td><td className="coding-html-tag-example"><code>p:first-child {'{ font-weight: bold; }'}</code></td></tr>
                  <tr><td className="coding-html-tag-name"><code>:last-child</code></td><td className="coding-html-tag-desc">Matches the last child element</td><td className="coding-html-tag-example"><code>p:last-child {'{ color: green; }'}</code></td></tr>
                </tbody>
              </table>
            </div>
            <h3 style={{marginTop: '2.5rem'}}>Pseudo-elements</h3>
            <div className="coding-html-tags-table-wrapper">
              <table className="coding-html-tags-table">
                <thead>
                  <tr>
                    <th>Pseudo-element</th>
                    <th>Description</th>
                    <th>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="coding-html-tag-name"><code>::before</code></td><td className="coding-html-tag-desc">Inserts content before an element’s content</td><td className="coding-html-tag-example"><code>p::before {'{ content: "Note: "; }'}</code></td></tr>
                  <tr><td className="coding-html-tag-name"><code>::after</code></td><td className="coding-html-tag-desc">Inserts content after an element’s content</td><td className="coding-html-tag-example"><code>p::after {'{ content: "!" }'}</code></td></tr>
                  <tr><td className="coding-html-tag-name"><code>::first-line</code></td><td className="coding-html-tag-desc">Styles the first line of a block element</td><td className="coding-html-tag-example"><code>p::first-line {'{ font-weight: bold; }'}</code></td></tr>
                  <tr><td className="coding-html-tag-name"><code>::first-letter</code></td><td className="coding-html-tag-desc">Styles the first letter of a block element</td><td className="coding-html-tag-example"><code>p::first-letter {'{ font-size: 2em; }'}</code></td></tr>
                  <tr><td className="coding-html-tag-name"><code>::selection</code></td><td className="coding-html-tag-desc">Styles the portion of an element that is selected by the user</td><td className="coding-html-tag-example"><code>p::selection {'{ background: yellow; }'}</code></td></tr>
                </tbody>
              </table>
            </div>
            <h3 style={{marginTop: '2.5rem'}}>Animations & Transitions</h3>
            <div className="coding-html-tags-table-wrapper">
              <table className="coding-html-tags-table">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Description</th>
                    <th>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="coding-html-tag-name"><code>@keyframes</code></td><td className="coding-html-tag-desc">Defines an animation sequence</td><td className="coding-html-tag-example"><code>@keyframes slide {'{ from { left: 0; } to { left: 100px; } }'}</code></td></tr>
                  <tr><td className="coding-html-tag-name"><code>animation</code></td><td className="coding-html-tag-desc">Shorthand for animation properties</td><td className="coding-html-tag-example"><code>div {'{ animation: slide 2s infinite; }'}</code></td></tr>
                  <tr><td className="coding-html-tag-name"><code>transition</code></td><td className="coding-html-tag-desc">Shorthand for transition properties</td><td className="coding-html-tag-example"><code>button {'{ transition: background 0.2s; }'}</code></td></tr>
                </tbody>
              </table>
            </div>
            <h3 style={{marginTop: '2.5rem'}}>Media Queries</h3>
            <div className="coding-html-tags-table-wrapper">
              <table className="coding-html-tags-table">
                <thead>
                  <tr>
                    <th>Syntax</th>
                    <th>Description</th>
                    <th>Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="coding-html-tag-name"><code>@media</code></td><td className="coding-html-tag-desc">Applies styles based on device characteristics</td><td className="coding-html-tag-example"><code>@media (max-width: 600px) {'{ body { font-size: 14px; } }'}</code></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      {showJsDetails && (
        <>
          <div className="coding-html-box">
            <h2>{jsDetails.title}</h2>
            <p>{jsDetails.description}</p>
            <div style={{ color: '#007bff', fontWeight: 'bold', fontSize: 17, margin: '8px 0 12px 0' }}>മലയാളം: വെബ് പേജുകൾക്ക് ഇന്ററാക്ടീവ് ആകാൻ സഹായിക്കുന്ന പ്രോഗ്രാമിംഗ് ഭാഷയാണ് ജാവാസ്ക്രിപ്റ്റ്. ഉപയോക്താവിന്റെ പ്രവർത്തനങ്ങൾക്ക് പ്രതികരിക്കാൻ ഇത് ഉപയോഗിക്കുന്നു.</div>
            <ul>
              {jsDetails.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
            {/* JS Videos */}
            <div style={{ margin: '18px 0 8px 0', textAlign: 'center' }}>
              <div style={{ fontWeight: 600, color: '#f7df1e', fontSize: 18, marginBottom: 8 }}>
                Watch: JavaScript Basics (English)
              </div>
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.10)', marginBottom: 8 }}>
                <iframe
                  src="https://www.youtube.com/embed/c-I5S_zTwAc"
                  title="Learn JAVASCRIPT in just 5 MINUTES (English)"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: 12 }}
                />
              </div>
            </div>
            <div style={{ margin: '8px 0 18px 0', textAlign: 'center' }}>
              <div style={{ fontWeight: 600, color: '#f7df1e', fontSize: 18, marginBottom: 8 }}>
                Watch: JavaScript Basics (Malayalam)
              </div>
              <div style={{ fontWeight: 500, color: '#1976d2', fontSize: 16, marginTop: 8, marginBottom: 8, background: '#f0f4ff', borderRadius: 8, padding: '10px 0' }}>
                Malayalam video will be added soon!
              </div>
            </div>
            <div
              className="coding-w3s-codebox-wrapper"
              onMouseEnter={() => setJsHovered(true)}
              onMouseLeave={() => setJsHovered(false)}
            >
              {!jsPreviewMode ? (
                <>
                  <pre className="coding-modal-example coding-w3s-codebox">
                    {jsDetails.example}
                  </pre>
                  {jsHovered && (
                    <div className="coding-w3s-overlay">
                      <button className="coding-w3s-btn" onClick={handleJsCopy}>
                        <i className="fas fa-copy" /> {jsCopied ? 'Copied!' : 'Copy'}
                      </button>
                      <button className="coding-w3s-btn" onClick={() => setJsPreviewMode(true)}>
                        <i className="fas fa-eye" /> Preview
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <iframe
                    title="JS Preview"
                    className="coding-modal-example coding-html-preview coding-w3s-codebox"
                    srcDoc={`<button id='js-btn' onclick="document.getElementById('js-msg').textContent='Clicked!';">Click me</button> <span id='js-msg'></span>`}
                    sandbox="allow-scripts"
                    style={{ background: '#fff', minHeight: 120 }}
                  />
                  {jsHovered && (
                    <div className="coding-w3s-overlay">
                      <button className="coding-w3s-btn" onClick={() => setJsPreviewMode(false)}>
                        <i className="fas fa-code" /> Show Code
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="coding-html-tags-section">
            <h3>Common JavaScript Methods/Properties</h3>
            <div className="coding-html-tags-table-wrapper">
              <table className="coding-html-tags-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Example</th>
                  </tr>
                </thead>
                <tbody>
                  {commonJSProps.map((prop, i) => (
                    <tr key={i}>
                      <td className="coding-html-tag-name"><code>{prop.prop}</code></td>
                      <td className="coding-html-tag-desc">{prop.desc}</td>
                      <td className="coding-html-tag-example"><code>{prop.example}</code></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h3 style={{marginTop: '2.5rem'}}>All JavaScript Methods/Properties</h3>
            <div className="coding-html-tags-table-wrapper">
              <table className="coding-html-tags-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Example</th>
                  </tr>
                </thead>
                <tbody>
                  {allJSProps.map((prop, i) => (
                    <tr key={i}>
                      <td className="coding-html-tag-name"><code>{prop.prop}</code></td>
                      <td className="coding-html-tag-desc">{prop.desc}</td>
                      <td className="coding-html-tag-example"><code>{prop.example}</code></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h3 style={{marginTop: '2.5rem'}}>Array Methods</h3>
            <div className="coding-html-tags-table-wrapper">
              <table className="coding-html-tags-table">
                <thead>
                  <tr>
                    <th>Method</th>
                    <th>Description</th>
                    <th>Example</th>
                  </tr>
                </thead>
                <tbody>
                  {jsArrayMethods.map((prop, i) => (
                    <tr key={i}>
                      <td className="coding-html-tag-name"><code>{prop.prop}</code></td>
                      <td className="coding-html-tag-desc">{prop.desc}</td>
                      <td className="coding-html-tag-example"><code>{prop.example}</code></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h3 style={{marginTop: '2.5rem'}}>String Methods</h3>
            <div className="coding-html-tags-table-wrapper">
              <table className="coding-html-tags-table">
                <thead>
                  <tr>
                    <th>Method</th>
                    <th>Description</th>
                    <th>Example</th>
                  </tr>
                </thead>
                <tbody>
                  {jsStringMethods.map((prop, i) => (
                    <tr key={i}>
                      <td className="coding-html-tag-name"><code>{prop.prop}</code></td>
                      <td className="coding-html-tag-desc">{prop.desc}</td>
                      <td className="coding-html-tag-example"><code>{prop.example}</code></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h3 style={{marginTop: '2.5rem'}}>Events</h3>
            <div className="coding-html-tags-table-wrapper">
              <table className="coding-html-tags-table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Description</th>
                    <th>Example</th>
                  </tr>
                </thead>
                <tbody>
                  {jsEvents.map((prop, i) => (
                    <tr key={i}>
                      <td className="coding-html-tag-name"><code>{prop.prop}</code></td>
                      <td className="coding-html-tag-desc">{prop.desc}</td>
                      <td className="coding-html-tag-example"><code>{prop.example}</code></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
  </div>
);
};

export default CodingLearnPage;