
import * as markdown_it from './vendors/markdown-it.js';
import * as markdown_it_footnote from './vendors/markdown-it-footnote.js';
import * as markdown_it_task_lists from './vendors/markdown-it-task-lists.js';
import * as markdown_it_attrs from './vendors/markdown-it-attrs.js';
import * as purify from './vendors/purify.js'
import {ScriptLoader,StyleLoader,DataLoader} from './loaders.js'

const GrobalStorage = {}
GrobalStorage.highlight_exception = ["math","graph","chart"];
GrobalStorage.plugins_loaded = false;

class MarkdownViewer extends HTMLElement {
  constructor() {
    super();
    this.dataset.status = "assigned"
    this.Storage = {};
    this.Storage.CodeHighlightHook = [];
    this.Storage.allowed_attributes = ['id', 'class', 'style'];
    this.query = this.QueryDecoder();
    this.status;
    this.SetDefaults();
  } 
  SetDefaults = () => {
    this.option = {}
    if(this.dataset.option){
      this.option = JSON.parse(this.dataset.option);
    }else{
      if(this.dataset.html){this.option.html = JSON.parse(this.dataset.html)}
      if(this.dataset.sanitize){this.option.sanitize = JSON.parse(this.dataset.sanitize)}
      if(this.dataset.format){this.option.format = this.dataset.format}
      if(this.dataset.spa){this.option.spa = JSON.parse(this.dataset.spa)}
      /*
      const config = {
        "html":true,
        "sanitize":false,
        "format":"markdown",
        "query":true,
        "query_path":"./"
      }
      */
    }
    if(this.option.html == undefined){this.option.html = false}
    if(this.option.sanitize == undefined){this.option.sanitize = true}
    if(this.option.format == undefined){this.option.format = "markdown"}
    if(this.option.spa == undefined){this.option.spa = false}
    if(this.option.link_target == undefined){this.option.link_target = this.id}

  }

  EscapeEntity = function (str) {
    return str.replace(/&/g, '&amp;')
      .replace(/>/g, '&gt;')
      .replace(/</g, '&lt;')
      .replace(/\"/g, '&quot;')
      .replace(/\'/g, '&#039;')
  }
  
  UnescapeEntity = function (str) {
    return str.replace(/&amp;/g, '&')
      .replace(/&gt;/g, '>')
      .replace(/&lt;/g, '<')
      .replace(/&quot;/g, '\"')
      .replace(/&#039;/g, '\'')
  }
  
  QueryDecoder = function () {
    var query = [];
    var search = decodeURIComponent(location.search);
    var q = search.replace(/^\?/, "&").split("&");
    for (var i = 1, l = q.length; i < l; i++) {
      var tmp_array = q[i].split("=");
      var name = this.EscapeEntity(tmp_array[0]);
      var value = this.EscapeEntity(tmp_array[1]);
      if (value === "true") {
        value = true;
      } else if (value === "false") {
        value = false;
      }
      query[name] = value;
    }
  
    return query;
  };

  code_highlight_hook = (f) => {
    this.Storage.CodeHighlightHook.push(f);
  }

  load = async (target) => {
    if(this.status != 'reloading'){
      this.status = 'loading';
      this.dataset.status = "loading";
    }
    let markdown;
    let src = this.getAttribute("src")
    this.option.default_path = './'

    if(src){
      this.Storage.mode = 'include';
      const path_array = src.split("/");
      if(path_array.length>1){
        path_array.pop()
        this.option.default_path = path_array.join("/")+"/"
      }
      let file;
      if(target){
        file = this.option.default_path+target;
      }else if(this.option.spa == true && Object.keys(this.query).length > 0) {
        for (var key in this.query) {
          const tgt_elem = document.getElementById(key);
          if(!tgt_elem){continue};
          if (key == this.id) {
            file = this.option.default_path+this.query[key].split("/").reverse()[0];
          }
        }
      }else{
        file = src;
      }

      const loader = new DataLoader();
      markdown = await loader.load(file);
    }else{
      const md_element = document.querySelector(`template[data-target="${this.id}"]`);
      if(md_element){
        this.Storage.mode = 'inline';
        markdown = md_element.innerHTML;
        markdown = markdown.replace(/(&gt;)/g, '>');
        markdown = markdown.replace(/(&lt;)/g, '<');
      }else{
        console.error("No markdown document is found.")
      }
    }

    let html = this.renderer.render(markdown);
    if (this.option.sanitize == true) {
      html = DOMPurify.sanitize(html);
    };
    let dom = document.createRange().createContextualFragment(html);

    if(this.Storage.mode == 'include' && this.option.spa == true){
      const link_array = dom.querySelectorAll("a");
      let href;
      for (var i = 0, ln = link_array.length; i < ln; i++) {
        href = link_array[i].getAttribute("href");
        if (
          href.match(/^(?!http(|s)).*/) &&
          href.match(/^(?!\#).*/) &&
          href.match(/^(?!.*(\/|=)).*/)
          && href.split('.').pop() == 'md'
        ) {
          link_array[i].href = "?" + this.option.link_target + "=" + href;
          link_array[i].addEventListener('click',(e)=>{
            e.preventDefault();
            const file = e.currentTarget.href.split("=")[1];
            const url = "?" + this.option.link_target + "=" + file;
            this.status = "reloading";
            this.dataset.status = "loading";
            this.load(file);
            window.history.pushState({}, '',url);
            this.setAttribute("src", this.option.default_path+file);
          })
        }
      }
    }
    let current_section = document.querySelector(`#${this.id}>section`);
    if(current_section){
      current_section.remove()
    }
    
    const new_section = document.createElement("section");
    new_section.appendChild(dom);
    this.appendChild(new_section);

    if(this.status == 'reloading'){
      const plugins = this.querySelector('mdview-plugins').children;
      const plugins_array = [...plugins]
      plugins_array.forEach((element,index)=>{
        element.dataset.status = "reloaded";
      })
    }
    this.status =  "loaded";
    this.dataset.status = "loaded"

    var code_array = document.querySelectorAll(`code[class*="language"]`)
    for (var i in code_array) {
      var class_list = code_array[i].classList;
      if (class_list && class_list.value.match(/language/)) {
        var lang = class_list.value.match(/(|\s)language-(.*)(|\s)/)[2];
        code_array[i].setAttribute("data-language", lang);
        if (GrobalStorage.highlight_exception.indexOf(lang) < 0) {
          code_array[i].setAttribute("data-highlight", true);
        } else {
          code_array[i].setAttribute("data-highlight", false);
        }
      }
      if (code_array[i].parentNode) {
        code_array[i].parentNode.classList.add("code")
      }
      if (code_array[i].dataset && code_array[i].dataset.highlight && code_array[i].dataset.highlight == "true") {
        hljs.lineNumbersBlock(code_array[i],{singleLine: false});
      }
    }
  }

  init = async () => {
    this.renderer = window.markdownit({
      html: this.option.html,
      linkify: true,
      breaks: true,
      typographer: true,
      highlight: (code, lang) => {
        if (this.Storage.CodeHighlightHook.length > 0) {
          for (var i in this.Storage.CodeHighlightHook) {
            code = this.Storage.CodeHighlightHook[i](
              code,
              lang
            );
          }
        }
        return code;
      }
    });

    this.renderer.linkify.set({
      fuzzyLink: false
    });

    this.renderer
      .use(markdownitFootnote)
      .use(markdownitTaskLists)
      .use(markdownItAttrs, {
      allowedAttributes: this.Storage.allowed_attributes
    });
    
    //--

    this.code_highlight_hook((code, lang) => {
      if (GrobalStorage.highlight_exception.indexOf(lang) < 0) {
        return hljs.highlightAuto(code, [lang]).value;
      }
    });
    this.load()

  }
  static get observedAttributes() {
    return ['data-status'];
  }
  connectedCallback() {
    this.dataset.status = "connected"
    this.init();
  }
  attributeChangedCallback(name, old_value, new_value){
    if(name =='data-status' && new_value == "loaded"){
      if(GrobalStorage.plugins_loaded == false ){
        customElements.define('mdview-plugins', MDViewPlugin);
        customElements.define('mdview-plugin-math', MDViewPluginMath);
        customElements.define('mdview-plugin-graph', MDViewPluginGraph);
        customElements.define('mdview-plugin-chart', MDViewPluginChart);
        GrobalStorage.plugins_loaded = true;
      }
    }
  
  }
}

class MDViewToc extends HTMLElement {
  constructor() {
    //console.log("MarkdownToc","constructor called")
    super();
  }

  crc32 = (str) => {
    // checksum - JavaScript CRC32 - Stack Overflow https://stackoverflow.com/questions/18638900/javascript-crc32
    var a_table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D";
    var b_table = a_table.split(' ').map(function (s) { return parseInt(s, 16) });
    var crc = -1;
    for (var i = 0, iTop = str.length; i < iTop; i++) {
      crc = (crc >>> 8) ^ b_table[(crc ^ str.charCodeAt(i)) & 0xFF];
    }
    return ((crc ^ (-1)) >>> 0).toString(16);
  };

  init = () => {
    this.renderer = window.markdownit({
      html: true,
      linkify: true,
      breaks: true,
      typographer: true,
    });
    const element = this.closest('mdview-content');
    var header_array = element.querySelectorAll(`h2, h3`)
    var toc_str_array = []
    toc_str_array.push(`## Contents`)
    for (var i in header_array) {
      if (header_array[i].textContent) {
        header_array[i].id = this.crc32(header_array[i].textContent);
        var indent_seeds = "          ";
        var depth = Number(header_array[i].tagName.slice(1, 2));
        var indent = indent_seeds.substr(0, (depth - 2) * 2);
        var str = indent + "- [" + header_array[i].textContent + "](#" + header_array[i].id + ")";
        toc_str_array.push(str);
      }
    }
    const toc = toc_str_array.join("\n");

    const html = this.renderer.render(toc);
    const dom = document.createRange().createContextualFragment(html);
    const toc_wrapper = document.createElement("div");
    toc_wrapper.classList.add("toc")
    toc_wrapper.appendChild(dom)
    this.appendChild(toc_wrapper)

    const toc_array = this.querySelectorAll(".toc");
    toc_array.forEach((element,index)=>{
      const toc_title = element.querySelectorAll("h2")[0];
      const toc_toggle_target = element.querySelectorAll("ul")[0]
      if(this.dataset.initial == "close"){
        toc_title.classList.toggle("close");
        toc_toggle_target.classList.add("toc-close");
      }
      toc_title.addEventListener('click',  (e) => {
        toc_title.classList.toggle("close");
        if (toc_title.classList.contains("close")) {
          toc_toggle_target.classList.add("toc-close");
        } else {
          toc_toggle_target.classList.remove("toc-close");
        }
      })
    })
  }
  static get observedAttributes() {
    return ['data-status'];
  }
  connectedCallback() {
    this.init();
  }
}

class MDViewPlugin extends HTMLElement {
  constructor(){
    super();
    const plugins = this.children;
    this.dataset.count = plugins.length;
    this.dataset.loaded = 0;
  }
  static get observedAttributes() {
    return ['data-count','data-loaded'];
  }
  connectedCallback() {

  }
  attributeChangedCallback(name, old_value, new_value){
    console.log(this.id,name, old_value, new_value)
  }
}

class MDViewPluginMath extends HTMLElement {
  constructor(){
    //GrobalStorage.highlight_exception.push("math");
    super();
    this.dataset.status = "assigned"
  }
  init(){
    window.MathJax.startup.promise.then(() => {
      const viewer = this.closest('mdview-content');
      if(viewer){
        var math_element = viewer.querySelectorAll(".language-math");
        math_element.forEach((element, index) => {
          MathJax.typesetPromise(element.childNodes);
          const svg = document.createRange().createContextualFragment(element.innerHTML);
          element.parentNode.insertBefore(svg, element);
          element.style.display = "none";
        })
      }
      //this.remove();
    })
  }
  static get observedAttributes() {
    return ['data-status'];
  }
  connectedCallback() {
    this.dataset.status = "connected"
    ScriptLoader([
      "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js"
    ],()=>{
      this.init();
      this.dataset.status = "loaded"
    })
  }
  attributeChangedCallback(name, old_value, new_value){
    console.log(this.tagName,name, new_value)
    if(new_value == "reloaded"){
      this.init();
      this.dataset.status = "loaded"
    }
  }
}

class MDViewPluginGraph extends HTMLElement {
  constructor(){
    super();
    this.dataset.status = "assigned"
  }
  init(){
    const viewer = this.closest('mdview-content');
    if(viewer){
      var graph_array = viewer.querySelectorAll(".language-graph");
      graph_array.forEach((element,index)=>{
        var p_node = element.parentNode;
        var graph_code = JSON.parse(element.innerHTML);
        var graph_id = "graph_" + index;
        var graph_element = document.createElement('div');
        graph_element.setAttribute("id", graph_id)
        graph_element.setAttribute("class", "graph")
        graph_element.style.width = "90%";
        graph_element.style.padding = "0";
        graph_element.style.margin = "0";
        p_node.parentNode.insertBefore(graph_element, p_node);
        p_node.style.display = "none";
        graph_code.bindto = "#" + graph_id;
        if (graph_code) {
          var chart = c3.generate(graph_code)
        }
      })
    }
  //this.remove();
  }
  static get observedAttributes() {
    return ['data-status'];
  }
  connectedCallback() {
    this.dataset.status = "connected"

    ScriptLoader([
      "https://cdnjs.cloudflare.com/ajax/libs/c3/0.7.0/c3.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/d3/5.9.2/d3.min.js"
    ],()=>{
      this.init();
      this.dataset.status = "loaded"
    })
    StyleLoader([
      "https://cdnjs.cloudflare.com/ajax/libs/c3/0.7.0/c3.min.css"
    ])
  }
  attributeChangedCallback(name, old_value, new_value){
    console.log(this.tagName,name, new_value)
    if(new_value == "reloaded"){
      this.init();
      this.dataset.status = "loaded"
    }
  }
}

class MDViewPluginChart extends HTMLElement {
  constructor(){
    super();
    this.dataset.status = "assigned"
  }
  init(){
    const viewer = this.closest('mdview-content');
    if(viewer){
      var chart_array = viewer.querySelectorAll(".language-chart");
      chart_array.forEach((element,index)=>{
        var p_node = element.parentNode;
        var chart_element = document.createElement('pre');
        chart_element.classList.add("mermaid");
        chart_element.innerHTML = element.innerHTML;
        p_node.parentNode.insertBefore(chart_element, p_node);
        p_node.style.display = "none";
      })
      mermaid.initialize({ startOnLoad: false });
      mermaid.init()
      //this.remove();
    }
  }
  static get observedAttributes() {
    return ['data-status'];
  }
  connectedCallback() {
    this.dataset.status = "connected"
    ScriptLoader([
      "https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"
    ],()=>{
      this.init();
      this.dataset.status = "loaded"
    })
  }
  attributeChangedCallback(name, old_value, new_value){
    console.log(this.tagName,name, new_value)
    if(new_value == "reloaded"){
      this.init();
      this.dataset.status = "loaded"
    }
  }
}

const scripts = [
  //"https://cdnjs.cloudflare.com/ajax/libs/markdown-it/12.2.0/markdown-it.min.js",
  //"https://cdn.jsdelivr.net/npm/markdown-it-attrs@4.1.4/markdown-it-attrs.browser.js",
  //"https://cdn.jsdelivr.net/npm/markdown-it-footnote@3.0.3/dist/markdown-it-footnote.min.js",
  //"https://cdn.jsdelivr.net/npm/markdown-it-task-lists@2.1.1/dist/markdown-it-task-lists.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/highlight.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/highlightjs-line-numbers.js/2.7.0/highlightjs-line-numbers.min.js",
  //"https://cdn.jsdelivr.net/npm/dompurify@2.4.0/dist/purify.min.js"
]
const styles = [
  "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.15.6/styles/github.min.css"
]
ScriptLoader(scripts, () => {
  customElements.define('mdview-content', MarkdownViewer);
  customElements.define('mdview-toc', MDViewToc);
})
StyleLoader(styles)
