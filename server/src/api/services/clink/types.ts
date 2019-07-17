interface ITextBase {
    type: string;
    text: string;
}
interface ITextPlain extends ITextBase {
    type: 'plain_text';
    emoji: boolean;
}
interface ITextMarkdown extends ITextBase {
    type: 'mrkdwn';
}
type IText = ITextPlain | ITextMarkdown;
interface IOption {
    text: IText;
    value: string;
}
interface ISlackInteractionBase {
    token: string;
    callback_id: string;
    type: string;
    trigger_id: string;
    response_url: string;
    team: {
        id: string,
        domain: string,
    };
    channel: {
        id: string,
        name: string,
    };
    user: {
        id: string,
        name: string,
    };
    message: {
        type: string;
        user: string;
        ts: string,
        text: string
    };
}
export interface ISlackInteractionDialog<T = any> extends ISlackInteractionBase {
    type: 'dialog_submission';
    state: string;
    submission: T;
}
export interface ISlackInteractionAction extends ISlackInteractionBase {
    type: 'message_action';
}
export interface ISlackInteractionButton extends ISlackInteractionBase {
    type: 'interactive_message';
    actions: any[];
}
interface ISlackInteractionBlockAction {
    action_id: string;
    block_id: string;
    value?: string;
    selected_user?: string;
    type: string;
}
interface ISlackInteractionBlockActionButton extends ISlackInteractionBlockAction {
    type: 'button';
    value: string;
}
interface ISlackInteractionBlockActionOverflow extends ISlackInteractionBlockAction {
    type: 'overflow';
    selected_option: IOption;
}
interface ISlackInteractionBlockActionUserSelect extends ISlackInteractionBlockAction {
    type: 'users_select';
    selected_user: string;
}
export interface ISlackInteractionBlockActions extends ISlackInteractionBase {
    type: 'block_actions';
    container: { type: string };
    actions: Array<ISlackInteractionBlockActionButton | ISlackInteractionBlockActionOverflow | ISlackInteractionBlockActionUserSelect>;
}

export type ISlackInteraction = ISlackInteractionAction |
    ISlackInteractionButton | ISlackInteractionDialog  | ISlackInteractionBlockActions;

export interface IProbabilityObject {
    value: string;
    probability: number | '*';
}

export interface IQuote {
    id: string;
    quote: string;
    quoted_by: string;
    said_by: string;
    timestamp: firebase.firestore.Timestamp;
}
