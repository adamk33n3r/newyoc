import { Request, Response } from 'express';

import { Controller, GET, POST } from 'src/decorators/routing';
import { CheckToken, Required } from 'src/decorators/util';

import { TeamSpeak } from 'src/services/teamspeak';
import config from 'src/config';

@Controller('/api-ai')
class ApiAIController {
    @POST()
    @CheckToken('this is a token')
    public index(req: Request, res: Response) {
        const ts = this.initTeamSpeak(res);
        ts.login(config.teamspeak.username, config.teamspeak.password)
        .then(() => ts.getOnlineClients())
        .then((online) => {
            let message: string;
            if (online.length > 0) {
                const clientNames = online.map((client) => client.client_nickname);
                let clients = clientNames.join(', ');
                clients = clients.replace(/(.*),/, '$1, and');
                message = clients + ' ' + (online.length === 1 ? 'is' : 'are') + ' online.';
            } else {
                message = 'Nobody is online right now.';
            }
            res.json({
              speech: message,
              displayText: message,
              source: 'yoc',
            });
            ts.close();
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send(error);
        });
    }

    private initTeamSpeak(res: Response): TeamSpeak {
        return new TeamSpeak(config.teamspeak.url, (error) => {
            res.status(500).json({ status: false, error: error });
        });
    }
}

export default new ApiAIController();
