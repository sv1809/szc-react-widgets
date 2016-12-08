import React, { PropTypes } from 'react';

const Pane = ({ label, children }) => (<div>
    {children}
</div>)

Pane.propTypes = {
    label: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired
};

export default Pane;