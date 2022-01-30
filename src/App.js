import React, { useEffect } from 'react';
import {
  ChakraProvider,
  theme,
  Container,
  FormControl,
  Input,
  FormLabel,
  Button,
  SimpleGrid,
  HStack,
  Editable,
  EditablePreview,
  EditableInput,
  useEditableControls,
  ButtonGroup,
  IconButton,
  Heading,
  Box,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Spacer,
  MenuIcon,
  Text,
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon, EditIcon, HamburgerIcon } from '@chakra-ui/icons';

function EditableControls() {
  const {
    isEditing,
    getSubmitButtonProps,
    getCancelButtonProps,
    getEditButtonProps,
  } = useEditableControls()

  return isEditing ? (
    <ButtonGroup  size='sm'>
      <IconButton icon={<CheckIcon />} {...getSubmitButtonProps()} />
      <IconButton icon={<CloseIcon />} {...getCancelButtonProps()} />
    </ButtonGroup>
  ) : (
    // <Flex justifyContent='center'>
      <IconButton size='sm' icon={<EditIcon />} {...getEditButtonProps()} />
    // </Flex>
  )
}

function playersObj(total) {
  let obj = {};
  for(let i = 1; i <= total; i++) {
    obj[`player_${i}`] = {name: `Player ${i}`, score: 0};
  }
  return obj;
}



function App() {
  var [totalPlayers, setTotalPlayers] = React.useState(10);
  var [score, setScore] = React.useState(playersObj(totalPlayers));
  var [highScore, setHighScore] = React.useState({name: "", score: 0});
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    if(Object.keys(score).length > 0) {
      let arr = Object.values(score);
      let maxVal = Math.max(...arr.map(x => x.score));
      let maxKey = Object.keys(score).find(key => score[key].score === maxVal);
      setHighScore(score[maxKey]);
    }
  }, [score])

  return (
    <ChakraProvider theme={theme}>
      <Container textAlign="center" p={0} m={0} maxW={'full'} h={"100vh"} overflow={"auto"}>
        
        <Drawer placement='left' onClose={onClose} isOpen={isOpen} size={"xs"}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader>{`xs drawer contents`}</DrawerHeader>
            <DrawerBody>
              
            </DrawerBody>
          </DrawerContent>
        </Drawer>
          {/* <Box as="header" w={"full"} h={50} bg={"gray.500"}> */}
          <HStack as={"header"} bg={"gray.500"} h={16} position={'sticky'} zIndex={2} top={0}>
            <Button
            onClick={onOpen}
            key={"fds"}
            m={4}
          ><HamburgerIcon/></Button>
            <Heading fontSize={'2xl'}>{`Highscore: ${highScore.score} ${highScore.score > 0 ? `by ${highScore.name}` : ""} `}</Heading>
          </HStack>
          {/* </Box> */}
          <SimpleGrid columns={2} spacing={5} alignContent={"center"} alignItems={"flex-end"} px={5} py={5}>
            {Array.from({ length: totalPlayers }).map((_, i) => 
            <>
              <FormControl key={i}>
                <FormLabel>                
                  <Editable defaultValue={score[`player_${i + 1}`].name} onSubmit={(e) => setScore({...score, [`player_${i + 1}`]: {...score[`player_${i + 1}`], name: e}})}>
                  <HStack>
                    <EditablePreview />
                    <EditableInput />
                    <EditableControls />
                  </HStack>
                </Editable></FormLabel>
                <Input defaultValue={0} value={score[`player_${i + 1}`].score} onChange={(e) => setScore({...score, [`player_${i + 1}`]: {...score[`player_${i + 1}`], score: Number(e.target.value)}})}/>
              </FormControl>
              <HStack key={`i${1}`}>
                <Button w={"full"} onClick={() => setScore({...score, [`player_${i + 1}`]: {...score[`player_${i + 1}`], score: Number(score[`player_${i + 1}`].score) + 1}})}>+ 1</Button>
                <Button w={"full"} onClick={() => setScore({...score, [`player_${i + 1}`]: {...score[`player_${i + 1}`], score: Number(score[`player_${i + 1}`].score) - 1}})}>- 1</Button>
              </HStack>
            </>)}
          </SimpleGrid>
      </Container>
    </ChakraProvider>
  );
}

export default App;
