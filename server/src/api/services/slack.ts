import { Request, Response, Router } from 'express';

import { Controller, GET, POST } from 'src/decorators/routing';

@Controller('/slack')
class SlackController {
    @GET('/')
    public index(req: Request, res: Response) {
        res.send({omg: 'yes'});
    }

    @GET()
    public clients(req: Request, res: Response) {
        res.send(['adam', 'josh']);
    }

    @POST()
    public kick(req: Request, res: Response) {
        res.send('k');
    }
}

export default new SlackController();
