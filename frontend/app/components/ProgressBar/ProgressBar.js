import React from 'react';
import cx from 'classnames';


export default class ProgressBar extends React.Component {
  static propTypes = {
    percent: React.PropTypes.number.isRequired,
    style: React.PropTypes.oneOf([
      'default',
      'success',
      'info',
      'warning',
      'danger',
    ]),
  }

  static defaultProps = {
    style: 'default',
  }

  render() {
    const percent = this.props.percent.toFixed(2);
    const styleClass = this.props.style == 'default' ? '' :
      'progress-bar-' + this.props.style;
    const styles = {
      // Always show some of the text.
      minWidth: '3.5em',

      // Bar width
      width: percent + '%',
    };

    return (
      <div key='progress' className='progress'>
        <div
          className={`progress-bar ${styleClass}`}
          role='progressbar'
          aria-valuenow={percent}
          aria-valuemin='0'
          aria-valuemax='100'
          style={styles}
        >
          <span>{percent + '%'}</span>
        </div>
      </div>
    );
  }
}
