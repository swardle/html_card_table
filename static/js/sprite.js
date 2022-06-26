function makeRequest(method, url) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
}

function getImageMeta(url) {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject();
        img.src = url;
    });
}

function AddStyle(css) {
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');

    head.appendChild(style);
    style.appendChild(document.createTextNode(css));
}

async function myFunction(p1, p2) {
  //  const img = await getImageMeta("img/Assets_final@2x.png");
  //  const width = img.width;
  //  const height = img.height; 
  //
  //  // await code here
  //  const data = await makeRequest("GET", "img/Assets_final@2x.json");
  //  const sprites = JSON.parse(data).TextureImporter.spriteSheet.sprites
  //  let i = 0;
  //  for (const sprite of sprites) {
  //      i++;
  //      if(i <= sprites.length/2) {
  //          continue;
  //      }
  //      let h = sprite.rect.height;
  //      let w = sprite.rect.width;
  //      let x = -sprite.rect.x;
  //      let y = height-(sprite.rect.y-sprite.rect.height);
  //      str = "#"+sprite.name.replace("@","")+" {"
  //      str += "    height: "+h+"px;"
  //      str += "    width: "+w+"px;"
  //      str += "    background-position: " + x + "px " + y + "px ;"
  //      str += "    background: url('img/Assets_final@2x.png');"
  //      str += "}"
  //      AddStyle(str)
  //      console.log(str)
  //  }
}
