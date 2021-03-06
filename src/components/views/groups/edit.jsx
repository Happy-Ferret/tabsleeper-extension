import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { TabGroup } from 'models';
import { Back } from 'icons';

class Edit extends React.Component {
  static propTypes = {
    uuid: PropTypes.string.isRequired,
    router: PropTypes.object.isRequired,
  }

  state = {
    groupName: "",
    group: null,
  }

  constructor(props) {
    super(props);

    this.onGroupNameChanged = this.onGroupNameChanged.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    this.loadGroup(this.props.uuid);
  }

  /**
   * Listen for changes to the UUID that has been supplied, loading a new
   * record if necessary
   */
  componentWillReceiveProps(newProps) {
    if (newProps.uuid !== this.props.uuid) {
      // Clear the old group
      this.setState({ group: null, groupName: "" });

      // Load the new one
      this.loadGroup(newProps.uuid);
    }
  }

  /**
   * Read the record from the DB
   */
  loadGroup(uuid) {
    TabGroup.read(uuid).then(group => {
      this.setState({ group, groupName: (group.name || "") });
      const domNode = ReactDOM.findDOMNode(this.refs.txtName);
      if (domNode) domNode.focus();
    })
    .catch(error => {
      if (error) console.error("An error occurred ", error);
    });
  }

  /**
   * Input handler for the name field
   */
  onGroupNameChanged(evt) {
    this.setState({ groupName: evt.target.value });

    const group = this.state.group;
    group.name = evt.target.value;
    group.save();
  }

  /**
   * Handler for when the form is submitted
   *
   * This should not make any writes - things are saved as they're edited
   */
  onSubmit(evt) {
    evt.preventDefault();
    window.location.hash = `#${this.props.router.generate('groups')}`;
  }

  render() {
    if (this.state.group) {
      return <div className='popup edit-group'>
        <div className='back-action'>
          <a href={`#${this.props.router.generate('groups')}`}>
            <Back color='#484848' width='24px' height='24px' />
            <span className='back-action--text'>Back</span>
          </a>
        </div>

        <form onSubmit={this.onSubmit}>
          <div className='edit-group--input-group'>
            <label htmlFor='name'>Name</label><br />
            <input
              type='text'
              id='name'
              name='name'
              ref='txtName'
              value={this.state.groupName}
              onChange={this.onGroupNameChanged}
              placeholder="Untitled" />
          </div>
        </form>
      </div>;
    } else {
      return <div className='popup'>
        <div>
          <Back color='#484848' width='24px' height='24px' />
        </div>
        <p>
          There was a problem trying to edit the group
        </p>
        <p>
          <a href={`#${this.props.router.generate('groups')}`}>Go back</a>
        </p>
      </div>;
    }
  }
};

export default Edit;
