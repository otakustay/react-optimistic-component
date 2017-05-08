import 'babel-polyfill';
import App from './App';
import {render} from 'react-dom';

render(<App />, document.body.appendChild(document.createElement('div')));
