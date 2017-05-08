/**
 * redux-optimistic-thunk
 *
 * @file react example
 * @author otakustay
 */

import OptimistiComponent from './OptimisticComponent';
import uid from './uid';
import delay from './delay';

let deleteLabelStyle = {
    'float': 'right',
    'cursor': 'pointer',
    'color': '#0076ff'
};

let pendingLabelStyle = {
    'float': 'right',
    'cursor': 'default',
    'color': '#b3b3b3'
};

let ItemLabel = ({id, deleted, pending, onDelete}) => {
    if (deleted) {
        return null;
    }
    if (pending) {
        return <span style={pendingLabelStyle}>pending...</span>;
    }
    return <span style={deleteLabelStyle} onClick={() => onDelete(id)}>delete</span>;
};

let TodoItem = props => {
    let {id, deleted, text} = props;

    return (
        <li key={id} style={{padding: '4px 6px', borderBottom: '1px solid #ccc'}}>
            <span style={{textDecoration: deleted ? 'line-through' : 'none'}}>{text}</span>
            <ItemLabel {...props} />
        </li>
    );
};

let DelayRadio = ({value, delay, onCheck}) => {
    let onChange = e => {
        if (e.target.checked) {
            onCheck(value);
        }
    };

    return (
        <label style={{marginRight: '12px'}}>
            <input type="radio" name="delay" onChange={onChange} checked={delay === value} />
            {value}s
        </label>
    );
};

let newItem = item => state => {
    let newItems = [item].concat(state.items);
    return {items: newItems};
};

let changeDelay = delay => () => ({delay});

let changeNewItemText = newItemText => () => ({newItemText});

let deleteItem = id => state => {
    let newItems = state.items.map(item => (item.id === id ? {...item, deleted: true} : item));
    return {items: newItems};
};

export default class App extends OptimistiComponent {

    state = {
        delay: 10,
        items: [
            {id: uid(), text: 'Buy a milk', pending: false, deleted: false},
            {id: uid(), text: 'Talk with Berry', pending: false, deleted: false},
            {id: uid(), text: 'Fitness - Run 10km', pending: false, deleted: false},
            {id: uid(), text: 'Read "Node.js for Embedded Systems"', pending: false, deleted: false},
            {id: uid(), text: 'Book next week\'s flight ticket', pending: false, deleted: false}
        ],
        newItemText: ''
    };

    setDelay(value) {
        this.setState(changeDelay(value));
    }

    updateNewItemText({target}) {
        this.setState(changeNewItemText(target.value));
    }

    async submitNewItem() {
        let transactionId = {};
        let text = this.state.newItemText;
        this.setState(changeNewItemText(''));
        let optimisticItem = {
            id: uid(),
            text: text,
            pending: true,
            deleted: false
        };
        this.setState(newItem(optimisticItem), null, transactionId);

        await delay(this.state.delay);

        this.rollbackOptimistic(transactionId);
        let actualNewItem = {
            id: uid(),
            text: text,
            pending: false,
            deleted: false
        };
        this.setState(newItem(actualNewItem));
    }

    deleteItem(id) {
        this.setState(deleteItem(id));
    }

    render() {
        let {newItemText, delay, items} = this.state;
        let inputStyle = {
            boxSizing: 'border-box',
            width: '100%',
            height: '36px',
            lineHeight: '36px',
            padding: '0 10px',
            outline: 'none'
        };
        let buttonStyle = {
            position: 'absolute',
            right: '0',
            top: '1px',
            bottom: '1px',
            cursor: 'pointer',
            border: 'none',
            padding: '0 12px',
            backgroundColor: '#0076ff',
            color: '#fff',
            fontSize: '16px'
        };
        return (
            <div style={{width: '720px', margin: '0 auto'}}>
                <div>
                    <span style={{display: 'inline-block', marginRight: '20px'}}>更换延迟：</span>
                    <DelayRadio value={1} delay={delay} onCheck={::this.setDelay} />
                    <DelayRadio value={2} delay={delay} onCheck={::this.setDelay} />
                    <DelayRadio value={5} delay={delay} onCheck={::this.setDelay} />
                    <DelayRadio value={10} delay={delay} onCheck={::this.setDelay} />
                </div>
                <div style={{position: 'relative', margin: '20px 0'}}>
                    <input
                        type="text"
                        style={inputStyle}
                        value={newItemText}
                        placeholder="输入文字"
                        onChange={::this.updateNewItemText}
                    />
                    <button type="button" style={buttonStyle} onClick={::this.submitNewItem}>添加项目</button>
                </div>
                <ul style={{listStyle: 'none', margin: '0', padding: '0'}}>
                    {items.map(item => ({...item, onDelete: ::this.deleteItem})).map(TodoItem)}
                </ul>
                <div style={{marginTop: '40px', color: '#4d4d4d'}}>
                    <p>按以下步骤复现积极UI效果：</p>
                    <ol>
                        <li>保持延迟时间为10s，添加一个项目，新的项目会出现在列表顶部并有pending标识。</li>
                        <li>迅速切换延迟为5s，添加另一荐。</li>
                        <li>迅速地删除几个已经存在的项目，被删除的项目会有删除线效果。</li>
                        <li>等待所有的项目创建完成，注意新建的项目的顺序。</li>
                    </ol>
                    <p>因5s延迟的项目会比10s延迟的更先完成，所以最终的列表顺序与你创建时积极UI响应的顺序相反。</p>
                </div>
            </div>
        );
    }
}
