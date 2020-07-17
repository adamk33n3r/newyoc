import { Request, Response } from 'express';

import { Controller, GET, POST } from 'src/decorators/routing';
import { Clink } from 'src/services/clink';
import config from 'src/config';


@Controller('/civ6')
class Civ6Controller {
    private clink = new Clink();

    @POST('/')
    @GET('/')
    public index(req: Request, res: Response) {
        let gameName: string, playerName: string, turnNumber: string, message: string;

        if (req.body.content) { // Is PYDT
            gameName = req.body.gameName;
            playerName = req.body.userName;
            turnNumber = req.body.round;
            const civ = req.body.civName;
            const leader = req.body.leaderName;
            const slackId = config.civ6.usernameMappings[playerName];
            const name = slackId ? `<@${slackId}>` : playerName;
            message = `It is now ${name}'s turn (${civ}) in the game ${gameName} (${turnNumber})`;
        } else if (req.body.value1) {// Is PBC
            gameName = req.body.value1;
            playerName = req.body.value2;
            turnNumber = req.body.value3;
            const slackId = config.civ6.usernameMappings[playerName];
            message = `It is now ${name}'s turn in the game ${gameName} (${turnNumber})`;
        } else {
            res.status(404).send();
            return;
        }

        this.clink.sendMessage('#civ6turns', message)
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
