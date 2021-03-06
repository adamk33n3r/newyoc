import { Request, Response } from 'express';

import { Controller, GET, POST } from 'src/decorators/routing';
import { TeamSpeak } from 'src/services/teamspeak';
import config from 'src/config';

@Controller('/teamspeak')
class TeamSpeakController {
    @GET('/')
    public async index(req: Request, res: Response) {
        if (!config.teamspeak.username || !config.teamspeak.password) {
            return res.status(500).send('No username or password');
        }
        const ts = this.initTeamSpeak(res);
        try {
            await ts.login(config.teamspeak.username, config.teamspeak.password);
            const [ online, channels] = await Promise.all([
                ts.getOnlineClients(),
                ts.getChannels(),
            ]);
            res.set({
                'Page-Size': 20,
                'Access-Control-Expose-Headers': 'Page-Size',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
            })
            res.json({
                success: true,
                data: {
                    online,
                    channels,
                },
            });
            ts.close();
        } catch (error) {
            console.error(error);
            res.status(500).send(error);
        }
    }

    private initTeamSpeak(res: Response): TeamSpeak {
        return new TeamSpeak(config.teamspeak.url, (error) => {
            res.status(500).json({ status: false, error: error });
        });
    }
}

export default new TeamSpeakController();
