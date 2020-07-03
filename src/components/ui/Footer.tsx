import * as React from "react"
import { bindActionCreators, Dispatch } from "redux"
import { connect } from "react-redux"
import cx from "classnames"

import { RootState } from "../../redux"
import { actions as UIActions } from "../../redux/ui"
import {
  //SocialIcon,
  NavigationItem,
  Logo,
  Footer as GFooter
} from "polyvolve-ui/lib"
import { componentStyle } from "../../lib/reexports"

interface Props {
  ownerName: string
  showExtendedUi?: boolean
  enableHide?: boolean
  uiActions: typeof UIActions
}

class Footer extends React.Component<Props> {
  static defaultProps: Partial<Props> = {
    enableHide: false,
    ownerName: "Polyvolve"
  }

  onMouseEnter = () => {
    this.props.uiActions.toggleUi()
  }

  onMouseLeave = () => {
    this.props.uiActions.toggleUi()
  }

  render(): JSX.Element {
    const { ownerName, showExtendedUi, enableHide } = this.props

    const footerContainerStyle = !enableHide || showExtendedUi ? {} : { opacity: 0 }
    const footerClasses = cx({ [componentStyle.footerActive]: !enableHide || showExtendedUi },
      componentStyle.footer)

    return (
      <GFooter>
        <div className={footerClasses} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} style={footerContainerStyle} >
          <div className={componentStyle.infoMenu}>
            <ul>
              <NavigationItem name="About" />
              <NavigationItem url="/contact" name="Contact" />
              <NavigationItem url="/privacy" name="Privacy Policy" />
              <NavigationItem url="/terms" name="Terms & Conditions" />
            </ul>
          </div>
          <div className={componentStyle.smBar}>
            <ul className="soc">
              {
                //<SocialIcon type="twitter" link="#" />
                //<SocialIcon type="github" link="#" />
              }
            </ul>
          </div>
        </div>
      </GFooter>
    )
  }
}

function mapStateToProps(state: RootState): Partial<Props> {
  return {
    showExtendedUi: state.ui.showExtendedUi
  }
}

function mapDispatchToProps(dispatch: Dispatch): Partial<Props> {
  return {
    uiActions: bindActionCreators(UIActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer)
