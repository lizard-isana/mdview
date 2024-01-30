const LoadedScripts = [];
const LoadedStyles = [];

const ScriptLoader = (scripts, callback) => {
  var len = scripts.length;
  var i = 0;
  const AppendScript = () => {
    if (LoadedScripts.indexOf(scripts[i]) < 0 && scripts[i] !== undefined) {
      var script = document.createElement("script");
      script.src = scripts[i];
      document.getElementsByTagName("head")[0].appendChild(script);
      LoadedScripts.push(scripts[i]);
      i++;
      if (i == len) {
        if (callback) {
          script.onload = ()=>{ 
            callback("loaded");
          }
        }
        return;
      }
      script.onload = AppendScript;
    } else if (scripts[i] !== undefined && i != len) {
      if (callback) {
          callback("exist");
      }
      i++;
      AppendScript();
    } else {
      return;
    }
  }
  AppendScript();
};

const StyleLoader = (styles) => {
  var len = styles.length;
  var i = 0;
  const AppendStyle = () => {
    if (LoadedStyles.indexOf(styles[i]) < 0 && styles[i] !== undefined) {
      var link = document.createElement("link");
      link.href = styles[i];
      link.rel = "stylesheet";
      document.getElementsByTagName("head")[0].appendChild(link);
      LoadedStyles.push(styles[i]);
      i++;
      link.onload = AppendStyle;
    } else if (styles[i] == undefined && i != len) {
      i++;
      AppendStyle();
    } else {
      return;
    }

  }
  AppendStyle();
};

const DataLoader = class{
  
  /*
  // DataLoaderをオプションなしで初期化してload()にURLを渡すと、
  // 拡張子(txt/json/html/xml)からフォーマットを判断してデータを返す。
  // callbackが必要ないとか、拡張子と内容がずれているとかがなければこれでOK
  const loader = new DataLoader();
  const data = await loader.load("/data/iss.txt");

  // 細かいオプションを設定したければ、初期化時にオプションを設定して
  const loader2 = new DataLoader({
    "url":"/data/iss.txt", // optional 上と同じくload()で指定してもOK。
    "format":"text",
    "callback":(data)=>{
      console.log(data);
    }
  });
  // そのままload()すると、callbackが実行される。
  loader.load();
  // awaitで待てばデータが返ってくる（上の例だとcallbackも実行される）。
  const data = await loader.load();
  // load()にURLを渡すと、先の設定で指定したurlを取得して、callbackが実行される。
  loader.load(/data/iss2.txt);
  */

  constructor(option = {}){
      this.option = option;
  }

  _get_format = (url) => {
    const extention = url.split('.').pop(); 
    let format;
    switch(extention){
      case "json":
        format = "json";
        break;
      case "txt":
        format = "text";
        break;
      case "xml":
        format = "xml";
        break;
      case "html":
        format = "html";
        break;
      default:
        format = "text";
        break;
    }
    return format;
  }

  load  = async (url) =>{
    let request;
    if(url){
      request = new Request(url);
    }else if(this.url){
      request = new Request(this.option.url);
    }
    let format;
    if(this.option.format){
      format = this.option.format;
    }else{
      format = this._get_format(url);
    }

    const response =  await fetch(request)
    .then(response => {
      if (response.status === 200) {
        switch(format){
          case "json":
            return response.json();
          case "text":
            return response.text();
          case "html":
          case "xml":
            return response.text();
          default:
            return response.text();
        }
      } else {
        throw new Error("Error: " + response.status);
      }
    })
    .then(response => {
      if(this.option.callback){
        this.option.callback(response)
      }
      switch(format){
        case "xml":
          var parser = new DOMParser();
          const xml = parser.parseFromString(response, "text/xml");
          return xml
        case "html":
          var parser = new DOMParser();
          const html = parser.parseFromString(response, "text/html");
          return html
        default:
          return response;
      }
    }).catch(error => {
      console.error(error);
    });
    return response;
  }
}

export {ScriptLoader,StyleLoader,DataLoader}