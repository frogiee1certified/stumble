const express = require("express");
const { parse } = require("node-html-parser");
const fs = require("fs");
const app = express();
const port = 5000;

app.get("/", stumbleHTML);

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});

async function stumbleHTML(req, res) {
    res.send(fs.readFileSync("./stumble.html", "utf8"));
}

async function getStumble() {
	console.log("refreshing");
    let stumble_html = await (await fetch("https://stumbleguys.com/play")).text();
	let parsed_html = parse(stumble_html);
	let parsed_json = JSON.parse(parsed_html.getElementById("__NEXT_DATA__").innerHTML).props.pageProps.gameConfig.attributes;
	let base_url = `https://live-assets.web.stumbleguys.com/unity/${parsed_json.version}/${parsed_json.environment}/${parsed_json.hash}`;
    let html = `<title>Stumble Guys</title><style>@import url(https://fonts.googleapis.com/css2?family=Lilita+One);*{background:#000;font-family:"Lilita One",sans-serif;width:100%;height:100%;overflow:visible;padding:0;margin:0;color:#fff}#fb-root,#uc{position:absolute}#l{width:30%;z-index:1000000;height:3%;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center}#p{background-color:#333}#f{width:0;background-color:#fff}p{position:static}</style><script>function load(e){console.log(e),document.getElementById("f").style.width=100*e+"%"}</script><div id=l><div id=p><div id=f></div></div><p>Game was made by Scopely<br>Bypass was made by skysthelimit.dev</div><canvas id=uc></canvas><script src=${base_url}/WebGL.loader.js></script><script>createUnityInstance(document.querySelector("#uc"),{dataUrl:"${base_url}/WebGL.data.unityweb",frameworkUrl:"${base_url}/WebGL.framework.js.unityweb",codeUrl:"${base_url}/WebGL.wasm.unityweb"},load).then(()=>{document.getElementById("l").style.display = "none"});</script>`;
	fs.writeFileSync('./stumble.html', html);
	console.log("refresh done");
}
getStumble()
setInterval(getStumble, 3600000)