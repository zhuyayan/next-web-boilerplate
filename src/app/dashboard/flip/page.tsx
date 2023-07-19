'use client';
import React from "react";
import styled, { keyframes } from "styled-components";
import Paper from '@mui/material/Paper';

const flipAnimation = keyframes`
  from {
    transform: perspective(600px) rotateY(0deg);
    animation-timing-function: ease-out;
  }
  40% {
    transform: perspective(600px) rotateY(170deg);
    animation-timing-function: ease-out;
  }
  50%,
  80% {
    transform: perspective(600px) rotateY(190deg);
    animation-timing-function: ease-in;
  }
  to {
    transform: perspective(600px) rotateY(360deg);
  }
`;

interface EmptyProps {
}

const Page = styled(Paper)<EmptyProps>`
  position: relative;
  width: 200px;
  height: 300px;
  margin: 0 auto;
  background: #fff;
  transform-style: preserve-3d;
  animation: ${flipAnimation} 2s linear infinite;
`;

const FrontPageContent = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  line-height: 260px;
  color: #fff;
  text-align: center;
  font-size: 40px;
  background-color: #f50057;
`;

const BackPageContent = styled(FrontPageContent)`
  transform: rotateY(180deg);
  background-color: #3f51b5;
`;

export default function FlipPage() {
  return (
    <>
      <Page>
        <FrontPageContent>Front</FrontPageContent>
        <BackPageContent>Back</BackPageContent>
      </Page>
    </>
  );
}
