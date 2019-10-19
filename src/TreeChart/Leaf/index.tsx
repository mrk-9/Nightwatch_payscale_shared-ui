import * as React from 'react';
import { TreeChartData } from '../TreeChart';
import numeral from 'numeral';

export interface LeafProps {
  leaf: TreeChartData; // The leaf data that this represents
  percentage: number; // The list of percentages for this level of leaves
  setRoot: (leaf: TreeChartData) => void; // The function to set the root if you click on a leaf
  secondActiveLeaf?: TreeChartData; // Active leaf that was clicked
  detailToShow: 'link' | 'comp'; // Which detail to show
  renderLines: (leaves: TreeChartData[]) => JSX.Element[]; // Curly lines.
      // Width that is proportional to the profile count
}

class Leaf extends React.PureComponent<LeafProps, {}> {
  getName = (name: string) => {
    return name.length > 40 ? `${name.substring(0, 40)}...` : name;
  }

  handleSetRoot = (leaf: TreeChartData) => {
    const { setRoot } = this.props;

    // only handle the click and pass it to parent if the clicked leaf has leaves in it
    return () => {
      if (leaf.leaves) {
        return setRoot(leaf);
      }
    };
  }

  getBorderClass = (percentage: number): string => {
    return percentage > 0.2
      ? 'tree-chart__leaf--lg' : percentage > 0.08
      ? 'tree-chart__leaf--md' : 'tree-chart__leaf--sm';
  }

  renderLeaves = (leaves: TreeChartData[]): JSX.Element[] => {
    return leaves.slice(0, 3).map((leaf, id) => (
      <div
        key={id}
        className={`tree-chart__leaf ${this.getBorderClass(leaf.percentage)}
                  ${leaf.leaves && leaf.leaves.length > 0
                  ? 'tree-chart__leaf--link'
                  : ''}
                  `}
      >
        {this.getName(leaf.name)}
        {this.renderDetail(leaf, this.props.detailToShow)}
      </div>
    ));
  }

  renderDetail = (leaf: TreeChartData, detailString: string) => {
    switch (detailString) {
      case 'link':
        return leaf.url && (
          <div className="tree-chart__salaries">
            <a
              href={leaf.url}
              // tslint:disable-next-line jsx-no-lambda
              onClick={(e) => e.stopPropagation()}
              target="_blank"
              rel="noopener"
            >
              View salaries &raquo;
            </a>
          </div>
        );
      case 'comp':
        return leaf.value && (
          <div className="tree-chart__salaries">
            <span className="tree-chart__comp">
              {numeral(leaf.value).format('$0,0')}
            </span>
          </div>
        );
      default:
        return '';
    }
  }
  render(): JSX.Element {
    const { leaf, percentage, renderLines, detailToShow, secondActiveLeaf } = this.props;

    if (!leaf || !percentage) {
      return null;
    }

    const hasLeaves = leaf.leaves && leaf.leaves.length > 0;

    return (
      <div key={leaf.name} className={'tree-chart__leaf_container'}>
        <div
          className={`tree-chart__leaf
            ${this.getBorderClass(leaf.percentage)}
            ${hasLeaves ? 'tree-chart__leaf--link' : ''}`}
          onClick={this.handleSetRoot(leaf)}
          title={leaf.name.length > 40 ? leaf.name : ''}
        >
          {this.getName(leaf.name)}
          {hasLeaves ? <i className="icon-right" /> : ''}
          {this.renderDetail(leaf, detailToShow)}
        </div>
         {secondActiveLeaf === leaf && hasLeaves && (
          <React.Fragment>
            <div
              className={'tree-chart__lines'}
              style={{ position: 'absolute', left: '330px' }}
            >
              {renderLines(leaf.leaves)}
            </div>
            <div
              className={`tree-chart__leaves ${
                leaf.leaves.length === 1 ? 'tree-chart__leaves--single' : ''
              }`}
              style={{ position: 'absolute', left: '450px'}}
            >
              {this.renderLeaves(leaf.leaves)}
            </div>
          </React.Fragment>
         )
        }
      </div>
    );
  }
}

export default Leaf;