import * as React from "react"
import { bindActionCreators, Dispatch } from "redux"
import { connect } from "react-redux"
import Link from "next/link"
import { RootState } from "../../redux"
import { actions as UIActions } from "../../redux/ui"

import {
  NavigationItem,
  DropdownMenu,
  DropdownMenuItem,
  Logo,
  LogoText
} from "polyvolve-ui/lib"
//import AuthActions from "../store/auth"

import * as homeIcon from "../../assets/icons/home.svg"
import * as settingsIcon from "../../assets/icons/settings.svg"
import * as refreshIcon from "../../assets/icons/refresh.svg"
import { navStyle } from "../../lib/reexports"

interface Props {
  authenticated?: boolean
  //authActions?: typeof AuthActions
  name?: string
  surname?: string
  id?: string
  showExtendedUi?: boolean
  uiActions: typeof UIActions
}

class Navigation extends React.Component<Props, {}> {
  refresh() { }

  onMouseEnter = () => {
    this.props.uiActions.toggleUi()
  }

  onMouseLeave = () => {
    this.props.uiActions.toggleUi()
  }

  render(): JSX.Element {
    const { name, surname, id, showExtendedUi } = this.props

    const navContainerStyle = showExtendedUi ? {} : { opacity: 0 }

    return (
      <nav className={navStyle.navContainer} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} style={navContainerStyle}>
        <div className={navStyle.branding}>
          <Link href="/">
            <a>
              <span className={navStyle.logoContainer}>
                <Logo size={24} />
                <LogoText text="Polyvolve" size={24} />
              </span>
            </a>
          </Link>
        </div>
        <div className={navStyle.right}>
          <ul className={navStyle.rightNav}>
            <NavigationItem icon={refreshIcon}
              className={navStyle.refreshIcon}
              onClick={this.refresh} />
            <NavigationItem url="/settings" icon={settingsIcon} />
            {id &&
              <DropdownMenu link={`/u/${id}`} name={name[0] + ". " + surname} className={navStyle.profileLink}>
                {
                  //<DropdownMenuItem name="Log out" onClick={() => this.props.authActions!!.logout({})} />
                }
                <DropdownMenuItem name="Ref" link={`/ref`} />
              </DropdownMenu>}
          </ul>
        </div>
        <div className={navStyle.nav}>
          <div className={navStyle.centerNav}>
            <ul>
              <NavigationItem icon={homeIcon} url="/" index={true} />
              <NavigationItem name="Users" url="/users" />
            </ul>
          </div>
        </div>
      </nav>
    )
  }
}


function mapStateToProps(state: RootState): Partial<Props> {
  const props: Partial<Props> = {
    authenticated: true,
    showExtendedUi: state.ui.showExtendedUi
  }

  if (state.dataOverview.user) {
    props.name = state.dataOverview.user.name
    props.surname = state.dataOverview.user.surname
    props.id = state.dataOverview.user.id
  }

  return props
}

function mapDispatchToProps(dispatch: Dispatch): Partial<Props> {
  return {
    uiActions: bindActionCreators(UIActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Navigation)
