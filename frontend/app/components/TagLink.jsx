/**
 * Note: This module was taken from react-router as of commit:
 *
 *    6264a91e6f037c3798553cd04ce9c0118f07c9ff
 *
 * The original license for this file can be found at:
 *
 *     https://github.com/rackt/react-router/blob/master/LICENSE
 *
 * This component was modified to:
 *  - Add support for `tagName`
 *  - Rename the component
 *  - Only pass on the `href` prop when the tag is an <a> tag.
 */

/*eslint-disable */
import React from 'react';

var { object, string, func } = React.PropTypes;

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

/**
 * <Link> components are used to create an <a> element that links to a route.
 * When that route is active, the link gets an "active" class name (or the
 * value of its `activeClassName` prop).
 *
 * For example, assuming you have the following route:
 *
 *   <Route name="showPost" path="/posts/:postID" handler={Post}/>
 *
 * You could use the following component to link to that route:
 *
 *   <Link to={`/posts/${post.id}`} />
 *
 * Links may pass along query string parameters
 * using the `query` prop.
 *
 *   <Link to="/posts/123" query={{ show:true }}/>
 */
export var TagLink = React.createClass({

  contextTypes: {
    router: object
  },

  propTypes: {
    activeStyle: object,
    activeClassName: string,
    to: string.isRequired,
    query: object,
    state: object,
    onClick: func,
    tagName: string,
  },

  getDefaultProps() {
    return {
      className: '',
      activeClassName: 'active',
      style: {},
      tagName: 'a',
    };
  },

  handleClick(event) {
    var allowTransition = true;
    var clickResult;

    if (this.props.onClick)
      clickResult = this.props.onClick(event);

    if (isModifiedEvent(event) || !isLeftClickEvent(event))
      return;

    if (clickResult === false || event.defaultPrevented === true)
      allowTransition = false;

    event.preventDefault();

    if (allowTransition)
      this.context.router.transitionTo(this.props.to, this.props.query, this.props.state);
  },

  render() {
    var { router } = this.context;
    var { to, query } = this.props;

    var props = Object.assign({}, this.props, {
      onClick: this.handleClick,
    });

    // override the 'cursor' style if it's not set
    if (!props.style.cursor)
      props.style.cursor = 'pointer';

    // only pass the 'href' prop if it's an <a> tag
    if (this.props.tagName === 'a')
      props.href = router.makeHref(to, query);

    // ignore if rendered outside of the context of a router, simplifies unit testing
    if (router && router.isActive(to, query)) {
      if (props.activeClassName)
        props.className += props.className !== '' ? ` ${props.activeClassName}` : props.activeClassName;

      if (props.activeStyle)
        props.style = Object.assign({}, props.style, props.activeStyle);
    }

    return React.createElement(this.props.tagName, props);
  }

});

export default TagLink;
