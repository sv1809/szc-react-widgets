import React, { PropTypes } from 'react';

const Pane = ({ label, children }) => (<div>
    {children}
</div>)

Pane.propTypes = {
    label: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]).isRequired
};

export default Pane;