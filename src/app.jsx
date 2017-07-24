import React from 'react';
import Field from './react/field.jsx'
import ActionCard from './react/actioncard.jsx'
import ActionList from './react/actionlist.jsx'
import styles from './app.css.js';
import AutonAction from './main/AutonAction.jsx'
import AutonActionWrapper from './main/AutonActionWrapper.jsx'
import DriveAutonAction from './main/actions/DriveAutonAction.jsx'

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.actionTypes = {
      drive: DriveAutonAction
    }

    this.addAction = this.addAction.bind(this);
    this.createAction = this.createAction.bind(this);
    this.createActionAtEnd = this.createActionAtEnd.bind(this);
    this.setSelected = this.setSelected.bind(this);
    this.createActionBeforeSelected = this.createActionBeforeSelected.bind(this);

    let actions = [];
    let i = 0;
    for (; i < 1; i++) {
      actions.push(this.createAction(i));
    }

    this.state = {
      actions: actions,
      selected: -1
    };
  }

  setSelected(selectedIndex) {
    let actions = this.state.actions
    if (this.state.selected != -1) {
      actions[this.state.selected].meta.selected = false;
    }
    if (selectedIndex == this.state.selected) { // Toggle selection, set false
      actions[selectedIndex].meta.selected = false;
      this.setState(Object.assign(this.state, {selected: -1}));
    } else { // New selection, set true
      actions[selectedIndex].meta.selected = true;
      this.setState(Object.assign(this.state, {selected: selectedIndex}));
    }
  }

  createAction() {
    let action = new AutonActionWrapper(this.setSelected);
    action.setAutonAction(new DriveAutonAction());
    return action;
  }

  // NOTE: Inserting at index other than 0 or null may not work as expected
  addAction(action, index) {
    let actions = this.state.actions;
    if (index) {
      if (index == 0) {
        actions.unshift(action);
      } else {
        actions.splice(index, 0, action);
      }
    } else {
      actions.push(action);
    }

    this.setState(Object.assign(this.state, {actions: actions}));
  }

  createActionAtEnd() {
    this.addAction(this.createAction());
    this.setSelected(this.state.actions.length - 1);
    // TODO Scroll to the selected
  }

  createActionBeforeSelected() {
    if (this.state.selected != -1) {
      this.state.actions[this.state.selected].meta.selected = false; // Unselect old
      // Add new
      this.addAction(this.createAction(), this.state.selected)
      let temp = this.state.selected;
      this.state.selected = -1;
      this.setSelected(temp);
    } else {
      this.addAction(this.createAction(), 0);
      // Select the new item
      this.setSelected(0);
    }

  }

  render() {

    let actionGUI = <div/>;
    if (this.state.selected != -1) {
      actionGUI = this.state.actions[this.state.selected].getGUI();
    }

    return (
      <div>
        <div style={styles.field}>
          <Field img="./assets/itz_field.jpg" elements={this.state.actions}/>
        </div>

        <div style={styles.panel}>

          <div style={styles.panel_upper}>
            {actionGUI}
          </div>

          <div style={styles.panel_lower_left}>
            <ActionList elements={this.state.actions}/>
            <div style={{
              borderStyle: 'solid',
              borderWidth: '1px',
              borderColor: 'lightgray',
              height: '30px',
              width: '248px'
            }}>
              <button type="button" style={Object.assign(styles.buttonStyle, {
                cssFloat: 'left',
                borderWidth: '1px',
                borderRightStyle: 'solid',
                borderColor: 'lightgray'
              })} onClick={this.createActionAtEnd}>Add to end</button>
              <button type="button" style={Object.assign(styles.buttonStyle, {
                overflow: 'hidden',
                borderStyle: 'none'
              })} onClick={this.createActionBeforeSelected}>Add before</button>
            </div>
          </div>

          <div style={styles.panel_lower_right}>
          <p>Lower right</p>
          </div>
        </div>
      </div>
    );
  }
}
