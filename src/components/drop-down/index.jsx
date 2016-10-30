import React, { Component } from 'react';
import classNames from 'classnames';

class DropDown extends Component {

  static propTypes = {
    label: React.PropTypes.string,
    style: React.PropTypes.obj,
    className: React.PropTypes.string,
    onClick: React.PropTypes.func,
    children: React.PropTypes.element,
  }

  constructor(props) {
    super(props);

    this.state = {
      active: false,
      label: null,
    };

    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.openList = this.openList.bind(this);
    this.select = this.select.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside, true);
  }

  handleClickOutside(e) {
    if (!this.node.contains(e.target)) {
      this.setState(state => Object.assign(state, { active: false }));
    }
  }

  openList(e) {
    if (e.target.classList.contains('drop-down_head')) {
      this.setState(state => Object.assign(state, { active: !this.state.active }));
    }
  }

  select(val) {
    this.setState(state => Object.assign(state, { label: val, active: false }));
  }

  render() {
    const { label, style, onClick, children, className } = this.props;

    return (
      <button
        className={classNames('drop-down', { active: this.state.active }, className)} label={label}
        style={style}
        onClick={onClick || this.openList}
        ref={(node) => { this.node = node; return node; }}
      >
        <span className="drop-down_head">
          <span className="label">{this.state.label || label}</span>
          <svg className="icon">
            <use xlinkHref={'#icon-list'} />
          </svg>
        </span>
        <div className="list">
          {
            React.Children.map(
              children, child => React.cloneElement(child,
                { onClick: () => this.select(child.props.children) }
              )
            )
          }
        </div>
      </button>
    );
  }
}

export default DropDown;
