import { Request, Response } from 'express';
import * as firebase from 'firebase/app';
import 'firebase/firestore';

import { Controller, GET } from 'src/decorators/routing';
import { Required } from 'src/decorators/util';
import { IQuote } from './services/clink/types';
import { Clink } from 'src/services/clink';

@Controller('/quotes')
class QuotesController {
    @GET()
    @Required('teamId')
    public index(req: Request, res: Response) {
        let query: firebase.firestore.Query = firebase.firestore().collection(`teams/${req.query.teamId}/quotes`)
            .orderBy('timestamp', 'desc')
        ;

        if (req.query.user) {
            query = query.where('said_by', '==', req.query.user);
        }

        const clink = new Clink();

        query.get().then((quotes) => {
            clink.getAllUsers().then((users) => {
                if (users.ok) {
                    const members = users.members as any[];
                    res.json(quotes.docs.map((qSnap) => {
                        const data = qSnap.data() as IQuote;
                        const said_by_name = `@${members.find((member) => member.id === data.said_by).profile.display_name}`;
                        const quoted_by_name = `@${members.find((member) => member.id === data.quoted_by).profile.display_name}`;
                        const quote = data.quote.replace(/(?:<@(\w+)>)+/g, (_match, userId) => {
                            const userName = (users.members as any[]).find((member) => member.id === userId).profile.display_name;
                            return `@${userName}`;
                        });
                        return {
                            ...data,
                            id: qSnap.id,
                            quote,
                            said_by_name,
                            quoted_by_name,
                            timestamp: data.timestamp.toDate().getTime(),
                        };
                    }));
                } else {
                    res.status(500).json(users);
                }
            });
        });
    }
}
export default new QuotesController();
