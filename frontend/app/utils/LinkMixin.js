/*eslint-disable */
import React from 'react';

function isLeftClickEvent(event) {
  return event.button === 0;
}

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

export default {
  propTypes: {
    active: React.PropTypes.bool,
    activeClassName: React.PropTypes.string.isRequired,
    onlyActiveOnIndex: React.PropTypes.bool.isRequired,
    disabled: React.PropTypes.bool,
    to: React.PropTypes.string.isRequired,
    params: React.PropTypes.object,
    query: React.PropTypes.object,
    onClick: React.PropTypes.func
  },
  contextTypes: {
    history: () => React.PropTypes.object.isRequired
  },

  getDefaultProps() {
    return {
      activeClassName: 'active',
      onlyActiveOnIndex: false,
    };
  },

  getInitialState() {
    var active = this.getActiveState();
    return { active };
  },

  trySubscribe() {
    var { history } = this.context;
    if (!history) return;
    this._unlisten = history.listen(this.handleHistoryChange);
  },

  tryUnsubscribe() {
    if (!this._unlisten) return;
    this._unlisten();
    this._unlisten = undefined;
  },

  handleHistoryChange() {
    var { active } = this.state;
    var nextActive = this.getActiveState();
    if (active !== nextActive) {
      this.setState({ active: nextActive });
    }
  },

  getActiveState() {
    var { history } = this.context;
    var { to, query, onlyActiveOnIndex } = this.props;
    if (!history) return false;
    return history.isActive(to, query, onlyActiveOnIndex);
  },

  componentDidMount() {
    this.trySubscribe();
  },

  componentWillUnmount() {
    this.tryUnsubscribe();
  },

  /**
   * Returns props except those used by this Mixin
   * Gets "active" from router if needed.
   * Gets the value of the "href" attribute to use on the DOM element.
   * Sets "onClick" to "handleRouteTo".
   */
  getLinkProps() {
    var { to, query } = this.props;

    var props = {
      ...this.props,
      onClick: this.handleClick
    };

    var { history } = this.context;
    var { active } = this.state;

    // Ignore if rendered outside the context
    // of history, simplifies unit testing.
    if (history) {
      props.href = history.createHref(to, query);

      if (active) {
        if (props.activeClassName)
          props.className += props.className !== '' ? ` ${props.activeClassName}` : props.activeClassName;

        if (props.activeStyle)
          props.style = { ...props.style, ...props.activeStyle };
      }
    }

    return props;
  },

  handleRouteTo(event) {
    let allowTransition = true;
    let clickResult;

    if (this.props.disabled) {
      event.preventDefault();
      return;
    }

    if (this.props.onClick) {
      clickResult = this.props.onClick(event);
    }

    if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
      return;
    }

    if (clickResult === false || event.defaultPrevented === true) {
      allowTransition = false;
    }

    event.preventDefault();

    if (allowTransition) {
      this.context.history.pushState(this.props.state, this.props.to, this.props.query);
    }
  }
};
