export default {
    playlist: [
        {
            image: '/assets/images/yoc.png',
            title: 'Default',
            description: 'Stream stuff, mane',
            file: 'rtmp://eon.adam-keenan.net/live/default',
        },
        {
            title: 'TEST',
            description: 'Nothing to see here',
            file: 'rtmp://eon.adam-keenan.net/live/test',
        },
        {
            title: 'Movienight',
            description: 'We watch movies together',
            file: 'rtmp://eon.adam-keenan.net/live/movienight',
        },
        {
            title: 'Mike',
            description: 'Mike plays gams',
            file: 'rtmp://eon.adam-keenan.net/live/mike',
        },
    ],
    width: '100%',
    aspectratio: '16:9',
    hlshtml: true,
    primary: 'flash',
    autostart: window.location.hostname === 'yoc.adam-keenan.com' && false,
    skin: {
        name: 'glow',
    },
    logo: {
        file: '/assets/images/yoc-100px-50a.png',
        hide: true,
    },
};
