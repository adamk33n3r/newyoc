import { Request, Response } from 'express';

import { Controller, GET, POST } from 'src/decorators/routing';
import { Required } from 'src/decorators/util';

import * as fileUpload from 'express-fileupload';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import { IGif } from './services/clink/types';

@Controller('/gifs')
class GifsController {
    @GET()
    @Required('teamId')
    public index(req: Request, res: Response) {
        const teamId = req.query.teamId;
        firebase.app('gifs').firestore().collection(`teams/${teamId}/gifs`).get()
        .then((gifs) => {
            return Promise.all(gifs.docs.map((doc) => {
                const gif = doc.data() as IGif;
                return firebase.app('gifs').storage().ref(doc.id).getDownloadURL()
                .then((url) => {
                    (gif as any).id = doc.id;
                    (gif as any).url = url;
                    return gif;
                })
                .catch((err) => {
                    res.send(500, err);
                });
            }));
        })
        .then((gifs) => {
            res.json(gifs);
        })
        .catch((err) => {
            res.send(500, err);
        });
    }

    @POST('/')
    @Required('teamId')
    public store(req: Request, res: Response) {
        const teamId = req.body.teamId;
        const file = (req.files.file as fileUpload.UploadedFile);
        firebase.app('gifs').storage().ref(file.name).put(file.data, {
            contentType: file.mimetype,
        }).then((upload) => {
            const tags = [
                file.name.slice(0, -4),
            ];

            Promise.all([
                firebase.app('gifs').firestore().collection(`teams/${teamId}/gifs`).doc(file.name).set({
                    tags,
                }),
                upload.ref.getDownloadURL(),
            ])
            .then(([_, url]) => {
                res.json({
                    id: file.name,
                    tags,
                    url,
                });
            });
        });
    }

    @POST()
    @Required('teamId', 'gif', 'tags')
    public updateTags(req: Request, res: Response) {
        firebase.app('gifs').firestore().collection(`teams/${req.body.teamId}/gifs`).doc(req.body.gif).set({
            tags: req.body.tags,
        }).then(() => {
            res.send();
        });
    }
}

export default new GifsController();
