import React from 'react';
import PropTypes from 'prop-types';

import { TabService, WindowService } from 'services';
import { TabActions, WindowActions } from 'actions';

function buttonText(count) {
  if (count > 2) {
    return `Sleep ${count} Selected Tabs`;
  } else {
    return "Sleep this window";
  }
}

class SleepWindowButton extends React.Component {
  static propTypes = {
    selectedCount: PropTypes.number.isRequired
  }

  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick(evt) {
    if (this.props.selectedCount >= 2) {
      WindowService.getCurrentWindow().
        then(win => TabService.getSelectedTabs(win.id)).
        then(TabActions.sleepTabs);
    } else {
      WindowService.getCurrentWindow().then(win => WindowActions.sleepWindow(win.id));
    }
  }

  render() {
    return <button className='sleep-window-button' onClick={this.onClick}>
      <span>
        {buttonText(this.props.selectedCount)}
      </span>
    </button>;
  }
}

export default SleepWindowButton;
