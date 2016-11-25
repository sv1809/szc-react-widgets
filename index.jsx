import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Select from './src/select/select';

const selectItems = []

for (let i = 0; i < 30; i++) {
    selectItems.push({
        value: 'value' + i,
        label: 'label' + i
    })
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: selectItems[1] }
        this.onSelect = this.onSelect.bind(this);
    }

    onSelect(value) {
        this.setState({
            value
        })
    }

    render() {
        return (<Select value={this.state.value} items={selectItems} onSelect={this.onSelect} idField='value' textField='label' nullable={true} searchable={true} />);
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('app')
);