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
    let stumble_html = await (await fetch("https://stumbleguys.com/play")).text();
	let parsed_html = parse(stumble_html);
	let parsed_json = JSON.parse(parsed_html.getElementById("__NEXT_DATA__").innerHTML).props.pageProps.gameConfig.attributes;
	let base_url = `https://live-assets.web.stumbleguys.com/unity/${parsed_json.version}/${parsed_json.environment}/${parsed_json.hash}`;
    let html = `<!DOCTYPE html><html><head><title>Stumble Guys</title><style>*{background:#000;width:100%;height:100%;overflow:visible;padding:0;margin:0;position:absolute;}</style></head><body><canvas id="uc"></canvas><script src="${base_url}/WebGL.loader.js"></script><script>createUnityInstance(document.querySelector("#uc"),{dataUrl:"${base_url}/WebGL.data.unityweb",frameworkUrl:"${base_url}/WebGL.framework.js.unityweb",codeUrl:"${base_url}/WebGL.wasm.unityweb"})</script></body></html>`;
	fs.writeFileSync('./stumble.html', html);
}
getStumble()
setInterval(getStumble, 1800000)