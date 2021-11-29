import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { Button } from '@chakra-ui/react';
import { Container } from '@chakra-ui/react';
import { Divider } from '@chakra-ui/react';
import { Text } from '@chakra-ui/react';
import { Link } from '@chakra-ui/react';
import { Stat, StatLabel, StatNumber, StatGroup } from '@chakra-ui/react';
import { Stack } from '@chakra-ui/react';

const Popup = () => {
  const [iterationNumber, setIterationNumber] = useState<number>(0);
  const [inProgressStatusName, setInProgressStatusName] =
    useState<string>('In Progress');
  const [reviewStatusName, setReviewStatusName] = useState<string>('Review');
  const [inProgress, setInProgress] = useState<boolean>(false);
  const [inProgressPoints, setInProgressPoints] = useState<number>(0);
  const [plannedPoints, setPlannedPoints] = useState<number>(0);
  const [reviewPoints, setReviewPoints] = useState<number>(0);
  const [totalPoints, setTotalPoints] = useState<number>(0);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.storage.local.get().then((data) => {
        if (data?.inProgressStatusName) {
          setInProgressStatusName(data.inProgressStatusName);
        }
        if (data?.reviewStatusName) setReviewStatusName(data.reviewStatusName);
        if (data?.plannedPoints) setPlannedPoints(data.plannedPoints);
        if (data?.totalPoints) setTotalPoints(data.totalPoints);
        if (data?.iterationNumber) setIterationNumber(data.iterationNumber);
        setInProgress(!!data?.inProgress);
      });
      const tab = tabs[0];
      if (tab.id) {
        chrome.tabs.sendMessage(
          tab.id,
          { type: 'GetPoints', inProgressStatusName, reviewStatusName },
          (points) => {
            setInProgressPoints(points.inProgressPoints);
            setReviewPoints(points.reviewPoints);
          },
        );
      }
    });
  }, []);

  const start = () => {
    setInProgress(true);
    setPlannedPoints(inProgressPoints);
    chrome.storage.local
      .set({ inProgress: true, plannedPoints: inProgressPoints })
      .then(() => console.log('Started!'));
  };

  const finished = () => {
    setInProgress(false);
    setPlannedPoints(0);
    const total = totalPoints + Math.max(0, plannedPoints - inProgressPoints);
    setTotalPoints(total);
    chrome.storage.local
      .set({
        inProgress: false,
        totalPoints: total,
        plannedPoints: 0,
      })
      .then(() => console.log('Finished!'));
  };

  return (
    <Container p={4} w={500}>
      <Text fontSize="xl">Point information</Text>
      <Divider />
      <StatGroup pt={2}>
        <Stat>
          <StatLabel>Iteration</StatLabel>
          <StatNumber>{iterationNumber}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Total</StatLabel>
          <StatNumber>{totalPoints}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Velocity</StatLabel>
          <StatNumber>
            {0 < iterationNumber ? totalPoints / iterationNumber : '-'}
          </StatNumber>
        </Stat>
      </StatGroup>
      <StatGroup pt={2}>
        <Stat>
          <StatLabel>Planned</StatLabel>
          <StatNumber>{plannedPoints}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>In Progress</StatLabel>
          <StatNumber>{inProgressPoints}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Review</StatLabel>
          <StatNumber>{reviewPoints}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Done</StatLabel>
          <StatNumber>
            {inProgress ? plannedPoints - inProgressPoints : '-'}
          </StatNumber>
        </Stat>
      </StatGroup>
      <Stack direction="row" align="center" pt={4}>
        <Button
          onClick={start}
          disabled={inProgress}
          size="xs"
          colorScheme="teal"
          width="80px"
        >
          Start
        </Button>
        <Button
          onClick={finished}
          disabled={!inProgress}
          size="xs"
          colorScheme="teal"
          width="80px"
        >
          Finished
        </Button>
        <Link color="teal.500" href={chrome.runtime.getURL('options.html')}>
          Options
        </Link>
      </Stack>
    </Container>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <Popup />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
