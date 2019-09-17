import * as React from "react";
import styled from "../../styled-components";

export const SubCategoryWrapper = styled.div`
  && {
    display: block;
  }
`;

export const SubCategoryHeader = styled.div`
  && {
    display: flex;
    padding-left: 60px;
    margin-bottom: 10px;
    font-weight: 700;
    line-height: 1.4 !important;
    align-items: center;
    cursor: pointer;
  }
`;

export const SubCategoryDisplayLabel = styled.div`
  && {
    color: #90b7bd;
    text-transform: uppercase;
    font-size: 12px;
  }
`;

export const SubCategoryContainer = styled.div`
  && {
    display: block;
    padding: 0 0 0 60px;
    margin-bottom: 10px;
  }
`;

export const SubCategoryList = styled.ul`
  && {
    list-style: none;
  }
`;

export interface SubCategoryProps {
  readonly displayLabel: string;
}

export const SubCategory: React.SFC<SubCategoryProps> = props => {
  return (
    <SubCategoryWrapper>
      <SubCategoryHeader>
        <SubCategoryDisplayLabel>{props.displayLabel}</SubCategoryDisplayLabel>
      </SubCategoryHeader>
      <SubCategoryContainer>{props.children}</SubCategoryContainer>
    </SubCategoryWrapper>
  );
};
