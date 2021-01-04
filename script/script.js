// クエリパラメータから設定時間を取得
const params = (new URL(document.location)).searchParams;
const settingTime = params.get('st') || 30000;

let totalTime = parseInt(settingTime) + 1000;
let startTime = Date.now();
let remainMSec = 0;
let timerId;

const startButton = document.querySelector('#start');
const stopButton = document.querySelector('#stop');
const skipButton = document.querySelector('#skip');


// ミリ秒を00:00表記に変換する
function formatTimeText(mSec) {
    // ミリ秒を整数の秒数に変換する
    const sec = Math.ceil(mSec / 1000);

    // 分
    let m = String(Math.floor(sec / 60)).padStart(2, '0');

    // 秒
    let s = String(sec - (m * 60)).padStart(2, '0');
    return `${m}:${s}`;
}


// リロードする
function doReload() {
    // reloadメソッドによりページをリロード
    window.location.reload();
}


function countDown() {
    timerId = setInterval(() => {
        currentTime = Date.now();
        const diff = currentTime - startTime;
        // 設定時間から差分を引いて、残りミリ秒を計算する
        remainMSec = totalTime - diff;

        if (remainMSec <= 0) {
            // タイマーを終了する
            clearInterval(timerId);
            doReload();
        }

        // ミリ秒を00:00表記に変換する
        let label = formatTimeText(remainMSec);

        document.querySelector('#log').innerHTML = label;
    }, 1000);
}

countDown();


// 停止
stopButton.addEventListener('click', () => {
    clearInterval(timerId);
    totalTime = remainMSec;
    stopButton.style.display = 'none';
    startButton.style.display = 'inline';
});

// 再開
startButton.addEventListener('click', () => {
    startTime = Date.now();
    countDown();
    startButton.style.display = 'none';
    stopButton.style.display = 'inline';
});

// スキップ
skipButton.addEventListener('click', () => {
    doReload();
});

// キーイベントでの操作
document.addEventListener('keydown', handleKeyDown);

function handleKeyDown(event) {
    const keyCode = event.keyCode;
    // 右矢印キーでスキップ
    if (keyCode === 39) {
        doReload();
    }
    // スペースキーで再生・停止
    if (keyCode === 32) {
        if (startButton.style.display === 'none') {
            clearInterval(timerId);
            totalTime = remainMSec;
            stopButton.style.display = "none";
            startButton.style.display = "inline";
        } else {
            startTime = Date.now();
            countDown();
            startButton.style.display = "none";
            stopButton.style.display = "inline";
        }
    }
}
