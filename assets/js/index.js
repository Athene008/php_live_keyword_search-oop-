const delayTime = 100;
let count = 0;

function setVisibleMode(type) {
    let element;

    document.querySelector("img[alt='dark']").src = `./assets/images/cat_${type}.gif`;

    if (type == 'dark') {
        element = document.querySelector('.light-mode');
        element.classList.remove('light-mode');
        element.classList.add('dark-mode');
        document.querySelector("img[alt='dark']").src = `./assets/images/cat_dark.gif`;
    } else {
        element = document.querySelector('.dark-mode');
        element.classList.remove('dark-mode');
        element.classList.add('light-mode');
        document.querySelector("img[alt='dark']").src = `./assets/images/cat_light.gif`;
    }
}

function search() {
    let keyword = document.querySelector('.search-box').value;
    let pattern = /[^a-zA-Z0-9 \-!?&.:]/;

    if (pattern.test(keyword)) {
        
    } else {
        // Change URL
        history.pushState('', '',  '?q=' + keyword.replaceAll(' ', '+'));

        load('first');
    }
}

function save(appId, clicked) {
    var xhr = new XMLHttpRequest();
    var keyword = document.querySelector('.search-box').value;

    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText == 'error') {
                alert('Error Occured!');
            }
        }
    };
    xhr.open("GET", "backend/main.php?keyword=" + keyword + "&app_id=" + appId + "&clicked" + clicked + "&mode=save", true);
    xhr.send();
}

function load(order) {
    var xhr = new XMLHttpRequest();
    var keyword = document.querySelector('.search-box').value;
    
    if (order == "first") {
        count = 0;
    } else {
        count += 1;
    }

    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var res = JSON.parse(this.responseText);
            document.querySelector('#view-more').style.display = res.more ? 'block' : 'none';

            if (order == 'first') {
                document.getElementById('item-box').innerHTML = generateHTML(res.result);
            } else {
                document.getElementById('item-box').innerHTML += generateHTML(res.result);
            }
        }
    };
    xhr.open("GET", "backend/main.php?keyword=" + keyword + "&count=" + count * 20 + "&mode=load", true);
    xhr.send();
}

function generateHTML(data) {
    var html = "";
    data.map(item => {
        html += `<div class="col-md-4 my-2">
                    <div class="box-container p-1 d-flex">
                    <div class="left-border"></div>
                    <a href="${item.url}" target="_blank" class="item">
                        <div class="box position-relative w-100" style="height: 90px;">
                            <div class="top-border"></div>
                            <div class="d-flex">  
                            <div>
                                <img src="./assets/app_icons/${item.icon_name}.png" alt="png" style="width: 50px;" class="p-1">
                            </div>
                            <div class="w-100 px-1">
                                <h6 class="fw-bold my-1 item-title">${item.name}</h6>
                                <p class="item-desc">${item.description}</p>
                            </div>
                            </div>
                            <div class="bottom-border"></div>
                        </div>
                    </a>
                    <div class="right-border"></div>
                    </div>
                </div>`;
    });
    return html;
}

window.onload = () => {
    let searchDelayTime;
    //setVisibleMode('dark');
    
    document.querySelector('#view-more').addEventListener('click', load);
    
    document.querySelector('.search-box').addEventListener('input', function(e) {
        clearTimeout(searchDelayTime);
        searchDelayTime = setTimeout(search, delayTime);
    });
}