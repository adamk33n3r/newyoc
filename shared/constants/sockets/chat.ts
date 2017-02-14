export namespace Chat {
    export type Connect = 'chat:connect';
    export type Disconnect = 'chat:disconnect';
    export type Message = 'chat:message';
    export const Connect: Connect = 'chat:connect';
    export const Disconnect: Disconnect = 'chat:disconnect';
    export const Message: Message = 'chat:message';
}

export type Chat = Chat.Connect | Chat.Disconnect | Chat.Message;

// function mkenum<T extends {[i: string]: U}, U extends string>(x: T): T {
//     return x;
//     // const o: any = {};
//     // for (const k in x) {
//     //     o[k] = k;
//     // }
//     // return o;
// }

// function mkenum3<X extends string>(...x: X[]): { [K in X]: K } {
//     const o: any = {};
//     for (const k in x) {
//         o[k] = k;
//     }
//     return o;
// }

// type enumType<T> = T[keyof T];
// type TT<T> = keyof T;
// export const Chat = mkenum({
//     Connect: 'chat:connect',
//     Message: 'chat:message',
// });
// export type Chat = (typeof Chat);
// export const Chat = mkenum3('chat:connect', 'chat:message');
// export type  Chat = TT<typeof Chat>;
// export type  Chat = enumType<typeof Chat>;
