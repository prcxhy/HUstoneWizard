import {exists, writeTextFile, createDir, BaseDirectory, removeFile, readDir, readTextFile} from '@tauri-apps/api/fs';

const DIR = 'HUstoneWizard\\places';

function saveFiles(place: {[key: string]: any}, fromPlace: {[key: string]: any} | null) {
    writeTextFile(DIR + '\\' + place['name'] + '.json', JSON.stringify(place, null, 2), {dir: BaseDirectory.Document});
    if(fromPlace != null) {
        removeFile(DIR + '\\' + fromPlace['name'] + '.json', {dir: BaseDirectory.Document});
    }
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
    
    return [overworldPlaces, netherPlaces, theEndPlaces];
}

export {saveFiles, loadPlaces};