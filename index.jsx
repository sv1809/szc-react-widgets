import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Select from './src/select/select';

const selectItems = [
    {
        value: 'test',
        label: 'test'
    },
    {
        value: 'test1',
        label: 'test1'
    },
    {
        value: 'test2',
        label: 'test2'
    }
]

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
        return (<Select value={this.state.value} items={selectItems} onSelect={this.onSelect} idField='value' textField='label' nullable={true}/>);
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('app')
);