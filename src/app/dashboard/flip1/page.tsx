"use client";
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const flipAnimation = keyframes`
  0% { transform: rotateY(0deg); }
  50% { transform: rotateY(180deg); }
  100% { transform: rotateY(360deg); }
`;

const Page = styled.div`
  width: 200px;
  height: 300px;
  margin: 1em auto;
  background: #eee;
  border: 1px solid #ccc;
  animation: ${flipAnimation} 3s infinite linear;
  transform-style: preserve-3d;
`;

// Define FrontContent and BackContent similarly
interface EmptyProps {
}


const FrontContent = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: lightblue;
  border: 1px solid #ccc;
  box-sizing: border-box;
  backface-visibility: hidden;
`;

const BackContent = styled(FrontContent)`
  transform: rotateY(180deg);
  background: lightgreen;
`;


function Book() {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 100; // Replace with the actual number of pages

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (e.deltaY < 0) {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
      } else {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
      }
    };

    window.addEventListener('wheel', handleScroll);

    return () => window.removeEventListener('wheel', handleScroll);
  }, [totalPages]);

  return (
      <Page>
        <FrontContent>Page {currentPage + 1}</FrontContent>
        <BackContent>Page {currentPage + 2}</BackContent>
      </Page>
  );
}

export default Book;
