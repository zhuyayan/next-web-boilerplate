import * as React from 'react';
import styled from 'styled-components';
const StyledFooter = styled.footer`
  background-color: #f0f0f0;
  font-size: 8px;
  padding: 5px;
  text-align: center;
  position: fixed;
  bottom: 0;
  width: 100%;
`;

type FooterProps = {
  style?: React.CSSProperties;
};
export default function Footer(props: FooterProps) {
    return (
        <StyledFooter style={props.style}>
            <p>上海鸣辰通健康科技有限公司</p>
        </StyledFooter>
    );
};
