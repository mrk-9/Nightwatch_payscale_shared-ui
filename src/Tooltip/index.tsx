import * as React from 'react';
import ReactTooltip from 'react-tooltip';
import { buildClassString } from '../StringUtils';
import './style/index.scss';

export interface TooltipProps {
  id: string;
  content: React.ReactFragment;
  wrapperClassName?: string;
  tooltipClassName?: string;
  place?: ReactTooltip.Place;
  effect?: ReactTooltip.Effect;
  key?: React.ReactText;
  event?: ReactTooltip.ElementEvents;
  type?: ReactTooltip.Type;
  border?: boolean;
}

/**
 * Tooltip is a wrapper around react-tooltip. A wrapper is added around
 * all child elements to make all children a hoverable tooltip trigger.
 */
export class Tooltip extends React.PureComponent<TooltipProps, {}> {
  render(): JSX.Element {
    const { id, content, wrapperClassName, tooltipClassName, place, effect, event, type, border } = this.props;

    const wrapperClassString = buildClassString({
      tooltip__wrapper: true,
      [wrapperClassName]: !!wrapperClassName
    });

    const tooltipClassString = buildClassString({
        tooltip__wrapper: true,
        tooltip__default: !tooltipClassName,
        [tooltipClassName]: !!tooltipClassName
      });

    return (
      <React.Fragment>
        <div className={wrapperClassString} data-tip="" data-for={id}>
          {this.props.children}
        </div>
        <ReactTooltip
          id={id}
          className={tooltipClassString}
          place={place || 'top'}
          effect={effect || 'float'}
          event={event || ''}
          border={border !== undefined ? border : true}
          type={type || 'light'}
        >
          {content}
        </ReactTooltip>
      </React.Fragment>
    );
  }
}