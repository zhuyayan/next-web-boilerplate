import React from 'react';
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
export default function Footer() {
  return (
      <StyledFooter>
        <p>上海鸣辰通健康科技有限公司</p>
      </StyledFooter>
  );
};
