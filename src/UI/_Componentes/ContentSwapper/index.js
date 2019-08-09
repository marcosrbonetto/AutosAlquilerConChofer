import React from "react";
import ReactCSSTransitionReplace from "react-css-transition-replace";

class ContentSwapper extends React.PureComponent {
  render() {
    const content = React.Children.toArray(this.props.children);
    let index;
    for (let i = 0; i < content.length; i++) {
      if (content[i].props.visible === "true") {
        index = i;
      }
    }

    return (
      <ReactCSSTransitionReplace {...this.props}>
        {content[index]}
      </ReactCSSTransitionReplace>
    );
  }
}

export default ContentSwapper;
