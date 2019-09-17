import * as React from "react";
import styled, { css } from "../../styled-components";
import Icon from "../icon";
import * as mapboxgl from "mapbox-gl";

export const ButtonLabel = styled.div`
  && {
    width: 100%;
    padding: 5px 10px;
    font-weight: 700;
    font-size: 12px;
    text-transform: uppercase;
    color: #ffffff;
    background: #1a4f5a;
  }
`;

export interface Props {
  readonly onClick?: () => void;
  readonly onMouseDown?: () => void;
  readonly onMouseUp?: () => void;
  readonly className?: string;
  readonly label?: string;
  readonly iconSize?: number;
  readonly icon?: string;
  readonly horizontal?: boolean;
}

export const button: React.SFC<Props> = ({
  className,
  onClick,
  onMouseDown,
  onMouseUp,
  label,
  icon,
  iconSize,
}) => {
  let handleClick = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (onClick) onClick();
  };
  let handleMouseDown = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (onMouseDown) onMouseDown();
  };
  let handleMouseUp = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (onMouseUp) onMouseUp();
  };
  return (
    <button
      className={className}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {icon && <Icon icon={icon} size={iconSize ? iconSize : 32} color="currentColor" />}
      {label && <ButtonLabel>{label}</ButtonLabel>}
    </button>
  );
};

export const Button = styled<Props>(button)`
  && {
    display: flex;
    overflow: hidden;
    flex-direction: column;
    border: 0;
    border-radius: 3px;
    outline: none;
    vertical-align: middle;
    cursor: pointer;
    background: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    flex: 0 1 auto;
    align-items: center;
    font-weight: bold;
    padding: 0;

    && svg {
      fill: #1a4f5a;
      padding: 10px 6px;
      margin: auto;
    }

    ${props =>
      props.horizontal &&
      css`
        flex-direction: row;
        align-items: center;

        ${/* sc-selector */ ButtonLabel} {
          background: transparent;
          color: #1a4f5a;
          text-transform: uppercase;
          width: auto;
          padding: 5px 20px 5px 4px;
          align-self: center;
        }
      `};
  }
`;

export default Button;
