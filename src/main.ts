import {saveFiles, loadPlaces} from './files.js';

var gohome = document.getElementById('gohome') as HTMLButtonElement;
var search = document.getElementById('search') as HTMLInputElement;
var searchResult = document.getElementById('search_result') as HTMLDivElement;
var more = document.getElementById('more') as HTMLInputElement;
var moreLabel = document.getElementById('more_label') as HTMLLabelElement;
var modes = document.getElementById('modes') as HTMLInputElement;
var create = document.getElementById('create') as HTMLDivElement;
var edit = document.getElementById('edit') as HTMLDivElement;
var save = document.getElementById('save') as HTMLButtonElement;
var cancel = document.getElementById('cancel') as HTMLButtonElement;
var content = document.getElementById('content') as HTMLDivElement;
var homepage = document.getElementById('homepage') as HTMLDivElement;
var placeCard = document.getElementById('place_card') as HTMLDivElement;    
var placeList = document.getElementById('place_list') as HTMLDivElement;

var placeShowing: {[key: string]: any};
var isSavingNew = true;

var placesMaps = loadPlaces();

const OVERWORLD_PLACES = placesMaps[0];
const NETHER_PLACES = placesMaps[1];
const THEEND_PLACES = placesMaps[2];

var SEARCH_MODE = 'place';
var SEARCH_RADIUS = 64;

function getAssetsImage(name: string) {
    let img: HTMLImageElement;
    if(name == 'overworld') {
        img = document.getElementsByClassName('assets')[0].cloneNode() as HTMLImageElement;
    } else if(name == 'nether') {
        img = document.getElementsByClassName('assets')[1].cloneNode() as HTMLImageElement;
    } else if(name == 'theEnd') {
        img = document.getElementsByClassName('assets')[2].cloneNode() as HTMLImageElement;
    } else {
        img = document.getElementsByClassName('assets')[3].cloneNode() as HTMLImageElement;
    }
    img.className = '';
    return img;
}

// HOMEPAGE.id = 'homepage';
// let logo = document.createElement('img');
// logo.src = './src/assets/HUstone.svg';
// HOMEPAGE.appendChild(logo);

// content.appendChild(HOMEPAGE);

function getMap(dim: string) {
    let map;
    switch(dim) {
        case 'overworld': map = OVERWORLD_PLACES;
        break;
        case 'nether': map = NETHER_PLACES;
        break;
        case 'theEnd': map = THEEND_PLACES;
        break;
        default: map = OVERWORLD_PLACES;
    }
    return map;
}

function createEditPage() {
    let map = getMap('overworld');
    let oppositeMap = getMap('nether');

    // 创建页面
    let page = document.createElement('div');
    page.id = 'editPage';

    // 基本信息区
    let basicInfo = document.createElement('div');
    basicInfo.className = 'infoPanel';

    // 地名输入
    let name = document.createElement('input');
    let intro = document.createElement('textarea');
    let _name_ = document.createElement('label');
    let _intro_ = document.createElement('label');
    name.type = 'text';
    intro.rows = 4;
    name.id = 'name';
    intro.id = 'introduction';
    name.oninput = () => {
        if(name.value == '') {
            save.disabled = true;
        } else {
            save.disabled = false;
        }
    }
    _name_.innerText = '名称';
    _intro_.innerText = '简介';
    _name_.setAttribute('for', 'name');
    _intro_.setAttribute('for', 'introduction');

    // 维度选择
    let dimension = document.createElement('div');
    let dimPicker = document.createElement('div');
    let dimName = document.createElement('p');
    dimPicker.className = 'dim_picker';
    dimension.id = 'dimension';
    dimName.innerText = '主世界';

    let dimAddition = document.createElement('div');
    let portal4Func = document.createElement('input');
    let portal4Pass = document.createElement('input');
    let _portal4Func_ = document.createElement('label');
    let _portal4Pass_ = document.createElement('label');
    portal4Func.type = 'checkbox';
    portal4Pass.type = 'checkbox';
    portal4Func.id = 'func';
    portal4Pass.id = 'pass';
    _portal4Func_.setAttribute('for', 'func');
    _portal4Pass_.setAttribute('for', 'pass');
    _portal4Func_.innerText = '有工业用传送门';
    _portal4Pass_.innerText = '有通行用传送门';

    dimAddition.append(portal4Func, _portal4Func_, portal4Pass, _portal4Pass_);

    let overworld = document.createElement('input');
    let nether = document.createElement('input');
    let theEnd = document.createElement('input');
    let _overworld_ = document.createElement('label');
    let _nether_ = document.createElement('label');
    let _theEnd_ = document.createElement('label');
    let ov = getAssetsImage('overworld');
    let nt = getAssetsImage('nether');
    let end = getAssetsImage('theEnd');
    overworld.type = 'radio';
    nether.type = 'radio';
    theEnd.type = 'radio';
    overworld.name = 'dimension';
    nether.name = 'dimension';
    theEnd.name = 'dimension';
    overworld.id = 'overworld';
    nether.id = 'nether';
    theEnd.id = 'theEnd';
    overworld.checked = true;
    overworld.onchange = () => {
        if(overworld.checked) {
            dimName.innerText = '主世界';
            dimAddition.style.display = 'flex';
            _opposite_.innerHTML = '<sub>下界侧</sub>';
            _opposite_.style.display = '';
            opposite.style.display = '';
            map = getMap('overworld');
            oppositeMap = getMap('nether');
            
            opposite.value = '';
            opposite.dispatchEvent(new Event('input'));
            parent.value = '';
            parent.dispatchEvent(new Event('input'));
        }
    }
    nether.onchange = () => {
        if(nether.checked) {
            dimName.innerText = '下界';
            dimAddition.style.display = 'flex';
            _opposite_.innerHTML = '<sub>主世界侧</sub>';
            _opposite_.style.display = '';
            opposite.style.display = '';
            map = getMap('nether');
            oppositeMap = getMap('overworld');

            opposite.value = '';
            opposite.dispatchEvent(new Event('input'));
            parent.value = '';
            parent.dispatchEvent(new Event('input'));
        }
    }
    theEnd.onchange = () => {
        if(theEnd.checked) {
            dimName.innerText = '末地';
            dimAddition.style.display = 'none';
            _opposite_.style.display = 'none';
            opposite.style.display = 'none';
            map = getMap('theEnd');

            opposite.value = '';
            opposite.dispatchEvent(new Event('input'));
            parent.value = '';
            parent.dispatchEvent(new Event('input'));
            portal4Func.checked = false;
            portal4Pass.checked = false;
        }
    }
    _overworld_.setAttribute('for', 'overworld');
    _nether_.setAttribute('for', 'nether');
    _theEnd_.setAttribute('for', 'theEnd');
    _overworld_.className = 'imgLabel';
    _nether_.className = 'imgLabel';
    _theEnd_.className = 'imgLabel';
    ov.width = 24;
    nt.width = 24;
    end.width = 24;
    _overworld_.appendChild(ov);
    _nether_.appendChild(nt);
    _theEnd_.appendChild(end);

    dimPicker.append(overworld, _overworld_, nether, _nether_, theEnd, _theEnd_);
    dimension.append(dimPicker, dimName);

    // 坐标输入
    let coordinate = document.createElement('div');
    coordinate.id = 'coordinate';
    // x输入
    let x = document.createElement('input');
    let y = document.createElement('input');
    let z = document.createElement('input');
    let _x_ = document.createElement('label');
    let _y_ = document.createElement('label');
    let _z_ = document.createElement('label');
    x.type = 'number';
    y.type = 'number';
    z.type = 'number';
    x.id = 'x';
    y.id = 'y';
    z.id = 'z';
    x.value = '0';
    y.value = '0';
    z.value = '0';
    _x_.innerText = 'x';
    _y_.innerText = 'y';
    _z_.innerText = 'z';
    _x_.setAttribute('for', 'x');
    _y_.setAttribute('for', 'y');
    _z_.setAttribute('for', 'z');
    coordinate.append(_x_, x, _y_, y, _z_, z);

    basicInfo.append(_name_, name, _intro_, intro, dimension, dimAddition, coordinate);
    
    // 相关地点信息区
    let rlt = document.createElement('div');
    // 物资信息区
    let rsc = document.createElement('div');
    // 说明信息区
    let dtl = document.createElement('div');
    // 相关人信息区
    let ply = document.createElement('div');
    // 相关地点-父级地点信息输入
    let parent = document.createElement('input');
    // 相关地点-对侧地点信息输入
    let opposite = document.createElement('input');
    // 父级地点检索结果
    let parentResult = document.createElement('div');
    // 对侧地点检索结果
    let oppositeResult = document.createElement('div');
    // 物资信息输入
    let resources = document.createElement('textarea');
    // 说明信息输入
    let details = document.createElement('textarea');
    // 相关人员信息输入
    let players = document.createElement('textarea');
    let _parent_ = document.createElement('label');
    let _opposite_ = document.createElement('label');
    let _resources_ = document.createElement('label');
    let _details_ = document.createElement('label');
    let _players_ = document.createElement('label');
    rlt.className = 'infoPanel';
    rsc.className = 'infoPanel';
    dtl.className = 'infoPanel';
    ply.className = 'infoPanel';
    resources.rows = 4;
    details.rows = 4;
    players.rows = 4;
    parent.type = 'text';
    opposite.type = 'text';
    parent.id = 'parent';
    opposite.id = 'opposite';
    parentResult.id = 'parent_result';
    oppositeResult.id = 'opposite_result';
    resources.id = 'resources';
    details.id = 'details';
    players.id = 'players';

    _parent_.innerHTML = '关联地点<br><sub>属于</sub>';
    _opposite_.innerHTML = '<sub>下界侧</sub>';
    _resources_.innerText = '物资';
    _details_.innerText = '说明';
    _players_.innerText = '相关人员';
    _parent_.setAttribute('for', 'parent');
    _opposite_.setAttribute('for', 'opposite');
    _resources_.setAttribute('for', 'resources');
    _details_.setAttribute('for', 'details');
    _players_.setAttribute('for', 'players');

    parent.oninput = () => {
        if(parent.value != '') {
            parentResult.style.display = 'flex';
            parentResult.replaceChildren();
            map.forEach((item) => {
                let placeName = item['name'] as string;
                if(placeName.includes(parent.value) && placeName != name.value) {
                    addResult(item, parentResult, () => {
                        parentResult.style.display = 'none';
                        parent.value = item['name'];
                    });
                }
            });
            if(parentResult.children.length == 0) {
                let p = document.createElement('p');
                p.innerText = '没有找到捏';
                parentResult.appendChild(p);
            }
        } else {
            parentResult.style.display = 'none';
        }
    };

    opposite.oninput = () => {
        if(opposite.value != '') {
            oppositeResult.style.display = 'flex';
            oppositeResult.replaceChildren();
            oppositeMap.forEach((item) => {
                let placeName = item['name'] as string;
                if(placeName.includes(opposite.value)) {
                    addResult(item, oppositeResult, () => {
                        oppositeResult.style.display = 'none';
                        opposite.value = item['name'];
                    });
                }
            });
            if(oppositeResult.children.length == 0) {
                let p = document.createElement('p');
                p.innerText = '没有找到捏';
                oppositeResult.appendChild(p);
            }
        } else {
            oppositeResult.style.display = 'none';
        }
    };
    
    rlt.append(_parent_, parent, parentResult, _opposite_, opposite, oppositeResult);
    rsc.append(_resources_, resources);
    dtl.append(_details_, details);
    ply.append(_players_, players);

    // 页面组装
    page.append(basicInfo, rlt, rsc, dtl, ply);
    // 页面添加
    content.replaceChildren(page);
}

function searchRadiusSetting() {
    let setting = document.createElement('div');
    let hint = document.createElement('p');
    let radius = document.createElement('input');
    setting.className = 'radius_setting'
    hint.innerText = '半径: ' + SEARCH_RADIUS;
    radius.type = 'range';
    radius.min = '64';
    radius.max = '512';
    radius.step = '64';
    radius.value = SEARCH_RADIUS.toString();
    radius.oninput = () => {
        SEARCH_RADIUS = parseInt(radius.value);
        hint.innerText = '半径: ' + radius.value;
        search.dispatchEvent(new Event('input'));
    }
    setting.append(hint, radius);
    return setting;
}

function fillInfo() {
    let name = document.getElementById('name') as HTMLInputElement;
    let intro = document.getElementById('introduction') as HTMLTextAreaElement;
    let dimension = document.getElementById(placeShowing['dimension']) as HTMLInputElement;
    let x = document.getElementById('x') as HTMLInputElement;
    let y = document.getElementById('y') as HTMLInputElement;
    let z = document.getElementById('z') as HTMLInputElement;
    let opposite = document.getElementById('opposite') as HTMLInputElement;
    let parent = document.getElementById('parent') as HTMLInputElement;
    let resources = document.getElementById('resources') as HTMLTextAreaElement;
    let details = document.getElementById('details') as HTMLTextAreaElement;
    let players = document.getElementById('players') as HTMLTextAreaElement;
    let funcPortal = document.getElementById('func') as HTMLInputElement;
    let passPortal = document.getElementById('pass') as HTMLInputElement;

    name.value = placeShowing['name'];
    intro.value = placeShowing['introduction'];
    dimension.checked = true;
    dimension.dispatchEvent(new Event('change'));

    if(placeShowing['portal'] == 'both') {
        funcPortal.checked = true;
        passPortal.checked = true;
    } else if(placeShowing['portal'] == 'pass') {
        passPortal.checked = true;
    } else if(placeShowing['portal'] == 'func') {
        funcPortal.checked = true;
    }
    x.value = placeShowing['x'];
    y.value = placeShowing['y'];
    z.value = placeShowing['z'];

    opposite.value = placeShowing['opposite'];
    parent.value = placeShowing['parent'];

    resources.value = placeShowing['resources'];
    details.value = placeShowing['details'];
    players.value = placeShowing['players'];
}

function editMode(isNewOne: boolean) {
    moreLabel.style.display = 'none';
    save.style.display = 'flex';
    save.disabled = isNewOne;
    cancel.style.display = 'flex';
    isSavingNew = isNewOne;
    createEditPage();
    if(!isNewOne) {
        fillInfo();
    }
}

function createAnchor(place: {[key: string]: any}) {
    let anchor = document.createElement('button');
    anchor.innerText = place['name'];
    anchor.onclick = () => {
        infoMode(place);
    }
    return anchor;
}

function infoMode(place: {[key: string]: any}) {
    save.style.display = 'none';
    cancel.style.display = 'none';
    moreLabel.style.display = 'flex';
    let page: HTMLDivElement;
    
    if(place != undefined) {
        edit.style.display = 'flex';

        placeShowing = place;
        
        let d = place['dimension'];
        let map = getMap(d);
        
        page = document.createElement('div');
        
        let basicInfo = document.createElement('div');
        let related = document.createElement('div');
        let resources = document.createElement('div');
        let details = document.createElement('div');
        let players = document.createElement('div');
        
        let nameAndDimension = document.createElement('div');
        let coordinate = document.createElement('div');
        let dimAddition = document.createElement('div');
        
        let name = document.createElement('h1');
        name.innerText = place['name'];
        let dimension = document.createElement('h2');
        if(d == 'overworld') {
            dimension.innerText = '主世界';
            content.style.backgroundColor = 'rgb(117, 99, 80)';
        }
        if(d == 'nether') {
            dimension.innerText = '下界';
            content.style.backgroundColor = 'rgb(87, 45, 45)';

        }
        if(d == 'theEnd') {
            dimension.innerText = '末地';
            dimAddition.style.display = 'none'
            content.style.backgroundColor = 'rgb(35, 0, 57)';

        }
        let dimLabel = getAssetsImage(d);
        dimLabel.width = 24;
        dimLabel.height = 24;
        let xLabel = document.createElement('p');
        let yLabel = document.createElement('p');
        let zLabel = document.createElement('p');
        xLabel.innerText = 'x';
        yLabel.innerText = 'y';
        zLabel.innerText = 'z';
        let x = document.createElement('h3');
        let y = document.createElement('h3');
        let z = document.createElement('h3');
        x.innerText = place['x'];
        y.innerText = place['y'];
        z.innerText = place['z'];
        let portalImg = getAssetsImage('portal');
        let portalType = document.createElement('h3');
        portalImg.width = 16;
        if(place['portal'] == '') {
            portalType.innerText = '无下界传送门';
            portalType.style.color = 'rgb(128, 128, 128)';
        }
        if(place['portal'] == 'func') {
            portalType.innerText = '生产用门，禁止通行';
            portalType.style.color = 'rgb(168, 80, 80)';
        }
        if(place['portal'] == 'pass') {
            portalType.innerText = '下界传送门通行专用';
            portalType.style.color = 'rgb(87, 174, 87)';
        }
        if(place['portal'] == 'both') {
            portalType.innerText = '有门但不要走错';           
            portalType.style.color = 'rgb(225, 195, 0)'
        }
        let intro = document.createElement('p');
        intro.innerText = place['introduction'];
        
        let rltTitle = document.createElement('h3');
        let oppTitle = document.createElement('h4');
        let prtTitle = document.createElement('h4');
        let chlTitle = document.createElement('h4');
        let rsrcTitle = document.createElement('h3');
        let dtlTitle = document.createElement('h3');
        let plyTitle = document.createElement('h3');
        rltTitle.innerText = '关联地点';
        oppTitle.innerText = d == 'overworld'? '下界侧': '主世界侧';
        prtTitle.innerText = '属于';
        chlTitle.innerText = '包含';
        rsrcTitle.innerText = '物资';
        dtlTitle.innerText = '说明';
        plyTitle.innerText = '相关人员';
        let rsrcInfo = document.createElement('p');
        let dtlInfo = document.createElement('p');
        let plyInfo = document.createElement('p');
        rsrcInfo.innerText = place['resources'];
        dtlInfo.innerText = place['details'];
        plyInfo.innerText = place['players'];
        let opposite = document.createElement('div');
        let parent = document.createElement('div');
        let children = document.createElement('div');
        opposite.append(oppTitle);
        parent.append(prtTitle);
        children.append(chlTitle);
        opposite.className = 'info_row';
        parent.className = 'info_row';
        children.className = 'info_row';
        if(place['opposite'] != '') {    
            let oppositeMap = d == 'overworld'? getMap('nether'): getMap('overworld');   
            opposite.append(createAnchor(oppositeMap?.get(place['opposite'])));
        } else {
            opposite.style.display = 'none';
        }
        if(place['parent'] != '') {
            parent.append(createAnchor(map?.get(place['parent'])));
        } else {
            parent.style.display = 'none';
        }
        if(place['children'] != '') {
            let childrenPlaces = place['children'] == ''? []: place['children'] as string[];
            childrenPlaces.forEach((childName) => {
                children.append(createAnchor(map?.get(childName)));
            });
        } else {
            children.style.display = 'none';
        }

        if(opposite.style.display == 'none' && parent.style.display == 'none' && children.style.display == 'none') {
            related.style.display = 'none';
        }
        
        nameAndDimension.append(name, dimLabel, dimension);
        coordinate.append(xLabel, x, yLabel, y, zLabel, z);
        dimAddition.append(portalImg, portalType);
        nameAndDimension.className = 'info_row';
        coordinate.className = 'info_row';
        dimAddition.className = 'info_row';
        
        basicInfo.append(nameAndDimension, coordinate, dimAddition, intro);
        related.append(rltTitle, opposite, parent, children);
        resources.append(rsrcTitle, rsrcInfo);
        details.append(dtlTitle, dtlInfo);
        players.append(plyTitle, plyInfo);
        resources.style.display = rsrcInfo.innerText == ''? 'none': 'flex';
        details.style.display = dtlInfo.innerText == ''? 'none': 'flex';
        players.style.display = plyInfo.innerText == ''? 'none': 'flex';
        
        page.append(basicInfo, related, resources, details, players);
        page.id = 'info_page';
        page.className = d + '_page';
    } else {
        page = homepage;
    }
    
    content.replaceChildren(page);
}

function savePlaces() {
    let name = document.getElementById('name') as HTMLInputElement;
    let intro = document.getElementById('introduction') as HTMLTextAreaElement;
    let x = document.getElementById('x') as HTMLInputElement;
    let y = document.getElementById('y') as HTMLInputElement;
    let z = document.getElementById('z') as HTMLInputElement;
    let parent = document.getElementById('parent') as HTMLInputElement; 
    let opposite = document.getElementById('opposite') as HTMLInputElement; 
    let resources = document.getElementById('resources') as HTMLTextAreaElement;
    let details = document.getElementById('details') as HTMLTextAreaElement;
    let players = document.getElementById('players') as HTMLTextAreaElement;
    let dims = document.getElementsByName('dimension');
    let dimension = 'overworld';
    dims.forEach((element) => {
        let input = element as HTMLInputElement;
        if(input.checked) {
            dimension = input.id;
        }
    });
    let map = getMap(dimension);

    let funcPortal = document.getElementById('func') as HTMLInputElement;
    let passPortal = document.getElementById('pass') as HTMLInputElement;
    let portal = '';
      
    if(funcPortal.checked && passPortal.checked) {
        portal = 'both';
    }
    if(!funcPortal.checked && passPortal.checked) {
        portal = 'pass';
    }
    if(funcPortal.checked && !passPortal.checked) {
        portal = 'func';
    }
    if(!funcPortal.checked && !passPortal.checked) {
        portal = '';
    }
    
    let place: {[key: string]: any} = {
        'name': name.value,
        'introduction': intro.value,
        'dimension': dimension,
        'portal': portal,
        'x': x.value,
        'y': y.value,
        'z': z.value,
        'parent': parent.value,
        'children': isSavingNew? []: placeShowing['children'],
        'opposite': opposite.value,
        'resources': resources.value,
        'details': details.value,
        'players': players.value,
    }

    let oldPlace2Remove = null;

    if(!isSavingNew) {
        let dimPast = placeShowing['dimension'];
        let mapPast = getMap(dimPast);
        let childrenPast = placeShowing['children'] == ''? []: placeShowing['children'] as string[];
        if(dimension != placeShowing['dimension'] || name.value != placeShowing['name']) {
            mapPast?.delete(placeShowing['name']);
            if(dimension != placeShowing['dimension']) {
                place['children'] = [];
            }
            if(name.value != placeShowing['name']) {
                oldPlace2Remove = placeShowing;
            }
            if(childrenPast.length != 0) {
                childrenPast.forEach((child) => {
                    let childPast = mapPast?.get(child);
                    childPast['parent'] = '';
                    saveFiles(childPast, null);
                })
            }
        }
        if(placeShowing['parent'] != place['parent'] || name.value != placeShowing['name']) {
            let parentPast = mapPast?.get(placeShowing['parent']);
            let brothers = parentPast['children'] == ''? []: parentPast['children'] as string[];
            brothers.splice(brothers.indexOf(placeShowing['name']), 1);
            parentPast['children'] = brothers;
            saveFiles(parentPast, null);
        }
        if(placeShowing['opposite'] != place['opposite'] || name.value != placeShowing['name']) {
            let oppositeMap = dimPast == 'overworld'? getMap('nether'): getMap('overworld');
            let opposite = oppositeMap?.get(placeShowing['opposite']);
            opposite['opposite'] = '';
            saveFiles(opposite, null);
        }
    }
    if(place['parent'] != '') {
        let parent = map?.get(place['parent']);
        let brothers = parent['children'] == ''? []: parent['children'] as string[];
        brothers.push(place['name']);
        parent['children'] = brothers;
        saveFiles(parent, null);
    }
    if(place['opposite'] != '') {
        let oppositeMap = place['dimension'] == 'overworld'? getMap('nether'): getMap('overworld');
        let opposite = oppositeMap?.get(place['opposite']);
        opposite['opposite'] = place['name'];
        saveFiles(opposite, null);
    }
    let children = place['children'] == ''? []: place['children'] as string[];
    if(children.length != 0) {
        children.forEach((item) => {
            let child = map?.get(item);
            child['parent'] = place['name'];
            saveFiles(child, null);
        })
    }

    map?.set(name.value, place);
    saveFiles(place, oldPlace2Remove);
    
    infoMode(place);
}

function addResult(place: {[key: string]: any}, container: HTMLDivElement, callbackfn: () => void) {
    let dim = place['dimension'];
    let div = document.createElement('div');
    let img = getAssetsImage(dim);
    let name = document.createElement('p');
    img.width = 24;
    img.height = 24;
    name.innerText = place['name'];
    div.className = 'result_entry';
    div.onclick = callbackfn;
    div.append(img, name);
    if(dim == 'overworld') {
        div.style.color = 'rgb(23, 67, 143)';
    }
    if(dim == 'nether') {
        div.style.color = 'rgb(87, 45, 45)';
    }
    if(dim == 'theEnd') {
        div.style.color = 'rgb(74, 0, 121)';
    }
    container.appendChild(div);
}

function findPlaces(key: string, match: string) { 
    searchResult.replaceChildren();
    OVERWORLD_PLACES.forEach((item) => {
        let value = item[key] as string;
        if(value.includes(match)) {
            addResult(item, searchResult, () => {
                searchResult.style.display = 'none';
                infoMode(item);
            });
        }
    });
    NETHER_PLACES.forEach((item) => {
        let value = item[key] as string;
        if(value.includes(match)) {
            addResult(item, searchResult, () => {
                searchResult.style.display = 'none';
                infoMode(item);
            });
        }
    });
    THEEND_PLACES.forEach((item) => {
        let value = item[key] as string;
        if(value.includes(match)) {
            addResult(item, searchResult, () => {
                searchResult.style.display = 'none';
                infoMode(item);
            });
        }
    });
    if(searchResult.children.length == 0) {
        let p = document.createElement('p');
        p.innerText = '没有找到捏';
        searchResult.appendChild(p);
    }
} 

function findPlacesByXYZ(xyz: string) {
    let xyzValue = xyz.split(' ');
    if(xyzValue.length == 2 || xyzValue.length == 3) {
        for(let i = searchResult.children.length - 1; i > 1; i--) {
            searchResult.children[i].remove();
        }
        let x = 0;
        let y = 0;
        let z = 0;
        if(xyzValue.length == 2) {
            x = parseFloat(xyzValue[0]);
            z = parseFloat(xyzValue[1]);
        }
        if(xyzValue.length == 3) {
            x = parseFloat(xyzValue[0]);
            y = parseFloat(xyzValue[1]);
            z = parseFloat(xyzValue[2]);
        }
        let placeMatch = function(item: {[key: string]: any}) {          
            let x1 = parseFloat(item['x'] as string);
            let y1 = parseFloat(item['y'] as string);
            let z1 = parseFloat(item['z'] as string);
            let distance_2 = Math.pow(x - x1, 2) + Math.pow(z - z1, 2);
            if(xyzValue.length == 3) {
                distance_2 += Math.pow(y - y1, 2);
            }
            if(distance_2 <= Math.pow(SEARCH_RADIUS, 2)) {
                addResult(item, searchResult, () => {
                    searchResult.style.display = 'none';
                    infoMode(item);
                });     
            }
        }
        OVERWORLD_PLACES.forEach(placeMatch);
        NETHER_PLACES.forEach(placeMatch);
        THEEND_PLACES.forEach(placeMatch);
        if(searchResult.children.length == 2) {
            let p = document.createElement('p');
            p.innerText = '没有找到捏';
            searchResult.appendChild(p);
        }
    }       
}

function randomPlace() {
    let d = Math.floor(Math.random() * 3);
    let map = OVERWORLD_PLACES;
    if(d == 1) {
        map = NETHER_PLACES;
    }
    if(d == 2) {
        map = THEEND_PLACES;
    }
    let keys = Array.from(map.keys());
    let l = map.size;
    let place = map.get(keys[Math.floor(Math.random() * l)]);
    document.getElementById('card_name')!.innerText = place['name'];
    placeCard.onclick = () => {infoMode(place);};
}

document.getElementById('refresh')!.onclick = (event) => {
    randomPlace();
    event.stopPropagation();
}

document.getElementById('list')!.onclick = (event) => {
    content.style.backgroundColor = '';
    placeCard.style.display = 'none';
    placeList.style.display = 'flex';
    let ovList = document.getElementById('list_ov') as HTMLInputElement;
    ovList.checked = true;
    ovList.dispatchEvent(new Event('change'));
    event.stopPropagation();
}

gohome.onclick = () => {
    edit.style.display = 'none';
    placeList.style.display = 'none';
    placeCard.style.display = 'flex';
    save.style.display = 'none';
    cancel.style.display = 'none';
    moreLabel.style.display = 'flex';
    content.replaceChildren(homepage);
}

search.oninput = () => {
    if(search.value != '') {
        searchResult.style.display = 'flex';
        if(SEARCH_MODE == 'place') {
            findPlaces('name', search.value);
        }
        if(SEARCH_MODE == 'location') {
            findPlacesByXYZ(search.value);
        }
        if(SEARCH_MODE == 'rsrc_info') {
            findPlaces('resources', search.value);
        }
    } else {
        searchResult.style.display = 'none';
    }
};

more.onchange = () => {
    if(more.checked) {
        document.getElementById('more_buttons')!.style.display = 'flex';
    } else {
        document.getElementById('more_buttons')!.style.display = 'none';
    }
};

save.onclick = () => {
    savePlaces();
};

cancel.onclick = () => {
    infoMode(placeShowing);
};

create.onclick = () => {
    more.checked = false;
    more.dispatchEvent(new Event('change'));
    editMode(true);
};

edit.style.display = 'none';
edit.onclick = () => {
    more.checked = false;
    more.dispatchEvent(new Event('change'));
    editMode(false);
};

modes.onchange = () => {
    if(modes.checked) {
        document.getElementById('modes_selections')!.style.display = 'flex';
    } else {
        document.getElementById('modes_selections')!.style.display = 'none';
    }
};

document.getElementsByName('modes').forEach((item) => {
    let selection = item as HTMLInputElement;
    selection.onchange = () => {
        modes.checked = false;
        modes.dispatchEvent(new Event('change'));
        if(selection.checked) {
            let modeDisplay = document.getElementById('modes_label') as HTMLLabelElement;
            modeDisplay.replaceChildren(selection.nextElementSibling?.firstChild?.cloneNode() as HTMLElement);
            SEARCH_MODE = selection.id;
            if(selection.id == 'location') { 
                let hint = document.createElement('p');
                hint.innerText = '格式: [x] [z]或[x] [y] [z]\n坐标值以空格分隔';
                searchResult.replaceChildren(hint, searchRadiusSetting());
            }
            search.dispatchEvent(new Event('input'));
        }
    };
})

document.getElementsByName('list_dim').forEach((item) => {
    let dimSelected = item as HTMLInputElement;
    dimSelected.onchange = () => {
        if(dimSelected.checked) {
            for(let i = placeList.children.length - 1; i >= 1; i--) {
                placeList.children[i].remove();
            }
            if(dimSelected.value == 'overworld') {
                OVERWORLD_PLACES.forEach((item) => {
                    addResult(item, placeList, () => {
                        placeList.style.display = 'none';
                        infoMode(item);
                    });
                })
            }
            if(dimSelected.value == 'nether') {
                NETHER_PLACES.forEach((item) => {
                    addResult(item, placeList, () => {
                        placeList.style.display = 'none';
                        infoMode(item);
                    });
                })
            }
            if(dimSelected.value == 'theEnd') {
                THEEND_PLACES.forEach((item) => {
                    addResult(item, placeList, () => {
                        placeList.style.display = 'none';
                        infoMode(item);
                    });
                })
            }
        }
    }
})

// createEditPage();
// console.log(placeShowing);