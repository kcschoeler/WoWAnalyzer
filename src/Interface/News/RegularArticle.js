import React from 'react';
import PropTypes from 'prop-types';
import Contributor from 'Interface/Contributor/Button';

class RegularArticle extends React.PureComponent {
  static propTypes = {
    title: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    bodyStyle: PropTypes.object,
    publishedAt: PropTypes.string.isRequired,
    publishedBy: PropTypes.shape({
      nickname: PropTypes.string.isRequired,
    }).isRequired,
  };

  render() {
    const { title, children, bodyStyle, publishedAt, publishedBy } = this.props;

    return (
      <article>
        <div className="panel">
          <div className="panel-heading">
            <h2>{title}</h2>
          </div>
          <div className="panel-body" style={bodyStyle}>
            {children}

            <div style={{ marginTop: '1em' }}>
              Published at {publishedAt} by <Contributor {...publishedBy} />.
            </div>
          </div>
        </div>
      </article>
    );
  }
}

export default RegularArticle;
