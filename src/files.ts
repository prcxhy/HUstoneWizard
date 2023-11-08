import {join, documentDir, resolveResource} from '@tauri-apps/api/path';
import {exists, writeTextFile, createDir, BaseDirectory, removeFile, readDir, readTextFile, renameFile} from '@tauri-apps/api/fs';
import {convertFileSrc} from '@tauri-apps/api/tauri'


async function saveFiles(place: {[key: string]: any}, fromPlace?: {[key: string]: any}) {
    let dir2Save = await join('HUstoneWizard', 'places', place['name'] + '.json');
    writeTextFile(dir2Save, JSON.stringify(place, null, 2), {dir: BaseDirectory.Document});
    if(fromPlace != undefined) {
        let dir2Remove = await join('HUstoneWizard', 'places', fromPlace['name'] + '.json');
        removeFile(dir2Remove, {dir: BaseDirectory.Document});

        let oldImage = await join('HUstoneWizard', 'images', fromPlace['name'] + '.png');
        let newImage = await join('HUstoneWizard', 'images', place['name'] + '.png');
        if(await exists(oldImage, {dir: BaseDirectory.Document})) {
            renameFile(oldImage, newImage, {dir: BaseDirectory.Document});
        }
    }
}

async function loadPlaces() {
    let keys4verify = [
        'name',
        'introduction',
        'dimension',
        'portal',
        'x',
        'y',
        'z',
        'parent',
        'children',
        'opposite',
        'resources',
        'details',
        'players'
    ];
    let placesDir = await join('HUstoneWizard', 'places');
    let imagesDir = await join('HUstoneWizard', 'images');
    let overworldPlaces = new Map();
    let netherPlaces = new Map();
    let theEndPlaces = new Map();
    
    if(!(await exists(placesDir, {dir: BaseDirectory.Document}))) {
        createDir(placesDir, {dir: BaseDirectory.Document, recursive: true});
        return [];
    } else {
        let fileEntries = await readDir(placesDir, {dir: BaseDirectory.Document});
        if(fileEntries.length == 0) {
            return [];
        }
        fileEntries.forEach((fileEntry) => {
            readTextFile(fileEntry.path).then((content) => {
                let place = JSON.parse(content);
                keys4verify.forEach((key) => {
                    if(place[key] == undefined) {
                        place[key] = '';
                    }
                })
                let dim = place['dimension'];
                if(dim == 'overworld') {
                    overworldPlaces.set(place['name'], place);
                }
                if(dim == 'nether') {
                    netherPlaces.set(place['name'], place);
                }
                if(dim == 'theEnd') {
                    theEndPlaces.set(place['name'], place);
                }
            });
        })
    }

    if(!(await exists(imagesDir, {dir: BaseDirectory.Document}))) {
        createDir(imagesDir, {dir: BaseDirectory.Document, recursive: true});
    }
    
    return [overworldPlaces, netherPlaces, theEndPlaces];
}

async function setBackPic(name: string, ...htmls: HTMLDivElement[]) {
    let pic = await join(await documentDir(), 'HUstoneWizard', 'images', name + '.png');
    let picExists = await exists(pic);
    if(picExists) {
        let url = convertFileSrc(pic);
        htmls.forEach(html => html.style.backgroundImage = `url(${url})`);
    }
    return picExists;
}

async function getResourceImg(fileName: string) {
    return convertFileSrc(await resolveResource('../resources/' + fileName));
}

export {saveFiles, loadPlaces, setBackPic, getResourceImg};