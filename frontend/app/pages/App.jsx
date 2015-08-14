import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import NavItemLink from '../utils/NavItemLink';


export default class App extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
  }

  render() {
    return (
      <div className='page-wrapper'>
        <Navbar fluid={true} staticTop={true} brand='ToDo'>
          <Nav>
            <NavItemLink to='/home'>
              Home
            </NavItemLink>
            <NavItemLink to='/about'>
              About
            </NavItemLink>
          </Nav>
        </Navbar>

        <div className='container-fluid'>
          {this.props.children}
        </div>
      </div>
    );
  }
}
