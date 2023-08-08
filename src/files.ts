import {join, documentDir} from '@tauri-apps/api/path';
import {exists, writeTextFile, createDir, BaseDirectory, removeFile, readDir, readTextFile, readBinaryFile} from '@tauri-apps/api/fs';


function saveFiles(place: {[key: string]: any}, fromPlace: {[key: string]: any} | null) {
    join('HUstoneWizard', 'places').then((DIR) => {
        join(DIR, place['name'] + '.json').then((newPlace) => {
            writeTextFile(newPlace, JSON.stringify(place, null, 2), {dir: BaseDirectory.Document});
        });
        if(fromPlace != null) {
            join(DIR, fromPlace['name'] + '.json').then((place2BeRemoved) => {
                removeFile(place2BeRemoved, {dir: BaseDirectory.Document});
            });
        }
    })
}

function loadPlaces() {
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
    let overworldPlaces = new Map();
    let netherPlaces = new Map();
    let theEndPlaces = new Map();
    join('HUstoneWizard', 'places').then((DIR) => {
        exists(DIR, {dir: BaseDirectory.Document}).then((exist) => {
            if(!exist) {
                createDir(DIR, {dir: BaseDirectory.Document, recursive: true});
            } else {
                readDir(DIR, {dir: BaseDirectory.Document}).then((fileEntry) => {
                    fileEntry.forEach((item) => {
                        readTextFile(item.path).then((content) => {
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
                });
            }
        })
    });

    join('HUstoneWizard', 'images').then((DIR) => {
        return exists(DIR, {dir: BaseDirectory.Document})
    }).then((exist) => {
        if(!exist) {
            join('HUstoneWizard', 'images').then((DIR) => {
                createDir(DIR, {dir: BaseDirectory.Document, recursive: true});
            });
        }
    })
    
    return [overworldPlaces, netherPlaces, theEndPlaces];
}

async function setBackPic(name: string, html: HTMLDivElement) {
    let pic = await join(await documentDir(), 'HUstoneWizard', 'images', name + '.png');
    let picExists = await exists(pic);
    if(picExists) {
        readBinaryFile(pic).then((image) => {
            let blob = new Blob([image], {type: 'image/png'});
            let url = URL.createObjectURL(blob);
            html.style.backgroundImage = `url(${url})`;
        });
    }
    return picExists;
}

export {saveFiles, loadPlaces, setBackPic};