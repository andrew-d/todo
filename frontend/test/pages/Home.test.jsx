import Home from '../../app/pages/Home';
import React from 'react';
import TestUtils from 'react/lib/ReactTestUtils';
import expect from 'expect';
import stubRouterContext from '../utils/stubRouterContext';


describe('home', function () {
  it('renders without problems', function () {
    const Subject = stubRouterContext(Home);
    const home = TestUtils.renderIntoDocument(<Subject />);

    expect(home).toExist();
  });
});
