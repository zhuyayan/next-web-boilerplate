import styled from "styled-components";
import React from "react";

const StyledFullScreenContainer = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #f0f0f0; /* 可以根据您的需求设置背景颜色 */
  /* 添加其他样式，根据需要进行调整 */
`;

export default function FullScreenContainer({children}:{children:React.ReactNode}){
  return (
      <>
        {/*<StyledFullScreenContainer>*/}
          {children}
        {/*</StyledFullScreenContainer>*/}
      </>
  )
}