import { Input } from 'antd';
import classes from './Header.module.css';

export default function Header() {
  return (
        <header className='header'>
            <Input
                placeholder='Search'
                className={classes.input}
            />
        </header>
  );
}
