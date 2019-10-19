import * as React from 'react';
import TreeChartLine from '../TreeChartLine';
import Leaf from '../Leaf';

export interface TreeChartData {
  name?: string; // The name of the root of the tree
  url?: string; // Optional: url for the leaf
  leaves?: TreeChartData[]; // Optional: list of children for this leaf
  value?: number; // Optional: the value corresponding to this leaf.
  percentage?: number; // The percentage of total count this leaf represents
}

export interface TreeChartProps {
  treeChartData: TreeChartData; // The data for the tree
  detailToShow?: 'link' | 'comp'; // which detail to show below each leaf
  showTwoLevels?: boolean; // if 'true' show two levels deep, else show one level
}

export interface TreeChartState {
  currentRoot: TreeChartData; // The leaf that represents the current root
  prevRoots: TreeChartData[]; // Stack of leaves. Last in array is the most recent root
  secondActiveLeaf?: TreeChartData; // Truthy if screen is larger than 767px
}

const windowIsDefined = () => {
  return typeof window !== 'undefined' && window !== null;
};

const tabletBreakpoint = 767;

class TreeChart extends React.PureComponent<TreeChartProps, TreeChartState> {
  constructor(props: TreeChartProps) {
    super(props);

    const { treeChartData, showTwoLevels } = this.props;

    let secondActiveLeaf;

    if (showTwoLevels && windowIsDefined()
      && window.innerWidth > tabletBreakpoint
      && treeChartData
      && treeChartData.leaves) {
      // find the first leaf that has child leaves, and set that as active leaf
      for (const leaf of treeChartData.leaves) {
        if (leaf.leaves) {
          secondActiveLeaf = leaf;
          break;
        }
      }
    }

    this.state = {
      currentRoot: treeChartData,
      prevRoots: [],
      secondActiveLeaf
    };
  }

  componentDidMount(): void {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount(): void {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    const { showTwoLevels } = this.props;
    const { currentRoot, secondActiveLeaf } = this.state;

    let newSecondActiveLeaf = null;

    // If secondActiveLeaf isn't already set, set it.
    if (showTwoLevels
        && windowIsDefined()
        && window.innerWidth > tabletBreakpoint
        && currentRoot
        && currentRoot.leaves) {
      // find the first leaf that has child leaves, and set that as active leaf
      for (const leaf of currentRoot.leaves) {
        if (leaf.leaves) {
          newSecondActiveLeaf = leaf;
          break;
        }
      }
      if (!secondActiveLeaf && newSecondActiveLeaf) {
        this.setState({ secondActiveLeaf: newSecondActiveLeaf });
      }
    } else if (secondActiveLeaf && !newSecondActiveLeaf) {
      this.setState({ secondActiveLeaf: null });
    }
  }

  setRoot = (leaf: TreeChartData) => {
    // if the width of screen is larger than 767px then we want to display second row, else we will display single row.
    if (windowIsDefined() && this.props.showTwoLevels && window.innerWidth > tabletBreakpoint) {
      this.setState({
        secondActiveLeaf: leaf
      });
    } else {
      const newRoot = leaf;
      const prevRoot = this.state.currentRoot;
      this.setState({
        currentRoot: newRoot,
        prevRoots: [...this.state.prevRoots, prevRoot]
      });
    }
  }

  handleOnClickBack = () => {
    if (this.state.prevRoots.length > 0) {
      const prevRoots = [...this.state.prevRoots];
      const newRoot = prevRoots.pop();
      this.setState({
        currentRoot: newRoot,
        prevRoots
      });
    }
  }

  renderLines = (leaves: TreeChartData[]): JSX.Element[] => {
    let directions: string[];
    switch (leaves.length) {
      case 1:
        directions = ['straight'];
        break;
      case 2:
        directions = ['up', 'down'];
        break;
      default:
        directions = ['up', 'straight', 'down'];
    }

    return leaves.map((leaf, id) => (
      <TreeChartLine
        key={leaf.name}
        direction={directions[id]}
        fraction={leaf.percentage}
      />
    ));
  }

  render(): JSX.Element {
    const { currentRoot, secondActiveLeaf } = this.state;
    const { detailToShow } = this.props;
    if (!currentRoot) {
      return null;
    }

    const { leaves } = currentRoot;

    // This defines whether we should add padding to the top of the
    // bottom of the tree chart to account to the height of the second level of leaves.
    let shiftClass = '';

    if (this.props.showTwoLevels && secondActiveLeaf) {
      if (currentRoot.leaves.length > 1 && secondActiveLeaf.leaves.length > 1) {
        const lastIndex = currentRoot.leaves.length === 2 ? 1 : 2;
        if (currentRoot.leaves[0] === secondActiveLeaf) {
            shiftClass = 'padding-top';
        } else if (currentRoot.leaves[lastIndex] === secondActiveLeaf) {
            shiftClass = 'padding-bottom';
        }
      }
    }

    return (
      <React.Fragment>
        <div className={`tree-chart tree-chart--${shiftClass}`}>
          <div className="tree-chart__left-container">
            <div className="tree-chart__root">
              <div className="tree-chart__root__name">{currentRoot.name}</div>
              {this.state.prevRoots.length > 0 && (
              <div onClick={this.handleOnClickBack} className="tree-chart__back">
                &laquo; back
              </div>
            )}
            </div>
          </div>
          <div className="tree-chart__lines">
            {leaves && this.renderLines(currentRoot.leaves)}
          </div>
          <div className={`tree-chart__leaves ${leaves && leaves.length === 1 ? 'tree-chart__leaves--single' : ''}`}>
            {leaves &&
              leaves.slice(0, 3).map((l) => (
                <Leaf
                  key={l.name}
                  leaf={l}
                  percentage={l.percentage}
                  setRoot={this.setRoot}
                  secondActiveLeaf={this.state.secondActiveLeaf}
                  detailToShow={detailToShow}
                  renderLines={this.renderLines}
                />
              ))}
          </div>
        </div>
        <div className="tree-chart__legend">
          <div className="tree-chart__legend-row">
            <div className="tree-chart__legend-color tree-chart__legend-color--large" />
            <div>More common (&gt; 20%)</div>
          </div>
          <div className="tree-chart__legend-row">
            <div className="tree-chart__legend-color tree-chart__legend-color--medium" />
            <div>Somewhat common (8 - 20%)</div>
          </div>
          <div className="tree-chart__legend-row">
            <div className="tree-chart__legend-color tree-chart__legend-color--small" />
            <div>Less common (&lt; 8%)</div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export { TreeChart };
export default TreeChart;