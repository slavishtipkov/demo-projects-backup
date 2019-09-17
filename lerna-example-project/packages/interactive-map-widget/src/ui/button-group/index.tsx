import styled from "../../styled-components";
import Button from "../button";

export const ButtonGroup = styled.div`
  && {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 3px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

    ${/* sc-selector */ Button} {
      position: relative;
      border-radius: 0;
      box-shadow: none;

      ::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.2);
      }
    }
  }
`;

export default ButtonGroup;
