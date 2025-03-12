import React from 'react';
import { LabIcon } from '@jupyterlab/ui-components';

interface IIconButtonProps {
  icon: LabIcon;
  tooltip: string;
  onClick: () => void;
}

export const IconButton: React.FC<IIconButtonProps> = ({
  icon,
  tooltip,
  onClick
}) => {
  return (
    <div className="icon-button-container" title={tooltip}>
      <button className="icon-button" onClick={onClick}>
        <icon.react tag="span" width="16px" height="16px" />
      </button>
    </div>
  );
};
