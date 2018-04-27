import ReactDOM from 'react-dom'
import React, { Component } from 'react'
import classnames from 'classnames'
import './style.less'

const modalRoot = document.getElementById('modal-root')
const noop = () => {}

export default class Modal extends Component {
  constructor(props) {
    super(props)
    this.el = document.createElement('div')
  }

  componentDidMount() {
    modalRoot.appendChild(this.el)
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.el)
  }

  render() {
    return ReactDOM.createPortal(<ModalCont {...this.props} />, this.el)
  }
}

const TRANS_CLASS_CONF = {
  beforeEnter: {
    fade: 'fade-enter',
    slide: 'slide-enter',
  },
  onEntering: {
    fade: 'fade-enter fade-enter-active',
    slide: 'slide-enter slide-enter-active',
  },
  onExiting: {
    fade: 'fade-exit fade-exit-active',
    slide: 'slide-exit slide-exit-active',
  },
  exit: {
    fade: 'fade-exit',
    slide: 'slide-exit',
  },
}

const DELAY = 300
class ModalCont extends Component {
  static defaultProps = {
    visible: true,
    transparent: false,
    className: '',
    animationType: 'none',
    onShow: noop,
    onDismiss: noop,
    onRequestClose: noop, // just use in android app
    onOrientationChange: noop,
  }
  state = {
    transClassName: '',
  }
  componentDidMount() {
    const { props } = this
    if (props.animationType !== 'none') {
      this.transAnClassName(props.visible, props.animationType)
    }
  }
  componentWillReceiveProps = async (nextProps) => {
    const { props } = this
    if (props.visible !== nextProps.visible && nextProps.animationType !== 'none') {
      this.transAnClassName(nextProps.visible, nextProps.animationType)
    }
  }
  getTransGroup = (visible) => {
    let rst = []
    if (visible) {
      rst = ['beforeEnter', 'onEntering']
    } else {
      rst = ['onExiting', 'exit']
    }
    return rst
  }
  transAnClassName = async (visible, type) => {
    const transGroup = this.getTransGroup(visible)
    await this.setState({
      transClassName: TRANS_CLASS_CONF[transGroup[0]][type],
    })
    await setTimeout(() => {
      this.setState({
        transClassName: TRANS_CLASS_CONF[transGroup[1]][type],
      })
    }, DELAY)
  }
  render() {
    const {
      /* eslint-disable no-unused-vars */
      animationType,
      onShow,
      onDismiss,
      onRequestClose,
      onOrientationChange,
      className: pClassName,
      /* eslint-enable rule */
      visible,
      transparent,
      ...otherProps
    } = this.props
    const { state } = this
    const className = classnames({ 'system-modal-cont': true, hide: !visible, transparent })
    return <div className={classnames(className, pClassName, state.transClassName)} {...otherProps} />
  }
}
