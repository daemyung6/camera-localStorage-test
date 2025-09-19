import * as Alert from './Alert.js';
const isDev = false;

const mainDiv = document.getElementsByClassName('root')[0];




let setting = document.createElement('div');


setting.classList.add('setting')
setting.appendChild((() => {
    return document.createTextNode('camera: ');
})())

let select = document.createElement('select');
select.addEventListener('input', () => {
    getSteam(deviceDatas[Number(select.value)].deviceId);
})

setting.appendChild(select)




let saveButton = document.createElement('button');
saveButton.innerText = '촬영'
setting.appendChild(saveButton)

const saveATag = document.createElement('a');
saveATag.download = 'image.png';



setting.appendChild((() => {
    return document.createElement('br');
})())


const width = 1920;
const height = 1080;









const canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext('2d');
mainDiv.appendChild(canvas);

const camVideo = document.createElement('video');
camVideo.setAttribute('autoplay', '');
if(isDev) {
    document.body.appendChild(camVideo)
    window.camVideo = camVideo;
}


mainDiv.appendChild(setting)




window.addEventListener('DOMContentLoaded', () => {
    init()
})

function init() {
    select.innerHTML = null
    getDevice();
    getSteam();

    document.documentElement.scrollTop = 0;

    draw();
}



let deviceDatas = [];
let isPermission = true;
function getDevice() {
    deviceDatas = [];

    select.innerHTML = null
    select.appendChild((() => {
        let op = document.createElement('option');
        op.innerText = '-- select camera --'
        op.setAttribute('disabled', '')
        op.setAttribute('selected', '')
        return op
    })())

    try {
        navigator.mediaDevices.enumerateDevices()
            .then((devices) => {
                let count = 0;
                for (let i = 0; i < devices.length; i++) {

                    if (devices[i].kind !== 'videoinput') {
                        continue;
                    }
                    if (devices[i].deviceId.length === 0) {
                        isPermission = false;
                        console.log('isPermission', isPermission)
                        return;
                    }

                    deviceDatas.push(devices[i])
                }

                if (!isPermission) { return; }

                for (let i = 0; i < deviceDatas.length; i++) {
                    select.appendChild((() => {
                        let option = document.createElement('option');
                        option.innerText = deviceDatas[i].label;
                        option.value = count
                        count++;
                        return option;
                    })())
                }
            })
            .catch((e) => {
                console.log(e)
                Alert.print('장치목록을 가져오지 못했습니다.\n' + e)
            });
    } catch (error) {
        console.log(error)
        Alert.print('장치목록을 가져오지 못했습니다.\n' + error)
    }
}


let tracks;
function getSteam(deviceId) {
    if(typeof tracks !== 'undefined') {
        for (let i = 0; i < tracks.length; i++) {
            tracks[i].stop();
        }
    }
    const option = {}

    if (typeof deviceId === 'string') {
        option.deviceId = deviceId;
    }

    navigator.mediaDevices.getUserMedia({
        video: option
    })
    .then( (stream) => {
        tracks = stream.getTracks();
        console.log('tracks', tracks)
        
        console.log('getUserMedia')
        if (!isPermission) {
            init();
            isPermission = true;
            return;
        }


        camVideo.onloadedmetadata = () => {
            camVideo.load();
            camVideo.play();
            camVideo.onloadedmetadata = undefined
        };
        camVideo.srcObject = stream;
    })
    .catch(e => {
        console.log(e);
        Alert.print('카메라 소스를 가져오지 못했습니다. \n' + e);
    })

}

const camCavnas = document.createElement('canvas');
camCavnas.width = width;
camCavnas.height = height;
const camContext = camCavnas.getContext('2d');
if(isDev) {
    document.body.appendChild(camCavnas)
}

function draw() {
    ctx.clearRect(0, 0, width, height); 
    if (!camVideo.paused) {

        let newHeight = camVideo.videoHeight * (width / camVideo.videoWidth);
        
        ctx.drawImage(
            camVideo, 

            0, 0, 
            camVideo.videoWidth, camVideo.videoHeight, 

            0,
            (height - newHeight) / 2,

            width, newHeight
        )
    }

    requestAnimationFrame(draw);
}

const description = document.querySelector('.main.description')

function Header(text) {
    let h2 = document.createElement('h2')
    h2.innerText = text

    return h2
}
function Div(text) {
    let div = document.createElement('div')
    if(typeof text === 'string') {
        div.innerText = text
    }
    return div
}
function Br() {
    let br = document.createElement('br')
    return br
}

description.appendChild( Header('목록') )
const countDiv = Div()
description.appendChild( countDiv )
let countButton = document.createElement('button')
countButton.innerText = 'countButton'
description.appendChild( countButton )


let count = 0
countDiv.innerText = count
function getCountData() {
    let data = Number(localStorage.getItem('count'))
    if(Number.isNaN(data)) { return }

    count = data
    countDiv.innerText = count
}
function setCountData() {
    localStorage.setItem('count', count)
}

countButton.onclick = () => {
    count++
    setCountData()
    setCountData()
    getCountData()
}

getCountData()

let cleartLocalStorageButton = document.createElement('button')
cleartLocalStorageButton.innerText = 'cleart localStorage'
description.appendChild( cleartLocalStorageButton )
cleartLocalStorageButton.onclick = () => {
    localStorage.clear()
    getCountData()
}