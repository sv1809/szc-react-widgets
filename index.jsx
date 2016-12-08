import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Widgets from './index.js';

const Select = Widgets.Select;
const Tabs = Widgets.Tabs;
const Pane = Widgets.Pane;
const Group = Widgets.Group;

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

    groupInner = () => {
        const res = [];
        for (let i = 0; i < 50; i++) {
            res.push(<div key={i}>{'groupInner ' + i}</div>)
        }
        return res;
    }

    render() {
        return (<Tabs>
            <Pane label='Tab1'>
                <span>Tab 1 content</span>
                <Group caption="Test group" expanded={true}>
                    {this.groupInner()}
                </Group>
            </Pane>
            <Pane label='Tab2'>
                <span>Tab 2 content</span>
                <Select value={this.state.value} items={selectItems} onSelect={this.onSelect} idField='value' textField='label' nullable={true} searchable={true} />
            </Pane>
        </Tabs>);
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('app')
);