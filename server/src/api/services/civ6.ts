import { Request, Response } from 'express';

import { Controller, GET, POST } from 'src/decorators/routing';
import { Clink } from 'src/services/clink';
import config from 'src/config';

@Controller('/civ6')
class Civ6Controller {
    private slack = new Clink();

    @POST('/')
    @GET('/')
    public index(req: Request, res: Response) {
        const gameName = req.body.value1;
        const playerName = req.body.value2;
        const turnNumber = req.body.value3;

        this.slack.sendMessage('#civ6turns', `It is now ${playerName}'s turn (${turnNumber}) in the game ${gameName}`)
        .then((response) => {
            if (response.ok) {
                res.json({ success: true, body: response.body});
            } else {
                console.error(response);
                res.status(500).send(response);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send(err);
        });
    }
}

export default new Civ6Controller();
