const styles = [{
    '.scroll-view': {
        '-webkit-overflow-scrolling': 'touch',
        height: '100%',

        '.scroll-view-y': {
            'overflow-x': 'hidden',
            'overflow-y': 'auto',
            height: '100%',

            ' .scroll-content': {
                height: '100%'
            }
        },

        '.scroll-view-x': {
            'overflow-x': 'auto',
            'overflow-y': 'hidden',
            width: '100%',

            ' .scroll-content': {
                width: '100%'
            }
        }
    },
    '.scroll-content': {
        ' .content': {},
        ' .page': {},
        ' .item': {}
    }
}];

export default styles;
