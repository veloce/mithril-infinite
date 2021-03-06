const grid_spacing = 8;
const grid_spacing_px = grid_spacing + 'px';
const item_size = 210;
const item_size_px = item_size + 'px';
const image_padding = 10;
const image_padding_px = image_padding + 'px';

const styles = [{
    '.scroll-view.horizontal': {
        margin: 0,
        height: item_size + 20 + 'px', // add space for scrollbar
        background: '#fff',

        ' .scroll-content': {
            padding: 0,
            margin: 0,
            'font-size': 0,

            ' .content, .padding-before, .padding-after': {
                display: 'inline-block'
            },
            ' .content': {
                margin: 0,
                'font-size': 0,

                ' .page': {
                    display: 'inline-block',
                    height: item_size_px
                },

                ' .grid-item': {
                    display: 'inline-block',
                    height: item_size_px,
                    width: item_size_px,
                    'background-color': '#f0f0f0',
                    margin: '0 ' + (grid_spacing / 2) + 'px',

                    ' .image-holder': {
                        height: item_size - 2 * image_padding + 'px',
                        width: item_size - 2 * image_padding + 'px',
                        overflow: 'hidden',
                        position: 'relative',
                        margin: image_padding_px,

                        ' .image': {
                            position: 'absolute',
                            left: 'auto',
                            top: 0,
                            right: 'auto',
                            bottom: 0,
                            width: '100%',
                            'background-size': 'contain',
                            'background-repeat': 'no-repeat',
                            'background-position-x': '50%',
                            opacity: 0,
                            transition: 'opacity .7s'
                        }
                    }
                }
            }
        }
    }
}];
export default styles;
