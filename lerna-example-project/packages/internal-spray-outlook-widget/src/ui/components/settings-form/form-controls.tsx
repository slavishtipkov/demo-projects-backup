import * as React from "react";
import styled, { StyledComponentClass, ThemeProp } from "../../../styled-components";

export const Fieldset = styled.fieldset`
  margin: 0;
  padding: 0;
  border: 0;
`;

export const Legend = styled.legend`
  margin: 10px;
  color: #999999;
  display: ${({ hide }: { readonly hide: boolean }) => (hide ? "none" : "block")};
  width: 100%;
`;

export const NormalLabel = styled.span`
  vertical-align: middle;
`;

export const BoldLabel = NormalLabel.extend`
  font-family: LatoBold, sans-serif;
  font-size: 15px;
`;

export const ErrorLabel = styled.span`
  display: block;
  margin-top: 10px;
  color: red;
`;

export const TextField = styled.input`
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  padding: 4px 8px 3px;
  width: 55px;
`;

export const SaveButton = styled.button`
  display: inline-block;
  padding: 4px 15px;
  border: 0;
  border-radius: 0;
  color: currentColor;
  font-size: 12px;
  font-weight: normal;
  white-space: nowrap;
  text-transform: uppercase;

  ${({ theme }) => theme.button};
`;

export const CancelButton = styled.a`
  margin-right: 20px;
`;

export const ControlGroup = styled.div`
  margin-bottom: 30px;
`;

export const ControlGroupIndent = styled.span`
  display: block;
  padding-left: 20px;
  margin-top: 6px;
`;

export const InlineControlToggle = styled.div`
  display: inline-block;
  margin-right: 10px;
  width: 100px;
`;

export const InlineSelect = styled.select`
  width: ${({ long }: { readonly long?: boolean }) => (long ? 110 : 85)}px;
  height: 25px;
`;

export const StackThenSplit = styled.div`
  display: block;

  @media (min-width: 768px) {
    display: flex;

    > * {
      flex-basis: 100%;
    }

    > * + * {
      margin-left: 100px;
    }
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;

  > * {
    flex-basis: 100%;
  }

  > *:first-child {
    display: none;
  }

  > *:last-child {
    text-align: right;
  }

  @media (min-width: 768px) {
    flex-direction: row;
    margin-top: 20px;

    > *:first-child {
      display: block;
    }
  }
`;
