import * as React from 'react';
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color'

const ColorPicker = ({handleChangeColor, value}) => {
    const [color, setColor] = React.useState(value);

    const [displayColorPicker, setDisplayColorPicker] = React.useState(false);

    React.useEffect(() => {
        if(!value) {
            setColor({r: 255, g: 255, b: 255, a: 1})
        } else {
            setColor(value);
        }
    }, [value]);

    const styles = reactCSS({
        'default': {
          color: {
            width: '20rem',
            height: '2rem',
            borderRadius: '2px',
            background: `${ color }`,
          },
          swatch: {
            padding: '5px',
            background: '#fff',
            borderRadius: '1px',
            boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
            display: 'inline-block',
            cursor: 'pointer',
          },
          popover: {
            position: 'absolute',
            zIndex: '2',
          },
          cover: {
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
          },
        },
      });

      const handleClick = () => {
        setDisplayColorPicker(!displayColorPicker)
      };
    
      const handleClose = () => {
        setDisplayColorPicker(false)
      };
    
      const handleChange = (color) => {
        setColor(color.hex)
        handleChangeColor(color.hex)
      };

    function handleTabChange(event, value) {
        setTabValue(value);
    }

    return (
        <div>
        <div style={ styles.swatch } onClick={ handleClick }>
          <div style={ styles.color } />
        </div>
        { displayColorPicker ? <div style={ styles.popover }>
          <div style={ styles.cover } onClick={ handleClose }/>
          <SketchPicker color={ color } onChange={ handleChange } />
        </div> : null }
        </div>
    );
}

export default ColorPicker;