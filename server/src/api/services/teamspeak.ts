import { Request, Response, Router } from 'express';

import { Controller, GET, POST } from 'src/decorators/routing';
import { TeamSpeak } from 'src/services/teamspeak';
import config from 'src/config';

@Controller('/teamspeak')
class TeamSpeakController {
    private teamspeak: TeamSpeak;

    @GET('/')
    public index(req: Request, res: Response) {
        const ts = this.initTeamSpeak(res);
        ts.login(config.teamspeak.username, config.teamspeak.password)
        .then(() => {
            Promise.all([
                ts.getOnlineClients(),
                ts.getChannels(),
            ]).then((results) => {
                const [ online, channels ] = results;
                res.json({
                    success: true,
                    data: {
                        online,
                        channels,
                    },
                });
                ts.close();
            }).catch((error) => {
                console.error(error);
                res.status(500).send(error);
            });
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

export default new TeamSpeakController();
